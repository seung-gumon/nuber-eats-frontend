import React from 'react';
import {useForm} from "react-hook-form";


interface ILoginForm {
    email?: string;
    password: string;
}


export const Login = () => {

    const {register, getValues, errors, handleSubmit} = useForm<ILoginForm>();

    const onSubmit = () => {
        console.log(getValues());
    }

    return (
        <div className='h-screen flex items-center justify-center bg-gray-800'>
            <div className='bg-white w-full max-w-lg pt-10 pb-5 py-10 rounded-lg text-center'>
                <h3 className='text-3xl text-gray-800'>Log In</h3>
                <form onSubmit={handleSubmit(onSubmit)} className='grid gap-3 mt-5 px-5 '>
                    <input
                        ref={register({
                            required: "이메일은 필수 사항 입니다."
                        })}
                        type={'email'}
                        placeholder={'Email'}
                        name={'email'}
                        required
                        className='input'
                    />
                    {errors.email?.message && (
                        <span className='text-medium text-red-500'>{errors.email?.message}</span>
                    )}
                    <input
                        ref={register({
                            required: "비밀번호는 필수 사항 입니다.",
                            minLength: 10
                        })}
                        type={'password'}
                        placeholder={'Password'}
                        name={'password'}
                        required
                        className='input'
                    />
                    {errors.password?.message && (
                        <span className='text-medium text-red-500'>
                            {errors.password?.message}
                        </span>
                    )}
                    {errors.password?.type === "minLength" && (
                        <span className='text-medium text-red-500'>
                            비밀번호는 최소 10글자 적어주세요
                        </span>
                    )}
                    <button
                        className={'mt-5 btn'}>Log In
                    </button>
                </form>
            </div>
        </div>
    )
}