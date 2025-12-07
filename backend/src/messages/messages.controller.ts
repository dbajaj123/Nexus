import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { SendMessageDto } from './dto/message.dto';

@ApiTags('messages')
@Controller('messages')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Post()
  @ApiOperation({ summary: 'Send a message' })
  async sendMessage(@GetUser('userId') userId: string, @Body() dto: SendMessageDto) {
    return this.messagesService.sendMessage(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get my messages' })
  async getMyMessages(@GetUser('userId') userId: string) {
    return this.messagesService.getMyMessages(userId);
  }

  @Get('conversation/:userId')
  @ApiOperation({ summary: 'Get conversation with a user' })
  async getConversation(@GetUser('userId') myId: string, @Param('userId') otherUserId: string) {
    return this.messagesService.getConversation(myId, otherUserId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark message as read' })
  async markAsRead(@Param('id') messageId: string) {
    return this.messagesService.markAsRead(messageId);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread message count' })
  async getUnreadCount(@GetUser('userId') userId: string) {
    const count = await this.messagesService.getUnreadCount(userId);
    return { count };
  }
}
