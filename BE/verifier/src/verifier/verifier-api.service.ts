import { Injectable } from '@nestjs/common';
import { NEARVerfiyResult } from '../types/types';
import { connectToNEARContract } from '../utils/utils';

@Injectable()
export class VerifierAPIService {
  verifyProof(
    proof: string,
    IssuerPubKey: string,
    majorCode: string,
    message: string,
    params: object,
    vkey: Uint8Array,
    strategy: Uint8Array,
  ): boolean {
    // TODO: Some block chain code snippet
    // ZKP 검증 by WASM 파일
    return true;
  }

  async loadProofResult(HolderPubKey: string) {
    // TODO: 내부 코드 변경 필요 (예상)
    const contract = await connectToNEARContract();

    // { Holder Pub Key : 검증 결과 } 적재
    await (contract as NEARVerfiyResult).load_verify_result({
      holder_public_key: HolderPubKey,
      verify_result: true,
    });

    // 제대로 적재 되었는지 확인
    const response = await (contract as NEARVerfiyResult).get_verify_result({
      holder_public_key: HolderPubKey,
    });

    console.log(
      `[+] Verify result by Holder pub key '${HolderPubKey}': ${response}`,
    );
    return true;
  }
}
