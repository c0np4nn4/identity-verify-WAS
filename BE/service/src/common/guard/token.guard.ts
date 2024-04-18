/* eslint-disable @typescript-eslint/no-empty-function */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CustomErrorException } from 'src/filter/custom-error.exception';
import { ServiceAPIService } from 'src/service/service-api.service';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private readonly serviceAPIService: ServiceAPIService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['token'];

    if (!token) {
      throw new CustomErrorException('Missing Token', 400);
    }

    const res = await this.serviceAPIService.getUserInfoByToken(token);
    if (!res.result) {
      throw new CustomErrorException('User Not Exist', 404);
    }
    return true;
  }
}
