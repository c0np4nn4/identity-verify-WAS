'use client';

import { BsFillInfoCircleFill } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import { getAlarmList } from '@/api/Notification';
import { IAlarm } from '@/types/alarm';
import Link from 'next/link';
import { postSendRejectSign } from '@/api/Matching';
import { useToast } from '@/stores/useToastStore';
import Toast from '@/app/_component/Toast';
import { EMatchingStatus } from '@/enumerates/matching';
import { useModalStore } from '@/stores/useModalStore';
import { useRouter } from 'next/navigation';
import useUserInfoStore from '@/stores/useUserInfoStore';
import Modal from '@/app/_component/Modal';

export default function NotificationPage() {
    const [alarmList, setAlarmList] = useState<IAlarm[]>([]);
    useEffect(function getAlarmListEffect() {
        const fetchAlarmList = async () => {
            const res = await getAlarmList();
            if (res.data.result <= 300) {
                console.log(res.data.data);
                setAlarmList(res.data.data.alarmList as IAlarm[]);
            }
        };
        fetchAlarmList();
    }, []);

    return (
        <main className="flex flex-col items-center justify-center p-24 text-white">
            <Toast />
            <h1 className="text-40 mt-24">내역</h1>
            {alarmList.length > 0 ? (
                <section className="flex flex-col gap-y-24 mt-80 w-full overflow-y-scroll h-800">
                    {alarmList.reverse().map((alarm, index) => (
                        <NotificationItem key={index} alarm={alarm} />
                    ))}
                </section>
            ) : (
                <div className="flex justify-center items-center text-white w-full h-full">
                    <h1>알림이 없어요!</h1>
                </div>
            )}
        </main>
    );
}

function NotificationItem({ alarm }: { alarm: IAlarm }) {
    const { openToast } = useToast();
    let colorString = 'bg-gray-800 text-white';
    let title = '';

    switch (alarm.matchLog.status) {
        case EMatchingStatus.IS_IT_ME_SEND:
            colorString = 'bg-green-500 text-white';
            title = '혹시 나야?를 보냄';
            break;
        case EMatchingStatus.IS_IT_ME_RECEIVE:
            colorString = 'bg-gray-800 text-white';
            title = '혹시 나야? 신청!';
            break;
        case EMatchingStatus.REJECT_RECEIVE:
            colorString = 'bg-pink-500 text-white';
            title = '혹시 나야?에 대해 거절받음';
            break;
        case EMatchingStatus.REJECT_SEND:
            colorString = 'bg-red-600 text-white';
            title = '혹시 나야?에 대해 거절을 보냄';
            break;
        case EMatchingStatus.POST_LABEL_RECEIVE:
            return <ReceiveLabelAlarm alarm={alarm} />;
            break;
    }

    const onRejectMatching = async () => {
        const res = await postSendRejectSign({
            targetPk: alarm.matchLog.targetPk,
        });
        if (res.data.result <= 300) {
            console.log(res.data.data);
            openToast('"혹시 나야?" 매칭을 거절했습니다!', 'success', () => {});
        } else {
            console.log(res.data.data);
            openToast('거절 실패', 'error', () => {});
        }
    };

    return (
        <div className={`flex flex-col p-18 ${colorString}`}>
            <div className="flex items-center gap-x-12">
                <BsFillInfoCircleFill size={14} />
                <h2 className="text-18">{title}</h2>
                <label className="text-12 ml-auto">
                    {new Date(alarm.createdAt).toLocaleString('ko-KR')}
                </label>
            </div>
            <div className={'flex gap-x-8'}>
                <p className="text-16 mt-12">{alarm.text}</p>
                {alarm.matchLog.status === EMatchingStatus.IS_IT_ME_RECEIVE && (
                    <div className={'flex gap-x-4 ml-auto'}>
                        <Link
                            href={`/matching/send-label?targetPk=${alarm.matchLog.targetPk}`}
                            className={
                                'bg-white text-black text-16 rounded-4 px-8 py-1 items-center flex'
                            }
                        >
                            수락하기
                        </Link>
                        <button
                            className="bg-white text-black text-16 rounded-4 px-8 py-1"
                            onClick={onRejectMatching}
                        >
                            거절하기
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function ReceiveLabelAlarm({ alarm }: { alarm: IAlarm }) {
    const { openToast } = useToast();
    let colorString = 'bg-blue-400 text-white';
    let title = '상대의 특징 라벨을 받음!';

    const modalState = useModalStore();

    const onCheckLabelClick = () => {
        modalState.openModal();
    };

    return (
        <div className={`flex flex-col p-18 ${colorString}`}>
            <div className="flex items-center gap-x-12">
                <BsFillInfoCircleFill size={14} />
                <h2 className="text-18">{title}</h2>
                <label className="text-12 ml-auto">
                    {new Date(alarm.createdAt).toLocaleString('ko-KR')}
                </label>
            </div>
            <div className={'flex gap-x-8'}>
                <p className="text-16 mt-12">{alarm.text}</p>
                <div className={'flex gap-x-4 ml-auto'}>
                    <button
                        onClick={onCheckLabelClick}
                        className={
                            'bg-white text-black text-16 rounded-4 px-8 py-1 items-center flex'
                        }
                    >
                        확인하기
                    </button>
                </div>
            </div>
            <CheckLabelModal
                labels={[
                    alarm.matchLog.label1,
                    alarm.matchLog.label2,
                    alarm.matchLog.label3,
                ]}
            />
        </div>
    );
}

function CheckLabelModal({ labels }: { labels: Array<string | null> }) {
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
                    <button
                        className={
                            'bg-secondary text-white rounded-10 px-8 py-4 w-full'
                        }
                        onClick={onCancle}
                    >
                        너 OOO이지?
                    </button>
                </div>
                <Link
                    href={'/pond'}
                    className={'w-full text-center underline mt-8'}
                >
                    사람 잘못 봤습니다...
                </Link>
            </article>
        </Modal>
    );
}
