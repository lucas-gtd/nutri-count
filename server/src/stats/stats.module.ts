import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { DiaryEntry } from '../diary/diary-entry.entity';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [TypeOrmModule.forFeature([DiaryEntry]), ProfileModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
