import { create } from 'zustand';

type TToastType = 'success' | 'error';

interface IToastState {
    isOpen: boolean;
    type: TToastType;
    message: string;
    callback?: () => void;
    openToast: (
        message: string,
        type: TToastType,
        callback: () => void
    ) => void;
    closeToast: () => void;
}

export const useToast = create<IToastState>((set) => ({
    isOpen: false,
    type: 'success',
    message: '',
    callback: undefined,
    openToast: (message, type, callback) =>
        set(() => {
            setTimeout(() => {
                set(() => ({ isOpen: false, message: '', type: 'success' }));
                callback();
            }, 3000);
            return { isOpen: true, message, type };
        }),
    closeToast: () =>
        set(() => ({ isOpen: false, message: '', type: 'success' })),
}));
