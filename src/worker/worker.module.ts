import { Module } from '@nestjs/common';
import {ScheduleModule} from "@nestjs/schedule";
import {MessageModule} from "../message/message.module";
import {WorkerService} from "./worker.service";
import {ConfigModule} from "@nestjs/config";
import WorkerConfig from "./worker.config";
import {VkModule} from "../vk/vk.module";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forFeature(WorkerConfig),
    VkModule,
    MessageModule,
  ],
  controllers: [],
  providers: [WorkerService],
})
export class WorkerModule {}
