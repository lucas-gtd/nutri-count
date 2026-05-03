import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';

export enum ActivityLevel {
  SEDENTARY = 'sedentary',
  LIGHT = 'light',
  MODERATE = 'moderate',
  ACTIVE = 'active',
  VERY_ACTIVE = 'very_active',
}

export enum Goal {
  LOSE = 'lose',
  MAINTAIN = 'maintain',
  GAIN = 'gain',
}

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @Column()
  age: number;

  @Column()
  sex: string;

  @Column('decimal')
  height_cm: number;

  @Column('decimal')
  weight_kg: number;

  @Column({ type: 'enum', enum: ActivityLevel })
  activity_level: ActivityLevel;

  @Column({ type: 'enum', enum: Goal })
  goal: Goal;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
