import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { OpenFoodFacts } from '@openfoodfacts/openfoodfacts-nodejs';
import { Food, FoodSource } from './food.entity';
import { CreateFoodDto } from './dto/create-food.dto';

const offClient = new OpenFoodFacts(globalThis.fetch);

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

    const { data, error } = await offClient.getProductV3(barcode);

    if (error || !data || data.status !== 'success' || !data.product) {
      throw new NotFoundException('Product not found');
    }

    const product = data.product as any;
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
    try {
      const { data, error } = await offClient.search({
        fields: 'code,product_name,brands,nutriments',
        page_size: 20,
        sort_by: 'unique_scans_n',
        search_terms: query,
      } as any);

      if (error || !data) return [];

      const products = (data as any).products;
      if (!Array.isArray(products)) return [];

      return products
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
