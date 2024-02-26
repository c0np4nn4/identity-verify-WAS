import { Injectable } from '@nestjs/common';
import { ProofDto } from './proof.dto';
import { lastValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ServiceAPIService {
  constructor(private httpService: HttpService) {}

  async verifyProof(dto: ProofDto): Promise<boolean> {
    const url = 'http://verifier:8083/api/verifier/verify-proof';
    return lastValueFrom(
      this.httpService
        .get(url, { params: { ...dto } })
        .pipe(map((response) => response.data)),
    );
  }
}
