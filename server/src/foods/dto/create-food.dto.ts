import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFoodDto {
  @IsOptional()
  @IsString()
  barcode?: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsNumber()
  calories_per_100g: number;

  @IsNumber()
  proteins_per_100g: number;

  @IsNumber()
  carbs_per_100g: number;

  @IsNumber()
  fats_per_100g: number;

  @IsOptional()
  @IsNumber()
  fiber_per_100g?: number;
}
