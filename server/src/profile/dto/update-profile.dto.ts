import { IsEnum, IsNumber, IsString, IsOptional } from 'class-validator';
import { ActivityLevel, Goal } from '../profile.entity';

export class UpdateProfileDto {
  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsString()
  sex?: string;

  @IsOptional()
  @IsNumber()
  height_cm?: number;

  @IsOptional()
  @IsNumber()
  weight_kg?: number;

  @IsOptional()
  @IsEnum(ActivityLevel)
  activity_level?: ActivityLevel;

  @IsOptional()
  @IsEnum(Goal)
  goal?: Goal;
}
