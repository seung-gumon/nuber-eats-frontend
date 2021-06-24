import React, {useState} from 'react'
import {gql, useQuery} from "@apollo/client";
import {restaurantsPageQuery, restaurantsPageQueryVariables} from "../../__generated__/restaurantsPageQuery";
import {faArrowCircleRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link, useHistory} from 'react-router-dom'
import {MainCategory} from "../../components/main-category";
import {Restaurant} from "../../components/restaurant";
import {useForm} from "react-hook-form";
import {Helmet} from "react-helmet-async";
import {CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT} from "../../fragments";


const RESTAURANTS_QUERY = gql`
    query restaurantsPageQuery($input: RestaurantsInput!) {
        mainCategories {
            ok
            error
            categories {
                ...CategoryParts
            }
        }
        restaurants(input: $input) {
            ok
            error
            totalPages
            totalResults
            results {
                ...RestaurantParts
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
    ${CATEGORY_FRAGMENT}
`;

interface IFormProps {
    searchTerm: string;
}


export const Restaurants = () => {


    const [page, setPage] = useState<number>(1);

    const {data, loading} = useQuery<restaurantsPageQuery, restaurantsPageQueryVariables>(RESTAURANTS_QUERY, {
        variables: {
            input: {
                page
            }
        }
    });

    const onNextPageClick = () => setPage(currentPage => currentPage + 1);
    const onPrevPageClick = () => setPage(currentPage => currentPage - 1);


    const {register, handleSubmit, getValues} = useForm();

    const history = useHistory();

    const onSearchSubmit = () => {
        const {searchTerm} = getValues();

        return history.push({
            pathname: "/search",
            search: `?term=${searchTerm}`
        })
    }


    return (
        <div>
            <Helmet>
                <title>Home | Nuber Eats</title>
            </Helmet>
            <form onSubmit={handleSubmit(onSearchSubmit)}
                  className={'bg-gray-800 w-full py-40 flex items-center justify-center'}>
                <input
                    name={'searchTerm'}
                    ref={register({required: true, min: 3})}
                    className={'input rounded-md border-0 md:w-3/12 w-3/4'}
                    type={'Search'}
                    placeholder={'음식점 이름으로 찾기'}/>
            </form>
            {!loading &&
            <>
                <div className={'max-w-screen-sm mx-auto md:px-0 px-3'}>
                    <div className={'w-full text-right py-4'}>
                        <Link to={"/all-categories"}>
                    <span className={'w-full cursor-pointer'}>
                        모든 카테고리 보기<FontAwesomeIcon icon={faArrowCircleRight} className="text-base ml-1.5"/>
                    </span>
                        </Link>

                    </div>
                    <div className={'grid grid-cols-3 grid-rows-3 gap-2'}>
                        {data?.mainCategories.categories?.slice(0, 12).map((category) =>
                            <MainCategory
                                key={category.id}
                                category={category}
                            />
                        )}
                    </div>
                </div>

                <div className={'max-w-screen-xl mx-auto mt-8'}>
                    <div className={'grid md:grid-cols-3 grid-rows-1 gap-x-5 gap-y-10'}>
                        {
                            data?.restaurants.results?.map((restaurant) => {
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
                    <div className={'flex justify-center items-center mt-10'}>
                        {page > 1 &&
                        <button onClick={onPrevPageClick}
                                className={'focus:outline-none font-medium text-2xl'}>&larr;</button>
                        }
                        <span className={'mx-5'}>
                           page {page} of {data?.restaurants.totalPages}
                        </span>
                        {
                            page !== data?.restaurants.totalPages &&
                            <button onClick={onNextPageClick}
                                    className={'focus:outline-none font-medium text-2xl'}>&rarr;</button>
                        }

                    </div>
                </div>

            </>

            }
        </div>
    )
}