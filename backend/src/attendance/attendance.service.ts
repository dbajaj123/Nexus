import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BulkAttendanceDto } from './dto/attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async recordBulkAttendance(dto: BulkAttendanceDto) {
    const date = new Date(dto.date);

    const records = await Promise.all(
      dto.records.map(async (record) => {
        // Check if record exists for this student and date
        const existing = await this.prisma.attendanceRecord.findFirst({
          where: {
            studentId: record.studentId,
            date,
          },
        });

        if (existing) {
          // Update existing record
          return this.prisma.attendanceRecord.update({
            where: { id: existing.id },
            data: {
              status: record.status,
              notes: record.notes,
            },
          });
        } else {
          // Create new record
          return this.prisma.attendanceRecord.create({
            data: {
              studentId: record.studentId,
              date,
              status: record.status,
              notes: record.notes,
            },
          });
        }
      }),
    );

    return records;
  }

  async getStudentAttendance(studentId: string, startDate?: Date, endDate?: Date) {
    return this.prisma.attendanceRecord.findMany({
      where: {
        studentId,
        date: {
          gte: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Default 30 days
          lte: endDate || new Date(),
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async getAttendanceStats(studentId: string) {
    const records = await this.prisma.attendanceRecord.findMany({
      where: { studentId },
    });

    const total = records.length;
    const present = records.filter((r) => r.status === 'PRESENT').length;
    const absent = records.filter((r) => r.status === 'ABSENT').length;
    const late = records.filter((r) => r.status === 'LATE').length;
    const excused = records.filter((r) => r.status === 'EXCUSED').length;

    return {
      total,
      present,
      absent,
      late,
      excused,
      attendanceRate: total > 0 ? (present / total) * 100 : 0,
    };
  }
}
