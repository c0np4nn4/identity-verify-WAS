import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomErrorException } from 'src/filter/custom-error.exception';
import { TokenGuard } from 'src/common/guard/token.guard';
import { AlarmAPIService } from './alarm-api.service';

@ApiTags('ALARM API')
@Controller('api/alarm')
export class AlarmAPIController {
  constructor(private readonly alarmAPIService: AlarmAPIService) {}

  @UseGuards(TokenGuard)
  @Get('/v1/list')
  @ApiOperation({
    summary: '알림 리스트 조회',
  })
  async getAlarmList(@Query('userPk') userPk: string) {
    try {
      return await this.alarmAPIService.getAlarmList(userPk);
    } catch (error) {
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
      return await this.alarmAPIService.getSingleAlarm(alarmPk);
    } catch (error) {
      throw new CustomErrorException('Request Failed', 400);
    }
  }
}
