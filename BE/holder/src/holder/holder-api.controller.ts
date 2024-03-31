import { Body, Controller, Get, Post, Query, UseFilters } from '@nestjs/common';
import { HolderAPIService } from './holder-api.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserVCDto } from '../dto/user-vc.dto';
import { CustomExceptionFilter } from '../filter/exception.filter';

@Controller('api/holder')
@ApiTags('HOLDER API')
@UseFilters(CustomExceptionFilter)
export class HolderAPIController {
  constructor(private readonly holderAPIService: HolderAPIService) {}

  @Post('/create-vc')
  @ApiOperation({
    summary: '사용자 VC 생성',
  })
  async createUserVC(@Body() dto: UserVCDto) {
    const { issuerPubKey, vc } = await this.holderAPIService.createUserVC(dto);
    const { proofValue, message } = await this.holderAPIService.getProofValue();
    const rawVC = JSON.parse(vc);
    Object.assign(rawVC, { proofValue });
    return {
      statusCode: 200,
      data: { issuerPubKey, vc: JSON.stringify(rawVC), message },
    };
  }
}
