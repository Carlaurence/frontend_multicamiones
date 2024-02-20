import React from "react";
import { useNavigate } from "react-router-dom";

const ButtomCreateProduct = () => {

    const navigate = useNavigate() //SE DEBE UTILIZAR PARA RE-DIRECCIONAR PAGINAS WEB

    const buttomHandler = () => {
        navigate("/categories");
    }

    return (
        <button className="
            bg-white 
            text-red-600  
            w-72
            h-9
            rounded-full
            border border-black 
            shadow-lg shadow-black
            hover:bg-opacity-90
            active:bg-opacity-50"
        onClick={buttomHandler}
        >
            Ingresar Vehiculo
        </button>
    )
}

export default ButtomCreateProduct;