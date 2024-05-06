import { useModalStore } from '@/stores/useModalStore';
import { useRouter } from 'next/navigation';
import useUserInfoStore from '@/stores/useUserInfoStore';
import Link from 'next/link';
import { postSendWrongPerson } from '@/api/Matching';
import { useToast } from '@/stores/useToastStore';

export function CheckLabelModal({
    labels,
    targetPk,
}: {
    labels: Array<string | null>;
    targetPk: string;
}) {
    const toast = useToast();
    const modalState = useModalStore();
    const router = useRouter();
    const userInfo = useUserInfoStore((state) => state.userInfo);

    const onCreateBoat = () => {
        router.push('/pond/boat');
        modalState.closeModal();
    };

    const onWrongPerson = async () => {
        const res = await postSendWrongPerson({ targetPk });
        console.log(res);
        if (res.data.result <= 300) {
            toast.openToast(
                '사람 잘못 봤습니다..를 보냈습니다.',
                'success',
                () => {}
            );
        }

        modalState.closeModal();
    };

    return (
        <article
            className={
                'fixed top-0 left-0 right-0 bottom-0 flex flex-col m-auto w-260 h-300 bg-white rounded-20 p-24'
            }
        >
            <h1>상대의 라벨입니다!</h1>
            <p className={'mt-24 text-14'}>
                {"'"} 당신이 짝사랑하는 분이 맞나요?{"'"}
            </p>
            <div
                className={
                    'flex flex-col gap-y-8 mt-24 justify-center items-center mb-12'
                }
            >
                <p>{labels[0]}</p>
                <p>{labels[1]}</p>
                <p>{labels[2]}</p>
            </div>
            <div className={'flex gap-x-8'}>
                <button
                    className={
                        'bg-primary text-white rounded-10 px-8 py-4 w-full'
                    }
                    onClick={onCreateBoat}
                    disabled={userInfo?.heart! < 20}
                >
                    혹시 진짜 나야?
                </button>
                <Link
                    href={'/matching/send-quiz?targetPk=' + targetPk}
                    className={
                        'bg-secondary text-white rounded-10 px-8 py-4 w-full text-center'
                    }
                >
                    너 OOO이지?
                </Link>
            </div>
            <button
                onClick={onWrongPerson}
                className={'w-full text-center underline mt-8'}
            >
                사람 잘못 봤습니다...
            </button>
        </article>
    );
}
