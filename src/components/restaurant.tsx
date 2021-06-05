import React from 'react';

interface IRestaurant {
    coverImg: string;
    name: string;
    categoryName?: string;
    id : string
}


export const Restaurant: React.FC<IRestaurant> = ({coverImg, name, categoryName}) => {
    return (
        <div className={'py-1'}>
            <div style={{backgroundImage: `url(${coverImg})`}} className="bg-red-500 bg-cover bg-center mb-3 py-28">
            </div>
            <h3 className="text-xl font-medium px-1 md:px-0">{name}</h3>
            <span className="border-t py-2 mt-1 block w-full px-1 md:px-0 text-xs opacity-50 border-gray-400">{categoryName}</span>
        </div>
    )
}