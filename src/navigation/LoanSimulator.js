import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import crud from "../backEndConnection/crud";
import Carousel from "../components/Carousel";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const LoanSimulator = () => {

    //FUNCION PARA DAR FORMATO PESOS COP A LOS VALORES NUMERICOS
    const formatterPesoCOP = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    })
    //FUNCION PARA DAR FORMATO A VALORES DE MILES SEPARADOS POR PUNTO
    const decimalFormatter = new Intl.NumberFormat("es-ES", {
        maximumFractionDigits: 0
    })

    
    
    return (
        <div className="relative overflow-hidden flex flex-col items-center bg-gradient-to-r from-black via-gray-400 to to-white h-full">
            <Navbar />
            <div className="flex flex-col justify-center w-screen h-screen items-center font-bold uppercase">
                    <h1>LOAN SIMULATOR</h1>
                    <Link to={'/trucksAll'} className="underline">Regresar</Link>
                </div>
            
                
            <Footer />
        </div>
    )
}

export default LoanSimulator;