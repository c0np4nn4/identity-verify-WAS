use crate::DidContract;
use crate::DidContractExt;
use crate::DidDocument;
use crate::HolderDID;
use crate::IssuerDID;
use crate::DID;

use near_sdk::AccountId;
use near_sdk::{env, log, near_bindgen};

use std::collections::HashSet;

#[near_bindgen]
impl DidContract {
    pub fn get_total_did(&self) -> Vec<String> {
        self.map_account_to_did.values().collect()
    }

    pub fn get_total_document(&self) -> Vec<DidDocument> {
        self.map_did_to_document.values().collect()
    }

    pub fn get_total_issuer_did(&self) -> Vec<IssuerDID> {
        self.set_issuer_did.iter().collect()
    }

    pub fn get_hashed_vcs(&self, issuer_did: IssuerDID) -> HashSet<String> {
        self.map_issuer_did_to_hashed_vcs.get(&issuer_did).unwrap()
    }

    pub fn get_mapped_issuer_did(&self, holder_did: HolderDID) -> IssuerDID {
        self.map_holder_did_to_issuer_did.get(&holder_did).unwrap()
    }

    pub fn get_mapped_holder_did_validity(
        &self,
        holder_did: HolderDID,
    ) -> bool {
        match self.map_holder_did_to_validity.get(&holder_did) {
            Some(v) => v,
            None => false,
        }
    }

    // zkp_verify.rs has 2 more methods
}

pub fn convert_account_id_to_did(near_named_account: AccountId) -> DID {
    format!("did:near:{}", near_named_account)
}

pub fn get_current_time() -> String {
    let seconds = env::block_timestamp() / 1_000_000_000u64;

    log!(format!("unix timestamp (secs): {:?}", seconds));

    // 원하는 형식으로 포맷팅
    let formatted_time = format!(
        "{}-{:02}-{:02}T{:02}:{:02}:{:02}Z",
        1970 + seconds / 31556952, // 년도
        (seconds / 2629743) % 12,  // 월
        (seconds / 86400) % 30,    // 일
        (seconds / 3600) % 24,     // 시간
        (seconds / 60) % 60,       // 분
        (seconds) % 60             // 초
    );

    formatted_time
}
