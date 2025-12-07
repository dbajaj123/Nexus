import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { CreateTransactionDto } from './dto/wallet.dto';

@ApiTags('wallet')
@Controller('wallet')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get()
  @ApiOperation({ summary: 'Get my wallet' })
  async getWallet(@GetUser('userId') userId: string) {
    return this.walletService.getWallet(userId);
  }

  @Post('transaction')
  @ApiOperation({ summary: 'Create a transaction' })
  async createTransaction(@GetUser('userId') userId: string, @Body() dto: CreateTransactionDto) {
    return this.walletService.createTransaction(userId, dto);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get transaction history' })
  async getTransactionHistory(@GetUser('userId') userId: string, @Query('limit') limit?: string) {
    return this.walletService.getTransactionHistory(userId, limit ? parseInt(limit) : 50);
  }
}
