import { create } from 'zustand';
import { IUserInfo } from '@/types/auth';

interface IUserInfoStore {
    userInfo: IUserInfo | null;
    login: (_userInfo: IUserInfo) => void;
    logout: () => void;
}

const useUserInfoStore = create<IUserInfoStore>((set) => ({
    userInfo: null,
    login: (_userInfo: IUserInfo) => set(() => ({ userInfo: _userInfo })),
    logout: () => set(() => ({ userInfo: null })),
}));

export default useUserInfoStore;
