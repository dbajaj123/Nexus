import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmissionStatus } from '@prisma/client';
import { CreateSubmissionDto, GradeSubmissionDto } from './dto/submission.dto';

@Injectable()
export class SubmissionsService {
  constructor(private prisma: PrismaService) {}

  async createSubmission(studentId: string, dto: CreateSubmissionDto) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: dto.assignmentId },
    });

    const isLate = new Date() > assignment.dueDate;
    const status = isLate ? SubmissionStatus.LATE : SubmissionStatus.SUBMITTED;

    return this.prisma.submission.create({
      data: {
        assignmentId: dto.assignmentId,
        studentId,
        contentUrl: dto.contentUrl,
        status,
      },
      include: {
        assignment: {
          include: {
            course: true,
          },
        },
      },
    });
  }

  async getMySubmissions(studentId: string) {
    return this.prisma.submission.findMany({
      where: { studentId },
      include: {
        assignment: {
          include: {
            course: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });
  }

  async getSubmissionsByAssignment(assignmentId: string) {
    return this.prisma.submission.findMany({
      where: { assignmentId },
      include: {
        student: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });
  }

  async gradeSubmission(dto: GradeSubmissionDto) {
    return this.prisma.submission.update({
      where: { id: dto.submissionId },
      data: {
        finalGrade: dto.finalGrade,
        feedback: dto.feedback,
        status: SubmissionStatus.GRADED,
      },
      include: {
        student: {
          include: {
            profile: true,
          },
        },
        assignment: true,
      },
    });
  }

  async getSubmissionById(submissionId: string) {
    return this.prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        assignment: {
          include: {
            course: true,
          },
        },
        student: {
          include: {
            profile: true,
          },
        },
      },
    });
  }
}
