import {gql, useLazyQuery} from "@apollo/client";
import React, {useEffect} from "react";
import {Helmet} from "react-helmet-async";
import {useHistory, useLocation} from "react-router-dom";
import {RESTAURANT_FRAGMENT} from "../../fragments";
import {
    searchRestaurant,
    searchRestaurantVariables,
} from "../../__generated__/searchRestaurant";
import {Restaurant} from "../../components/restaurant";

const SEARCH_RESTAURANT = gql`
    query searchRestaurant($input: SearchRestaurantInput!) {
        searchRestaurant(input: $input) {
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
`;

export const Search = () => {
    const location = useLocation();
    const history = useHistory();
    const [callQuery, {data}] = useLazyQuery<searchRestaurant,
        searchRestaurantVariables>(SEARCH_RESTAURANT);
    useEffect(() => {
        const [_, queryString] = location.search.split("?term=");
        const [query, page] = queryString.split("?page=");
        if (!queryString || isNaN(Number(page))) {
            return history.replace("/");
        }


        callQuery({
            variables: {
                input: {
                    page: Number(page),
                    query: decodeURI(query)
                },
            },
        });
    }, [history, location]);


    return (
        <div>
            <Helmet>
                <title>Search | Nuber Eats</title>
            </Helmet>
            <div className={'max-w-screen-xl mx-auto mt-8'}>
                <div className={'grid md:grid-cols-3 grid-rows-1 gap-x-5 gap-y-10'}>
                    {
                        data?.searchRestaurant?.restaurants?.map((restaurant) => {
                            return (
                                <Restaurant
                                    key={restaurant.id}
                                    id={restaurant.id + ""}
                                    coverImg={restaurant.coverImg}
                                    name={restaurant.name}
                                    categoryName={restaurant.category?.name}
                                />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
};