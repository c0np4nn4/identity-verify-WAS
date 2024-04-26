export interface IAlarm {
    pk: number;
    userPk: string;
    matchLogPk: number;
    text: string;
    read: boolean;
    createdAt: Date;
}
