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
import { DiaryService } from './diary.service';
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('diary')
@UseGuards(JwtAuthGuard)
export class DiaryController {
  constructor(private diaryService: DiaryService) {}

  @Get()
  getByDate(
    @CurrentUser() user: { id: string },
    @Query('date') date: string,
  ) {
    return this.diaryService.getByDate(user.id, date);
  }

  @Post()
  create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateDiaryEntryDto,
  ) {
    return this.diaryService.create(user.id, dto);
  }

  @Delete(':id')
  delete(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.diaryService.delete(user.id, id);
  }
}
