import React from "react";
import GoogleMapReact from 'google-map-react';

const Marcador = () => 
    <div className="text-red-600 text-4xl"><ion-icon name="location"></ion-icon></div>;

export default function SimpleMap() {

    const defaultProps = {
        center: {
            lat: 3.469515222112361,
            lng: -76.51836179147858
        },
        zoom: 17
    };

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyDFePY1l_INLcZoL7JbNOGdeYq7-NV5484" }}
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
            >
                <Marcador
                    lat={3.469726272492303}
                    lng={-76.51857147490902}
                    text="My Marker"
                >

                </Marcador>
            </GoogleMapReact>
        </div>
    );
}