import React, {useEffect, useState} from 'react';
import {useParams , useHistory} from "react-router-dom";
import {gql, useMutation} from "@apollo/client";
import {createDish, createDishVariables} from "../../__generated__/createDish";
import {useForm} from "react-hook-form";
import {Helmet} from "react-helmet-async";
import {Button} from "../../components/button";
import {MY_RESTAURANT_QUERY} from "./my-restaurant";


const CREATE_DISH_MUTATION = gql`
    mutation createDish($input: CreateDishInput!) {
        createDish(input: $input) {
            ok
            error
        }
    }
`;


interface IParams {
    restaurantId: string
}

interface IForm {
    name : string;
    price : string;
    description : string
    [Key:string] : string;
}


export const AddDish = () => {


    const [uploading, setUploading] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>("");

    const history = useHistory();
    const {restaurantId} = useParams<IParams>()
    const {watch,register, getValues, errors, handleSubmit, formState, setValue} = useForm<IForm>(
        {mode: "onChange"}
    );



    const [createDishMutation, {loading}] = useMutation<createDish, createDishVariables>(CREATE_DISH_MUTATION, {
        onCompleted: () => {
            alert("메뉴가 생성 되었습니다.");
            return history.goBack();
        },
        refetchQueries: [{
            query: MY_RESTAURANT_QUERY, variables: {
                input: {
                    id: +restaurantId
                }
            }
        }]
    })


    const uploadDishImage = async () => {

        try{
            setUploading(true);
            const {file} = getValues();

            const dishFile = file[0];
            const formBody = new FormData();


            formBody.append('file', dishFile)
            const {url: dishImage} = await (await fetch("https://reverent-wozniak-6334ad.netlify.app/uploads/", {
                method: "POST",
                body: formBody
            })).json();

            setImageUrl(() => dishImage);
            setUploading(false);

        }catch{
            return alert('새로고침후 다시 올려주세요.');
        }
    }


    const onSubmit = async () => {

        try{

            const {file, name, price, description, ...rest} = getValues();
            const optionObject = optionsNumber.map(theId => ({
                name: rest[`${theId}-optionName`],
                extra: +rest[`${theId}-optionExtra`]
            }));


            await createDishMutation({
                variables: {
                    input: {
                        name,
                        price: +price,
                        description,
                        restaurantId: +restaurantId,
                        options: optionObject,
                        photo : imageUrl
                    }
                }
            });
        }catch (e) {

        }

    }


    const [optionsNumber , setOptionsNumber] = useState<number[]>([]);


    const onAddOptionClick = () => {
        setOptionsNumber((current) => [Date.now() , ...current]);
    }

    const onDeleteClick = (idToDelete : number) => {
        setOptionsNumber((current) => current.filter((id) => id !== idToDelete));

        setValue(`${idToDelete}-optionName`, "")
        setValue(`${idToDelete}-optionExtra`, "")
    }



    return (
        <div className="container flex flex-col items-center mt-52">
            <Helmet>
                <title>Add Dish | Nuber Eats</title>
            </Helmet>


            <h4 className="font-semibold text-2xl mb-3">Add Dish</h4>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
            >
                <h4 className={'font-medium text-lg'}>Upload Dish Images</h4>
                {
                    uploading ?
                        <span className={'font-bold'}>Loading...</span>
                        :
                        <input className={'my-3 mb-0'}
                               type={'file'}
                               name={'file'}
                               accept={'image'}
                               onChange={() => uploadDishImage()}
                               ref={register()}
                        />
                }

                {!imageUrl ?
                    <span>Please Upload Dish Image</span>
                :
                    <div className={'my-3'} style={{'width':'300px'}}>
                        <img src={imageUrl} alt={'DishImage'}/>
                    </div>
                }
                <input
                    className="input"
                    type="text"
                    name="name"
                    placeholder="Name"
                    ref={register({ required: "Name is required." })}
                />
                <input
                    className="input"
                    type="number"
                    name="price"
                    min={0}
                    placeholder="Price"
                    ref={register({ required: "Price is required." })}
                />
                <div className={'my-10'}>
                    <h4 className={'font-medium mb-3 text-lg'}>Dish Option</h4>
                    <span
                        onClick={onAddOptionClick}
                        className={'cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5'}
                    >
                        Add Dish Option
                    </span>
                    {optionsNumber.length !== 0 && (
                        optionsNumber.map((id) => (
                            <div key={id} className={'mt-5'}>
                                <input ref={register} name={`${id}-optionName`}
                                       className={'py-2 px-4 mr-3 focus:outline-none focus:border-gray-800 border-2'}
                                       type={'text'} placeholder={'Option Name'}/>
                                <input ref={register} name={`${id}-optionExtra`}
                                       className={'py-2 px-4 focus:outline-none focus:border-gray-800 border-2'}
                                       type={'number'} min={0} placeholder={'Option Extra'}/>
                                <span className={'cursor-pointer py-2 text-white bg-red-500 py-1 px-2 mt-5 ml-3'} onClick={() => onDeleteClick(id)}>Delete Option</span>
                            </div>
                        ))
                    )
                    }
                </div>
                <input
                    className="input"
                    type="text"
                    name="description"
                    placeholder="Description"
                    ref={register({ required: "Description is required." })}
                />
                <Button
                    loading={loading}
                    canClick={formState.isValid && Boolean(imageUrl)}
                    actionText="Create Dish"
                />
            </form>
        </div>
    );
}