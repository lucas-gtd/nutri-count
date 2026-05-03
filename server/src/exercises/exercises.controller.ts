import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('exercises')
@UseGuards(JwtAuthGuard)
export class ExercisesController {
  constructor(private exercisesService: ExercisesService) {}

  @Get()
  getByDate(
    @CurrentUser() user: { id: string },
    @Query('date') date: string,
  ) {
    return this.exercisesService.getByDate(user.id, date);
  }

  @Post()
  create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateExerciseDto,
  ) {
    return this.exercisesService.create(user.id, dto);
  }

  @Delete(':id')
  delete(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.exercisesService.delete(user.id, id);
  }
}
