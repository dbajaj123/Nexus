import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
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
        wallet: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
  }

  async updateProfile(userId: string, data: any) {
    return this.prisma.profile.update({
      where: { userId },
      data,
    });
  }

  async getMyProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            badges: {
              include: {
                badge: true,
              },
              orderBy: {
                earnedAt: 'desc',
              },
            },
          },
        },
        wallet: true,
        enrollments: {
          include: {
            course: {
              include: {
                teacher: {
                  include: {
                    profile: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const { passwordHash, refreshToken, ...sanitized } = user;
    return sanitized;
  }
}
