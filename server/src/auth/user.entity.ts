import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Profile } from '../profile/profile.entity';
import { DiaryEntry } from '../diary/diary-entry.entity';
import { Exercise } from '../exercises/exercise.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  @OneToMany(() => DiaryEntry, (entry) => entry.user)
  diary_entries: DiaryEntry[];

  @OneToMany(() => Exercise, (exercise) => exercise.user)
  exercises: Exercise[];
}
