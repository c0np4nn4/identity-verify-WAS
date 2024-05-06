'use client';

import { BsFillInfoCircleFill } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import { getAlarmList } from '@/api/Notification';
import { IAlarm } from '@/types/alarm';
import Link from 'next/link';
import { postSendWrongPerson } from '@/api/Matching';
import { useToast } from '@/stores/useToastStore';
import Toast from '@/app/_component/Toast';
import { EMatchingStatus } from '@/enumerates/matching';
import { ReceiveLabelAlarmItem } from '@/app/(home)/notification/_component/ReceiveLabelAlarmItem';
import { ReceiveChosungAlarmItem } from '@/app/(home)/notification/_component/ReceiveChosungAlarmItem';
import Modal from '@/app/_component/Modal';
import useUserInfoStore from '@/stores/useUserInfoStore';

export default function NotificationPage() {
    const [alarmList, setAlarmList] = useState<IAlarm[]>([]);
    const userInfo = useUserInfoStore((state) => state.userInfo);
    useEffect(function getAlarmListEffect() {
        const fetchAlarmList = async () => {
            const res = await getAlarmList();
            if (res.data.result <= 300) {
                console.log(res.data.data);
                setAlarmList(res.data.data.alarmList.reverse() as IAlarm[]);
            }
        };
        fetchAlarmList();
    }, []);

    return (
        <main className="flex flex-col items-center justify-center p-24 text-white">
            <Toast />
            <Modal />

            <h1 className="text-40 mt-24">{userInfo?.nickname}의 내역</h1>
            {alarmList.length > 0 ? (
                <section className="flex flex-col gap-y-24 mt-80 w-full  h-800">
                    {alarmList.map((alarm, index) => (
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
        case EMatchingStatus.WRONG_RECEIVE:
            colorString = 'bg-red-600 text-white';
            title = '혹시 나야?에 대해 나 아님을 받음';
            break;
        case EMatchingStatus.WRONG_SEND:
            colorString = 'bg-red-600 text-white';
            title = '혹시 나야?에 대해 나 아님을 보냄';
        case EMatchingStatus.REJECT_RECEIVE:
            colorString = 'bg-pink-500 text-white';
            title = '안타깝게도 다른 사람이었나봐요ㅠ';
            break;
        case EMatchingStatus.REJECT_SEND:
            colorString = 'bg-red-600 text-white';
            title = '나아님을 보냄.';
            break;
        case EMatchingStatus.POST_LABEL_RECEIVE:
            return <ReceiveLabelAlarmItem alarm={alarm} />;
            break;
        case EMatchingStatus.POST_LABEL_SEND:
            colorString = 'bg-green-500 text-white';
            title = '상대에게 특징 라벨을 보냄';
            break;
        case EMatchingStatus.NAME_RECEIVE:
            return <ReceiveChosungAlarmItem alarm={alarm} />;
            break;
        case EMatchingStatus.NAME_SEND:
            colorString = 'bg-green-400 text-white';
            title = '상대에게 자기 이름을 보냄';
            break;
        case EMatchingStatus.ANSWER_RECEIVE:
            colorString = 'bg-green-500 text-white';
            title = '상대가 자기가 맞대요. 인연을 찾으신걸 축하드립니다!';
            break;
        case EMatchingStatus.ANSWER_SEND:
            colorString = 'bg-green-500 text-white';
            title = '나맞어를 보냄';
            break;
        default:
            break;
    }

    const onWrongPerson = async () => {
        const res = await postSendWrongPerson({
            targetPk: alarm.matchLog.targetPk,
        });
        if (res.data.result <= 300) {
            console.log(res.data.data);
            openToast('사람 잘못 보셨습니다!', 'success', () => {});
        } else {
            console.log(res.data.data);
            openToast(res.data.data.message, 'error', () => {});
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
                            onClick={onWrongPerson}
                        >
                            거절하기
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
