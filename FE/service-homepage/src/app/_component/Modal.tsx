'use client';

import Portal from './Portal';
import { useModalStore } from '@/stores/useModalStore';

export default function Modal({ children }: { children: React.ReactNode }) {
    const modalState = useModalStore();

    if (!modalState || !modalState.isModalOpen) {
        return null;
    }

    return <Portal>{children}</Portal>;
}
