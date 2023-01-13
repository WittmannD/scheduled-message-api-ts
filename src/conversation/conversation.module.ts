import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { VkModule } from '../vk/vk.module';

@Module({
  imports: [VkModule],
  controllers: [ConversationController],
})
export class ConversationModule {}
