import React from 'react';
import GoogleMapReact from 'google-map-react'

export const Dashboard = () => {
    return (
        <div>
            <div className={'overflow-hidden'} style={{'width':window.innerWidth , height : "95vh"}}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyClV1z3d_sq74tbWHN-TTCN7YNyOpt3-rA' }}
                    defaultZoom={20}
                    defaultCenter={{
                        lat: 59.95,
                        lng: 30.33
                    }}
                >
                    <h1>Hello</h1>
                </GoogleMapReact>
            </div>
        </div>
    )
}
