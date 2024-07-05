#[cfg(test)]
mod tests {

    use near_sdk::AccountId;
    use std::str::FromStr;

    use crate::{
        utils::{convert_account_id_to_did, get_current_time},
        DidContract, DidDocument, IssuerDID,
    };

    #[test]
    fn test_reg_did() {
        use crate::DidContract;

        let mut contract = DidContract::default();

        contract.reg_did_using_account(false);

        let did_list: Vec<String> = contract.get_total_did();

        println!("[+] did_list: {:?}", did_list);

        contract.reg_did_using_account(false);
    }

    #[test]
    fn test_get_did_list() {
        let mut contract = DidContract::default();

        contract.reg_did_using_account(false);

        let list: Vec<String> = contract.get_total_did();

        println!("list: {:?}", list);
    }

    #[test]
    fn test_get_did_document_list() {
        let mut contract = DidContract::default();

        contract.reg_did_using_account(false);

        let list: Vec<DidDocument> = contract.get_total_document();

        println!("list: {:#?}", list);
    }

    #[test]
    fn test_get_current_time_test() {
        println!("time: {:?}", get_current_time());
    }

    #[test]
    fn test_reg_issuer() {
        use near_sdk::test_utils::VMContextBuilder;
        use near_sdk::testing_env;
        const NEAR: u128 = 1_000_000_000_000_000_000_000_000;

        let mut contract = DidContract::default();

        let mut builder = VMContextBuilder::new();
        builder.predecessor_account_id("bear-bear.testnet".parse().unwrap());
        builder.attached_deposit(11 * NEAR);
        testing_env!(builder.build());

        contract.reg_did_using_account(true);

        let list: Vec<IssuerDID> = contract.get_total_issuer_did();

        println!("list: {:#?}", list);
    }

    // #[test]
    // fn issue_vc() {
    //     use near_sdk::test_utils::VMContextBuilder;
    //     use near_sdk::{log, testing_env};
    //     const NEAR: u128 = 1_000_000_000_000_000_000_000_000;

    //     let mut contract = DidContract::default();

    //     let mut builder = VMContextBuilder::new();
    //     builder.predecessor_account_id("bear-bear.testnet".parse().unwrap());
    //     builder.attached_deposit(11 * NEAR);
    //     testing_env!(builder.build());

    //     contract.reg_did_using_account(true);

    //     builder.predecessor_account_id("alice.testnet".parse().unwrap());
    //     testing_env!(builder.build());

    //     let vc = contract.issue_vc("bear-bear.testnet".parse().unwrap());

    //     log!(format!("vc: {:#?}", vc));
    // }
    //
    #[test]
    fn test_load_hashed_vc() {
        use near_sdk::test_utils::VMContextBuilder;
        use near_sdk::{log, testing_env};
        const NEAR: u128 = 1_000_000_000_000_000_000_000_000;

        let mut contract = DidContract::default();

        // Issuer 등록하기
        let mut builder = VMContextBuilder::new();
        builder.predecessor_account_id("bear-bear.testnet".parse().unwrap());
        builder.attached_deposit(11 * NEAR);
        testing_env!(builder.build());

        contract.reg_did_using_account(true);
        println!("<test> Issuer 등록 완료");

        // "alice.testnet"이 "bear-bear.testnet"에게 받았다고 주장하는 vc 적재하기
        builder.predecessor_account_id("alice.testnet".parse().unwrap());
        testing_env!(builder.build());

        contract.load_hashed_vc(
            String::from("did:near:bear-bear.testnet"),
            String::from("hashed_vc_1234"),
        );
        println!("<test> Hashed VC 적재 완료");

        let hashed_vcs =
            contract.get_hashed_vcs(String::from("did:near:bear-bear.testnet"));

        log!(format!("<test> hashed_vcs: {:?}", hashed_vcs));
    }

    #[test]
    fn test_convert_account_id_to_did() {
        let near_named_account: AccountId =
            AccountId::from_str("alice.testnet").unwrap();

        let did = convert_account_id_to_did(near_named_account);

        assert_eq!(did, "did:near:alice.testnet");
    }

    #[test]
    fn test_load_holder_did_issuer_did_mapping() {
        use near_sdk::test_utils::VMContextBuilder;
        use near_sdk::testing_env;
        const NEAR: u128 = 1_000_000_000_000_000_000_000_000;

        let mut contract = DidContract::default();

        // "pnu.testnet"을 issuer로 등록
        let mut builder = VMContextBuilder::new();
        builder.predecessor_account_id("pnu.testnet".parse().unwrap());
        builder.attached_deposit(11 * NEAR);
        testing_env!(builder.build());

        contract.reg_did_using_account(true);
        println!("<test> Issuer 등록 완료");

        // "newbie.testnet"의 did 등록
        builder.predecessor_account_id("newbie.testnet".parse().unwrap());
        testing_env!(builder.build());

        contract.reg_did_using_account(false);

        // holder --> issuer maaping 등록
        let holder_did = String::from("did:near:newbie.testnet");
        let issuer_did = String::from("did:near:pnu.testnet");

        contract.load_holder_did_issuer_did_mapping(
            holder_did.clone(),
            issuer_did.clone(),
        );

        let res_issuer_did = contract.get_mapped_issuer_did(holder_did);

        assert_eq!(res_issuer_did, issuer_did);
    }

    // #[test]
    // fn test_load_holder_did_validity_mapping() {
    //     use near_sdk::test_utils::VMContextBuilder;
    //     use near_sdk::testing_env;

    //     let mut builder = VMContextBuilder::new();
    //     // "newbie.testnet"의 did 등록
    //     builder.predecessor_account_id("newbie.testnet".parse().unwrap());
    //     testing_env!(builder.build());

    //     let mut contract = DidContract::default();

    //     // 일단 did 등록 해둬야 함
    //     contract.reg_did_using_account(false);

    //     contract
    //         .load_verify_result("did:near:newbie.testnet".to_string(), true);

    //     println!(
    //         "<test> holder validity: {:?}",
    //         contract.get_mapped_holder_did_validity(
    //             "did:near:newbie.testnet".to_string()
    //         )
    //     );

    //     assert_eq!(
    //         true,
    //         contract.get_mapped_holder_did_validity(
    //             "did:near:newbie.testnet".to_string()
    //         )
    //     )
    // }
}
