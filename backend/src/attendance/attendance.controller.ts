import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { BulkAttendanceDto } from './dto/attendance.dto';

@ApiTags('attendance')
@Controller('attendance')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post('bulk')
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Record bulk attendance (Teacher only)' })
  async recordBulkAttendance(@Body() dto: BulkAttendanceDto) {
    return this.attendanceService.recordBulkAttendance(dto);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get student attendance records' })
  async getStudentAttendance(
    @Param('studentId') studentId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.attendanceService.getStudentAttendance(
      studentId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('stats/:studentId')
  @ApiOperation({ summary: 'Get attendance statistics' })
  async getAttendanceStats(@Param('studentId') studentId: string) {
    return this.attendanceService.getAttendanceStats(studentId);
  }

  @Get('my-attendance')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Get my attendance (Student only)' })
  async getMyAttendance(@GetUser('userId') userId: string) {
    return this.attendanceService.getStudentAttendance(userId);
  }
}
