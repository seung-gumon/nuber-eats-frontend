import React, {useEffect, useState} from 'react';
import GoogleMapReact from 'google-map-react'
import {gql, useMutation, useSubscription} from "@apollo/client";
import {FULL_ORDER_FRAGMENT} from "../../fragments";
import {coockedOrders} from "../../__generated__/coockedOrders";
import {Link, useHistory} from 'react-router-dom';
import {takeOrder, takeOrderVariables} from "../../__generated__/takeOrder";


const COOKED_ORDERS_MUTATION = gql`
    subscription coockedOrders {
        cookedOrders {
            ...FullOrderParts
        }
    }
    ${FULL_ORDER_FRAGMENT}
`


const TAKE_ORDER_MUTATION = gql`
    mutation takeOrder ($input : TakeOrderInput!) {
        takeOrder(input : $input) {
            ok
            error
        }
    }
`

interface ICoords {
    latitude: number;
    longitude: number;
}

interface IDriverProps extends ICoords {
    $hover?: any;
}





export const Dashboard = () => {

    const [driverCoords, setDriverCoords] = useState<ICoords>({longitude: 0, latitude: 0});

    const [map, setMap] = useState<google.maps.Map>();
    const [maps, setMaps] = useState<any>();


    const onSuccess = ({coords: {longitude, latitude}}: GeolocationPosition) => {
        setDriverCoords({longitude, latitude});
    }

    const onError = (error: GeolocationPositionError) => {
        console.log(error)
    }

    useEffect(() => {
        navigator.geolocation.watchPosition(onSuccess, onError, {
            enableHighAccuracy: true,
        })
    }, [])

    const onApiLoaded = ({map, maps}: { map: any; maps: any }) => {
        map.panTo(new google.maps.LatLng(driverCoords.latitude, driverCoords.longitude));
        setMap(map);
        setMaps(maps);
    };


    useEffect(() => {
        if (map && maps) {
            map.panTo(new google.maps.LatLng(driverCoords.latitude, driverCoords.longitude));
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({location: new google.maps.LatLng(driverCoords.latitude, driverCoords.longitude)},
                (results, status) => {
                    console.log(results[0])
                    //여기에 현재 주소 나옴
                })
        }
    }, [driverCoords.latitude, driverCoords.longitude])


    const makePath = () => {
        if (map) {
            const directionsService = new google.maps.DirectionsService();
            const directionsRenderer = new google.maps.DirectionsRenderer();
            directionsRenderer.setMap(map);
            directionsService.route(
                {
                    origin: {
                        location: new google.maps.LatLng(driverCoords.latitude, driverCoords.longitude)
                    },
                    destination: {
                        location: new google.maps.LatLng(driverCoords.latitude + 0.01, driverCoords.longitude + 0.01)
                    },
                    travelMode: google.maps.TravelMode.TRANSIT,
                }, (result) => {
                    directionsRenderer.setDirections(result);
                })
        }
    }


    const {data: cookedOrdersData} = useSubscription<coockedOrders>(COOKED_ORDERS_MUTATION);


    useEffect(() => {
        if (cookedOrdersData?.cookedOrders.id) {
            makePath();
        }
    }, [cookedOrdersData])


    const history = useHistory();
    const onCompleted = (data: takeOrder) => {
        if (data.takeOrder.ok) {
            history.push(`/orders/${cookedOrdersData?.cookedOrders.id}`)
        }
    }
    const [takeOrderMutation] = useMutation<takeOrder, takeOrderVariables>(TAKE_ORDER_MUTATION, {
        onCompleted
    })

    const triggerMutation = (orderId: number) => {
        takeOrderMutation({
            variables: {
                input: {
                    id: orderId
                }
            }
        })
    }


    if (driverCoords.latitude === 0 && driverCoords.longitude === 0) {
        return (
            <div
                className={'w-full font-semibold text-lg h-screen flex flex-col items-center justify-center'}>
                <span>Loading...</span>
            </div>
        )
    }


    return (

        <div>
            <div className={'overflow-hidden'} style={{'width': window.innerWidth, height: "50vh"}}>
                {
                    driverCoords.latitude !== 0 && driverCoords.longitude !== 0 &&
                        <GoogleMapReact
                            bootstrapURLKeys={{key: 'AIzaSyClV1z3d_sq74tbWHN-TTCN7YNyOpt3-rA'}}
                            defaultZoom={16}
                            defaultCenter={{
                                lat: 36.58,
                                lng: 125.33
                            }}
                            yesIWantToUseGoogleMapApiInternals={true}
                            onGoogleApiLoaded={onApiLoaded}
                        >
                        </GoogleMapReact>
                }
            </div>
            {cookedOrdersData?.cookedOrders ?
                <div className={'max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5'}>
                    <h1 className='text-center text-3xl font-medium'>New Cooked Order</h1>
                    <h4 className='text-center my-3 text-md font-medium'>Pick it up Soon @{cookedOrdersData?.cookedOrders.restaurant?.name}</h4>
                    <button onClick={() => triggerMutation(cookedOrdersData?.cookedOrders.id)} className={'w-full block text-center text-white rounded-md hover:bg-lime-600 py-2 px-3 bg-lime-500'}>Accept Challenge &rarr;</button>
                </div>
                :
                <div className={'max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5'}>
                    <h1 className={"font-medium"}>주문이 없습니다</h1>
                </div>
            }
        </div>
    )
}
