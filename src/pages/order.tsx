import React, {useEffect} from 'react';
import {useParams} from "react-router-dom";
import {gql} from "@apollo/client/core";
import {useQuery} from "@apollo/client";
import {getOrder, getOrderVariables} from "../__generated__/getOrder";


const GET_ORDER = gql`
    query getOrder($input : GetOrderInput!) {
        getOrder(input : $input) {
            ok
            error
            order {
                id
                status
                total
                driver {
                    email
                }
                customer {
                    email
                }
                restaurant {
                    name
                }
            }
        }
    }
`


interface IOrder {

}


interface IParams {
    id: string
}


export const Order: React.FC<IOrder>
    = ({}) => {


    const params = useParams<IParams>();
    const {data} = useQuery<getOrder, getOrderVariables>(GET_ORDER, {
        variables: {
            input: {
                id: +params.id
            }
        }
    });

    useEffect(() => {
        console.log(data , "this is DAta")
    },[data])

    return (

        <div className={'w-full'}>

        </div>

    )
}