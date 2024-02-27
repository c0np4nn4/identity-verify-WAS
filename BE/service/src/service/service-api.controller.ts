import { Controller, Get, Query } from '@nestjs/common';
import { ServiceAPIService } from './service-api.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProofDto } from './proof.dto';

@Controller('api/service')
@ApiTags('SERVICE API')
export class ServiceAPIController {
  constructor(private readonly serviceAPIService: ServiceAPIService) {}

  @Get('verify-proof')
  @ApiOperation({
    summary: '생성된 Proof를 검증하기 위해 Verifier 서버로 프록시',
  })
  async verifyProof(@Query() dto: ProofDto): Promise<boolean> {
    return await this.serviceAPIService.verifyProof(dto);
  }
}
