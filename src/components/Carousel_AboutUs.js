//npm install react-slick --save
//npm install slick-carousel --save
import React, { Component, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";//SON OBLIGATORIOS PARA USAR react-slick
import "slick-carousel/slick/slick-theme.css";//SON OBLIGATORIOS PARA USAR react-slick
import './Styles.css';//PARA PONER TRANSPARENTE LOS SLICK-ARROWS

export default class CarouselAboutUs extends Component {

    render() {
        const settings = {
            dots: true,
            infinite: true,
            speed: 2000,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 5000,
            pauseOnHover: true
        };

        const images = this.props.images;//ESTOS PROPS VIENE LAS IMAGENES DESDE EL COMPONENTE <ABOUT_US> 
        //console.log(images)
        
        //NOTA IMPORTANTE:
        /**
         * Para la relación de aspecto predeterminada de 16:9, codifica en las siguientes resoluciones: 
         * 4320p (8K): 7680 × 4320. 
         * 2160p (4K): 3840 × 2160. 
         * 1440p (2K): 2560 × 1440.
         * REGULAR: 1920 x 1080.
         * REGULAR: 1280 x 720.
         * CONCLUSION: 16/9 = FACTOR 1.78 => POR CADA 1.78 DE ANCHO, REQUIERE 1 DE ALTO 
         */
        //lg:w-[1000px] lg:h-[562px] md:w-[820px] md:h-[460px] sm:w-[400px] sm:h-[225px]
        //
        return (
                <Slider {...settings}>
                    {images.map((image, index) => (
                        <div key={index}>
                            <img src={image} alt="images_AboutUs" className="aspect-square"></img>
                        </div>
                    ))}
                </Slider>        
        );
    }
}