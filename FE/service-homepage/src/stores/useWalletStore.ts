import { create } from 'zustand';

interface IWalletStore {
    isInstalled: boolean;
    setInstalled: (isInstalled: boolean) => void;
}

const useWalletStore = create<IWalletStore>((set) => ({
    isInstalled: false,
    setInstalled: (isInstalled: boolean) => set(() => ({ isInstalled })),
}));

export default useWalletStore;
