import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { DiaryEntry } from '../diary/diary-entry.entity';
import { ProfileService } from '../profile/profile.service';
import { calculateBMR, calculateTDEE } from '../common/utils/nutrition';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(DiaryEntry)
    private diaryRepository: Repository<DiaryEntry>,
    private profileService: ProfileService,
  ) {}

  async getStats(userId: string, from: string, to: string) {
    const entries = await this.diaryRepository.find({
      where: {
        user_id: userId,
        date: Between(from, to),
      },
      relations: ['food'],
      order: { date: 'ASC' },
    });

    const profile = await this.profileService.getProfile(userId);
    let dailyTarget = 2000;
    if (profile) {
      const bmr = calculateBMR(
        Number(profile.weight_kg),
        Number(profile.height_cm),
        profile.age,
        profile.sex,
      );
      dailyTarget = Math.round(calculateTDEE(bmr, profile.activity_level));
    }

    // Group by date
    const dailyMap: Record<string, number> = {};
    for (const entry of entries) {
      const ratio = Number(entry.quantity_g) / 100;
      const cal = Number(entry.food.calories_per_100g) * ratio;
      dailyMap[entry.date] = (dailyMap[entry.date] || 0) + cal;
    }

    // Generate all dates in range
    const result: { date: string; calories: number; target: number }[] = [];
    const current = new Date(from);
    const end = new Date(to);
    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      result.push({
        date: dateStr,
        calories: Math.round(dailyMap[dateStr] || 0),
        target: dailyTarget,
      });
      current.setDate(current.getDate() + 1);
    }

    return result;
  }
}
