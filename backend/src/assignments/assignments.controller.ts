import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AssignmentsService } from './assignments.service';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { CreateAssignmentDto } from './dto/assignment.dto';

@ApiTags('assignments')
@Controller('assignments')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class AssignmentsController {
  constructor(private assignmentsService: AssignmentsService) {}

  @Post()
  @Roles(UserRole.TEACHER)
  @ApiOperation({ summary: 'Create a new assignment (Teacher only)' })
  async createAssignment(@GetUser('userId') userId: string, @Body() dto: CreateAssignmentDto) {
    return this.assignmentsService.createAssignment(dto, userId);
  }

  @Get('course/:courseId')
  @ApiOperation({ summary: 'Get assignments by course' })
  async getAssignmentsByCourse(@Param('courseId') courseId: string) {
    return this.assignmentsService.getAssignmentsByCourse(courseId);
  }

  @Get('upcoming')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Get upcoming assignments (Student only)' })
  async getUpcomingAssignments(@GetUser('userId') userId: string, @GetUser('role') role: UserRole) {
    return this.assignmentsService.getUpcomingAssignments(userId, role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get assignment by ID' })
  async getAssignment(@Param('id') assignmentId: string) {
    return this.assignmentsService.getAssignmentById(assignmentId);
  }
}
