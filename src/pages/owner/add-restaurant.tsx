import React, {useEffect, useState} from 'react';
import {gql} from "@apollo/client/core";
import {useApolloClient, useMutation} from "@apollo/client";
import {createRestaurant, createRestaurantVariables} from "../../__generated__/createRestaurant";
import {createAccountMutationVariables} from "../../__generated__/createAccountMutation";
import {useForm} from "react-hook-form";
import {Button} from "../../components/button";
import {Helmet} from "react-helmet-async";
import {FormError} from "../../components/form-error";
import {MY_RESTAURANTS_QUERY} from "./my-restaurants";
import {useHistory} from "react-router-dom";


const CREATE_RESTAURANT_MUTATION = gql`
    mutation createRestaurant($input : CreateRestaurantInput!) {
        createRestaurant(input : $input) {
            ok
            error
            restaurantId
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

    const client = useApolloClient();
    const history = useHistory();

    const [imageUrl, setImageUrl] = useState<string>("");

    const onCompleted = async (data: createRestaurant) => {
        const {createRestaurant: {ok, error, restaurantId}} = data
        if (ok) {
            const {name, categoryName, address} = getValues();

            const queryResult = client.readQuery({query: MY_RESTAURANTS_QUERY})


            await client.writeQuery({
                query: MY_RESTAURANTS_QUERY,
                data: {
                    myRestaurant: {
                        ...queryResult.myRestaurant,
                        restaurants: [
                            {
                                address,
                                category: {
                                    name : categoryName,
                                    __typename: 'Category',
                                    __proto__: Object,
                                },
                                coverImg: imageUrl,
                                id: restaurantId,
                                isPromoted: false,
                                name,
                                __typename: "Restaurant",
                            },
                            ...queryResult.myRestaurant.restaurants
                        ]
                    }
                }
            });

            setUploading(() => false);

            alert(`"${name}"이 생성 되었습니다. 마이 페이지로 이동합니다.`)
            return history.push("/");

        } else {
            return alert(error);
        }
    }


    const [createRestaurantMutation, {
        loading,
        data
    }] = useMutation<createRestaurant, createRestaurantVariables>(CREATE_RESTAURANT_MUTATION, {
        onCompleted,
    });


    const {register, getValues, formState, errors, handleSubmit} = useForm<IFormProps>({
        mode: "onChange"
    });

    const [uploading, setUploading] = useState(false);

    const onSubmit = async () => {
        try {
            setUploading(true)
            const {file, name, categoryName, address} = getValues();
            const actualFile = file[0];
            const formBody = new FormData();
            formBody.append('file', actualFile)
            const {url: coverImg} = await (await fetch("https://reverent-wozniak-6334ad.netlify.app/", {
                method: "POST",
                body: formBody
            })).json();

            setImageUrl(() => coverImg);

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
                       ref={register({required: "이름은 필수 조건입니다.", minLength: 5})}/>
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