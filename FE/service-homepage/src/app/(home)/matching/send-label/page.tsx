'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import useUserInfoStore from '@/stores/useUserInfoStore';
import { useToast } from '@/stores/useToastStore';
import { useState } from 'react';
import { LabelData } from '@/datas/label';
import LabelSelectSection from '@/app/(home)/pond/boat/_component/LabelSelectSection';
import { postCreateBoat } from '@/api/Boat';
import { postSendMyLabel } from '@/api/Matching';

const TOTAL_STEP = 3;

export default function SendLabelPage() {
    const router = useRouter();
    const targetPk = useSearchParams().get('targetPk');
    const toast = useToast((state) => state);
    const [step, setStep] = useState(0);
    const [labels, setLabels] = useState<string[]>(
        Array.from({ length: 9 }, () => '')
    );
    const [secreteLabels, setSecreteLabels] = useState<string[]>(
        Array.from({ length: 2 }, () => '')
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

    const onSendMyLabel = async () => {
        const res = await postSendMyLabel({
            targetPk: targetPk as string,
            label1: labels[0],
            label2: labels[1],
            label3: labels[2],
        });
        console.log(res);
        if (res.status <= 300 && res.data.result === 200) {
            toast.openToast(
                '나의 특징을 성공적으로 보냈습니다!',
                'success',
                () => {
                    router.push('/notification');
                }
            );
        }
    };

    return (
        <main className="text-white w-full h-full flex flex-col items-center bg-gradient-to-b from-[#162832] to-[#527784]">
            <h1 className={'text-24 mx-auto mt-48'}>라벨 보내기</h1>
            <p>상대방에게 보낼 라벨을 3가지만 골라주세요!</p>
            <div className="relative w-full overflow-hidden h-full mt-72">
                <div
                    className="flex transition-transform duration-500"
                    style={{ transform: `translateX(-${step * 100}%)` }}
                >
                    <SelectSection1 onClickLabel={onClickLabel} />
                    <SelectSection2 onClickLabel={onClickLabel} />
                    <SecreteSelectSection
                        onClickLabel={onClickSecreteLabel}
                        onCreateBoat={onSendMyLabel}
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
            {LabelData.slice(6, 8).map((label, index) => {
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
