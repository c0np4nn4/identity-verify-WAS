'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import type { IUserInfoForm } from '@/types/auth';
import { postLogin } from '@/api/Auth';
import useUserStore from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import UserInfoInput from '@/app/(landing)/_component/UserInfoInput';
import BoatButton from '@/app/_component/BoatButton';

export default function Page() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<IUserInfoForm>();
    const { login } = useUserStore();
    const router = useRouter();

    const onSubmit: SubmitHandler<IUserInfoForm> = async (data) => {
        const res = await postLogin(data.id, data.password);
        if (res.data.result <= 300) {
            alert('로그인 성공');
            login(res.data.data, getValues('nickname') as string);
            router.push('/pond');
        } else {
            alert('로그인 실패: ' + res.data.data.message);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="absolute top-100 text-4xl font-bold text-white">
                로그인
            </h1>
            <form
                className="flex flex-col mt-80 gap-y-12"
                onSubmit={handleSubmit(onSubmit)}
            >
                <UserInfoInput
                    type={'text'}
                    placeholder={'아이디'}
                    name={'id'}
                    register={register}
                />
                <UserInfoInput
                    type={'password'}
                    placeholder={'비밀번호 입력'}
                    name={'password'}
                    register={register}
                />
                <BoatButton>로그인</BoatButton>
            </form>
        </main>
    );
}
