import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { Food } from '../foods/food.entity';

export enum MealType {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  SNACK = 'snack',
}

@Entity('diary_entries')
export class DiaryEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.diary_entries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @ManyToOne(() => Food, (food) => food.diary_entries)
  @JoinColumn({ name: 'food_id' })
  food: Food;

  @Column()
  food_id: string;

  @Column({ type: 'enum', enum: MealType })
  meal_type: MealType;

  @Column('decimal')
  quantity_g: number;

  @Column('date')
  date: string;

  @CreateDateColumn()
  created_at: Date;
}
