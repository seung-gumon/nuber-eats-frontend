import React from 'react';
import {gql, useQuery} from "@apollo/client";
import {DISH_FRAGMENT, ORDERS_FRAGMENT, RESTAURANT_FRAGMENT} from "../../fragments";
import {useParams} from "react-router-dom";
import {myRestaurant, myRestaurantVariables} from "../../__generated__/myRestaurant";
import {Helmet} from "react-helmet-async";
import {Link} from 'react-router-dom';
import {Dish} from "../../components/dish";
import {
    VictoryAxis,
    VictoryBar,
    VictoryChart, VictoryLabel,
    VictoryLine,
    VictoryPie,
    VictoryTheme,
    VictoryVoronoiContainer
} from 'victory';


export const MY_RESTAURANT_QUERY = gql`
    query myRestaurant($input: MyRestaurantInput!) {
        myRestaurant(input: $input) {
            ok
            error
            restaurant {
                ...RestaurantParts
                menu {
                    ...DishParts
                }
                orders {
                    ...OrderParts
                }
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
    ${DISH_FRAGMENT}
    ${ORDERS_FRAGMENT}
`;


interface IProps {
    id: string;
}


export const MyRestaurant = () => {
    const {id} = useParams<IProps>();


    const {data} = useQuery<myRestaurant, myRestaurantVariables>(MY_RESTAURANT_QUERY, {
        variables: {
            input: {
                id: +id
            }
        }
    })

    console.log(data);

    const chartData = [
        {x: 1, y: 3000},
        {x: 2, y: 4000},
        {x: 3, y: 5500},
        {x: 4, y: 3500},
        {x: 5, y: 6500},
        {x: 6, y: 8500},
        {x: 7, y: 3300},
    ]

    return (
        <div>
            <Helmet>
                <title>{data?.myRestaurant.restaurant?.name ?? 'My Restaurant'} | Nuber Eats</title>
            </Helmet>
            <div
                className="  bg-gray-700  py-28 bg-center bg-cover"
                style={{
                    backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})`,
                }}
            ></div>
            <div className="container mt-10 px-10">
                <h2 className="text-4xl font-medium mb-10">
                    {data?.myRestaurant.restaurant?.name || "Loading..."}
                </h2>
                <Link to={`/restaurant/${id}/add-dish`} className=" mr-8 text-white bg-gray-800 py-3 px-10">
                    Add Dish &rarr;
                </Link>
                <Link to={``} className=" text-white bg-lime-700 py-3 px-10">
                    Buy Promotion &rarr;
                </Link>
                <div className="mt-10">
                    {data?.myRestaurant.restaurant?.menu.length === 0 ? (
                        <h4 className="text-xl mb-5">Please upload a dish!</h4>
                    ) : (
                        <div className={'grid md:grid-cols-3 grid-rows-1 gap-x-5 gap-y-10'}>
                            {data?.myRestaurant.restaurant?.menu.map((dish) => (
                                <Dish
                                    key={dish.id}
                                    description={dish.description}
                                    name={dish.name}
                                    price={dish.price}
                                    photo={dish.photo}
                                />
                            ))
                            }
                        </div>
                    )}
                </div>
                <div className={'mt-20 mb-10'}>
                    <h4 className={'text-center text-2xl font-medium'}>Sales</h4>
                    <div className={'mt-10'}>
                        <VictoryChart height={500} width={window.innerWidth} domainPadding={50}
                                      theme={VictoryTheme.material}
                                      containerComponent={<VictoryVoronoiContainer/>}>
                            <VictoryLine
                                labels={({datum}) => `$${datum.y}`}
                                labelComponent={<VictoryLabel style={{fontSize: 30}} renderInPortal dy={-20}/>}
                                interpolation="cardinal"
                                style={{
                                    data: {
                                        strokeWidth: 5
                                    }
                                }}
                                data={
                                    data?.myRestaurant.restaurant?.orders?.map((order) => ({
                                        x: order.created_at,
                                        y: order.total
                                    }))
                                }
                            />
                            <VictoryAxis dependentAxis style={{tickLabels: {fontSize: 20, fill: "#4D7C0F"} as any}}
                                         tickFormat={(tick => `$${tick}`)}/>
                            <VictoryAxis style={{tickLabels: {fontSize: 20} as any}}
                                         tickFormat={(tick => new Date(tick).toLocaleDateString("ko"))} label={"Days"}/>
                        </VictoryChart>
                    </div>
                </div>
            </div>
        </div>

    )

}