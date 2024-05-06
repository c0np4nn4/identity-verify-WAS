import { useModalStore } from '@/stores/useModalStore';
import { useRouter } from 'next/navigation';
import useUserInfoStore from '@/stores/useUserInfoStore';
import Link from 'next/link';
import { postSendCorrectSign, postSendRejectSign } from '@/api/Matching';
import { useToast } from '@/stores/useToastStore';

export function CheckChosungModal({
    name,
    targetPk,
}: {
    name: string;
    targetPk: string;
}) {
    const toastStore = useToast();
    const modalState = useModalStore();
    const router = useRouter();
    const userInfo = useUserInfoStore((state) => state.userInfo);
    console.log(name, targetPk);

    const onYesMe = async () => {
        const res = await postSendCorrectSign({ targetPk });
        console.log(res);
        if (res.data.result <= 300) {
            toastStore.openToast('나맞어 를 보냈습니다.', 'success', () => {
                modalState.closeModal();
            });
        } else {
            toastStore.openToast(
                '서버 오류가 발생했습니다.',
                'error',
                () => {}
            );
        }
    };

    const onNoMe = async () => {
        const res = await postSendRejectSign({ targetPk });
        console.log(res);
        if (res.data.result <= 300) {
            toastStore.openToast('나 아님을 보냈습니다.', 'success', () => {
                modalState.closeModal();
            });
        } else {
            toastStore.openToast(
                '서버 오류가 발생했습니다.',
                'error',
                () => {}
            );
        }
    };

    return (
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
                    onClick={onYesMe}
                    disabled={userInfo?.heart! < 20}
                >
                    나 맞어!
                </button>
                <button
                    className={
                        'bg-secondary text-white rounded-10 px-8 py-4 w-full text-center'
                    }
                    onClick={onNoMe}
                >
                    나 아님 ㅎㅎ
                </button>
            </div>
        </article>
    );
}
