import React, {useEffect, useState} from 'react';
import {gql} from "@apollo/client/core";
import {useMutation} from "@apollo/client";
import {createRestaurant, createRestaurantVariables} from "../../__generated__/createRestaurant";
import {createAccountMutationVariables} from "../../__generated__/createAccountMutation";
import {useForm} from "react-hook-form";
import {Button} from "../../components/button";
import {Helmet} from "react-helmet-async";
import {FormError} from "../../components/form-error";


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
    file: FileList
}


export const AddRestaurant = () => {


    const onCompleted = (data:createRestaurant) => {
        const {createRestaurant : {ok , error}} = data
        if (ok) {
            setUploading(false);
        }
    }

    const [createRestaurantMutation, {
        loading,
        data
    }] = useMutation<createRestaurant, createRestaurantVariables>(CREATE_RESTAURANT_MUTATION , {
        onCompleted
    });



    const {register, getValues, formState, errors, handleSubmit} = useForm<IFormProps>({
        mode: "onChange"
    });

    const [uploading , setUploading] = useState(false);

    const onSubmit = async () => {
        try {
            setUploading(true)
            const {file, name, categoryName, address} = getValues();
            const actualFile = file[0];
            const formBody = new FormData();
            formBody.append('file', actualFile)
            const {url: coverImg} = await (await fetch("http://localhost:4000/uploads/", {
                method: "POST",
                body: formBody
            })).json();

            await createRestaurantMutation({
                variables: {
                    input: {
                        name,
                        categoryName,
                        address,
                        coverImg
                    }
                }
            });

        } catch (e) {

        }
    }

    return (
        <div className={'max-w-screen-2xl mx-auto flex flex-col justify-center items-center h-screen'}>
            <Helmet>
                <title>Add Restaurant | Nuber Eats</title>
            </Helmet>
            <h1 className={'text-black font-bold text-xl'}>Add Restaurant</h1>
            <form onSubmit={handleSubmit(onSubmit)} className={'flex flex-col w-10/12 max-w-lg'}>
                <input className={'input'} type='text' name={'name'} placeholder={'name'}
                       ref={register({required: "이름은 필수 조건입니다."})}/>
                <input className={'input mt-1'} type='text' name={'address'} placeholder={'address'}
                       ref={register({required: "주소는 필수 조건입니다."})}/>
                <input className={'input mt-1'} type='text' name={'categoryName'} placeholder={'categoryName'}
                       ref={register({required: "카테고리 이름은 필수 조건입니다."})}/>
                <div className={'my-1'}>
                    <input type={'file'} name={'file'} accept={'image'} ref={register({required: true})}/>
                </div>
                <Button canClick={formState.isValid} loading={uploading} actionText={'Create Restaurant'}/>
                {data?.createRestaurant?.error && <FormError errorMessage={data.createRestaurant.error}/>}
            </form>


        </div>
    )
}