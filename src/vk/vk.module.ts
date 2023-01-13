import { Module } from '@nestjs/common';
import { VkService } from './vk.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import VkConfig from './vk.config';

@Module({
  imports: [HttpModule, ConfigModule.forFeature(VkConfig)],
  providers: [VkService],
  exports: [VkService],
})
export class VkModule {}
