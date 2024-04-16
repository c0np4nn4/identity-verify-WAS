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
                    defaultValue={'kimcookieya'}
                    name={'nickname'}
                />
                <RegisterInput
                    type={'text'}
                    placeholder={'아이디'}
                    defaultValue={'min49590'}
                    name={'id'}
                />
                <RegisterInput
                    type={'password'}
                    placeholder={'비밀번호 입력'}
                    defaultValue={'1234'}
                    name={'password'}
                />
                <RegisterInput
                    type={'password'}
                    placeholder={'비밀번호 재확인'}
                    defaultValue={'1234'}
                    name={'passwordConfirm'}
                />
                <button className="bg-gray-800 text-white p-4 rounded-md">
                    회원가입
                </button>
            </form>
        </main>
    );
}

function RegisterInput({
    type,
    placeholder,
    defaultValue,
    name,
}: {
    type: string;
    placeholder: string;
    defaultValue: string;
    name: 'nickname' | 'id' | 'password' | 'passwordConfirm';
}) {
    const { register } = useForm<ISignupForm>();

    return (
        <div className={'px-12 py-2 rounded-full bg-white'}>
            <input
                type={type}
                placeholder={placeholder}
                className="p-2 rounded-md mb-4"
                defaultValue={defaultValue}
                {...register(name, { required: true })}
            />
        </div>
    );
}
