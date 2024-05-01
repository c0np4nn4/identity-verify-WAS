import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomErrorException } from 'src/filter/custom-error.exception';
import { TokenGuard } from 'src/common/guard/token.guard';
import { AlarmAPIService } from './alarm-api.service';
import { CustomLoggerService } from 'src/module/custom.logger';
import { WHERE } from 'src/common/const';

@ApiTags('ALARM API')
@Controller('api/alarm')
export class AlarmAPIController {
  constructor(
    private readonly alarmAPIService: AlarmAPIService,
    private readonly customLoggerService: CustomLoggerService,
  ) {}

  @UseGuards(TokenGuard)
  @Get('/v1/list')
  @ApiOperation({
    summary: '알림 리스트 조회',
  })
  async getAlarmList(@Query('userPk') userPk: string) {
    try {
      const alarmList = await this.alarmAPIService.getAlarmList(userPk);
      return { statusCode: 200, data: { alarmList } };
    } catch (error) {
      this.customLoggerService.error(
        WHERE['ALARM'],
        '/v1/list',
        '알림 리스트 조회 실패',
        {
          userPk,
        },
      );
      throw new CustomErrorException('Request Failed', 400);
    }
  }

  @UseGuards(TokenGuard)
  @Get('/v1/single')
  @ApiOperation({
    summary: '단일 알림 조회',
  })
  async getSingleAlarm(@Query('alarmPk') alarmPk: number) {
    try {
      const alarm = await this.alarmAPIService.getSingleAlarm(alarmPk);
      return { statusCode: 200, data: { alarm } };
    } catch (error) {
      this.customLoggerService.error(
        WHERE['ALARM'],
        '/v1/single',
        '단일 알림 조회 실패',
        {
          alarmPk,
        },
      );
      throw new CustomErrorException('Request Failed', 400);
    }
  }
}
