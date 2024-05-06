'use client';

import Portal from './Portal';
import { useModalStore } from '@/stores/useModalStore';
import { EventHandler } from 'react';

export default function Modal() {
    const modalState = useModalStore();

    if (!modalState || !modalState.isModalOpen) {
        return null;
    }

    const onOverlayClick = (e: React.MouseEvent<HTMLElement>) => {
        if (e.target === e.currentTarget) {
            modalState.closeModal();
        }
    };

    return (
        <Portal>
            <div
                className="flex flex-col justify-center items-center w-full h-full fixed top-0 left-0 bg-black bg-opacity-50 z-50"
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    position: 'fixed',
                    zIndex: '10000',
                    flex: '1',
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
                }}
                onClick={onOverlayClick}
            >
                {modalState.content}
            </div>
        </Portal>
    );
}
