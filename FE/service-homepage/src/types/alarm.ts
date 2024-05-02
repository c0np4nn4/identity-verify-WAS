import { EMatchingStatus } from '@/enumerates/matching';

export interface IAlarm {
    pk: number;
    userPk: string;
    matchLogPk: number;
    text: string;
    read: boolean;
    createdAt: string;
    matchLog: {
        answer: string | null;
        createdAt: string;
        label1: string | null;
        label2: string | null;
        label3: string | null;
        name: string | null;
        status: EMatchingStatus;
        targetPk: string;
    };
}
