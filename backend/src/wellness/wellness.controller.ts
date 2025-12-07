import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WellnessService } from './wellness.service';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { CreateWellnessLogDto } from './dto/wellness.dto';

@ApiTags('wellness')
@Controller('wellness')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class WellnessController {
  constructor(private wellnessService: WellnessService) {}

  @Post('log')
  @ApiOperation({ summary: 'Create a wellness log entry' })
  async createWellnessLog(@GetUser('userId') userId: string, @Body() dto: CreateWellnessLogDto) {
    return this.wellnessService.createWellnessLog(userId, dto);
  }

  @Get('my-logs')
  @ApiOperation({ summary: 'Get my wellness logs' })
  async getMyWellnessLogs(@GetUser('userId') userId: string, @Query('limit') limit?: string) {
    return this.wellnessService.getMyWellnessLogs(userId, limit ? parseInt(limit) : 30);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get wellness statistics' })
  async getWellnessStats(@GetUser('userId') userId: string) {
    return this.wellnessService.getWellnessStats(userId);
  }

  @Get('flagged')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Get flagged wellness logs (Admin/Teacher only)' })
  async getFlaggedLogs() {
    return this.wellnessService.getFlaggedLogs();
  }
}
