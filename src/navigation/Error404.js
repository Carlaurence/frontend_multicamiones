import React from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const Error404 = () => {
    const navigate = useNavigate();
    return (
        <div className="overflow-hidden bg-gradient-to-r from-black via-gray-400 to to-white">
            <Navbar />
            <div className="bg-gradient-to-r from-black via-gray-400 to to-white flex flex-col gap-3 justify-center min-h-screen items-center">
                <h1 className="text-2xl font-semibold">UPS.... ERROR 404. NOT FOUND</h1>
                <h1 className="text-lg font-medium">Lo sentimos, pero la pagina que buscas no existe.</h1>
                <h1 className="underline">Regresar a la pagina principal</h1>
                <button onClick={() => navigate(`/`)} type="button" value="edit" className="bg-red-600 rounded-md border border-black shadow-lg shadow-black hover:bg-red-700 hover:text-gray-300 active:bg-opacity-70 w-[120px] h-[30px] flex justify-center items-center text-sm text-white font-semibold" >Pagina Principal</button>
            </div>
            <Footer/>
        </div>

    )
}

export default Error404;