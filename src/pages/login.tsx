import React from 'react';
import {useForm} from "react-hook-form";
import {FormError} from "../components/form-error";
import {gql, useMutation} from "@apollo/client";
import {
    loginMutation,
    loginMutationVariables,
} from "../__generated__/loginMutation";


interface ILoginForm {
    email: string;
    password: string;
}

const LOGIN_MUTATION = gql`
    mutation loginMutation($email:String! , $password : String!){
        login(input : {
            email : $email,
            password : $password
        }) {
            ok
            error
            token
        }
    }
`;


export const Login = () => {

    const {register, getValues, errors, handleSubmit} = useForm<ILoginForm>();


    const [loginMutation] = useMutation<loginMutation, loginMutationVariables>(LOGIN_MUTATION);


    const onSubmit = () => {
        const {email, password} = getValues();
        loginMutation({
            variables: {
                email,
                password,
            }
        })
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
                        <FormError errorMessage={errors.email?.message}/>
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
                        <FormError errorMessage={errors.password?.message}/>
                    )}
                    {errors.password?.type === "minLength" && (
                        <FormError errorMessage={'비밀번호는 최소 10글자 적어주세요'}/>
                    )}
                    <button className={'mt-5 btn'}>Log In</button>
                </form>
            </div>
        </div>
    )
}