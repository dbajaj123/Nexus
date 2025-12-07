import { IsString, IsUUID, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GradeSubmissionDto {
  @ApiProperty()
  @IsString()
  submissionText: string;

  @ApiProperty()
  @IsString()
  assignmentDescription: string;

  @ApiProperty()
  @IsNumber()
  maxPoints: number;
}

export class ChatDto {
  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsUUID()
  courseId: string;
}
