import React from "react";
import { useNavigate } from "react-router-dom";

const ButtomLoanCalculator = ( props ) => {

    const navigate = useNavigate() //SE DEBE UTILIZAR PARA RE-DIRECCIONAR PAGINAS WEB

    const buttomHandler = () => {
        navigate(props.url);
    }

    return (
        <button className="
            bg-red-600 
            text-white
            text-xs
            font-medium  
            rounded-full
            border border-black 
            shadow-lg shadow-black
            hover:bg-red-700
            hover:text-gray-300
            active:bg-red-600"
            style={{width: props.width, height: props.height}}
        onClick={buttomHandler}
        >
            SIMULADOR DE CREDITO
        </button>
    )
}

export default ButtomLoanCalculator;