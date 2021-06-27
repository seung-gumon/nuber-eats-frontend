import React, {useEffect} from 'react';
import {useParams, Link} from "react-router-dom";
import {gql, useQuery} from "@apollo/client";
import {RESTAURANT_FRAGMENT} from "../../fragments";
import {restaurant, restaurantVariables} from "../../__generated__/restaurant";
import {Helmet} from "react-helmet-async";


const RESTAURANT = gql`
    query restaurant($input : RestaurantInput!) {
        restaurant(input : $input) {
            ok
            error
            restaurant {
                ...RestaurantParts
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
`

interface IParams {
    id: string
}


export const Restaurant = () => {

    const {id} = useParams<IParams>();

    const {data} = useQuery<restaurant, restaurantVariables>(RESTAURANT, {
        variables: {
            input: {
                restaurantId: +id
            }
        }
    })

    return (
        <div className={'bg-gray-800 bg-center bg-cover py-48'} style={{'backgroundImage': `url(${data?.restaurant.restaurant?.coverImg})`}}>
            <Helmet>
                <title>{data?.restaurant.restaurant?.name ? `${data.restaurant.restaurant.name} | Restaurant` : "Restaurant"}</title>
            </Helmet>
            <div className={'bg-white w-3/12 py-4 pl-48'}>
                <h4 className={'text-3xl mb-3'}>{data?.restaurant.restaurant?.name}</h4>
                <Link to={`/category/${data?.restaurant.restaurant?.category?.id}`}>
                    <h5 className={'text-sm font-light mb-2'}>{data?.restaurant.restaurant?.category?.name}</h5>
                </Link>
                <h6 className={'text-sm font-light'}>{data?.restaurant.restaurant?.address}</h6>
            </div>
        </div>
    )
}