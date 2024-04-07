import create from 'zustand';

interface IUserStore {
  id: string | null;
  nickname: string | null;
  login: (id: string, nickname: string) => void;
  logout: () => void;
}

const useUserStore = create<IUserStore>((set) => ({
  id: null,
  nickname: null,
  login: (id: string, nickname: string) => set(() => ({ id, nickname })),
  logout: () => set(() => ({ id: null, nickname: null })),
}));

export default useUserStore;