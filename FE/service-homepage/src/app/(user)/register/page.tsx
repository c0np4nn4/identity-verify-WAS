'use client';

import {SubmitHandler, useForm} from 'react-hook-form';
import {postRegister} from '@/api/Auth';
import {ISignupForm} from '@/types/auth';


export default function Page() {
  const {register, handleSubmit, formState: {errors}} = useForm<ISignupForm>();

  const onSubmit: SubmitHandler<ISignupForm> = async (data) => {
    if (data.password !== data.passwordConfirm) {
      alert('비밀번호가 다릅니다!');
      return;
    }

    try {
      const res = await postRegister(data.nickname, data.id, data.password);
      alert(res.data.message);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-cetner p-24">
      <h1 className="text-4xl font-bold">Welcome to Service Client</h1>
      <p className="text-lg">This is a 회원가입 Page.</p>
      <form className="flex flex-col w-1/3 mt-8"
            onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Nickname"
          className="p-2 border border-gray-300 rounded-md mb-4"
          defaultValue={'kimcookieya'}
          {...register('nickname', {required: true})}
        />
        <input
          type="text"
          placeholder="Id"
          className="p-2 border border-gray-300 rounded-md mb-4"
          defaultValue={'min49590'}
          {...register('id', {required: true})}
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 border border-gray-300 rounded-md mb-4"
          defaultValue={'1234'}
          {...register('password', {required: true})}
        />
        <input
          type="password"
          placeholder="Password Confirm"
          className="p-2 border border-gray-300 rounded-md mb-4"
          defaultValue={'1234'}
          {...register('passwordConfirm', {required: true})}
        />
        <button className="bg-blue-500 text-white p-2 rounded-md">
          회원가입
        </button>
      </form>
    </main>
  );
}
