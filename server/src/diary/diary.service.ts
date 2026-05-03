import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiaryEntry } from './diary-entry.entity';
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto';
import { ProfileService } from '../profile/profile.service';
import {
  calculateBMR,
  calculateTDEE,
  calculateTEF,
  calculateRemainingCalories,
} from '../common/utils/nutrition';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(DiaryEntry)
    private diaryRepository: Repository<DiaryEntry>,
    private profileService: ProfileService,
  ) {}

  async getByDate(userId: string, date: string) {
    const entries = await this.diaryRepository.find({
      where: { user_id: userId, date },
      relations: ['food'],
      order: { created_at: 'ASC' },
    });

    const profile = await this.profileService.getProfile(userId);

    let totalCalories = 0;
    let totalProteins = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    let totalFiber = 0;

    for (const entry of entries) {
      const ratio = Number(entry.quantity_g) / 100;
      totalCalories += Number(entry.food.calories_per_100g) * ratio;
      totalProteins += Number(entry.food.proteins_per_100g) * ratio;
      totalCarbs += Number(entry.food.carbs_per_100g) * ratio;
      totalFats += Number(entry.food.fats_per_100g) * ratio;
      totalFiber += Number(entry.food.fiber_per_100g) * ratio;
    }

    let bmr = 0;
    let tdee = 0;
    let tef = calculateTEF(totalCalories);
    let remaining = 0;

    if (profile) {
      bmr = calculateBMR(
        Number(profile.weight_kg),
        Number(profile.height_cm),
        profile.age,
        profile.sex,
      );
      tdee = calculateTDEE(bmr, profile.activity_level);
      remaining = calculateRemainingCalories(tdee, 0, totalCalories, tef);
    }

    return {
      entries,
      totals: {
        calories: Math.round(totalCalories),
        proteins: Math.round(totalProteins),
        carbs: Math.round(totalCarbs),
        fats: Math.round(totalFats),
        fiber: Math.round(totalFiber),
      },
      metrics: {
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        tef: Math.round(tef),
        remaining: Math.round(remaining),
      },
    };
  }

  async create(userId: string, dto: CreateDiaryEntryDto): Promise<DiaryEntry> {
    const entry = this.diaryRepository.create({
      ...dto,
      user_id: userId,
    });
    return this.diaryRepository.save(entry);
  }

  async delete(userId: string, id: string): Promise<void> {
    const entry = await this.diaryRepository.findOne({
      where: { id, user_id: userId },
    });
    if (!entry) throw new NotFoundException('Entry not found');
    await this.diaryRepository.remove(entry);
  }
}
