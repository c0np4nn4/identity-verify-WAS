/* eslint-disable @typescript-eslint/no-empty-function */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CustomErrorException } from 'src/filter/custom-error.exception';
import { ServiceAPIService } from 'src/api/service/service-api.service';
import { CustomLoggerService } from 'src/module/custom.logger';
import { WHERE } from '../const';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private readonly serviceAPIService: ServiceAPIService,
    private readonly customLoggerService: CustomLoggerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['token'];

    if (!token) {
      this.customLoggerService.error(
        WHERE['TOKEN_GUARD'],
        'TOKEN GUARD',
        '유효하지 않은 토큰',
        {},
      );
      throw new CustomErrorException('Missing Token', 400);
    }

    const res = await this.serviceAPIService.getUserInfoByToken(token);
    if (!res.result) {
      this.customLoggerService.error(
        WHERE['TOKEN_GUARD'],
        'TOKEN GUARD',
        '존재하지 않는 사용자',
        {
          token,
        },
      );
      throw new CustomErrorException('User Not Exist', 404);
    }
    return true;
  }
}
