import create from 'zustand';

interface IUserStore {
  token: string | null;
  nickname: string | null;
  login: (token: string, nickname: string) => void;
  logout: () => void;
}

const useUserStore = create<IUserStore>((set) => ({
  token: null,
  nickname: null,
  login: (token: string, nickname: string) => set(() => ({ token, nickname })),
  logout: () => set(() => ({ token: null, nickname: null })),
}));

export default useUserStore;