import React from 'react';

interface IDishProps {
    description: string;
    name: string;
    price: number;
    photo: string
}


export const Dish: React.FC<IDishProps> =
    ({
         description,
         name,
         price,
         photo,
     }) => {


        const addComma = (price : number) => {
            return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }


        return (
            <div className={'px-8 py-4 border hover:border-gray-800 transition-all flex items-center'}>
                <div className={'flex flex-col  flex-1'}>
                    <h3 className={'font-medium text-xl'}>{name}</h3>
                    <h4>{description}</h4>
                    <span className={'mt-6'}>{addComma(price)}</span>
                </div>
                <div className='bg-center bg-cover' style={{'width':'150px','height':'150px',backgroundImage: `url(${photo})`}}>
                </div>
            </div>
        )
    }