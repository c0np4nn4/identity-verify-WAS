import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { WHERE_LOG } from 'src/common/const';
import { Logger } from 'winston';

@Injectable()
export class CustomLoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  error(where: string, url: string, title: string, object: any) {
    this.logger.error(
      `\n\t 🔴 - ${WHERE_LOG[where]} [${url}] ${title}\n\t`,
      object,
    );
  }

  invalid(where: string, url: string, title: string, object: any) {
    this.logger.warn(
      `\n\t 🔴 - ${WHERE_LOG[where]} [${url}] ${title}\n\t`,
      object,
    );
  }

  log(where: string, title: string) {
    // 사실은 warn임 (로깅 구분 위함)
    this.logger.warn(`\n\t 🟡 - ${WHERE_LOG[where]} ${title}\n\t`, {});
  }
}
