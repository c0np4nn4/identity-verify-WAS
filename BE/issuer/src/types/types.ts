import { Contract } from 'near-api-js';

export type NEARContract = Contract & {
  get_total_did: (
    args: { holder_pub_key: string },
    gas?: number,
    depositAmount?: number,
  ) => Promise<string>;
  load_hashed_vc: (
    args: { issuer_did: string; hashed_vc: string },
    gas?: number,
    depositAmount?: number,
  ) => Promise<any>;
  get_hashed_vcs: (
    args: { issuer_did: string },
    gas?: number,
    depositAmount?: number,
  ) => Promise<Set<string>>;
};
