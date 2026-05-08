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

  async importFromOff(dto: CreateFoodDto): Promise<Food> {
    if (dto.barcode) {
      const existing = await this.foodsRepository.findOne({
        where: { barcode: dto.barcode },
      });
      if (existing) return existing;
    }
    const food = this.foodsRepository.create({
      ...dto,
      source: FoodSource.OPENFOODFACTS,
    });
    return this.foodsRepository.save(food);
  }

  async findByBarcode(barcode: string): Promise<Food> {
    let food = await this.foodsRepository.findOne({ where: { barcode } });
    if (food) return food;

    // Fetch from Open Food Facts
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${barcode}`,
      {
        headers: {
          'User-Agent':
            'NutriCount/1.0 (https://github.com/lucas-gtd/nutri-count)',
        },
      },
    );
    if (!response.ok) throw new NotFoundException('Product not found');
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

  async searchOpenFoodFacts(query: string): Promise<any[]> {
    const url = `https://world.openfoodfacts.org/api/v2/search?search_terms=${encodeURIComponent(query)}&fields=code,product_name,brands,nutriments&page_size=20&sort_by=unique_scans_n`;
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent':
            'NutriCount/1.0 (https://github.com/lucas-gtd/nutri-count)',
        },
      });
      if (!res.ok) return [];
      const data = await res.json();
      if (!Array.isArray(data.products)) return [];
      return data.products
        .filter((p: any) => p.product_name)
        .map((p: any) => {
          const n = p.nutriments || {};
          return {
            barcode: p.code || undefined,
            name: p.product_name,
            brand: p.brands || undefined,
            calories_per_100g: n['energy-kcal_100g'] ?? 0,
            proteins_per_100g: n['proteins_100g'] ?? 0,
            carbs_per_100g: n['carbohydrates_100g'] ?? 0,
            fats_per_100g: n['fat_100g'] ?? 0,
            fiber_per_100g: n['fiber_100g'] ?? 0,
          };
        });
    } catch {
      return [];
    }
  }
}
