import React from 'react';
import {gql, useQuery} from "@apollo/client";
import {DISH_FRAGMENT, RESTAURANT_FRAGMENT} from "../../fragments";
import {useParams} from "react-router-dom";
import {myRestaurant, myRestaurantVariables} from "../../__generated__/myRestaurant";
import {Helmet} from "react-helmet-async";
import {Link} from 'react-router-dom';


export const MY_RESTAURANT_QUERY = gql`
    query myRestaurant($input: MyRestaurantInput!) {
        myRestaurant(input: $input) {
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
`;


interface IProps {
    id: string;
}


export const MyRestaurant = () => {
    const {id} = useParams<IProps>();


    const {data} = useQuery<myRestaurant, myRestaurantVariables>(MY_RESTAURANT_QUERY, {
        variables: {
            input: {
                id: +id
            }
        }
    })


    return (
        <div>
            <div
                className="  bg-gray-700  py-28 bg-center bg-cover"
                style={{
                    backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})`,
                }}
            ></div>
            <div className="container mt-10 px-10">
                <h2 className="text-4xl font-medium mb-10">
                    {data?.myRestaurant.restaurant?.name || "Loading..."}
                </h2>
                <Link to={`/restaurant/${id}/add-dish`} className=" mr-8 text-white bg-gray-800 py-3 px-10">
                    Add Dish &rarr;
                </Link>
                <Link to={``} className=" text-white bg-lime-700 py-3 px-10">
                    Buy Promotion &rarr;
                </Link>
                <div className="mt-10">
                    {data?.myRestaurant.restaurant?.menu.length === 0 ? (
                        <h4 className="text-xl mb-5">Please upload a dish!</h4>
                    ) : null}
                </div>
            </div>
        </div>

    )

}