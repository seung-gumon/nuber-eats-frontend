import React, {useEffect} from 'react';
import {useLocation, useHistory} from 'react-router-dom';
import {Helmet} from "react-helmet-async";
import {gql, useLazyQuery} from "@apollo/client";
import {RESTAURANT_FRAGMENT} from "../../fragments";
import {searchRestaurant, searchRestaurantVariables} from "../../__generated__/searchRestaurant";


export const Search = () => {


    const SEARCH_RESTAURANT = gql`
        query searchRestaurant ($input : SearchRestaurantInput!){
            searchRestaurant(input : $input) {
                ok
                error
                totalPages
                totalResults
                restaurants {
                    ...RestaurantParts
                }
            }
        }
        ${RESTAURANT_FRAGMENT}
    `

    const location = useLocation();
    const history = useHistory();


    const [queryReadyToStart, {
        loading,
        data
    }] = useLazyQuery<searchRestaurant, searchRestaurantVariables>(SEARCH_RESTAURANT)

    useEffect(() => {
        const [_, query] = location.search.split("?term=");

        if (!query) {
            return history.replace("/");
        }

        queryReadyToStart({
            variables: {
                input: {
                    page: 1,
                    query
                }
            }
        })

    }, [history, location])


    return (
        <div>
            <Helmet>
                <title>Search | Nuber Eats</title>
                <h1>Search Page</h1>
            </Helmet>
        </div>
    )
}