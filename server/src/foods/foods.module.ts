import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodsController } from './foods.controller';
import { FoodsService } from './foods.service';
import { Food } from './food.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Food])],
  controllers: [FoodsController],
  providers: [FoodsService],
  exports: [FoodsService],
})
export class FoodsModule {}
