import { useEffect } from 'react';
import { cls } from '@/utils/tailwind';
import { useToast } from '@/stores/useToastStore';
import Portal from '@/app/_component/Portal';

export default function Toast() {
    const { isOpen, type, message, closeToast } = useToast();

    useEffect(
        function closeToastEffect() {
            console.log('isOpen', isOpen);
            if (isOpen) {
                setTimeout(() => {
                    closeToast();
                }, 3000);
            }
        },
        [isOpen, message]
    );

    return (
        <Portal>
            <div
                className={cls(
                    `fixed bottom-200 left-8 right-8 z-50 flex p-4 bg-white border-t border-primary h-40 rounded-12 justify-center items-center`,
                    'transition-all duration-300 ease-in-out',
                    isOpen ? '' : 'translate-y-60',
                    type === 'success' ? 'text-green-500' : 'text-red-500'
                )}
            >
                <span>{message}</span>
            </div>
        </Portal>
    );
}
