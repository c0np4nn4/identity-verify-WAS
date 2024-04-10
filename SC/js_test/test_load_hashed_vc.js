const nearAPI = require('near-api-js');

const callContract = async () => {
    const { Contract, connect, keyStores, utils } = nearAPI;

    // Just a randomly generated NEAR testnet account
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
        }
    );

    // const response = await contract.get_did_list();
    // console.log(response);

    await contract.load_hashed_vc({
        issuer_did: 'did:near:quixotic-debt.testnet',
        hashed_vc: 'DUMMY HASHED VC, EXAPMLE HASHED VC',
    });

    const response = await contract.get_hashed_vcs({
        issuer_did: 'did:near:quixotic-debt.testnet',
    });

    console.log(
        "[+] hashed VCs from issuer 'quixotic-debt.testnet': ",
        response
    );
};

callContract();
