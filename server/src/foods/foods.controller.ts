import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('foods')
@UseGuards(JwtAuthGuard)
export class FoodsController {
  constructor(private foodsService: FoodsService) {}

  @Get('search')
  search(@Query('q') query: string) {
    return this.foodsService.search(query || '');
  }

  @Get('barcode/:barcode')
  findByBarcode(@Param('barcode') barcode: string) {
    return this.foodsService.findByBarcode(barcode);
  }

  @Post('import')
  importFromOff(@Body() dto: CreateFoodDto) {
    return this.foodsService.importFromOff(dto);
  }

  @Post()
  create(@Body() dto: CreateFoodDto) {
    return this.foodsService.create(dto);
  }
}
