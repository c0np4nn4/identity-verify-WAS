import { MdKeyboardArrowDown } from 'react-icons/md';
import PaperBoatCard from '@/app/(home)/pond/_component/PaperBoatCard';
import { BoatData } from '@/datas/paperboat';

export default function PonePage() {
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
                        href={`/pond/${index}`}
                    />
                ))}
            </section>
        </main>
    );
}
