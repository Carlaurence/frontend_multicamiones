import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Pruebas = () => {


    return (
        <div className="overflow-hidden flex flex-col bg-gradient-to-r from-black via-gray-400 to to-white">
            <Navbar />
            <div className="flex flex-col md:min-h-screen">MODULO PRUEBAS</div>
            <Footer />
        </div>
    );
}

export default Pruebas;