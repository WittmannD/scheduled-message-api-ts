import { Injectable, Logger } from '@nestjs/common';
import { MessageStatus, ScheduledMessage } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { CreateMessageDto } from './dto/create-message.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    private readonly dataSource: DatabaseService,
    private readonly configService: ConfigService,
  ) {}
  async create(
    userId: string,
    token: string,
    peerId: string,
    createMessageDto: CreateMessageDto,
  ) {
    return await this.dataSource.scheduledMessage.create({
      data: {
        ...createMessageDto,
        peerId,
        userId,
        token,
      },
    });
  }

  async findUserConversationMessages(
    userId: string,
    peerId: string,
  ): Promise<ScheduledMessage[]> {
    return await this.dataSource.scheduledMessage.findMany({
      where: {
        userId,
        peerId,
      },
    });
  }

  async findAwaitedByDispatchTime(
    from: Date,
    to: Date,
  ): Promise<ScheduledMessage[]> {
    return await this.dataSource.scheduledMessage.findMany({
      where: {
        status: MessageStatus.AWAIT,
        timeForDispatch: {
          lte: to,
          gte: from,
        },
      },
    });
  }

  async update(id: number, updateMessageDto: Partial<ScheduledMessage>) {
    await this.dataSource.scheduledMessage.update({
      where: { id },
      data: { ...updateMessageDto },
    });
  }

  async remove(id: number) {
    await this.dataSource.scheduledMessage.delete({
      where: { id },
    });
  }

  async removeUserMessage(userId: string, id: number) {
    await this.dataSource.scheduledMessage.deleteMany({
      where: { id, userId },
    });
  }
}
