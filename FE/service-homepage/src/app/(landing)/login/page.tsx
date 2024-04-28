'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { IUserInfo, IUserInfoForm } from '@/types/auth';
import { getMe, postLogin } from '@/api/Auth';
import useUserInfoStore from '@/stores/useUserInfoStore';
import { useRouter } from 'next/navigation';
import UserInfoInput from '@/app/(landing)/_component/UserInfoInput';
import BoatButton from '@/app/_component/BoatButton';
import { useToast } from '@/stores/useToastStore';
import Toast from '@/app/_component/Toast';

export default function Page() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<IUserInfoForm>();
    const { openToast } = useToast();
    const { login } = useUserInfoStore();
    const router = useRouter();

    const fetchMe = async () => {
        const res = await getMe();
        if (res.status <= 200) {
            console.log(res.data.data);
        }
        return res.data.data.userInfo as IUserInfo;
    };

    const onSubmit: SubmitHandler<IUserInfoForm> = async (data) => {
        const res = await postLogin(data.id, data.password);
        if (res.data.result <= 300) {
            openToast('로그인 성공', 'success', () => router.push('/pond'));
            console.log(res.data);
            const userInfo = await fetchMe();
            console.log(userInfo);
            login(userInfo);
        } else {
            openToast(
                `로그인 실패 - ${res.data.data.message}`,
                'error',
                () => {}
            );
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <Toast />
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
