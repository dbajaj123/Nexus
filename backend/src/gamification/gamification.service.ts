import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GamificationService {
  constructor(private prisma: PrismaService) {}

  async addXP(userId: string, xp: number, reason: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    const newXP = profile.xp + xp;
    const newLevel = this.calculateLevel(newXP);

    return this.prisma.profile.update({
      where: { userId },
      data: {
        xp: newXP,
        level: newLevel,
      },
    });
  }

  async awardBadge(userId: string, badgeId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    const badge = await this.prisma.badge.findUnique({
      where: { id: badgeId },
    });

    // Check if already owned
    const existing = await this.prisma.badgeOwnership.findUnique({
      where: {
        profileId_badgeId: {
          profileId: profile.id,
          badgeId,
        },
      },
    });

    if (existing) {
      return existing;
    }

    // Award badge and XP
    const [ownership] = await this.prisma.$transaction([
      this.prisma.badgeOwnership.create({
        data: {
          profileId: profile.id,
          badgeId,
        },
        include: {
          badge: true,
        },
      }),
      this.prisma.profile.update({
        where: { id: profile.id },
        data: {
          xp: profile.xp + badge.xpValue,
        },
      }),
    ]);

    return ownership;
  }

  async getLeaderboard(schoolId: string, limit = 10) {
    const users = await this.prisma.user.findMany({
      where: { schoolId },
      include: {
        profile: {
          include: {
            badges: {
              include: {
                badge: true,
              },
            },
          },
        },
      },
      orderBy: {
        profile: {
          xp: 'desc',
        },
      },
      take: limit,
    });

    return users.map((user, index) => ({
      rank: index + 1,
      userId: user.id,
      email: user.email,
      name: `${user.profile.firstName} ${user.profile.lastName}`,
      xp: user.profile.xp,
      level: user.profile.level,
      badgeCount: user.profile.badges.length,
    }));
  }

  async getAllBadges() {
    return this.prisma.badge.findMany();
  }

  async createBadge(data: any) {
    return this.prisma.badge.create({
      data,
    });
  }

  private calculateLevel(xp: number): number {
    // Simple level calculation: level = floor(sqrt(xp / 100))
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  }
}
