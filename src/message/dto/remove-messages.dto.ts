import { ArrayMinSize, IsArray, IsInt, IsPositive } from 'class-validator';

export class RemoveMessagesDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @IsPositive({ each: true })
  ids: number[];
}
