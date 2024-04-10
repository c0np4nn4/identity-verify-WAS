import { Injectable } from '@nestjs/common';
import { UserVCDto } from './user-vc.dto';

import { Contract, connect, keyStores, utils } from 'near-api-js';

type NEARContract = Contract & {
    load_hashed_vc: (
        args: { issuer_did: String; hashed_vc: String },
        gas?: number,
        depositAmount?: number
    ) => Promise<any>;
    get_hashed_vcs: (
        args: { issuer_did: String },
        gas?: number,
        depositAmount?: number
    ) => Promise<Set<String>>;
};

@Injectable()
export class IssuerAPIService {
    async createUserVC(dto: UserVCDto): Promise<any> {
        // TODO: Some block chain code snippet
        // 인자로 받은 학번, 비밀번호, Holder Pub Key로 규격에 맞게 VC를 생성
        const vc = 'vc';
        return vc;
    }

    // Contract를 interface처럼 쓸 수 있도록 함수 하나 추가함
    async connectToNEARContract(): Promise<Contract> {
        // shaggy-trade.testnet 이라는 이름의 테스트넷 계정 비밀키
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

        // connect to NEAR
        const nearConnection = await connect(connectionConfig);

        const account = await nearConnection.account('shaggy-trade.testnet');

        const contract = new Contract(
            account, // the account object that is connecting
            'cagey-mark.testnet',
            {
                // name of contract you're connecting to
                viewMethods: [
                    'get_document',
                    'get_did_list',
                    'get_did_document_list',
                    'get_hashed_vcs',
                    'get_issuer_list',
                ], // view methods do not change state but usually return a value
                changeMethods: ['reg_did_using_account', 'load_hashed_vc'], // change methods modify state
                useLocalViewExecution: false,
            }
        );

        return contract;
    }

    async loadKeyChain(vc: any): Promise<boolean> {
        const issuerPubKey = await this.getIssuerPubKey();

        const contract = await this.connectToNEARContract();

        (contract as NEARContract).load_hashed_vc({
            issuer_did: 'did:near:quixotic-debt.testnet',
            hashed_vc: 'DUMMY HASHED VC, EXAPMLE HASHED VC',
        });

        // 제대로 적재 되었는지 확인하기 위해 get_hashed_vcs() 호출
        const response = await (contract as NEARContract).get_hashed_vcs({
            issuer_did: 'did:near:quixotic-debt.testnet',
        });

        console.log(
            "[+] hashed VCs from issuer 'quixotic-debt.testnet': ",
            response
        );
        // 제대로 적재 되었는지 확인하기 위해 get_hashed_vcs() 호출

        // TODO: Some block chain code snippet
        // - { Issuer Pub Key, Hash(VC) } 이 키체인을 블록체인 상에 적재
        return true;
    }

    async getIssuerPubKey() {
        // 서버 내 fileDB에서 저장하고 있다가 가져오는 getter니까 신경 X
        return 'Issuer Pub Key';
    }
}
