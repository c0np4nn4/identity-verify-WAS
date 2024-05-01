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
  const account = await nearConnection.account('shaggy-trade.testnet');

  const contract = new Contract(account, 'honorable-muscle.testnet', {
    viewMethods: [
      'get_document',
      'get_did_list',
      'get_did_document_list',
      'get_hashed_vcs',
      'get_issuer_list',
      'get_veriy_result'

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
