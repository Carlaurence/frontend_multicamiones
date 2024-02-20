import React, { Component } from "react";
import GoogleMapReact from 'google-map-react';

export default class Maps extends Component {
    render() {
        //apiKey={"AIzaSyDFePY1l_INLcZoL7JbNOGdeYq7-NV5484"}
        return (
            <div className="container">
                <GoogleMapReact
                    
                    bootstrapURLKeys={{key: "AIzaSyDFePY1l_INLcZoL7JbNOGdeYq7-NV5484"}}
                    style={{ height: "100px", width: "100px" }}
                    zoom={18}
                    center={{lat: 3.46952,lng: -76.51829}}
                    markers={[{address: "address1", lat: 3.46952, lng: -76.51829}]}
                />
            </div>
        )
    }
}


