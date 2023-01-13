import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { DatabaseModule } from '../database/database.module';
import { VkModule } from '../vk/vk.module';

@Module({
  imports: [DatabaseModule, VkModule],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
