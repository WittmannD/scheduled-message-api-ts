import { ScheduledMessage } from '@prisma/client';
import { IsDateString, IsEmpty, Length } from 'class-validator';
import { MinDate } from '../../decorators/validate-min-date.decorator';

export class CreateMessageDto
  implements Pick<ScheduledMessage, 'content' | 'payload' | 'timeForDispatch'>
{
  @Length(1, 3000)
  content: string;

  @IsEmpty()
  payload: string;

  @IsDateString()
  @MinDate()
  timeForDispatch: Date;
}
