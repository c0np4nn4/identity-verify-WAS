import { create } from 'zustand';

interface IModalStore {
    isModalOpen: boolean;
    content?: React.ReactNode;
    openModal: (content: React.ReactNode) => void;
    closeModal: () => void;
}

export const useModalStore = create<IModalStore>((set) => ({
    isModalOpen: false,
    content: undefined,
    openModal: (content) => set(() => ({ isModalOpen: true, content })),
    closeModal: () => set(() => ({ isModalOpen: false })),
}));
