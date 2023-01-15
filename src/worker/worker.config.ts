import { registerAs } from '@nestjs/config';
import { IWorkerConfig } from './intrefaces/config.interface';
import * as process from 'process';

export default registerAs(
  'scheduler',
  (): IWorkerConfig => ({
    fetchPeriodSeconds: +process.env.FETCH_PERIOD_S || 0.5 * 60,
  }),
);
