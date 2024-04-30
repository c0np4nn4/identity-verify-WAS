import { Injectable } from '@nestjs/common';
import { NEARVerfiyResult } from '../types/types';
import { connectToNEARContract } from '../utils/utils';
import { groth16 } from 'snarkjs';

@Injectable()
export class VerifierAPIService {
  /*
    @ Use: Verifier Controller - verifyProof()
    @ Intend: 2차 인증 ZKP proof 검증을 wasm 파일로 수행
  */
  async verifyProof(
    proofJson: string,
    IssuerPubKeyJson: string,
    vKeyJson: string,
  ): Promise<boolean> {
    const { proof, IssuerPubKey, vKey } = this.jsonConverter(
      proofJson,
      IssuerPubKeyJson,
      vKeyJson,
    );

    // verify success
    const res = await groth16.verify(vKey, IssuerPubKey, proof);

    if (res === true) {
      console.log('Proof verified successfully');
    } else {
      console.log('Invalid proof');
    }
    return true;
  }

  /*
    @ Use: Verifier Controller - verifyProof()
    @ Intend: ZKP 검증으로 생성된 proof를 Near 네트워크에 적재
  */
  async loadProofResult(HolderPubKey: string) {
    // TODO: 내부 코드 변경 필요 (예상)
    const contract = await connectToNEARContract();

    // { Holder Pub Key : 서비스 이름 } 적재
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

  /*
    @ Use: verifyProof()
    @ Intend: json 파일로 변환
  */
  jsonConverter(proof: string, IssuerPubKey: string, vKey: string) {
    return {
      proof: JSON.parse(proof),
      IssuerPubKey: JSON.parse(IssuerPubKey),
      vKey: JSON.parse(vKey),
    };
  }
}
