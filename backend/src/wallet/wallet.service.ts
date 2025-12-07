import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TxStatus, TxType } from '@prisma/client';
import { CreateTransactionDto } from './dto/wallet.dto';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async getWallet(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: {
            timestamp: 'desc',
          },
          take: 20,
        },
      },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return wallet;
  }

  async createTransaction(userId: string, dto: CreateTransactionDto) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    // Validate balance for PAYMENT transactions
    if (dto.type === TxType.PAYMENT && wallet.balance < dto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Calculate new balance
    let newBalance = wallet.balance;
    if (dto.type === TxType.DEPOSIT || dto.type === TxType.REFUND) {
      newBalance += dto.amount;
    } else if (dto.type === TxType.PAYMENT) {
      newBalance -= dto.amount;
    }

    // Create transaction and update wallet balance
    const [transaction] = await this.prisma.$transaction([
      this.prisma.transaction.create({
        data: {
          walletId: wallet.id,
          amount: dto.amount,
          type: dto.type,
          category: dto.category,
          description: dto.description,
          status: TxStatus.COMPLETED,
        },
      }),
      this.prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: newBalance },
      }),
    ]);

    return transaction;
  }

  async getTransactionHistory(userId: string, limit = 50) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return this.prisma.transaction.findMany({
      where: { walletId: wallet.id },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
    });
  }
}
