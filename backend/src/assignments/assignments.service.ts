import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { CreateAssignmentDto } from './dto/assignment.dto';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async createAssignment(dto: CreateAssignmentDto, teacherId: string) {
    // Verify teacher owns the course
    const course = await this.prisma.course.findUnique({
      where: { id: dto.courseId },
    });

    if (course.teacherId !== teacherId) {
      throw new ForbiddenException('You can only create assignments for your courses');
    }

    return this.prisma.assignment.create({
      data: {
        ...dto,
        dueDate: new Date(dto.dueDate),
      },
      include: {
        course: true,
      },
    });
  }

  async getAssignmentsByCourse(courseId: string) {
    return this.prisma.assignment.findMany({
      where: { courseId },
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
        _count: {
          select: {
            submissions: true,
          },
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  async getUpcomingAssignments(userId: string, role: UserRole) {
    if (role === UserRole.STUDENT) {
      const enrollments = await this.prisma.enrollment.findMany({
        where: { studentId: userId },
        select: { courseId: true },
      });

      const courseIds = enrollments.map((e) => e.courseId);

      return this.prisma.assignment.findMany({
        where: {
          courseId: {
            in: courseIds,
          },
          dueDate: {
            gte: new Date(),
          },
        },
        include: {
          course: true,
          submissions: {
            where: {
              studentId: userId,
            },
          },
        },
        orderBy: {
          dueDate: 'asc',
        },
        take: 10,
      });
    }

    return [];
  }

  async getAssignmentById(assignmentId: string) {
    return this.prisma.assignment.findUnique({
      where: { id: assignmentId },
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
        submissions: {
          include: {
            student: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    });
  }
}
