'use client';

import { forwardRef, RefObject, useRef } from 'react';
import { postSendRealName } from '@/api/Matching';
import { useSearchParams } from 'next/navigation';

const CHOSUNG_LIST = [
    'ㄱ',
    'ㄲ',
    'ㄴ',
    'ㄷ',
    'ㄸ',
    'ㄹ',
    'ㅁ',
    'ㅂ',
    'ㅃ',
    'ㅅ',
    'ㅆ',
    'ㅇ',
    'ㅈ',
    'ㅉ',
    'ㅊ',
    'ㅋ',
    'ㅌ',
    'ㅍ',
    'ㅎ',
];

export default function SendQuizPage() {
    const targetPk = useSearchParams().get('targetPk');
    console.log(targetPk);
    const inputRef1 = useRef<HTMLInputElement>(null);
    const inputRef2 = useRef<HTMLInputElement>(null);
    const inputRef3 = useRef<HTMLInputElement>(null);

    const handleChosungInput = (ref: RefObject<HTMLInputElement>) => {
        if (ref.current === null) return;

        const input = ref.current.value;
        const lastChar = input.charAt(input.length - 1); // 입력된 마지막 문자
        if (CHOSUNG_LIST.includes(lastChar)) {
            ref.current.value = lastChar; // 마지막 문자가 초성이면 해당 값으로 설정
            // 다음 input으로 포커스 이동
            const nextInput = ref.current
                .nextElementSibling as HTMLInputElement;
            if (nextInput) {
                nextInput.focus();
            }
        } else {
            ref.current.value = ''; // 초성이 아니면 초기화
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const chosung1 = inputRef1.current?.value;
        const chosung2 = inputRef2.current?.value;
        const chosung3 = inputRef3.current?.value;

        if (chosung1 && chosung2 && chosung3) {
            console.log(chosung1 + chosung2 + chosung3);
            const res = await postSendRealName({
                targetPk: targetPk as string,
                name: chosung1 + chosung2 + chosung3,
            });
            console.log(res);
            if (res.data.statusCode <= 200) {
                console.log('이름 전송 성공');
            } else {
                console.log('이름 전송 실패');
            }
        } else {
            console.log('모든 칸을 채워주세요');
        }
    };

    return (
        <main className="flex flex-col items-center justify-center p-24 text-white">
            <h1 className="text-40 mt-24">퀴즈</h1>
            <p className="mt-24">아래에 초성을 입력해주세요</p>
            <form
                onSubmit={onSubmit}
                className={'w-full h-full justify-center items-center px-24'}
            >
                <div
                    className={'flex w-full justify-between items-center mt-48'}
                >
                    <ChosungInput
                        ref={inputRef1}
                        handleChosungInput={handleChosungInput}
                    />
                    <ChosungInput
                        ref={inputRef2}
                        handleChosungInput={handleChosungInput}
                    />
                    <ChosungInput
                        ref={inputRef3}
                        handleChosungInput={handleChosungInput}
                    />
                </div>
                <button
                    className={
                        'w-full p-12 mt-48 bg-black text-white rounded-8 justify-center items-center'
                    }
                >
                    제출
                </button>
            </form>
        </main>
    );
}

const ChosungInput = forwardRef(
    (
        {
            handleChosungInput,
        }: {
            handleChosungInput: (_: RefObject<HTMLInputElement>) => void;
        },
        _ref
    ) => {
        return (
            <input
                ref={_ref}
                onChange={() => handleChosungInput(_ref)}
                className={
                    'w-72 h-72 rounded-8 border text-48 text-black text-center'
                }
            />
        );
    }
);
