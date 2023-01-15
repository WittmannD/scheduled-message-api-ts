import { ScheduledMessage } from '@prisma/client';
import { IsDateString, IsOptional, IsString, Length } from 'class-validator';
import { MinDate } from '../../decorators/validate-min-date.decorator';

export class CreateMessageDto
  implements Pick<ScheduledMessage, 'content' | 'payload' | 'timeForDispatch'>
{
  @IsString()
  @Length(1, 3000)
  content: string;

  @IsString()
  @IsOptional()
  payload: string | null;

  @IsDateString()
  @MinDate()
  timeForDispatch: Date;
}
