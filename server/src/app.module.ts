import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { FoodsModule } from './foods/foods.module';
import { DiaryModule } from './diary/diary.module';
import { ExercisesModule } from './exercises/exercises.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    ProfileModule,
    FoodsModule,
    DiaryModule,
    ExercisesModule,
    StatsModule,
  ],
})
export class AppModule {}
