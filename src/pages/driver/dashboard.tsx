import React, {useEffect, useState} from 'react';
import GoogleMapReact from 'google-map-react'


interface ICoords {
    latitude: number;
    longitude : number;
}


export const Dashboard = () => {

    const [driverCoords, setDriverCoords] = useState<ICoords>({longitude: 0, latitude: 0});

    const [map,setMap] = useState<any>();
    const [maps,setMaps] = useState<any>();

    const onSuccess = ({coords : {longitude,latitude}}: GeolocationPosition) => {
        setDriverCoords({longitude,latitude});
    }

    const onError = (error: GeolocationPositionError) => {
        console.log(error)
    }

    const onApiLoaded = ({map, maps}: { map: any, maps: any }) => {
        map.panTo(new maps.LatLng(driverCoords.latitude, driverCoords.longitude));
        setMap(map)
        setMaps(maps);
    };


    useEffect(() => {
        if (map && maps) {
            map.panTo(new maps.LatLng(driverCoords.latitude, driverCoords.longitude));
        }
    },[driverCoords.latitude , driverCoords.longitude])



    useEffect(() => {
        navigator.geolocation.watchPosition(onSuccess, onError, {
            enableHighAccuracy: true,
        })
    }, [])

    return (
        <div>
            <div className={'overflow-hidden'} style={{'width': window.innerWidth, height: "50vh"}}>
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
                    <div
                        //@ts-ignore
                        lat={driverCoords.latitude}
                        //@ts-ignore
                        lng={driverCoords.longitude}
                        className={'text-lg'}>🏍</div>
                </GoogleMapReact>
            </div>
        </div>
    )
}
