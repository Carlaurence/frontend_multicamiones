import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


export default class CarouselFooter extends Component {

    render() {

        const settings = {dots: true,
            infinite: true, 
            speed: 4000, 
            autoplay: true, 
            autoplaySpeed: 1000, 
            pauseOnHover: true,
            slidesToShow: 4,
            slidesToScroll: 1,
            cssEase: "linear"
        };

        const images = [
            "https://res.cloudinary.com/depcjbb7q/image/upload/v1689654085/logo-wolksvagen-130x58_vtikk8.png",
            "https://res.cloudinary.com/depcjbb7q/image/upload/v1689654085/logo-jac-130x58_ilrkaf.png",
            "https://res.cloudinary.com/depcjbb7q/image/upload/v1689654084/logo-hyundai-130x58_q6iqb3.png",
            "https://res.cloudinary.com/depcjbb7q/image/upload/v1689654084/logo-chevrolet-130x58_r4joxd.png",
            "https://res.cloudinary.com/depcjbb7q/image/upload/v1689654084/logo-foton-130x58_espwcs.png"
        ]

        return (
                <div className="w-[80%] h-35 py-4">{/*DEFINE LAS DIMENSIONES L*H DEL CUADRO DONDE SE MUESTRA EL CAROUSEL*/}
                    <Slider {...settings}>
                        {images.map((img, index) => (
                            <div key={img}>
                                <img src={img} alt="imagen 1" className=" h-35 w-40"></img>
                            </div>
                        ))}
                    </Slider>
                </div>
        );
    }
}
