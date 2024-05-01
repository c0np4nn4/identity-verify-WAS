# NEAR DID contract
- NEAR 상에서 DID 를 구현한 컨트랙트입니다

## NEAR DID
- `NEAR DID`는 아래와 같이 정의합니다.

```
did:near:<named_account>
```

## NEAR DID Document
- `NEAR DID Document`는 아래와 같은 형태로 구성됩니다.

```
{
    context: [ 'https://www.w3.org/ns/did/v1' ],
    id: 'did:near:horrible-goat.testnet',
    public_key: [
      {
        id: 'did:near:horrible-goat.testnet',
        auth_type: 'Ed25519VerificationKey2020',
        controller: 'did:near:horrible-goat.testnet',
        public_key_base_58: '5fyeaFJFxqJvadaVfwV5Wdu8g5cq3N8KS4as37AjA3nH'
      }
    ],
    created: '2024-01-11T00:27:13Z',
    updated: '2024-01-11T00:27:13Z'
}
```

# Contract 구성
## Contract 초기 설정
- `cargo-near...` 명령어로 테스트넷 계정을 만들고, 배포합니다.
- `issuer` 를 등록합니다.
- `service`를 등록합니다.

### 예시
```bash
export CTRT="hello-world.testnet"
near call $CTRT reg_did_using_account --useAccount $CTRT '{"is_issuer": true}' --deposit 5
near call $CTRT reg_service_name '{"service_name": "kataomoi-boat"}' --useAccount $CTRT
near view $CTRT get_total_registered_services
# [ 'kataomoi-boat' ]
near call $CTRT load_verify_result '{"service_name":"kataomoi-boat", "holder_did": "hpubkey"}' --useAccount $CTRT
near view $CTRT get_servicename_values '{"service_name":"kataomoi-boat"}'
```

## 구성
- Smart contract 는 아래와 같이 총 6개의 state를 저장하고 있습니다.

- map_account_to_did: UnorderedMap<AccountId, DID>
    - `NEAR named account` 를 입력받고, `NEAR DID` 를 반환합니다.

- map_did_to_document: UnorderedMap<DID, DidDocument>
    - `NEAR DID` 를 입력받고, `NEAR DID Document` 를 반환합니다.

- set_issuer_did: UnorderedSet<IssuerDID>
    - 등록된 **Issuer** 의 집합입니다.

- map_issuer_did_to_hashed_vcs: UnorderedMap<IssuerDID, HashSet<HashedVC>>
    - 등록된 **Issuer** 가 발행한 `VC` 들의 해쉬값을 반환합니다.

- map_holder_did_to_issuer_did: UnorderedMap<HolderDID, IssuerDID>
    - `Holder` 에게 `VC` 를 발급한 `Issuer` 를 반환합니다.

- map_holder_did_to_validity: UnorderedMap<HolderDID, Validity>
    - `Holder` 의 유효성을 반환합니다.
    - *caller* : `Verifier`

# Method
## Change Method
- #[payable] pub fn reg_did_using_account(&mut self, is_issuer: bool)
    - `NEAR named account` 를 통해 `NEAR DID` 를 생성하고 `NEAR DID Document` 를 온체인에 기록하는 메서드
    - `NEAR named account` 는 `env::predecessor_account_id()` 를 통해 참조
    - `is_issuer` 인자로 `holder` 와 `issuer` 를 구분
        - `issuer` 로 등록하기 위해서는 `5 NEAR` 이상을 예치(deposit) 해야함
- pub fn load_holder_did_issuer_did_mapping(&mut self, holder_did: DID, issuer_did: DID)
    - `holder` 에게 `VC`를 발급한 `issuer` 를 온체인에 기록하는 메서드
- pub fn load_holder_did_validity_mapping(&mut self, holder_did: DID, validity: bool)
    - `holder` 의 유효성을 기록하는 메서드
- pub fn load_hashed_vc(&mut self, issuer_did: IssuerDID, hashed_vc: HashedVC)
    - `issuer` 가 발급한 `VC`들의 ***해시값*** 을 온체인에 기록하는 메서드

## View Method
- pub fn get_total_did(&self) -> Vec<String> 
    - 등록된 전체 `NEAR DID`를 반환하는 메서드
- pub fn get_total_document(&self) -> Vec<DidDocument> 
    - 등록된 전체 `NEAR DID Document`를 반환하는 메서드
- pub fn get_total_issuer_did(&self) -> Vec<IssuerDID> 
    - 등록된 전체 `Issuer DID`를 반환하는 메서드
- pub fn get_hashed_vcs(&self, issuer_did: IssuerDID) -> HashSet<String> 
    - 특정 `Issuer`가 발급한 `VC`들의 ***해시값*** 을 반환하는 메서드
- pub fn get_mapped_issuer_did(&self, holder_did: HolderDID) -> IssuerDID 
    - 특정 `Holder`에게 `VC`를 발급한 `Issuer`의 `NEAR DID` 를 반환하는 메서드
- pub fn get_mapped_holder_did_validity(&self, holder_did: HolderDID) -> bool
    - 특정 `Holder`의 유효성을 반환하는 메서드



 

## Example

```bash
#!/bin/bash

export NEAR_DID_CTRT="little-pies.testnet"
# export HOLDER="horrible-goat.testnet"
# export ISSUER="obtainable-soda.testnet"

# did 목록 확인
near view $NEAR_DID_CTRT get_total_did
# did document 목록 확인
near view $NEAR_DID_CTRT get_total_document
# issuer 목록 확인
near view $NEAR_DID_CTRT get_total_issuer_did
# hash(vc) 목록 확인
near view $NEAR_DID_CTRT get_hashed_vcs '{"issuer_did": "did:near:obtainable-soda.testnet"}'
# VC 발급한 issuer 확인
near view $NEAR_DID_CTRT get_mapped_issuer_did '{"holder_did": "did:near:horrible-goat.testnet"}'
# holder 유효성 확인
near view $NEAR_DID_CTRT get_mapped_holder_did_validity '{"holder_did": "did:near:horrible-goat.testnet"}'
```
