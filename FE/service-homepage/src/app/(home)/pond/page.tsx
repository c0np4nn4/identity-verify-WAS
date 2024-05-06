'use client';

import { MdKeyboardArrowDown } from 'react-icons/md';
import PaperBoatCard from '@/app/(home)/pond/_component/PaperBoatCard';
import { BoatData } from '@/datas/paperboat';
import { useEffect, useState } from 'react';
import { getBoatList } from '@/api/Pond';
import { IBoat } from '@/types/boat';

export default function PonePage() {
    const [boatList, setBoatList] = useState<IBoat[]>([]);
    useEffect(function getBoatListEffect() {
        const fetchBoatList = async () => {
            const res = await getBoatList();
            console.log(res.data.data.boatList as IBoat[]);
            if (res.data.result <= 300) {
                setBoatList(res.data.data.boatList as IBoat[]);
            }
        };
        fetchBoatList();
    }, []);

    return (
        <main className="flex flex-col p-24 w-full h-full">
            <div className={'flex'}>
                <h1 className="text-4xl font-bold text-white">연못</h1>
                <label className={'ml-auto text-white'}>부산대</label>
                <MdKeyboardArrowDown color={'white'} />
            </div>
            {boatList.length > 0 ? (
                <section className="grid grid-cols-2 gap-24 justify-items-center mt-48 justify-center items-center text-white">
                    {boatList.map((boat, index) => (
                        <PaperBoatCard
                            key={index}
                            labels={boat.labels}
                            authorNickname={boat.userNickname}
                            href={`/pond/${boat.pk}`}
                        />
                    ))}
                </section>
            ) : (
                <div
                    className={
                        'flex justify-center items-center text-white w-full h-full'
                    }
                >
                    <h1>지금 띄워진 종이배가 없어요!</h1>
                </div>
            )}
        </main>
    );
}
