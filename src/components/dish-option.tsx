import React from "react";

interface IDishOptionProps {
    isSelected: boolean;
    name: string;
    extra?: number | null;
    dishId: number;
    addOptionToItem: (dishId: number, optionName: string) => void;
    removeOptionFromItem: (dishId: number, optionName: string) => void;
}

export const DishOption: React.FC<IDishOptionProps> = ({
                                                           isSelected,
                                                           name,
                                                           extra,
                                                           addOptionToItem,
                                                           removeOptionFromItem,
                                                           dishId,
                                                       }) => {
    const onClick = () => {
        if (isSelected) {
            removeOptionFromItem(dishId, name);
        } else {
            addOptionToItem(dishId, name);
        }
    };

    const addComma = (price: any) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }


    return (
        <span
            onClick={onClick}
            className={`flex border items-center ${
                isSelected ? "border-gray-800" : ""
            }`}
        >
      <h6 className="mr-2">{name}</h6>
            {extra && <h6 className="text-sm opacity-75">({addComma(extra)})</h6>}
    </span>
    );
};