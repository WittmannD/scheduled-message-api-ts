import { registerAs } from '@nestjs/config';
import { IVkConfig } from './interfaces/config.interface';
import * as process from 'process';

export default registerAs(
  'vk',
  (): IVkConfig => ({
    APIUrl: 'https://api.vk.com/method',
    APIVersion: process.env.VK_API_VERSION || '5.131',
    requestTimeout: +process.env.VK_API_REQUEST_TIMEOUT_MS || 0,
  }),
);
