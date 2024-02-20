import React from "react";
import { useNavigate } from "react-router-dom";

const ButtomAdmin = () => {

    const navigate = useNavigate() //SE DEBE UTILIZAR PARA RE-DIRECCIONAR PAGINAS WEB

    const securityFilter = async () => {
        const token = localStorage.getItem('token');//IR A localStorage Y TRAER VALUE: DE KEY 'token'
        //CONDICIONAL
        if(!token){//SI NO HAY TOKEN EN localStorage
            navigate("/sign_in")
        }else{
            navigate("/admin")
        }
    }

    return (
        <button className="bg-white 
        text-red-600
        font-semibold
        rounded-full 
        px-2
        lg:px-4 
        py-[3px] 
        lg:py-1
        border border-black 
        shadow-lg shadow-black
        hover:bg-opacity-90
        active:bg-opacity-50"
        onClick={securityFilter}
        >
            Admin
        </button>
    )
}

export default ButtomAdmin;