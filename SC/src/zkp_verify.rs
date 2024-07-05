use near_sdk::{env, log, near_bindgen};

use crate::DidContractExt;
use crate::{DidContract, HolderDID, IssuerDID};
use std::collections::HashSet;

#[near_bindgen]
impl DidContract {
    pub fn load_verify_result(
        &mut self,
        service_name: String,
        holder_did: HolderDID,
    ) {
        if self.set_service_name.contains(&service_name) == false {
            env::panic_str(
                "Not a registered service, should be registered first",
            );
        }

        match self.map_servicename_to_holder_validity.get(&service_name) {
            // 이전에 등록된 Service 인 경우
            Some(mut l) => match l.contains(&holder_did) {
                true => {
                    // 이미 인증된 사용자
                    env::panic_str("Already registered user")
                }
                false => {
                    // 새로 인증한 사용자
                    l.insert(holder_did);
                }
            },
            None => {
                // 처음으로 사용자를 등록하는 서비스
                let mut new_hash_set = HashSet::new();

                new_hash_set.insert(holder_did);

                self.map_servicename_to_holder_validity
                    .insert(&service_name, &new_hash_set);
            }
        };
    }

    pub fn get_verify_result(
        &self,
        service_name: String,
        holder_did: HolderDID,
    ) -> bool {
        let list_of_valid_holders = self
            .map_servicename_to_holder_validity
            .get(&service_name)
            .expect("No holders had been registered");

        list_of_valid_holders.contains(&holder_did)
    }
}
