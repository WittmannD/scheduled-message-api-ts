import { Prisma } from '@prisma/client';
import { IsEnum, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderMessagesQueryDto
  implements Prisma.ScheduledMessageOrderByWithRelationInput
{
  @IsOptional()
  @IsEnum(Prisma.SortOrder)
  id?: Prisma.SortOrder;

  @IsOptional()
  @IsEnum(Prisma.SortOrder)
  updatedAt?: Prisma.SortOrder;

  @IsOptional()
  @IsEnum(Prisma.SortOrder)
  createdAt?: Prisma.SortOrder;

  @IsOptional()
  @IsEnum(Prisma.SortOrder)
  timeForDispatch?: Prisma.SortOrder;

  @IsOptional()
  @IsEnum(Prisma.SortOrder)
  status?: Prisma.SortOrder;
}

export class GetMessagesQueryDto {
  @IsObject()
  @ValidateNested()
  @Type(() => OrderMessagesQueryDto)
  orderBy?: OrderMessagesQueryDto;
}
