import { UseFormRegister } from 'react-hook-form';
import type { IUserInfoForm } from '@/types/auth';

export default function UserInfoInput({
    type,
    placeholder,
    name,
    register,
}: {
    type: string;
    placeholder: string;
    name: 'nickname' | 'id' | 'password' | 'passwordConfirm';
    register: UseFormRegister<IUserInfoForm>;
}) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            className="px-12 py-2 mb-4 rounded-full focus:outline-none"
            {...register(name)}
        />
    );
}
