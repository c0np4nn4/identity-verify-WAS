import { Contract, connect, keyStores, utils } from 'near-api-js';

// Contract를 interface처럼 쓸 수 있도록 구현
export async function connectToNEARContract(): Promise<Contract> {
  // 테스트넷 계정: shaggy-trade.testnet
  // 계정 정보: https://testnet.nearblocks.io/address/shaggy-trade.testnet
  const privateKey =
    'ed25519:AZjV8EWE341ENZ3iYKoydJrmKAUqaayAYcAydJDHQHBtzYzyBFojFRGr5DRrQxAsD1RVa522suQehT6Mye3BUGR';
  const keyPair = utils.KeyPair.fromString(privateKey);

  const keyStore = new keyStores.InMemoryKeyStore();
  keyStore.setKey('testnet', 'shaggy-trade.testnet', keyPair);

  const connectionConfig = {
    networkId: 'testnet',
    keyStore,
    nodeUrl: 'https://rpc.testnet.near.org',
    walletUrl: 'https://testnet.mynearwallet.com/',
    helperUrl: 'https://helper.testnet.near.org',
    explorerUrl: 'https://testnet.nearblocks.io',
  };

  // NEAR 연결
  const nearConnection = await connect(connectionConfig);
  // issuer
  const account = await nearConnection.account('shaggy-trade.testnet');

  const contract = new Contract(account, 'honorable-muscle.testnet', {
    viewMethods: [
      'get_document',
      'get_did_list',
      'get_did_document_list',
      'get_hashed_vcs',
      'get_issuer_list',
      'get_verify_result'
    ],
    changeMethods: [
      'reg_did_using_account',
      'load_hashed_vc',
      'load_verify_result'
    ],
    useLocalViewExecution: false,
  });

  return contract;
}

export function createVC(uuid: string, holderPubKey: string) {
  const timeStamp = getTimeStamp();
  // proofValue 는 현재 하드코딩  됨
  // - issuer 필드와 함께, 연산결과로 수정되어야 함
  // - 참고: https://cyphr.me/ed25519_tool/ed.html
  return {
    context: ['https://www.w3.org/ns/credentials/v2'],
    id: `url:uuid:${uuid}`,
    credential_type: ['VerifiableCredential', 'MajorCredential'],
    // 완성본 issuer
    issuer: 'did:near:pnu.testnet',
    validFrom: timeStamp,
    credentialSubject: {
      id: `did:near:${holderPubKey}.testnet`,
      subject: {
        school_did: 'did:near:pnu.testnet',
      },
    },
    proof: {
      type: 'CircRefNEARDIDProof',
      cryptosuite: 'eddsa',
      created: timeStamp,
      verificationMethod: 'CircRefVCSignatureVerificationMethod',
      proofPurpose: 'assertionMethod',
      proofValue: '',
    },
  };
}

function getTimeStamp() {
  const now = new Date();

  const y = now.getFullYear();
  const m = ('0' + (now.getMonth() + 1)).slice(-2);
  const d = ('0' + now.getDate()).slice(-2);

  const h = ('0' + now.getHours()).slice(-2);
  const min = ('0' + now.getMinutes()).slice(-2);
  const sec = ('0' + now.getSeconds()).slice(-2);

  return `${y}-${m}-${d}T${h}:${min}:${sec}Z`;
}
