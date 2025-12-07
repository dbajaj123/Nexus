import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GamificationService } from './gamification.service';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';

@ApiTags('gamification')
@Controller('gamification')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class GamificationController {
  constructor(private gamificationService: GamificationService) {}

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get school leaderboard' })
  async getLeaderboard(@GetUser('schoolId') schoolId: string, @Query('limit') limit?: string) {
    return this.gamificationService.getLeaderboard(schoolId, limit ? parseInt(limit) : 10);
  }

  @Get('badges')
  @ApiOperation({ summary: 'Get all badges' })
  async getAllBadges() {
    return this.gamificationService.getAllBadges();
  }

  @Post('badges')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new badge (Admin only)' })
  async createBadge(@Body() data: any) {
    return this.gamificationService.createBadge(data);
  }

  @Post('award-badge')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Award badge to user (Admin/Teacher only)' })
  async awardBadge(@Body() body: { userId: string; badgeId: string }) {
    return this.gamificationService.awardBadge(body.userId, body.badgeId);
  }

  @Post('add-xp')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Add XP to user (Admin/Teacher only)' })
  async addXP(@Body() body: { userId: string; xp: number; reason: string }) {
    return this.gamificationService.addXP(body.userId, body.xp, body.reason);
  }
}
