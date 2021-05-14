import React from 'react';
import Helmet from 'react-helmet';
import {useForm} from "react-hook-form";
import {FormError} from "../components/form-error";
import {gql, useMutation} from "@apollo/client";
import nuberLogo from "../images/logo.svg"
import {Button} from "../components/button";
import {Link , useHistory} from 'react-router-dom'
import {UserRole} from "../__generated__/globalTypes";
import {createAccountMutation, createAccountMutationVariables} from "../__generated__/createAccountMutation";


interface ICreateAccountForm {
    email: string;
    password: string;
    role: UserRole;
}

const CREATE_ACCOUNT_MUTATION = gql`
    mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
        createAccount(input: $createAccountInput) {
            ok
            error
        }
    }
`;


export const CreateAccount = () => {

    const {register, getValues, errors, handleSubmit, formState, watch} = useForm<ICreateAccountForm>(
        {
            mode: "onChange",
            defaultValues: {
                role: UserRole.Client
            }
        });


    const history = useHistory();

    const onCompleted = (data: createAccountMutation) => {
        const {createAccount: {ok, error}} = data;
        if (ok) {
            return history.push("/login");
        }
    }
    const [createAccountMutation, {
        loading,
        data: createAccountMutationResult
    }] = useMutation<createAccountMutation, createAccountMutationVariables>(CREATE_ACCOUNT_MUTATION, {
        onCompleted
    });


    const onSubmit = async () => {
        if (!loading) {
            const {email, password, role} = getValues();
            createAccountMutation({
                variables: {
                    createAccountInput: {
                        email,
                        password,
                        role
                    }
                },
            })
        }
    }

    return (
        <div className='h-screen flex items-center flex-col mt-10 lg:mt-28'>
            <Helmet>
                <title>Create Account | Nuber Eats</title>
            </Helmet>
            <div className={'w-full max-w-screen-sm flex flex-col px-5 items-center'}>
                <img src={nuberLogo} alt={"Logo"} className='w-52 mb-5'/>
                <h4 className="w-full font-medium text-left text-3xl mb-7">Let's get started</h4>
                <form onSubmit={handleSubmit(onSubmit)} className='grid gap-3 w-full mb-3'>
                    <input
                        ref={register({
                            required: "이메일은 필수 사항 입니다.",
                            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
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
                    {errors.email?.type === 'pattern' && (
                        <FormError errorMessage={"Please enter a valid email"}/>
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
                    <select ref={register({required: true})} className={'input'} name={'role'}>
                        {Object.keys(UserRole).map((role, index) => <option key={index}>{role}</option>)}
                    </select>
                    <Button canClick={formState.isValid} loading={loading} actionText={"Create Account"}/>
                    {createAccountMutationResult?.createAccount.error && (
                        <FormError errorMessage={createAccountMutationResult.createAccount.error}/>
                    )}
                </form>
                <div>
                    Already have an account ?
                    <Link to={'/login'} className={'text-lime-600 hover:underline'}> Log in now</Link>
                </div>
            </div>
        </div>

    )
}