'use client';

import { BsFillInfoCircleFill } from 'react-icons/bs';
import { FaHeart } from 'react-icons/fa';

export default function NotificationPage() {
    return (
        <main className="flex flex-col items-center justify-center p-24">
            <h1 className="text-40 mt-24">알림창</h1>
            <section className="flex flex-col gap-y-24 mt-80 w-full">
                <NotificationItem
                    type={'info'}
                    title={'종이배 도착!'}
                    message={'누군가 종이배를 열었네요. 누구일까요?'}
                />
                <NotificationItem
                    type={'success'}
                    title={'매칭 성공!'}
                    message={'짝사랑과 매칭되셨나요? 축하드립니다!'}
                />
                <NotificationItem
                    type={'reject'}
                    title={'매칭 실패..'}
                    message={
                        '아쉽게도 짝사랑과 매칭되지 못했네요. 힘내라는 의미로 5하트를 돌려드릴게요!'
                    }
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
}: {
    type: NotificationType;
    title: string;
    message: string;
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
        <div className="flex flex-col gap-y-4 items-start justify-center text-start w-full">
            <div
                className={`flex gap-x-12 w-full items-center ${colorString} px-4 py-2 rounded-4`}
            >
                {type === NOTIFICATION_TYPE.info ? (
                    <BsFillInfoCircleFill />
                ) : (
                    <FaHeart color={'pink'} />
                )}
                <h2 className="text-lg font-bold">{title}</h2>
            </div>
            <p className="text-base px-4">{message}</p>
        </div>
    );
}
