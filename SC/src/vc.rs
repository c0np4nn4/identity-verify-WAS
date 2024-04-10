use near_sdk::{env, log, near_bindgen};

use crate::DidContractExt;
use crate::{DidContract, IssuerDID};
use std::collections::HashSet;

pub type HashedVC = String;

#[near_bindgen]
impl DidContract {
    pub fn load_hashed_vc(
        &mut self,
        issuer_did: IssuerDID,
        hashed_vc: HashedVC,
    ) {
        if self.set_issuer_did.contains(&issuer_did) {
            let mut vcs: HashSet<String> =
                match self.map_issuer_did_to_hashed_vcs.remove(&issuer_did) {
                    Some(hs) => hs,
                    None => HashSet::new(),
                };

            vcs.insert(hashed_vc);

            self.map_issuer_did_to_hashed_vcs.insert(&issuer_did, &vcs);
        } else {
            env::panic_str("Not a registered issuer");
        }
    }
}
