import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('stats')
@UseGuards(JwtAuthGuard)
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get()
  getStats(
    @CurrentUser() user: { id: string },
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.statsService.getStats(user.id, from, to);
  }
}
