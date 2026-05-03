import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { MealType } from '../diary-entry.entity';

export class CreateDiaryEntryDto {
  @IsNotEmpty()
  @IsString()
  food_id: string;

  @IsEnum(MealType)
  meal_type: MealType;

  @IsNumber()
  quantity_g: number;

  @IsNotEmpty()
  @IsString()
  date: string;
}
