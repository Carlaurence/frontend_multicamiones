//npm install react-slick --save
//npm install slick-carousel --save
import React from "react";
import CarouselFooter from "./CarouselFooter";
import Logo from "../assets/images/Logo-Sin-Fondo.png"
/**REACT ICONS*/
import { BsTelephonePlusFill, BsEnvelopeAtFill } from "react-icons/bs";
import { FaLocationDot, FaSquareWhatsapp, FaSquareInstagram, FaSquareFacebook } from "react-icons/fa6";

const Footer = () => {

    return (
        
            <div className="relative bg-white flex items-end h-[260px] border-8 border-black overflow-hidden">
                <div className="absolute flex justify-center top-0 h-[113px] w-full">
                    <CarouselFooter />
                </div>
                <div className="relative bg-black w-[50%] h-[200px] top-[53px] right-[92px] rotate-[21deg]"></div>
                <div className="absolute bg-black w-full h-[140px] flex justify-center items-center gap-4 z-10">
                    <img src={Logo} alt='logo Multicomerciales' className='flex w-52 invert brightness-0 md:w-52 lg:w-56'></img>
                    <div className="hidden md:flex h-[124px] border-[2px] rounded-sm border-white"></div>
                    <div className="hidden md:flex w-64 h-[115px] lg:h-[124px]">
                        <ul className="text-white text-xs">
                            <li className="text-sm uppercase">Multicomerciales De Occidente</li>
                            <li className="flex items-center gap-2"><FaLocationDot/>Calle 34N No. 2AN-36 Cali-Colombia</li>
                            <li className="flex items-center gap-2"><BsTelephonePlusFill/>602 6677118 / 6677114</li>
                            <li className="flex items-center gap-2"><FaSquareWhatsapp/>+57 3207062751</li>
                            <li className="flex items-center gap-2"><FaSquareInstagram/>@camiones.multicomerciales</li>
                            <li className="flex items-center gap-2"><FaSquareFacebook/>Multicomerciales de Occidente</li>
                            <li className="flex items-center gap-2"><BsEnvelopeAtFill/>dcomercial.multicomerciales@gmail.com</li>
                        </ul>
                    </div>
                </div>
                <div className="relative bg-black w-[50%] h-[200px] top-[53px] left-[92px] rotate-[-21deg]"></div>
            </div>
    )
}

export default Footer;