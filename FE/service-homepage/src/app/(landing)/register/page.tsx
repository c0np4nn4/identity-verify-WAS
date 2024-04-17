'use client';

import { SubmitHandler, useForm, UseFormRegister } from 'react-hook-form';
import { postRegister } from '@/api/Auth';
import { ISignupForm } from '@/types/auth';

export default function Page() {
    const {
        handleSubmit,
        formState: { errors },
    } = useForm<ISignupForm>();

    const onSubmit: SubmitHandler<ISignupForm> = async (data) => {
        if (data.password !== data.passwordConfirm) {
            alert('비밀번호가 다릅니다!');
            return;
        }

        try {
            const res = await postRegister(
                data.nickname,
                data.id,
                data.password
            );
            alert(res.data.message);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="absolute top-100 text-4xl font-bold text-white">
                회원가입
            </h1>
            <form
                className="flex flex-col mt-80 gap-y-12"
                onSubmit={handleSubmit(onSubmit)}
            >
                <RegisterInput
                    type={'text'}
                    placeholder={'닉네임'}
                    name={'nickname'}
                />
                <RegisterInput
                    type={'text'}
                    placeholder={'아이디'}
                    name={'id'}
                />
                <RegisterInput
                    type={'password'}
                    placeholder={'비밀번호 입력'}
                    name={'password'}
                />
                <RegisterInput
                    type={'password'}
                    placeholder={'비밀번호 재확인'}
                    name={'passwordConfirm'}
                />
                <button className="bg-gray-800 text-white p-4 rounded-md">
                    회원가입하기
                </button>
            </form>
        </main>
    );
}

function RegisterInput({
    type,
    placeholder,
    name,
}: {
    type: string;
    placeholder: string;
    name: 'nickname' | 'id' | 'password' | 'passwordConfirm';
}) {
    const { register } = useForm<ISignupForm>();

    return (
        <input
            type={type}
            placeholder={placeholder}
            className="px-12 py-2 mb-4 rounded-full focus:outline-none"
            {...register(name, { required: true })}
        />
    );
}
