import { create } from 'zustand';

interface IModalStore {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}

export const useModalStore = create<IModalStore>((set) => ({
    isModalOpen: false,
    openModal: () => set(() => ({ isModalOpen: true })),
    closeModal: () => set(() => ({ isModalOpen: false })),
}));
