import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { TokenGuard } from '../guards/token.guard';
import { Client } from '../decorators/client.decorator';
import { ApiKeyPayload } from '../interfaces/client.interface';
import { GetMessagesQueryDto } from './dto/get-messages-query.dto';
import { RemoveMessagesDto } from './dto/remove-messages.dto';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('conversation/:peerId')
  @UseGuards(TokenGuard)
  async create(
    @Param('peerId') peerId: string,
    @Client() client: ApiKeyPayload,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return await this.messageService.create(
      client.userId,
      client.accessToken,
      peerId,
      createMessageDto,
    );
  }

  @Get('conversation/:peerId')
  @UseGuards(TokenGuard)
  async findUserConversationMessages(
    @Param('peerId') peerId: string,
    @Query() getMessagesQuery: GetMessagesQueryDto,
    @Client() client: ApiKeyPayload,
  ) {
    return await this.messageService.findUserConversationMessages(
      client.userId,
      peerId,
      getMessagesQuery,
    );
  }

  @Delete()
  @UseGuards(TokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  removeMany(
    @Client() client: ApiKeyPayload,
    @Body() removeMessagesDto: RemoveMessagesDto,
  ) {
    return this.messageService.removeUserMessages(
      client.userId,
      removeMessagesDto.ids,
    );
  }

  @Delete(':id')
  @UseGuards(TokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Client() client: ApiKeyPayload) {
    return this.messageService.removeUserMessages(client.userId, [+id]);
  }
}
