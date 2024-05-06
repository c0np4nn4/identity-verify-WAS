import { Contract } from 'near-api-js';

export type NEARVerfiyResult = Contract & {
  load_verify_result: (
    args: { service_name: string; holder_did: string },
    gas?: number,
    depositAmount?: number,
  ) => Promise<any>;
  get_verify_result: (
    args: { service_name: string; holder_did: string },
    gas?: number,
    depositAmount?: number,
  ) => Promise<boolean>;
};
