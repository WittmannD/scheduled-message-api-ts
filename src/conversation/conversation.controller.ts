import {
  BadRequestException,
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { VkService } from '../vk/vk.service';
import { TokenGuard } from '../guards/token.guard';
import { Client } from '../decorators/client.decorator';
import { ApiKeyPayload } from '../interfaces/client.interface';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly vkService: VkService) {}

  @Get(':peerId')
  @UseGuards(TokenGuard)
  async getConversation(
    @Client() client: ApiKeyPayload,
    @Param('peerId') peerId: string,
  ) {
    try {
      return await this.vkService.getConversations(client.accessToken, peerId);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
