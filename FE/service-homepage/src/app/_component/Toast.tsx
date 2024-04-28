import { useEffect } from 'react';
import { cls } from '@/utils/tailwind';
import { useToast } from '@/stores/useToastStore';
import Portal from '@/app/_component/Portal';

export default function Toast() {
    const { isOpen, type, message, closeToast } = useToast();

    return (
        <div
            className={cls(
                `fixed top-8 left-12 right-12 z-50 flex p-4 bg-white border-t border-primary h-40 rounded-12 justify-center items-center`,
                'transition-all duration-300 ease-in-out',
                isOpen ? 'translate-y-0' : '-translate-y-60',
                type === 'success' ? 'text-green-500' : 'text-red-500'
            )}
        >
            <span>{message}</span>
        </div>
    );
}
