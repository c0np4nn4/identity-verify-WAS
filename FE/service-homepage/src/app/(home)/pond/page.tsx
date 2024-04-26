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
            if (res.status === 200) {
                console.log(res.data.data);
                setBoatList(res.data.data as IBoat[]);
            }
        };
        fetchBoatList();
    }, []);

    return (
        <main className="flex flex-col p-24">
            <div className={'flex'}>
                <h1 className="text-4xl font-bold text-white">연못</h1>
                <label className={'ml-auto text-white'}>부산대</label>
                <MdKeyboardArrowDown color={'white'} />
            </div>
            <section className="grid grid-cols-2 gap-24 justify-items-center mt-48">
                {BoatData.map((boat, index) => (
                    <PaperBoatCard
                        key={index}
                        labels={['#해외여행', '#바다', '#여행']}
                        authorNickname={boat.authorNickname}
                        href={`/pond/${boat.pk}`}
                    />
                ))}
                {boatList.map((boat, index) => (
                    <PaperBoatCard
                        key={index}
                        labels={boat.labels}
                        authorNickname={boat.userNickname}
                        href={`/pond/${boat.pk}`}
                    />
                ))}
            </section>
        </main>
    );
}
