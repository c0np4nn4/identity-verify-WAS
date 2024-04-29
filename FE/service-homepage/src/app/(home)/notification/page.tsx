'use client';

import { BsFillInfoCircleFill } from 'react-icons/bs';
import { FaHeart } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { getAlarmList } from '@/api/Notification';
import { IAlarm } from '@/types/alarm';

export default function NotificationPage() {
    const [alarmList, setAlarmList] = useState<IAlarm[]>([]);
    useEffect(function getAlarmListEffect() {
        const fetchAlarmList = async () => {
            const res = await getAlarmList();
            if (res.data.result <= 300) {
                setAlarmList(res.data.data.alarmList as IAlarm[]);
            }
        };
        fetchAlarmList();
    }, []);

    return (
        <main className="flex flex-col items-center justify-center p-24 text-white">
            <h1 className="text-40 mt-24">알림창</h1>
            <section className="flex flex-col gap-y-24 mt-80 w-full">
                <NotificationItem
                    type="info"
                    title="알림"
                    message="알림 메시지"
                    read={false}
                    createdAt={new Date()}
                />
            </section>
        </main>
    );
}

const NOTIFICATION_TYPE = {
    info: 'info',
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
    createdAt: Date;
}) {
    let colorString = 'bg-gray-800 text-white';

    switch (type) {
        case NOTIFICATION_TYPE.info:
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
        <div className={`flex flex-col p-24 ${colorString}`}>
            <div className="flex items-center gap-x-12">
                <BsFillInfoCircleFill size={32} />
                <h2 className="text-24">{title}</h2>
            </div>
            <p className="text-16 mt-12">{message}</p>
            <div className="flex items-center mt-24">
                <FaHeart size={24} />
                <p className="text-16 ml-12">5</p>
                <p className="text-16 ml-auto">{createdAt.toDateString()}</p>
            </div>
        </div>
    );
}
