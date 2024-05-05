'use client';

import { FaSailboat } from 'react-icons/fa6';
import Modal from '@/app/_component/Modal';
import { useModalStore } from '@/stores/useModalStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useUserInfoStore from '@/stores/useUserInfoStore';

export default function CreateBoarFab() {
    const modalState = useModalStore();

    const onFabClick = () => {
        modalState.openModal();
    };

    return (
        <div className={'fixed bottom-80 right-30 z-[1000]'}>
            <button
                onClick={onFabClick}
                className={
                    'p-8 rounded-full bg-white flex items-center justify-center shadow-lg'
                }
            >
                <FaSailboat
                    color={'black'}
                    size={'36'}
                    className={'active:animate-spring'}
                />
            </button>
            <CreateBoatModal />
        </div>
    );
}

function CreateBoatModal() {
    const modalState = useModalStore();
    const router = useRouter();
    const userInfo = useUserInfoStore((state) => state.userInfo);

    const onCreateBoat = () => {
        router.push('/pond/boat');
        modalState.closeModal();
    };

    const onCancle = () => {
        modalState.closeModal();
    };

    return (
        <Modal>
            <article
                className={
                    'fixed top-0 left-0 right-0 bottom-0 flex flex-col m-auto w-260 h-300 bg-white rounded-20 p-24'
                }
            >
                <h1>종이배를 띄우시겠습니까?</h1>
                <p className={'mt-24 text-14'}>
                    안녕하세요 {userInfo?.nickname}님!
                </p>
                <p>20하트가 소모됩니다!</p>
                <p className={'mt-40 text-12'}>
                    {"'"} 종이배를 띄우면 다른 사람들이 당신의 마음을 볼 수
                    있습니다.{"'"}
                </p>
                <p className={'text-14 mt-auto'}>
                    하트:{' '}
                    <span className={'text-red-400'}>{userInfo?.heart}</span>{' '}
                    보유 중
                </p>
                <div className={'flex gap-4 ml-auto mt-auto'}>
                    <button
                        className={'bg-primary text-white rounded-10 px-8 py-4'}
                        onClick={onCreateBoat}
                        disabled={userInfo?.heart! < 20}
                    >
                        띄우기
                    </button>
                    <button
                        className={
                            'bg-secondary text-white rounded-10 px-8 py-4'
                        }
                        onClick={onCancle}
                    >
                        취소
                    </button>
                </div>
            </article>
        </Modal>
    );
}
