'use client';

import LabelSelectSection from '@/app/(home)/pond/boat/_component/LabelSelectSection';
import { useState } from 'react';
import { LabelData } from '@/datas/label';
import { useRouter } from 'next/navigation';
import { postCreateBoat } from '@/api/Boat';
import useUserInfoStore from '@/stores/useUserInfoStore';

const TOTAL_STEP = 3;

export default function BoatPage() {
    const router = useRouter();
    const userInfo = useUserInfoStore((state) => state.userInfo);
    const [step, setStep] = useState(0);
    const [labels, setLabels] = useState<string[]>(
        Array.from({ length: 9 }, () => '')
    );
    const [secreteLabels, setSecreteLabels] = useState<string[]>(
        Array.from({ length: 3 }, () => '')
    );
    const handleNext = () => {
        setStep((prevStep) => Math.min(prevStep + 1, TOTAL_STEP - 1));
    };
    const handlePrevious = () => {
        setStep((prevStep) => Math.max(prevStep - 1, 0));
    };

    const onClickLabel = (index: number, option: string) => {
        setLabels((prevLabels) => {
            const newLabels = [...prevLabels];
            newLabels[index] = option;
            console.log(newLabels);
            return newLabels;
        });
    };

    const onClickSecreteLabel = (index: number, option: string) => {
        setSecreteLabels((prevLabels) => {
            const newLabels = [...prevLabels];
            newLabels[index] = option;
            console.log(newLabels);
            return newLabels;
        });
    };

    const onCreateBoat = async () => {
        console.log('배 만들기');
        const res = await postCreateBoat({
            userPk: userInfo!.pk,
            labels,
            secreteLabels,
        });
        console.log(res);
        if (res.status <= 300) {
            // router.push('/pond');
        }
    };

    return (
        <main
            className={
                'relative flex flex-col h-full w-full text-white items-center justify-center'
            }
        >
            <h1 className={'text-28 mt-48 text-center'}>
                짝사랑하는 사람의 특징을
                <br /> 골라주세요!
            </h1>
            <div className="relative w-full overflow-hidden h-full mt-72">
                <div
                    className="flex transition-transform duration-500"
                    style={{ transform: `translateX(-${step * 100}%)` }}
                >
                    <SelectSection1 onClickLabel={onClickLabel} />
                    <SelectSection2 onClickLabel={onClickLabel} />
                    <SecreteSelectSection
                        onClickLabel={onClickSecreteLabel}
                        onCreateBoat={onCreateBoat}
                    />
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

function SelectSection1({
    onClickLabel,
}: {
    onClickLabel: (index: number, option: string) => void;
}) {
    return (
        <section
            className={
                'flex-none flex flex-col gap-y-24 items-center justify-center w-full h-full p-24'
            }
        >
            {LabelData.slice(0, 3).map((label, index) => {
                return (
                    <LabelSelectSection
                        key={index}
                        label={label.label}
                        options={label.options}
                        onSelect={(option) => onClickLabel(index, option)}
                    />
                );
            })}
        </section>
    );
}

function SelectSection2({
    onClickLabel,
}: {
    onClickLabel: (index: number, option: string) => void;
}) {
    return (
        <section
            className={'flex-none flex flex-col gap-y-24 w-full h-full p-24'}
        >
            {LabelData.slice(3, 6).map((label, index) => {
                return (
                    <LabelSelectSection
                        key={index}
                        label={label.label}
                        options={label.options}
                        onSelect={(option) => onClickLabel(index + 3, option)}
                    />
                );
            })}
        </section>
    );
}

function SecreteSelectSection({
    onClickLabel,
    onCreateBoat,
}: {
    onClickLabel: (index: number, option: string) => void;
    onCreateBoat: () => void;
}) {
    return (
        <section
            className={'flex-none flex flex-col gap-y-24 w-full h-full p-24'}
        >
            <h2 className={'text-24'}>시크릿 라벨 고르기</h2>
            {LabelData.slice(6, 9).map((label, index) => {
                return (
                    <LabelSelectSection
                        key={index}
                        label={label.label}
                        options={label.options}
                        onSelect={(option) => onClickLabel(index, option)}
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
