import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Food, FoodSource } from './food.entity';
import { CreateFoodDto } from './dto/create-food.dto';

@Injectable()
export class FoodsService {
  constructor(
    @InjectRepository(Food)
    private foodsRepository: Repository<Food>,
  ) {}

  async search(query: string): Promise<Food[]> {
    return this.foodsRepository.find({
      where: { name: ILike(`%${query}%`) },
      take: 20,
    });
  }

  async findByBarcode(barcode: string): Promise<Food> {
    let food = await this.foodsRepository.findOne({ where: { barcode } });
    if (food) return food;

    // Fetch from Open Food Facts
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${barcode}`,
    );
    const data = await response.json();

    if (data.status !== 1 || !data.product) {
      throw new NotFoundException('Product not found');
    }

    const product = data.product;
    const nutriments = product.nutriments || {};

    food = this.foodsRepository.create({
      barcode,
      name: product.product_name || 'Unknown',
      brand: product.brands || null,
      calories_per_100g: nutriments['energy-kcal_100g'] || 0,
      proteins_per_100g: nutriments.proteins_100g || 0,
      carbs_per_100g: nutriments.carbohydrates_100g || 0,
      fats_per_100g: nutriments.fat_100g || 0,
      fiber_per_100g: nutriments.fiber_100g || 0,
      source: FoodSource.OPENFOODFACTS,
    });

    return this.foodsRepository.save(food);
  }

  async create(dto: CreateFoodDto): Promise<Food> {
    const food = this.foodsRepository.create({
      ...dto,
      source: FoodSource.CUSTOM,
    });
    return this.foodsRepository.save(food);
  }
}
