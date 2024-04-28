'use client';

import { getBoatSingle } from '@/api/Pond';
import { IBoat } from '@/types/boat';
import { useEffect, useState } from 'react';
import { generateColor } from '@/utils/color';
import Link from 'next/link';
import { useToast } from '@/stores/useToastStore';
import postSendIsItMe from '@/api/Matching';
import { getMe } from '@/api/Auth';
import { IUserInfo } from '@/types/auth';

export default function BoatMatchingPage({
    params,
}: {
    params: { boatPk: number };
}) {
    const boatPk = params.boatPk;
    const [boat, setBoat] = useState<IBoat | null>(null);
    const [user, setUser] = useState<IUserInfo | null>(null);
    const toastState = useToast((state) => state);

    useEffect(() => {
        const fetchBoat = async () => {
            const res = await getBoatSingle(boatPk);
            if (res.status <= 300) {
                setBoat(res.data.data as IBoat);
            }
        };
        fetchBoat();

        const fetchMe = async () => {
            const res = await getMe();
            if (res.status <= 200) {
                console.log(res.data.data);
                setUser(res.data.data.userInfo as IUserInfo);
            }
        };
        fetchMe();
    }, []);

    const onLikeMe = async () => {
        console.log('좋아요 보내기');
        const res = await postSendIsItMe({ targetPk: boat?.userPk as string });
        toastState.openToast('좋아요를 보냈습니다!', 'success');
    };

    return (
        <main className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#162832] to-[#527784]">
            <div className="w-full h-24 flex justify-center items-center">
                나의 하트 수: {user?.heart}
            </div>
            <h1 className="text-4xl font-bold text-white">배 매칭</h1>
            <section className="flex flex-col gap-y-8 justify-items-center mt-24 mb-48 w-full px-24">
                {boat && (
                    <>
                        <div className="flex flex-wrap mt-2 gap-8">
                            {boat.labels?.map((label, index) => (
                                <span
                                    key={label + index}
                                    className={`text-18 rounded-6 px-2 py-1 bg-mypink`}
                                >
                                    {label}
                                </span>
                            ))}
                        </div>
                        <p className="text-s m ml-auto mt-auto font-sans px-4 rounded-8 bg-gray-200">
                            {boat.userNickname}
                        </p>
                    </>
                )}
            </section>
            <div
                className={
                    'flex gap-x-12 mt-8 w-full items-center justify-center px-12'
                }
            >
                <button
                    className={
                        'bg-mypink text-white text-24 rounded-12 px-8 py-4 w-full'
                    }
                    onClick={onLikeMe}
                >
                    혹시 난가?
                </button>
                <Link
                    href={'/pond'}
                    className={
                        'bg-myblue text-white text-center text-24 rounded-12 px-8 py-4 w-full'
                    }
                >
                    난 아닌 듯...
                </Link>
            </div>
        </main>
    );
}

function LabelTag({ label }: { label: string }) {
    const [bgColor, seBgColor] = useState('');
    useEffect(function bgColorEffect() {
        seBgColor(generateColor());
    }, []);

    return (
        <div
            className={`text-24 rounded-6 px-24 py-4 text-white bg-mypink h-fit w-full`}
            style={{ background: 'black' }}
        >
            # {label}
        </div>
    );
}
