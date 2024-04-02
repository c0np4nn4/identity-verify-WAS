'use client';

import {SubmitHandler, useForm} from 'react-hook-form';
import axios from 'axios';
import {ISigninForm} from '@/types/auth';


export default function Page() {
  const {register, handleSubmit, formState: {errors}} = useForm<ISigninForm>();

  const onSubmit: SubmitHandler<ISigninForm> = async (data) => {
    try {
      const res = await axios.post(process.env.NEXT_PUBLIC_API_SERVICE + '/v1/login', {
        id: data.id,
        password: data.password,
      });
      console.log(res);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-cetner p-24">
      <h1 className="text-4xl font-bold">Welcome to Service Client</h1>
      <p className="text-lg">This is a 로그인 Page.</p>
      <form className="flex flex-col w-1/3 mt-8"
            onSubmit={handleSubmit(onSubmit)}>
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
        <button className="bg-blue-500 text-white p-2 rounded-md">
          로그인
        </button>
      </form>
    </main>
  );
}
