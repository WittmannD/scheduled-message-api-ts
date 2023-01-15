import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ApiKeyPayload } from '../interfaces/client.interface';

@Injectable()
export class TokenGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    request.client = this.validateApiKey(request.headers['x-api-key']);

    return true;
  }

  validateApiKey(apiKey): ApiKeyPayload {
    let client: ApiKeyPayload;

    try {
      const decoded = Buffer.from(apiKey.toString(), 'base64').toString(
        'ascii',
      );
      client = JSON.parse(decoded);
    } catch (err) {}

    if (!client || !client.userId || !client.accessToken)
      throw new UnauthorizedException();

    return client;
  }
}
