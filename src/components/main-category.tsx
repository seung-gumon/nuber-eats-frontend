import React from 'react';
import {
    restaurantsPageQuery_mainCategories_categories
} from "../__generated__/restaurantsPageQuery";

interface IMainCategory {
    category: restaurantsPageQuery_mainCategories_categories
}


export const MainCategory: React.FC<IMainCategory> = ({category}) => {
    return (
        <div
            key={category.id}
            className={'flex items-center justify-end w-full categoryBackground transition duration-250 ease-in-out transform hover:-translate-y-1 hover:scale-110 cursor-pointer'}>
            <span className={'mx-auto font-bold text-gray-700'}>{category.name}</span>
            <div className={'float-right w-14 h-14 bg-cover bg-right'}
                 style={{backgroundImage: `url(${category.coverImg})`}}>
            </div>
        </div>
    )
}