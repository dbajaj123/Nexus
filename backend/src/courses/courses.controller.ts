import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { CreateCourseDto, EnrollStudentDto } from './dto/course.dto';

@ApiTags('courses')
@Controller('courses')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Post()
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new course (Teacher only)' })
  async createCourse(@GetUser('userId') userId: string, @Body() dto: CreateCourseDto) {
    return this.coursesService.createCourse(userId, dto);
  }

  @Get('my-courses')
  @ApiOperation({ summary: 'Get my courses' })
  async getMyCourses(@GetUser('userId') userId: string, @GetUser('role') role: UserRole) {
    return this.coursesService.getMyCourses(userId, role);
  }

  @Get('all')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all courses (Admin only)' })
  async getAllCourses() {
    return this.coursesService.getAllCourses();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course by ID' })
  async getCourse(
    @Param('id') courseId: string,
    @GetUser('userId') userId: string,
    @GetUser('role') role: UserRole,
  ) {
    return this.coursesService.getCourseById(courseId, userId, role);
  }

  @Post('enroll')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Enroll a student in a course' })
  async enrollStudent(@Body() dto: EnrollStudentDto) {
    return this.coursesService.enrollStudent(dto.studentId, dto.courseId);
  }
}
