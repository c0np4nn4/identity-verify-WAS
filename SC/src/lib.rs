use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap, UnorderedSet};
use near_sdk::{env, log, near_bindgen, AccountId, Balance};

mod did_document;
mod test;
mod utils;
mod vc;
mod zkp_verify;

use did_document::*;
use std::collections::HashSet;
use utils::convert_account_id_to_did;
use vc::HashedVC;

pub type Validity = bool;
pub type ServiceName = String;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
struct DidContract {
    // Mapping: NEAR account --> NEAR DID
    pub map_account_to_did: UnorderedMap<AccountId, DID>,

    // Mapping: NEAR DID --> NEAR DID Document
    pub map_did_to_document: UnorderedMap<DID, DidDocument>,

    // Set: Issuer DID
    pub set_issuer_did: UnorderedSet<IssuerDID>,

    // Set: Service Name
    pub set_service_name: UnorderedSet<ServiceName>,

    // Mapping: Issuer DID --> Vec<HashedVc>
    pub map_issuer_did_to_hashed_vcs:
        UnorderedMap<IssuerDID, HashSet<HashedVC>>,

    // Mapping: Holder DID --> Issuer DID
    pub map_holder_did_to_issuer_did: UnorderedMap<HolderDID, IssuerDID>,

    // Mapping: Holder DID --> Validity
    pub map_holder_did_to_validity: UnorderedMap<HolderDID, Validity>,

    // Mapping: ServiceName --> Holder DID --> Validity
    pub map_servicename_to_holder_validity:
        UnorderedMap<ServiceName, HashSet<HolderDID>>,
}

impl Default for DidContract {
    fn default() -> Self {
        Self {
            map_account_to_did: UnorderedMap::new(b"l"),
            map_did_to_document: UnorderedMap::new(b"d"),
            set_issuer_did: UnorderedSet::new(b"s"),
            set_service_name: UnorderedSet::new(b"n"),
            map_issuer_did_to_hashed_vcs: UnorderedMap::new(b"h"),
            map_holder_did_to_issuer_did: UnorderedMap::new(b"v"),
            map_holder_did_to_validity: UnorderedMap::new(b"y"),
            map_servicename_to_holder_validity: UnorderedMap::new(b"y"),
        }
    }
}

#[near_bindgen]
impl DidContract {
    #[payable]
    pub fn reg_did_using_account(&mut self, is_issuer: bool) {
        let near_named_account: AccountId = env::predecessor_account_id();

        let did: String = match self.map_account_to_did.get(&near_named_account)
        {
            Some(did) => {
                log!("already registered!, did: {:?}", did);
                did
            }
            None => {
                // registering...
                let did: String = format!("did:near:{}", near_named_account);

                log!("registered new did!: {:?}", did);

                self.map_account_to_did.insert(&near_named_account, &did);

                did
            }
        };

        // 2. Register DID Document
        let pk_base58 = {
            let pk_bytes = env::signer_account_pk();
            let pk_bs58 = bs58::encode(pk_bytes.as_bytes());
            let pk_string = &pk_bs58.into_string()[1..];

            pk_string.to_string()
        };

        log!("pk_base58: {:?}", pk_base58);

        let public_key = DidPublicKey {
            id: did.clone(),
            auth_type: "Ed25519VerificationKey2020".to_string(),
            controller: did.clone(),
            public_key_base_58: pk_base58,
        };

        // // time
        let formatted_time = utils::get_current_time();

        let did_document = DidDocument {
            context: vec![String::from("https://www.w3.org/ns/did/v1")],
            id: did.clone(),
            public_key: vec![public_key],
            created: formatted_time.clone(),
            updated: formatted_time,
        };

        self.map_did_to_document.insert(&did, &did_document);

        // 3. Is Issuer
        if is_issuer == true {
            const NEAR: u128 = 1_000_000_000_000_000_000_000_000;

            let deposit: Balance = env::attached_deposit();

            if deposit >= 5 * NEAR {
                let did =
                    convert_account_id_to_did(env::predecessor_account_id());
                self.set_issuer_did.insert(&did);
            } else {
                env::panic_str("Not enough deposit NEAR")
            }
        }
    }

    pub fn load_holder_did_issuer_did_mapping(
        &mut self,
        holder_did: HolderDID,
        issuer_did: IssuerDID,
    ) {
        // issuer_did validity check
        if self.set_issuer_did.contains(&issuer_did) {
            // holder_did validity check
            log!(format!("did_list: {:?}", self.get_total_did()));

            if self
                .map_account_to_did
                .values()
                .collect::<Vec<String>>()
                .contains(&holder_did)
            {
                self.map_holder_did_to_issuer_did
                    .insert(&holder_did, &issuer_did);
            }
        }
    }

    // TODO: need more strict logic
    pub fn reg_service_name(&mut self, service_name: ServiceName) {
        self.set_service_name.insert(&service_name);
    }
}
