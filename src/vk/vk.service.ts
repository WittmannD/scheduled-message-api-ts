import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ScheduledMessage } from '@prisma/client';
import * as queryString from 'querystring';
import { firstValueFrom } from 'rxjs';
import { randomInt } from 'crypto';
import { Method } from 'axios';
import { IVkConfig } from './interfaces/config.interface';

@Injectable()
export class VkService {
  private config: IVkConfig;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.config = configService.get<IVkConfig>('vk');
  }

  buildApiCallUrl(method: string, params: Record<string, any>) {
    const url = new URL(`method/${method}`, this.config.APIUrl);
    url.search = queryString.stringify({
      v: this.config.APIVersion,
      ...params,
    });
    return url.toString();
  }

  async apiCall(method, params, httpMethod: Method = 'post') {
    const url = this.buildApiCallUrl(method, params);
    const response = await firstValueFrom(
      this.httpService.request({
        method: httpMethod,
        timeout: this.config.requestTimeout,
        url,
      }),
    );

    if (response.data.error) {
      throw new HttpException(
        { message: response.data.error.error_msg },
        HttpStatus.BAD_REQUEST,
      );
    }

    return response.data.response;
  }

  getRandomId() {
    /*
     * generate random int 32 number in a silly way
     * */
    return randomInt(-2147483648, 2147483647);
  }

  async sendMessage(message: ScheduledMessage) {
    return await this.apiCall('messages.send', {
      peer_id: message.peerId,
      message: message.content,
      payload: message.payload ?? "",
      random_id: this.getRandomId(),
      access_token: message.token,
    });
  }

  async getConversations(token: string, peerId: string) {
    const data = await this.apiCall(
      'messages.getConversationsById',
      {
        peer_ids: peerId,
        access_token: token,
      },
      'GET',
    );


    return data.items;
  }
}
