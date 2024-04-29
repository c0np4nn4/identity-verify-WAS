import { Injectable } from '@nestjs/common';
import { NEARVerfiyResult } from '../types/types';
import { connectToNEARContract } from '../utils/utils';

@Injectable()
export class VerifierAPIService {
  /*
    @ Use: Verifier Controller - verifyProof()
    @ Intend: 2차 인증 ZKP proof 검증을 wasm 파일로 수행
  */
  verifyProof(
    proof: string,
    IssuerPubKey: string,
    pk: string,
    message: string,
    params: object,
    vkey: Uint8Array,
  ): boolean {
    // TODO: Some block chain code snippet
    // ZKP 검증 by WASM 파일
    return true;
  }

  /*
    @ Use: Verifier Controller - verifyProof()
    @ Intend: ZKP 검증으로 생성된 proof를 Near 네트워크에 적재
  */
  async loadProofResult(HolderPubKey: string) {
    // TODO: 내부 코드 변경 필요 (예상)
    const contract = await connectToNEARContract();

    // { Holder Pub Key : 학과 코드 } 적재
    await (contract as NEARVerfiyResult).load_verify_result({
      holder_public_key: HolderPubKey,
      service_name: 'dot-dan-bea',
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
