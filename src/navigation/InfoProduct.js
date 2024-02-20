import React from "react";
import Navbar from "../components/Navbar";

const InfoProduct = () => {

    return (
        <>
            <Navbar />
            <div className="bg-gradient-to-r from-black via-gray-400 to to-white flex justify-center h-screen items-center font-bold uppercase">
                <h1>INFORMACION DETALLADA DEL PRODUCTO SELECCIONADO</h1>
            </div>
        </>
    )

}

export default InfoProduct;