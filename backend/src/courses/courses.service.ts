import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { CreateCourseDto } from './dto/course.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async createCourse(teacherId: string, dto: CreateCourseDto) {
    return this.prisma.course.create({
      data: {
        ...dto,
        teacherId,
      },
      include: {
        teacher: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async getMyCourses(userId: string, role: UserRole) {
    if (role === UserRole.TEACHER) {
      return this.prisma.course.findMany({
        where: { teacherId: userId },
        include: {
          enrollments: {
            include: {
              student: {
                include: {
                  profile: true,
                },
              },
            },
          },
          assignments: {
            orderBy: {
              dueDate: 'asc',
            },
            take: 3,
          },
        },
      });
    }

    if (role === UserRole.STUDENT) {
      const enrollments = await this.prisma.enrollment.findMany({
        where: { studentId: userId },
        include: {
          course: {
            include: {
              teacher: {
                include: {
                  profile: true,
                },
              },
              assignments: {
                where: {
                  dueDate: {
                    gte: new Date(),
                  },
                },
                orderBy: {
                  dueDate: 'asc',
                },
                take: 3,
              },
            },
          },
        },
      });

      return enrollments.map((e) => e.course);
    }

    return [];
  }

  async getCourseById(courseId: string, userId: string, role: UserRole) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        teacher: {
          include: {
            profile: true,
          },
        },
        enrollments: {
          include: {
            student: {
              include: {
                profile: true,
              },
            },
          },
        },
        assignments: {
          orderBy: {
            dueDate: 'asc',
          },
        },
        resources: true,
        schedule: true,
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check access
    if (role === UserRole.TEACHER && course.teacherId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (role === UserRole.STUDENT) {
      const enrollment = await this.prisma.enrollment.findFirst({
        where: {
          courseId,
          studentId: userId,
        },
      });

      if (!enrollment) {
        throw new ForbiddenException('Not enrolled in this course');
      }
    }

    return course;
  }

  async enrollStudent(studentId: string, courseId: string) {
    return this.prisma.enrollment.create({
      data: {
        studentId,
        courseId,
      },
      include: {
        course: true,
        student: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async getAllCourses() {
    return this.prisma.course.findMany({
      include: {
        teacher: {
          include: {
            profile: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });
  }
}
