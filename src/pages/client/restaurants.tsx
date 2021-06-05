import React from 'react'
import {gql, useQuery} from "@apollo/client";
import {restaurantsPageQuery, restaurantsPageQueryVariables} from "../../__generated__/restaurantsPageQuery";
import {faArrowCircleRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from 'react-router-dom'


const RESTAURANTS_QUERY = gql`
    query restaurantsPageQuery($input: RestaurantsInput!) {
        mainCategories {
            ok
            error
            categories {
                id
                name
                coverImg
                slug
                restaurantCount
            }
        }
        restaurants(input: $input) {
            ok
            error
            totalPages
            totalResults
            results {
                id
                name
                coverImg
                category {
                    name
                }
                address
                isPromoted
            }
        }
    }
`;


export const Restaurants = () => {

    const {data, loading} = useQuery<restaurantsPageQuery, restaurantsPageQueryVariables>(RESTAURANTS_QUERY, {
        variables: {
            input: {
                page: 1
            }
        }
    });




    return (
        <div>
            <form className={'bg-gray-800 w-full py-40 flex items-center justify-center'}>
                <input className={'input rounded-md border-0 w-3/12'} type={'Search'}
                       placeholder={'음식점 이름으로 찾기'}/>
            </form>
            {!loading &&
            <div className={'max-w-screen-sm mx-auto'}>
                <div className={'w-full text-right py-4'}>
                    <Link to={"/all-categories"}>
                    <span className={'w-full cursor-pointer'}>
                        모든 카테고리 보기<FontAwesomeIcon icon={faArrowCircleRight} className="text-base ml-1.5"/>
                    </span>
                    </Link>

                </div>
                <div className={'grid grid-cols-3 grid-rows-3 gap-2'}>
                    {data?.mainCategories.categories?.slice(0, 12).map((categories) =>
                        <div
                            key={categories.id}
                            className={'flex items-center justify-end w-full categoryBackground transition duration-250 ease-in-out transform hover:-translate-y-1 hover:scale-110 cursor-pointer'}>
                            <span className={'mx-auto font-bold text-gray-700'}>{categories.name}</span>
                            <div className={'float-right w-14 h-14 bg-cover bg-right'}
                                 style={{backgroundImage: `url(${categories.coverImg})`}}>
                            </div>
                        </div>
                    )}
                </div>

            </div>
            }
        </div>
    )
}