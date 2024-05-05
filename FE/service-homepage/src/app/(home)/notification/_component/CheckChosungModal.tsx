import { useModalStore } from '@/stores/useModalStore';
import { useRouter } from 'next/navigation';
import useUserInfoStore from '@/stores/useUserInfoStore';
import Modal from '@/app/_component/Modal';
import Link from 'next/link';

export function CheckChosungModal({
    name,
    targetPk,
}: {
    name: string;
    targetPk: string;
}) {
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
                <h1>상대가 당신의 이름을 추측했습니다!</h1>
                <div
                    className={
                        'flex flex-col gap-y-8 mt-24 justify-center items-center mb-12'
                    }
                >
                    <p>{name}</p>
                </div>
                <div className={'flex gap-x-8'}>
                    <button
                        className={
                            'bg-primary text-white rounded-10 px-8 py-4 w-full'
                        }
                        onClick={onCreateBoat}
                        disabled={userInfo?.heart! < 20}
                    >
                        나 맞어!
                    </button>
                    <Link
                        href={'/matching/send-quiz?targetPk=' + targetPk}
                        className={
                            'bg-secondary text-white rounded-10 px-8 py-4 w-full text-center'
                        }
                    >
                        나 아님 ㅎㅎ
                    </Link>
                </div>
            </article>
        </Modal>
    );
}
