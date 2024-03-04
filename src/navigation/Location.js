import React, { useEffect, useState } from "react";
import Navbar from '../components/Navbar';
import Mapss from '../components/Mapss';
import Footer from '../components/Footer';


const Location = () => {

    const [isTop, setIsTop] = useState(true)//SETEA [isTop === true] PARA QUE SE RENDERICE EN EL TOP:0
    useEffect(() => {
        //EVENTO OYENTE PARA QUE EL MOVERSE EL SCROLL SETE [isTop === false]
        window.addEventListener('scroll', () => {
          setIsTop(window.scrollY === 0);
        });
      }, []);

    return (
        <div className={`relative overflow-hidden flex flex-col bg-gradient-to-r from-black via-gray-400 to to-white ${isTop ? window.scrollTo({top:0}) : ''}`}>
            
            <Navbar />

            <div className="mt-[115px] min-h-screen">
                <Mapss />
            </div>

            <Footer />

        </div>
    )
}

export default Location;

/**
 return (
        <>
            <Navbar />
            <div className="bg-gradient-to-r from-black via-gray-400 to to-white flex justify-center">
                <h1>About_US</h1>
            </div>
        </>
    )
 */