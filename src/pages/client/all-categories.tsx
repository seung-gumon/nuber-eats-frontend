import React from 'react'
import {gql, useQuery} from "@apollo/client";
import {allCategoriesQuery} from "../../__generated__/allCategoriesQuery";
import {Link} from 'react-router-dom';


const ALL_CATEGORIES = gql`
    query allCategoriesQuery {
        allCategories {
            ok
            error
            categories {
                id
                name
                coverImg
                slug
            }
        }
    }
`;


export const AllCategories = () => {

    const {data} = useQuery<allCategoriesQuery>(ALL_CATEGORIES);
    return (
        <div className={'p-10 text-3xl'}>
            <h2 className={'font-bold'}>모든 카테고리</h2>
            <h4 className={'text-base text-medium mt-1'}>취향에 맞는 카테고리를 선택해보세요</h4>
            <ul className={'grid grid-cols-3 grid-rows-3 gap-2 mt-10'}>
                {data?.allCategories.categories?.map((category) => {
                    return (
                        <Link to={`category/${category.id}`}>
                            <span className={'text-lg font-medium hover:underline'}>{category.name}</span>
                        </Link>
                    )
                })}
            </ul>
        </div>
    )
}