import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { DiaryEntry } from '../diary/diary-entry.entity';

export enum FoodSource {
  OPENFOODFACTS = 'openfoodfacts',
  CUSTOM = 'custom',
}

@Entity('foods')
export class Food {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  barcode: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  brand: string;

  @Column('decimal')
  calories_per_100g: number;

  @Column('decimal')
  proteins_per_100g: number;

  @Column('decimal')
  carbs_per_100g: number;

  @Column('decimal')
  fats_per_100g: number;

  @Column('decimal', { default: 0 })
  fiber_per_100g: number;

  @Column({ type: 'enum', enum: FoodSource, default: FoodSource.CUSTOM })
  source: FoodSource;

  @OneToMany(() => DiaryEntry, (entry) => entry.food)
  diary_entries: DiaryEntry[];
}
