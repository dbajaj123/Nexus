import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { GradeSubmissionDto, ChatDto } from './dto/ai.dto';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('ai')
@Controller('ai')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class AiController {
  constructor(
    private aiService: AiService,
    private prisma: PrismaService,
  ) {}

  @Post('grade')
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  @ApiOperation({ summary: 'AI-powered grading (Teacher only)' })
  async gradeSubmission(@Body() dto: GradeSubmissionDto) {
    return this.aiService.gradeSubmission(dto.submissionText, dto.assignmentDescription, dto.maxPoints);
  }

  @Post('chat')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'AI Study Buddy chat (Student only)' })
  async chat(@Body() dto: ChatDto) {
    const course = await this.prisma.course.findUnique({
      where: { id: dto.courseId },
      include: {
        resources: {
          take: 3,
        },
      },
    });

    const courseContext = course.resources.map((r) => r.title).join(', ');
    const response = await this.aiService.studyBuddyChat(dto.message, course.name, courseContext);

    return { response };
  }

  @Post('summarize')
  @ApiOperation({ summary: 'AI-powered content summarization' })
  async summarize(@Body() body: { content: string }) {
    const summary = await this.aiService.generateSummary(body.content);
    return { summary };
  }
}
