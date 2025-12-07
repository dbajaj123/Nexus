import { IsUUID, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubmissionDto {
  @ApiProperty()
  @IsUUID()
  assignmentId: string;

  @ApiProperty()
  @IsString()
  contentUrl: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comment?: string;
}

export class GradeSubmissionDto {
  @ApiProperty()
  @IsUUID()
  submissionId: string;

  @ApiProperty()
  finalGrade: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  feedback?: string;
}
