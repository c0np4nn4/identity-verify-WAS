import { Injectable } from '@nestjs/common';
import { NEARVerfiyResult } from '../types/types';
import { connectToNEARContract } from '../utils/utils';
import { Groth16Proof, groth16 } from 'snarkjs';
import { vkey } from 'src/common/const';

@Injectable()
export class VerifierAPIService {
  /*
    @ Use: Verifier Controller - verifyProof()
    @ Intend: 2차 인증 ZKP proof 검증을 wasm 파일로 수행
  */
  async verifyProof(publicSignals: string[], proof: Groth16Proof) {
    const res = await groth16.verify(vkey, publicSignals, proof);

    if (res === true) {
      console.log('Proof verified successfully');
      return true;
    } else {
      console.log('Invalid proof');
      return false;
    }
  }

  /*
    @ Use: Verifier Controller - verifyProof()
    @ Intend: ZKP 검증을 통해 인증받은 사용자를 Near 네트워크에 적재
  */
  async loadProofResult(ServiceName: string, HolderPubKey: string) {
    const contract = await connectToNEARContract();

    // { Holder Pub Key : 서비스 이름 } 적재
    await (contract as NEARVerfiyResult).load_verify_result({
      service_name: `${ServiceName}`,
      holder_did: `did:near:${HolderPubKey}`,
    });

    // 제대로 적재 되었는지 확인
    const response = await (contract as NEARVerfiyResult).get_verify_result({
      service_name: `${ServiceName}`,
      holder_did: `did:near:${HolderPubKey}`,
    });

    console.log(
      `[+] Verify result by Holder pub key '${HolderPubKey}': ${response}`,
    );
    // return true;
    return response;
  }
}
