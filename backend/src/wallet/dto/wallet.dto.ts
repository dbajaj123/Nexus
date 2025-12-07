import { IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TxType } from '@prisma/client';

export class CreateTransactionDto {
  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty({ enum: TxType })
  @IsEnum(TxType)
  type: TxType;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
