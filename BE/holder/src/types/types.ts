import { Contract } from 'near-api-js';

export type NEARContract = Contract & {
  reg_did_using_account: (
    args: { is_issuer: boolean; holder_pubkey: string },
    gas?: number,
    depositAmount?: number,
  ) => Promise<any>;
};
