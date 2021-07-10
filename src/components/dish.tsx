import React from 'react';
import {
    restaurant_restaurant_restaurant_menu_options,
} from "../__generated__/restaurant";

interface IDishProps {
    id ?: number,
    description: string;
    name: string;
    price: number;
    photo: string;
    isCustomer?: boolean;
    options ?: restaurant_restaurant_restaurant_menu_options[] | null;
    orderStarted ?: boolean
    addItemToOrder ?: (dishId : number) => void;
    isSelected ?: boolean;
    removeFromOrder ?: (dishId : number) => void;
}


export const Dish: React.FC<IDishProps> =
    ({
         id = 0,
         description,
         name,
         price,
         photo,
         isCustomer = false,
         options,
         orderStarted = false,
         addItemToOrder,
         isSelected,
         removeFromOrder
     }) => {


        const addComma = (price: any) => {
            return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }

        const onClick = () => {
            if (orderStarted) {
                if (!isSelected && addItemToOrder) {
                    return addItemToOrder(id);
                }
                if (isSelected && removeFromOrder) {
                    return removeFromOrder(id);
                }
            }
        }

        return (
            <div onClick={() => onClick()} className={`px-8 py-4 border hover:border-gray-800 transition-all flex items-center ${isSelected ? "border-gray-800" : "cursor-pointer hover:border-gray-800"}`}>

                <div className={'flex flex-col  flex-1'}>
                    <h3 className={'font-medium text-xl'}>{name}</h3>
                    <h4 className={'font-base text-sm'}>{description}</h4>
                    <span className={'mt-6'}>가격 : {addComma(price)}원</span>
                    {isCustomer && options && options?.length !== 0 && (
                        <div className={'overflow-y-hidden'} style={{'maxHeight':'130px'}}>
                            <h5 className={'my-2 font-medium'}>Dish Options</h5>
                            {
                                options?.map((option,index) => (
                                    <div className={'flex items-center'} key={index}>
                                        <h6 className={'mr-2'}>{option.name}</h6>
                                        <h6 className={'text-sm opacity-75'}>{addComma(option?.extra)}원</h6>
                                    </div>
                                ))
                            }
                        </div>
                    )}

                </div>
                <div className='bg-center bg-cover' style={{'width':'150px','height':'150px',backgroundImage: `url(${photo})`}}>
                </div>



            </div>
        )
    }