'use client';

import { SubmitHandler, useForm, UseFormRegister } from 'react-hook-form';
import { postRegister } from '@/api/User';
import { IUserInfoForm } from '@/types/auth';
import { useRouter } from 'next/navigation';
import UserInfoInput from '@/app/(sign)/_component/UserInfoInput';
import BoatButton from '@/app/_component/BoatButton';

export default function Page() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IUserInfoForm>();
    const router = useRouter();

    const onSubmit: SubmitHandler<IUserInfoForm> = async (data) => {
        if (
            !data.nickname ||
            !data.id ||
            !data.password ||
            !data.passwordConfirm
        ) {
            alert('모든 항목을 입력해주세요!');
            return;
        }

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
            router.push('/login');
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
                <UserInfoInput
                    type={'text'}
                    placeholder={'닉네임'}
                    name={'nickname'}
                    register={register}
                />
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
                <UserInfoInput
                    type={'password'}
                    placeholder={'비밀번호 재확인'}
                    name={'passwordConfirm'}
                    register={register}
                />
                <BoatButton>회원가입하기</BoatButton>
            </form>
        </main>
    );
}
