export interface IUserInfoForm {
    nickname?: string;
    id: string;
    password: string;
    passwordConfirm?: string;
}

export interface IUserInfo {
    pk: string;
    nickname: string;
    id: string;
    password: string;
    isVerifiedUser: boolean;
    heart: number;
    createdAt: Date;
}
