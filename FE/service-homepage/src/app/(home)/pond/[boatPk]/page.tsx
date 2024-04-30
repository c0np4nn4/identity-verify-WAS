'use client';

import { getBoatSingle } from '@/api/Pond';
import { IBoat } from '@/types/boat';
import { useEffect, useState } from 'react';
import { generateColor } from '@/utils/color';
import Link from 'next/link';
import { useToast } from '@/stores/useToastStore';
import { postSendIsItMe } from '@/api/Matching';
import useUserInfoStore from '@/stores/useUserInfoStore';
import { useRouter } from 'next/navigation';

export default function BoatMatchingPage({
    params,
}: {
    params: { boatPk: number };
}) {
    const userStore = useUserInfoStore((state) => state);
    const boatPk = params.boatPk;
    const [boat, setBoat] = useState<IBoat | null>(null);
    const toastState = useToast((state) => state);
    const router = useRouter();

    useEffect(() => {
        const fetchBoat = async () => {
            const res = await getBoatSingle(boatPk);
            if (res.status <= 300) {
                console.log(res.data.data.boat);
                setBoat(res.data.data.boat as IBoat);
            } else {
                toastState.openToast(
                    '종이배를 불러오는데 실패했습니다.',
                    'error',
                    () => {
                        router.push('/pond');
                    }
                );
            }
        };
        fetchBoat();
    }, []);

    const onLikeMe = async () => {
        console.log('혹시 나야?');
        const res = await postSendIsItMe({
            targetPk: 'dd62b508-aa4f-4f34-a16f-ed1e9858e10b', // boat?.userPk as string
        });
        if (res.status <= 300 && res.data.result === 200) {
            toastState.openToast('혹시나야를 보냈습니다!', 'success', () => {
                router.push('/notification');
            });
        } else {
            toastState.openToast(
                '혹시나야를 보내는데 실패했습니다.',
                'error',
                () => {}
            );
        }
    };

    return (
        <main className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#162832] to-[#527784]">
            <div className="w-full h-24 flex justify-center items-center text-red-400">
                나의 하트 수: {userStore.userInfo?.heart}
            </div>
            <h1 className="text-4xl font-bold text-white">종이배</h1>
            <section className="flex flex-col gap-y-8 justify-center items-center mt-24 mb-48 w-full px-24">
                {boat && (
                    <>
                        <div className="flex mt-2 gap-8 w-2/3 flex-wrap justify-center ">
                            {boat.labels?.map((label, index) => {
                                if (!label) return null;

                                return (
                                    <p
                                        key={label + index}
                                        className={`text-18 rounded-6 py-1 bg-white text-nowrap text-center flex-1 px-12`}
                                    >
                                        #{label}
                                    </p>
                                );
                            })}
                        </div>
                        <p className="text-sm ml-auto mt-auto font-sans text-white p-12">
                            {boat.userNickname}님이 띄웠어요!
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
                        'bg-mypink text-white text-24 rounded-12 px-8 py-4 flex-1'
                    }
                    onClick={onLikeMe}
                >
                    혹시 난가?
                </button>
                <Link
                    href={'/pond'}
                    className={
                        'bg-myblue text-white text-center text-24 rounded-12 px-8 py-4 flex-1'
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
