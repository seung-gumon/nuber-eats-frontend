import React, {useEffect, useState} from 'react';
import {useParams, Link} from "react-router-dom";
import {gql, useQuery} from "@apollo/client";
import {DISH_FRAGMENT, RESTAURANT_FRAGMENT} from "../../fragments";
import {restaurant, restaurantVariables} from "../../__generated__/restaurant";
import {Helmet} from "react-helmet-async";
import {Dish} from "../../components/dish";
import {CreateOrderItemInput} from "../../__generated__/globalTypes";


const RESTAURANT = gql`
    query restaurant($input : RestaurantInput!) {
        restaurant(input : $input) {
            ok
            error
            restaurant {
                ...RestaurantParts
                menu {
                    ...DishParts
                }
            }
            
        }
    }
    ${RESTAURANT_FRAGMENT}
    ${DISH_FRAGMENT}
`


const CREATE_ORDER_MUTATION = gql`
    mutation createOrder($input: CreateOrderInput!) {
        createOrder(input : $input) {
            ok
            error
        }
    }
`


interface IParams {
    id: string
}


export const Restaurant = () => {

    const {id} = useParams<IParams>();

    const [orderStart , setOrderStart] = useState(false);
    const [orderItems , setOrderItems] = useState<CreateOrderItemInput[]>([]);


    const addItemToOrder = (dishId : number) => {
        if (!isSelected(dishId)) {
            setOrderItems((current) => [{dishId},...current])
        }
    }

    const removeFromOrder= (dishId : number) => {
        setOrderItems((current) => current.filter(dish => dish.dishId !== dishId));
    }


    const isSelected = (dishId : number) => {
        return Boolean(orderItems.find(order => order.dishId === dishId))
    }

    const {data} = useQuery<restaurant, restaurantVariables>(RESTAURANT, {
        variables: {
            input: {
                restaurantId: +id
            }
        }
    })

    const triggerStartOrder = () => {
        setOrderStart(() => true);
    }




    return (
        <div>
            <div className={'bg-gray-800 bg-center bg-cover py-48'} style={{'backgroundImage': `url(${data?.restaurant.restaurant?.coverImg})`}}>
                <Helmet>
                    <title>{data?.restaurant.restaurant?.name ? `${data.restaurant.restaurant.name} | Nuber-Eats` : "Restaurant"}</title>
                </Helmet>
                <div className={'bg-white w-3/12 py-4 pl-48'}>
                    <h4 className={'text-3xl mb-3'}>{data?.restaurant.restaurant?.name}</h4>
                    <Link to={`/category/${data?.restaurant.restaurant?.category?.id}`}>
                        <h5 className={'text-sm font-light mb-2'}>{data?.restaurant.restaurant?.category?.name}</h5>
                    </Link>
                    <h6 className={'text-sm font-light'}>{data?.restaurant.restaurant?.address}</h6>
                </div>
            </div>
            <div className={'px-10 mt-10'}>
                <button onClick={() => triggerStartOrder()} className={`text-lg font-medium text-white py-4 focus:outline:none transition-colors bg-lime-600 hover:bg-lime-700 px-10`}>
                    {orderStart ? "Ordering" : "Start Order"}
                </button>
            </div>


            <div className={'px-10 mt-10 grid md:grid-cols-3 grid-rows-1 gap-x-5 gap-y-10'}>
                {data?.restaurant.restaurant?.menu.map((dish) => (
                    <Dish
                        isSelected={isSelected(dish.id)}
                        id={dish.id}
                        orderStarted={orderStart}
                        key={dish.id}
                        description={dish.description}
                        name={dish.name}
                        price={dish.price}
                        photo={dish.photo}
                        isCustomer={true}
                        options={dish.options}
                        addItemToOrder={addItemToOrder}
                        removeFromOrder={removeFromOrder}
                    />
                ))
                }
            </div>
        </div>


    )
}