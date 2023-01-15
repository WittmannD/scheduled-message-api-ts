import { Injectable, Logger } from '@nestjs/common';
import { MessageService } from '../message/message.service';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import {
  addSeconds,
  subSeconds,
  differenceInMilliseconds,
  getTime,
} from 'date-fns';
import { ConfigService } from '@nestjs/config';
import { ScheduledMessage, MessageStatus } from '@prisma/client';
import { VkService } from '../vk/vk.service';
import { IWorkerConfig } from './intrefaces/config.interface';

@Injectable()
export class WorkerService {
  private readonly logger = new Logger(WorkerService.name);
  private config: IWorkerConfig;
  constructor(
    private readonly messageService: MessageService,
    private readonly vkService: VkService,
    private readonly configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {
    this.config = configService.get<IWorkerConfig>('scheduler');
  }

  private async onSuccess(message: ScheduledMessage) {
    const timestamp = new Date();
    this.logger.log(
      `Message #${message.id} sent successful.
      Timestamp: ${timestamp.toISOString()}; 
      Expected time: ${message.timeForDispatch.toISOString()}; 
      Difference: ${differenceInMilliseconds(
        timestamp,
        message.timeForDispatch,
      )}ms`,
    );

    await this.messageService.update(message.id, {
      status: MessageStatus.SUCCEEDED,
    });
  }

  async onFailure(err: Error, message: ScheduledMessage) {
    this.logger.error(
      `An error occurred during sending message #${message.id}: ${err?.message}`,
    );
    await this.messageService.update(message.id, {
      status: MessageStatus.FAILED,
    });
  }

  addMessageTimeout(message: ScheduledMessage) {
    const callback = () => {
      this.vkService
        .sendMessage(message)
        .then(() => this.onSuccess(message))
        .catch((err) => this.onFailure(err, message));
    };

    const milliseconds = Math.max(
      1,
      differenceInMilliseconds(message.timeForDispatch, new Date()),
    );

    const timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(
      `message-${message.id}-[${getTime(message.timeForDispatch)}]`,
      timeout,
    );
  }

  async processMessages(messages: ScheduledMessage[]) {
    this.logger.log(`Fetched ${messages.length} messages`);

    for (const message of messages) {
      await this.messageService.update(message.id, {
        status: MessageStatus.PROCESSED,
      });
      this.addMessageTimeout(message);
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async fetchAwaitedMessages() {
    const now = new Date();
    const from = subSeconds(now, this.config.fetchPeriodSeconds);
    const to = addSeconds(now, this.config.fetchPeriodSeconds);
    const messages = await this.messageService.findAwaitedByDispatchTime(
      from,
      to,
    );
    await this.processMessages(messages);
  }
}
