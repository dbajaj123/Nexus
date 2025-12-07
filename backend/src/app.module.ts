import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { AttendanceModule } from './attendance/attendance.module';
import { WellnessModule } from './wellness/wellness.module';
import { WalletModule } from './wallet/wallet.module';
import { GamificationModule } from './gamification/gamification.module';
import { AiModule } from './ai/ai.module';
import { MessagesModule } from './messages/messages.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    AssignmentsModule,
    SubmissionsModule,
    AttendanceModule,
    WellnessModule,
    WalletModule,
    GamificationModule,
    AiModule,
    MessagesModule,
    NotificationsModule,
  ],
})
export class AppModule {}
