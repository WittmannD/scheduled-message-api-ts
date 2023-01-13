import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageModule } from './message/message.module';
import { DatabaseModule } from './database/database.module';
import { WorkerModule } from './worker/worker.module';
import { ConfigModule } from '@nestjs/config';
import { ConversationModule } from './conversation/conversation.module';
import { VkModule } from './vk/vk.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    MessageModule,
    WorkerModule,
    ConversationModule,
    VkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
