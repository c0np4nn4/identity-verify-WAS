import { Body, Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomErrorException } from 'src/filter/custom-error.exception';
import { TokenGuard } from 'src/common/guard/token.guard';
import { BoatAPIService } from './boat-api.service';

@ApiTags('BOAT API')
@Controller('api/boat')
export class BoatAPIController {
  constructor(private readonly boatAPIService: BoatAPIService) {}

  @UseGuards(TokenGuard)
  @Get('/v1/list')
  @ApiOperation({
    summary: '종이배 리스트 조회',
  })
  async getBoatList(@Query('userPk') userPk: string) {
    try {
      return await this.boatAPIService.getBoatList(userPk);
    } catch (error) {
      throw new CustomErrorException('Request Failed', 400);
    }
  }

  @UseGuards(TokenGuard)
  @Get('/v1/list-filter')
  @ApiOperation({
    summary: '종이배 리스트 조회 - 필터링',
  })
  async getFilteredBoatList(
    @Query('userPk') userPk: string,
    @Query('filter1') filter1: string,
    @Query('filter2') filter2: string,
    @Query('filter3') filter3: string,
    @Query('filter4') filter4: string = null,
    @Query('filter5') filter5: string = null,
  ) {
    try {
      return await this.boatAPIService.getFilteredBoatList(
        userPk,
        filter1,
        filter2,
        filter3,
        filter4,
        filter5,
      );
    } catch (error) {
      throw new CustomErrorException('Request Failed', 400);
    }
  }

  @UseGuards(TokenGuard)
  @Get('/v1/single')
  @ApiOperation({
    summary: '단일 종이배 조회',
  })
  async getSingleBoat(@Query('boatPk') boatPk: string) {
    try {
      return await this.boatAPIService.getSingleBoat(boatPk);
    } catch (error) {
      throw new CustomErrorException('Request Failed', 400);
    }
  }
}
