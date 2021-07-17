import React, {useEffect} from 'react';
import {useParams} from "react-router-dom";
import {gql} from "@apollo/client/core";
import {useQuery, useSubscription} from "@apollo/client";
import {getOrder, getOrderVariables} from "../__generated__/getOrder";
import {Helmet} from "react-helmet-async";
import {FULL_ORDER_FRAGMENT} from "../fragments";
import {orderUpdates, orderUpdatesVariables} from "../__generated__/orderUpdates";
import {useMe} from "../hooks/useMe";


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


interface IOrder {

}


interface IParams {
    id: string
}


export const Order: React.FC<IOrder> = () => {


    const addComma = (price: any) => {
        return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    const params = useParams<IParams>();
    const {data : userData} = useMe();
    const {data , subscribeToMore} = useQuery<getOrder, getOrderVariables>(GET_ORDER, {
        variables: {
            input: {
                id: +params.id
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
                    {
                        subscriptionData : {data},
                    } : {subscriptionData : {data : orderUpdates}}
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
                {userData?.me.role === 'Client' &&
                    <div className={'w-full flex flex-col justify-center items-center'} style={{'maxWidth': '600px'}}>
                        <span className={'w-11/12 text-lime-600 text-center text-lg py-4'}>Status : {data?.getOrder.order?.status}</span>
                    </div>
                }
                {userData?.me.role === "Owner" && (
                    <>
                        {data?.getOrder.order?.status === "Pending" && (
                            <div className={'w-full flex flex-col justify-center items-center px-3'} style={{'maxWidth': '600px'}}>
                                <button className={'w-full text-center my-3 text-white rounded-md hover:bg-lime-600 py-2 px-3 bg-lime-400'}>Accept Order</button>
                            </div>
                        )}
                        {data?.getOrder.order?.status === "Cooking" && (
                            <div className={'w-full flex flex-col justify-center items-center px-3'} style={{'maxWidth': '600px'}}>
                                <button className={'w-full text-center my-3 text-white rounded-md hover:bg-lime-600 py-2 px-3 bg-lime-400'}>Order Cooked</button>
                            </div>
                        )}
                    </>
                )}

            </div>


        </div>


    )
}