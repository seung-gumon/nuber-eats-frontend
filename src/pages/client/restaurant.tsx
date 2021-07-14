import React, {useEffect, useState} from 'react';
import {useParams, Link, useHistory} from "react-router-dom";
import {gql, useMutation, useQuery} from "@apollo/client";
import {DISH_FRAGMENT, RESTAURANT_FRAGMENT} from "../../fragments";
import {restaurant, restaurantVariables} from "../../__generated__/restaurant";
import {Helmet} from "react-helmet-async";
import {Dish} from "../../components/dish";
import {CreateOrderItemInput} from "../../__generated__/globalTypes";
import {DishOption} from "../../components/dish-option";
import {createOrder, createOrderVariables} from "../../__generated__/createOrder";


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
            orderId
        }
    }
`


interface IParams {
    id: string
}


export const Restaurant = () => {

    const {id} = useParams<IParams>();

    const [orderStart, setOrderStart] = useState(false);
    const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);



    const addItemToOrder = (dishId: number) => {
        if (!isSelected(dishId)) {
            setOrderItems((current) => [{dishId, options: []}, ...current])
        }
    }

    const removeFromOrder = (dishId: number) => {
        setOrderItems((current) => current.filter(dish => dish.dishId !== dishId));
    }


    const getItem = (dishId: number) => {
        return orderItems.find(order => order.dishId === dishId)
    }

    const isSelected = (dishId: number) => {
        return Boolean(getItem(dishId))
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


    const addOptionToItem = (dishId: number, optionName: string) => {
        if (!isSelected(dishId)) {
            return
        }
        const oldItem = getItem(dishId);
        if (oldItem) {
            const hasOption = Boolean(oldItem.options?.find(aOption => aOption.name === optionName))
            if (!hasOption) {
                removeFromOrder(dishId);
                return setOrderItems((current) => [{
                    dishId,
                    options: [{name: optionName}, ...oldItem.options!]
                }, ...current])
            }
        }
    }

    const getOptionFromItem = (item: CreateOrderItemInput, optionName: string) => {
        return item.options?.find(option => option.name === optionName)
    }

    const isOptionSelected = (dishId: number, optionName: string) => {
        const item = getItem(dishId);
        if (item) {
            return Boolean(getOptionFromItem(item, optionName));
        }
        return false;
    }

    const removeOptionFromItem = (dishId: number, optionName: string) => {
        if (!isSelected(dishId)) {
            return;
        }
        const oldItem = getItem(dishId);
        if (oldItem) {
            removeFromOrder(dishId);
            setOrderItems((current) => [
                {
                    dishId,
                    options: oldItem.options?.filter(
                        (option) => option.name !== optionName
                    ),
                },
                ...current,
            ]);
            return;
        }
    };

    const history = useHistory();
    const onCompleted = (data: createOrder) => {
        const {createOrder: {ok, orderId}} = data;
        if (ok) {
            alert('주문이 완료 되었습니다');
            return history.push(`/orders/${orderId}`)
        }
    }

    const [createOrderMutation , {loading : placeLoading}] = useMutation<createOrder , createOrderVariables>(CREATE_ORDER_MUTATION, {
        onCompleted
    })


    const triggerCancelOrder = () => {
        setOrderStart(false);
        setOrderItems([]);
    }


    const triggerConfirmOrder = async () => {
        if (orderItems.length === 0) {
            return alert("메뉴를 먼저 선택해주세요!")
        }

        const ok = window.confirm('주문 하시겠습니까 ?');

        if (ok) {
            await createOrderMutation({
                variables: {
                    input: {
                        restaurantId: +id,
                        items: orderItems
                    }
                }
            })
        }
    }




    useEffect(() => {
        console.log(orderItems, "Order Items")
    }, [orderItems])

    return (
        <div>
            <div className={'bg-gray-800 bg-center bg-cover py-48'}
                 style={{'backgroundImage': `url(${data?.restaurant.restaurant?.coverImg})`}}>
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
                {!orderStart &&
                    <button onClick={() => triggerStartOrder()}
                            className={`text-lg font-medium text-white py-4 focus:outline:none transition-colors bg-lime-600 hover:bg-lime-700 px-10`}>
                        Start Order
                    </button>
                }
                {orderStart &&
                    <>
                        <button onClick={triggerConfirmOrder} className={'text-lg font-medium text-white py-4 focus:outline:none transition-colors bg-lime-600 hover:bg-lime-700 px-10'}>
                            Confirm Order
                        </button>
                        <button onClick={triggerCancelOrder}
                                className={'text-lg font-medium text-white py-4 ml-3 focus:outline:none transition-colors bg-black px-10'}>
                            Cancel Order
                        </button>
                    </>
                }

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
                    >
                        {
                            dish.options?.map((option, index) => (
                                <DishOption
                                    key={index}
                                    dishId={dish.id}
                                    isSelected={isOptionSelected(dish.id, option.name)}
                                    name={option.name}
                                    extra={option.extra}
                                    addOptionToItem={addOptionToItem}
                                    removeOptionFromItem={removeOptionFromItem}
                                />
                            ))
                        }
                    </Dish>
                ))
                }
            </div>
        </div>


    )
}