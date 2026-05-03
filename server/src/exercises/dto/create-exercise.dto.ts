import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateExerciseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  calories_burned: number;

  @IsNumber()
  duration_min: number;

  @IsNotEmpty()
  @IsString()
  date: string;
}
