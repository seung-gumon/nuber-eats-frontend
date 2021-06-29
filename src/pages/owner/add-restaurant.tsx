import React, {useEffect} from 'react';
import {gql} from "@apollo/client/core";
import {useMutation} from "@apollo/client";
import {createRestaurant} from "../../__generated__/createRestaurant";
import {createAccountMutationVariables} from "../../__generated__/createAccountMutation";
import {useForm} from "react-hook-form";
import {Button} from "../../components/button";
import {Helmet} from "react-helmet-async";


const CREATE_RESTAURANT_MUTATION = gql`
    mutation createRestaurant($input : CreateRestaurantInput!) {
        createRestaurant(input : $input) {
            ok
            error
        }
    }
`

interface IFormProps {
    name: string;
    address: string;
    categoryName: string;
}


export const AddRestaurant = () => {

    const [createRestaurantMutation, {
        loading,
        data
    }] = useMutation<createRestaurant, createAccountMutationVariables>(CREATE_RESTAURANT_MUTATION);

    const {register, getValues, formState, errors, handleSubmit} = useForm<IFormProps>({
        mode : "onChange"
    });

    const onSubmit = () => {
        console.log(getValues())
    }

    return (
        <div className={'max-w-screen-2xl mx-auto'}>
            <Helmet>
                <title>Add Restaurant | Nuber Eats</title>
            </Helmet>
            <h1>Add Restaurant</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input className={'input'} type='text' name={'name'} placeholder={'name'} ref={register({required: "이름은 필수 조건입니다."})}/>
                <input className={'input'} type='text' name={'address'} placeholder={'address'} ref={register({required: "주소는 필수 조건입니다."})}/>
                <input className={'input'} type='text' name={'categoryName'} placeholder={'categoryName'} ref={register({required: "카테고리 이름은 필수 조건입니다."})}/>
                <Button canClick={formState.isValid} loading={loading} actionText={'Create Restaurant'}/>
            </form>
        </div>
    )
}