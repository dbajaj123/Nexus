import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWellnessLogDto } from './dto/wellness.dto';

@Injectable()
export class WellnessService {
  constructor(private prisma: PrismaService) {}

  async createWellnessLog(userId: string, dto: CreateWellnessLogDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    const flagged = dto.moodScore <= 3; // Auto-flag low mood scores

    return this.prisma.wellnessLog.create({
      data: {
        profileId: profile.id,
        moodScore: dto.moodScore,
        tags: dto.tags,
        notes: dto.notes,
        flagged,
      },
    });
  }

  async getMyWellnessLogs(userId: string, limit = 30) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    return this.prisma.wellnessLog.findMany({
      where: { profileId: profile.id },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  async getWellnessStats(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    const logs = await this.prisma.wellnessLog.findMany({
      where: {
        profileId: profile.id,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    if (logs.length === 0) {
      return {
        averageMood: 0,
        totalLogs: 0,
        flaggedCount: 0,
        trend: 'neutral',
      };
    }

    const averageMood = logs.reduce((sum, log) => sum + log.moodScore, 0) / logs.length;
    const flaggedCount = logs.filter((log) => log.flagged).length;

    // Calculate trend (comparing first half vs second half)
    const mid = Math.floor(logs.length / 2);
    const firstHalf = logs.slice(0, mid);
    const secondHalf = logs.slice(mid);

    const firstAvg = firstHalf.reduce((sum, log) => sum + log.moodScore, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, log) => sum + log.moodScore, 0) / secondHalf.length;

    let trend = 'neutral';
    if (secondAvg > firstAvg + 0.5) trend = 'improving';
    if (secondAvg < firstAvg - 0.5) trend = 'declining';

    return {
      averageMood: Math.round(averageMood * 10) / 10,
      totalLogs: logs.length,
      flaggedCount,
      trend,
    };
  }

  async getFlaggedLogs() {
    return this.prisma.wellnessLog.findMany({
      where: { flagged: true },
      include: {
        profile: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
