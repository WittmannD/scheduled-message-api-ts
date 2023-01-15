import { Injectable, Logger } from '@nestjs/common';
import { MessageStatus, ScheduledMessage } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { CreateMessageDto } from './dto/create-message.dto';
import { DatabaseService } from '../database/database.service';
import { GetMessagesQueryDto } from './dto/get-messages-query.dto';

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
    options?: GetMessagesQueryDto,
  ): Promise<ScheduledMessage[]> {
    return await this.dataSource.scheduledMessage.findMany({
      where: {
        userId,
        peerId,
      },
      orderBy: options?.orderBy,
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

  async removeUserMessages(userId: string, ids: number[]) {
    await this.dataSource.scheduledMessage.deleteMany({
      where: {
        id: {
          in: ids,
        },
        userId,
      },
    });
  }
}
