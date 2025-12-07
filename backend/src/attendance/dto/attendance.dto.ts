import { IsUUID, IsDateString, IsEnum, IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AttendanceStatus } from '@prisma/client';

export class AttendanceItem {
  @ApiProperty()
  @IsUUID()
  studentId: string;

  @ApiProperty({ enum: AttendanceStatus })
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class BulkAttendanceDto {
  @ApiProperty()
  @IsUUID()
  courseId: string;

  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiProperty({ type: [AttendanceItem] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceItem)
  records: AttendanceItem[];
}
