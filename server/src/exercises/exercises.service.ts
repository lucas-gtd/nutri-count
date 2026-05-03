import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './exercise.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private exercisesRepository: Repository<Exercise>,
  ) {}

  async getByDate(userId: string, date: string): Promise<Exercise[]> {
    return this.exercisesRepository.find({
      where: { user_id: userId, date },
      order: { created_at: 'ASC' },
    });
  }

  async create(userId: string, dto: CreateExerciseDto): Promise<Exercise> {
    const exercise = this.exercisesRepository.create({
      ...dto,
      user_id: userId,
    });
    return this.exercisesRepository.save(exercise);
  }

  async delete(userId: string, id: string): Promise<void> {
    const exercise = await this.exercisesRepository.findOne({
      where: { id, user_id: userId },
    });
    if (!exercise) throw new NotFoundException('Exercise not found');
    await this.exercisesRepository.remove(exercise);
  }
}
