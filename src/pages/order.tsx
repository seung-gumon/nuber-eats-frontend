import React, {useEffect} from 'react';
import {useParams} from "react-router-dom";
import {gql} from "@apollo/client/core";
import {useMutation, useQuery} from "@apollo/client";
import {getOrder, getOrderVariables} from "../__generated__/getOrder";
import {Helmet} from "react-helmet-async";
import {FULL_ORDER_FRAGMENT} from "../fragments";
import {orderUpdates} from "../__generated__/orderUpdates";
import {useMe} from "../hooks/useMe";
import {editOrder, editOrderVariables} from "../__generated__/editOrder";
import {OrderStatus, UserRole} from "../__generated__/globalTypes";


const GET_ORDER = gql`
    query getOrder($input : GetOrderInput!) {
        getOrder(input : $input) {
            ok
            error
            order {
                ...FullOrderParts
            }
        }
    }
    ${FULL_ORDER_FRAGMENT}
`

const ORDER_SUBSCRIPTION = gql`
    subscription orderUpdates($input: OrderUpdatesInput!) {
        orderUpdates(input: $input) {
            ...FullOrderParts
        }
    }
    ${FULL_ORDER_FRAGMENT}
`;


const EDIT_ORDER = gql`
    mutation editOrder($input : EditOrderInput!) {
        editOrder(input : $input) {
            ok
            error
        }
    }
`


interface IParams {
    id: string
}


export const Order = () => {


    const addComma = (price: any) => {
        return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    const params = useParams<IParams>();
    const {data : userData} = useMe();
    const [editOrderMutation] = useMutation<editOrder, editOrderVariables>(EDIT_ORDER);
    const {data , subscribeToMore} = useQuery<getOrder, getOrderVariables>(GET_ORDER, {
        variables: {
            input: {
                id: +params.id,
            }
        }
    });

    useEffect(() => {
        if (data?.getOrder.ok) {
            subscribeToMore({
                document : ORDER_SUBSCRIPTION,
                variables : {
                    input: {
                        id: +params.id
                    },
                },
                updateQuery : (
                    prev,
                    {subscriptionData : {data},} : {subscriptionData : {data : orderUpdates}}
                ) => {
                    if (!data) return prev;
                    return {
                        getOrder : {
                            ...prev.getOrder,
                            order : {
                                ...data.orderUpdates,
                            }
                        }
                    }
                },
            })
        }
    },[data])


    const onButtonClick = (newStatus: OrderStatus) => {
        editOrderMutation({
            variables: {
                input: {
                    id: +params.id,
                    status: newStatus
                }
            }
        })
    }





    return (
        <div className={'p-2 w-full h-screen flex flex-col justify-center items-center'}
             style={{'paddingBottom': '55px'}}>
            <Helmet>
                <title>Order #{params.id} | Nuber Eats</title>
            </Helmet>
            <div className={'border w-full flex flex-col justify-center items-center'} style={{'maxWidth': '600px'}}>
                <span
                    className={'w-full text-center py-6 text-white font-bold text-lg bg-blue-900'}>주문 ID : {data?.getOrder.order?.id}</span>
                <div className={'w-full flex flex-col justify-center items-center'} style={{'maxWidth': '600px'}}>
                    <span
                        className={'w-11/12 text-center border-b-2 border-gray-500 text-lg py-7 font-bold'}>총 가격 : {addComma(data?.getOrder.order?.total)}원</span>
                </div>
                <div className={'w-full flex flex-col justify-center items-center'} style={{'maxWidth': '600px'}}>
                    <span
                        className={'w-11/12 text-left border-b-2 border-gray-500 text-lg py-4'}>음식점 : {data?.getOrder.order?.restaurant?.name}</span>
                </div>
                <div className={'w-full flex flex-col justify-center items-center'} style={{'maxWidth': '600px'}}>
                    <span
                        className={'w-11/12 text-left border-b-2 border-gray-500 text-lg py-4'}>주문자 이메일: {data?.getOrder.order?.customer?.email}</span>
                </div>
                <div className={'w-full flex flex-col justify-center items-center'} style={{'maxWidth': '600px'}}>
                    <span
                        className={'w-11/12 text-left border-b-2 border-gray-500 text-lg py-4'}>배달원 이메일: {data?.getOrder.order?.driver?.email ? data?.getOrder.order?.driver?.email : "배정 안됌"}</span>
                </div>
                {userData?.me.role === UserRole.Client &&
                    <div className={'w-full flex flex-col justify-center items-center'} style={{'maxWidth': '600px'}}>
                        <span className={'w-11/12 text-lime-600 text-center text-lg py-4'}>Status : {data?.getOrder.order?.status}</span>
                    </div>
                }
                {userData?.me.role === UserRole.Owner && (
                    <>
                        {data?.getOrder.order?.status === OrderStatus.Pending && (
                            <div className={'w-full flex flex-col justify-center items-center px-3'} style={{'maxWidth': '600px'}}>
                                <button onClick={() => onButtonClick(OrderStatus.Cooking)} className={'w-full text-center my-3 text-white rounded-md hover:bg-lime-600 py-2 px-3 bg-lime-400'}>Accept Order</button>
                            </div>
                        )}
                        {data?.getOrder.order?.status === OrderStatus.Cooking && (
                            <div className={'w-full flex flex-col justify-center items-center px-3'} style={{'maxWidth': '600px'}}>
                                <button onClick={() => onButtonClick(OrderStatus.Cooked)} className={'w-full text-center my-3 text-white rounded-md hover:bg-lime-600 py-2 px-3 bg-lime-400'}>Order Cooked</button>
                            </div>
                        )}
                        {
                            data?.getOrder.order?.status !== OrderStatus.Cooking && data?.getOrder.order?.status !== OrderStatus.Pending &&
                            <div className={'w-full flex flex-col justify-center items-center'} style={{'maxWidth': '600px'}}>
                                <span className={'w-11/12 text-lime-600 text-center text-lg py-4'}>Status : {data?.getOrder.order?.status}</span>
                            </div>
                        }
                    </>
                )}
                {userData?.me.role === UserRole.Delivery && (
                    <>
                        {data?.getOrder.order?.status === OrderStatus.Cooked && (
                            <button
                                onClick={() => onButtonClick(OrderStatus.PickedUp)}
                                className="w-11/12 text-center my-3 text-white rounded-md hover:bg-lime-600 py-2 px-3 bg-lime-400"
                            >
                                Picked Up
                            </button>
                        )}
                        {data?.getOrder.order?.status === OrderStatus.PickedUp && (
                            <button
                                onClick={() => onButtonClick(OrderStatus.Delivered)}
                                className="w-11/12 text-center my-3 text-white rounded-md hover:bg-lime-600 py-2 px-3 bg-lime-400"
                            >
                                Order Delivered
                            </button>
                        )}
                    </>
                )}
                {data?.getOrder.order?.status === OrderStatus.Delivered && (
                    <span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
              Thank you for using Nuber Eats
            </span>
                )}

            </div>


        </div>


    )
}