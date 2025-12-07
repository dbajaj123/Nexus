import { IsString, IsUUID, IsDateString, IsInt, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AssignmentType } from '@prisma/client';

export class CreateAssignmentDto {
  @ApiProperty()
  @IsUUID()
  courseId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsDateString()
  dueDate: string;

  @ApiProperty()
  @IsInt()
  maxPoints: number;

  @ApiProperty({ enum: AssignmentType })
  @IsEnum(AssignmentType)
  type: AssignmentType;
}
