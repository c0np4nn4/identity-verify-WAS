import { create } from 'zustand';

interface IUserStore {
    id: string | null;
    nickname: string | null;
    heart: number | null;
    login: ({
        id,
        nickname,
        heart,
    }: {
        id: string;
        nickname: string;
        heart: number;
    }) => void;
    logout: () => void;
}

const useUserStore = create<IUserStore>((set) => ({
    id: null,
    nickname: null,
    heart: null,
    login: ({
        id,
        nickname,
        heart,
    }: {
        id: string;
        nickname: string;
        heart: number;
    }) => set(() => ({ id, nickname, heart })),
    logout: () => set(() => ({ id: null, nickname: null, heart: null })),
}));

export default useUserStore;
