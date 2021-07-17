import React, {useEffect, useState} from 'react';
import GoogleMapReact from 'google-map-react'


interface ICoords {
    latitude: number;
    longitude: number;
}

interface IDriverProps extends ICoords {
    $hover?: any;
}


const Driver: React.FC<IDriverProps> = ({latitude, longitude}) => <div
    //@ts-ignore
    lat={latitude}
    //@ts-ignore
    lng={longitude}
    className={'text-lg'}>🏍</div>


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


    const onGetRouteClick = () => {
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


    return (
        <div>
            <div className={'overflow-hidden'} style={{'width': window.innerWidth, height: "50vh"}}>
                {
                    driverCoords.latitude === 0 && driverCoords.longitude === 0 ?
                        <div
                            className={'w-full font-semibold text-lg h-full flex flex-col items-center justify-center'}>
                            <span>Loading...</span>
                        </div>

                        :
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
                            {/*<Driver latitude={driverCoords.latitude} longitude={driverCoords.longitude}/>*/}
                        </GoogleMapReact>
                }

            </div>
            <button onClick={onGetRouteClick}>GET ROUTE</button>
        </div>
    )
}
