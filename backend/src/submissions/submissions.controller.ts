import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SubmissionsService } from './submissions.service';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { CreateSubmissionDto, GradeSubmissionDto } from './dto/submission.dto';

@ApiTags('submissions')
@Controller('submissions')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class SubmissionsController {
  constructor(private submissionsService: SubmissionsService) {}

  @Post()
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Submit an assignment (Student only)' })
  async createSubmission(@GetUser('userId') userId: string, @Body() dto: CreateSubmissionDto) {
    return this.submissionsService.createSubmission(userId, dto);
  }

  @Get('my-submissions')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Get my submissions (Student only)' })
  async getMySubmissions(@GetUser('userId') userId: string) {
    return this.submissionsService.getMySubmissions(userId);
  }

  @Get('assignment/:assignmentId')
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get submissions by assignment (Teacher only)' })
  async getSubmissionsByAssignment(@Param('assignmentId') assignmentId: string) {
    return this.submissionsService.getSubmissionsByAssignment(assignmentId);
  }

  @Patch('grade')
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Grade a submission (Teacher only)' })
  async gradeSubmission(@Body() dto: GradeSubmissionDto) {
    return this.submissionsService.gradeSubmission(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get submission by ID' })
  async getSubmission(@Param('id') submissionId: string) {
    return this.submissionsService.getSubmissionById(submissionId);
  }
}
