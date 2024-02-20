//npm install react-slick --save
//npm install slick-carousel --save
import React, { Component, useState } from "react";
/**REACT SLICK */
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";//SON OBLIGATORIOS PARA USAR react-slick
import "slick-carousel/slick/slick-theme.css";//SON OBLIGATORIOS PARA USAR react-slick
import './Styles.css';//PARA PONER TRANSPARENTE LOS SLICK-ARROWS

export default class CarouselTruck extends Component {

    render() {
        
        const settings = {

            customPaging: function(i) {
                
                return (
                  <div className="border-[2px] border-white">
                    <img className="aspect-[4/3]" src={`${truckImages[i].secure_url}`} />
                  </div>
                );

            },

            dots: true,
            dotsClass: "slick-dots slick-thumb",
            infinite: true,
            speed: 2000,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 5000,
            pauseOnHover: true
        };

        //ESTOS PROPS VIENEN DESDE EL COMPONENTE <HOME>
        const truckImages = this.props.truck.images
        //console.log(truckImages)

        return (
            <Slider {...settings}>
                {truckImages.map((image, index) => (
                    <div key={index}>
                        <img src={image.secure_url} alt="imagen 1" className="aspect-[5/4] "></img>
                    </div>
                ))}
            </Slider>
        );
    }
}

/** <img src={baseUrl + "/abstract04.jpg"} /> */