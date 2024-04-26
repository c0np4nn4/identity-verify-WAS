import { create } from 'zustand';

type TToastType = 'success' | 'error';

interface IToastState {
    isOpen: boolean;
    type: TToastType;
    message: string;
    openToast: (message: string, type: TToastType) => void;
    closeToast: () => void;
}

export const useToast = create<IToastState>((set) => ({
    isOpen: false,
    type: 'success',
    message: '',
    openToast: (message, type) => set(() => ({ isOpen: true, message, type })),
    closeToast: () =>
        set(() => ({ isOpen: false, message: '', type: 'success' })),
}));
