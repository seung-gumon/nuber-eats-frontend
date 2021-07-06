import React, {useState} from 'react';
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
}


export const AddDish = () => {

    const history = useHistory();
    const {restaurantId} = useParams<IParams>()
    const {register, getValues, errors, handleSubmit, formState , setValue} = useForm<IForm>({mode: "onChange"});
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


    const onSubmit = async () => {
        const {name, price, description , ...rest} = getValues();

        await createDishMutation({
            variables: {
                input: {
                    restaurantId: +restaurantId,
                    name,
                    price : +price,
                    description
                }
            }
        });
    }


    const [optionsNumber , setOptionsNumber] = useState(0);


    const onAddOptionClick = () => {
        setOptionsNumber((current) => current + 1)
    }

    const onDeleteClick = (idToDelete : number) => {
        setOptionsNumber((current) => current-1);
        // @ts-ignore
        setValue(`${idToDelete}-optionName`, "")
        // @ts-ignore
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
                    {optionsNumber !== 0 && (
                        Array.from(new Array(optionsNumber)).map((_,index) => (
                            <div key={index} className={'mt-5'}>
                                <input ref={register} name={`${index}OptionName`} className={'py-2 px-4 mr-3 focus:outline-none focus:border-gray-800 border-2'} type={'text'} placeholder={'Option Name'}/>
                                <input ref={register} name={`${index}OptionExtra`} className={'py-2 px-4 focus:outline-none focus:border-gray-800 border-2'} type={'number'} min={0} placeholder={'Option Extra'}/>
                                <span onClick={() => onDeleteClick(index)}>Delete Option</span>
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
                    canClick={formState.isValid}
                    actionText="Create Dish"
                />
            </form>
        </div>
    );
}