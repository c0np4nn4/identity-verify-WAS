'use client';

import LabelSelectSection from '@/app/(home)/my-page/boat/_component/LabelSelectSection';
import { useState } from 'react';
import { LabelData } from '@/datas/label';
import { postCreateBoat } from '@/api/Boat';
import { useRouter } from 'next/navigation';

const TOTAL_STEP = 3;

export default function BoatPage() {
    const [step, setStep] = useState(0);
    const handleNext = () => {
        setStep((prevStep) => Math.min(prevStep + 1, TOTAL_STEP - 1));
    };
    const handlePrevious = () => {
        setStep((prevStep) => Math.max(prevStep - 1, 0));
    };
    const onSelectSex = (label: string, option: string) => {
        console.log(`${label} : ${option}`);
    };

    return (
        <main className={'relative flex flex-col h-full w-330'}>
            <h1 className={'text-28'}>
                짝사랑하는 분의 특징을
                <br /> 골라주세요!
            </h1>
            <div className="relative w-full overflow-hidden h-full mt-72">
                <div
                    className="flex transition-transform duration-500"
                    style={{ transform: `translateX(-${step * 100}%)` }}
                >
                    <SelectSection1 />
                    <SelectSection2 />
                    <SelectSection3 />
                </div>
            </div>
            <div className="flex gap-x-4 absolute right-0 left-0 bottom-50 mx-auto w-full">
                <button
                    className="px-4 py-2"
                    onClick={handlePrevious}
                    disabled={step === 0}
                >
                    Previous
                </button>
                <button
                    className="px-4 py-2"
                    onClick={handleNext}
                    disabled={step === TOTAL_STEP - 1}
                >
                    Next
                </button>
            </div>
        </main>
    );
}

function SelectSection1() {
    return (
        <section className={'flex-none flex flex-col gap-y-24'}>
            {LabelData.slice(0, 3).map((label, index) => {
                return (
                    <LabelSelectSection
                        key={index}
                        label={label.label}
                        options={label.options}
                        onSelect={(option) => console.log(option)}
                    />
                );
            })}
        </section>
    );
}

function SelectSection2() {
    return (
        <section className={'flex-none flex flex-col gap-y-24'}>
            {LabelData.slice(3, 6).map((label, index) => {
                return (
                    <LabelSelectSection
                        key={index}
                        label={label.label}
                        options={label.options}
                        onSelect={(option) => console.log(option)}
                    />
                );
            })}
        </section>
    );
}

function SelectSection3() {
    const router = useRouter();
    const onCreateBoat = async () => {
        // TODO: 종이배 생성 API 호출
        // const res = await postCreateBoat({
        //
        // })
        router.push('/notification');
    };
    return (
        <section className={'flex-none flex flex-col gap-y-24'}>
            {LabelData.slice(6, 9).map((label, index) => {
                return (
                    <LabelSelectSection
                        key={index}
                        label={label.label}
                        options={label.options}
                        onSelect={(option) => console.log(option)}
                    />
                );
            })}
            <div className={'flex gap-x-8'}>
                <button
                    className={'w-full p-8 bg-blue-300'}
                    onClick={onCreateBoat}
                >
                    띄우기
                </button>
            </div>
        </section>
    );
}
