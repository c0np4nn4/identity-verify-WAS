import { Contract } from 'near-api-js';

export type NEARVerfiyResult = Contract & {
  load_verify_result: (
    args: { holder_public_key: string; service_name: string },
    gas?: number,
    depositAmount?: number,
  ) => Promise<any>;
  get_verify_result: (
    args: { holder_public_key: string },
    gas?: number,
    depositAmount?: number,
  ) => Promise<boolean>;
};
