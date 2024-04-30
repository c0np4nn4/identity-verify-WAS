'use client';

import { BsFillInfoCircleFill } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import { getAlarmList } from '@/api/Notification';
import { IAlarm } from '@/types/alarm';
import Link from 'next/link';

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
            <h1 className="text-40 mt-24">알림창</h1>
            {alarmList.length > 0 ? (
                <section className="flex flex-col gap-y-24 mt-80 w-full overflow-y-scroll h-full">
                    {alarmList.map((alarm, index) => (
                        <NotificationItem
                            key={index}
                            type={NOTIFICATION_TYPE.IS_IT_ME_RECEIVE}
                            title={'혹시 나야 신청!'}
                            message={alarm.text}
                            read={alarm.read}
                            createdAt={alarm.createdAt}
                        />
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

const NOTIFICATION_TYPE = {
    IS_IT_ME_RECEIVE: 'IS_IT_ME_RECEIVE',
    success: 'success',
    reject: 'reject',
} as const;

type NotificationType =
    (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

function NotificationItem({
    type,
    title,
    message,
    read,
    createdAt,
}: {
    type: NotificationType;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
}) {
    let colorString = 'bg-gray-800 text-white';

    switch (type) {
        case NOTIFICATION_TYPE.IS_IT_ME_RECEIVE:
            colorString = 'bg-gray-800 text-white';
            break;
        case NOTIFICATION_TYPE.success:
            colorString = 'bg-pink-500 text-white';
            break;
        case NOTIFICATION_TYPE.reject:
            colorString = 'bg-red-600 text-white';
            break;
    }

    return (
        <div className={`flex flex-col p-18 ${colorString}`}>
            <div className="flex items-center gap-x-12">
                <BsFillInfoCircleFill size={14} />
                <h2 className="text-18">{title}</h2>
                <label className="text-12 ml-auto">
                    {new Date(createdAt).toLocaleString('ko-KR')}
                </label>
            </div>
            <div className={'flex gap-x-8'}>
                <p className="text-16 mt-12">{message}</p>
                {type === NOTIFICATION_TYPE.IS_IT_ME_RECEIVE && (
                    <div className={'flex gap-x-4 ml-auto'}>
                        <Link
                            href={'/matching/send-label'}
                            className={
                                'bg-white text-black text-16 rounded-4 px-8 py-1 items-center flex'
                            }
                        >
                            수락하기
                        </Link>
                        <button className="bg-white text-black text-16 rounded-4 px-8 py-1">
                            거절하기
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
