import React from "react";
import { useNavigate } from "react-router-dom";

const ButtomSingOut = (props) => {

    const navigate = useNavigate();
    
    const logout = () => {//FUNCION PARA CERRAR SESION ADMIN
        localStorage.removeItem('token');//BORRA EL TOKEN ALMACENADO EN EL LOCALSTORAGE
        navigate("/");//REDIRECCIONA AL HOME
    }

    return (
        <button
        type="submit"
        value="log_in"
         className="
            bg-white 
            text-red-600  
            
            rounded-full
            border border-black 
            shadow-lg shadow-black
            hover:bg-opacity-90
            active:bg-opacity-50
            font-bold"
            style={{width:props.width, height:props.height}}
            onClick={logout}>
            Cerrar Sesion
        </button>
    )
}

export default ButtomSingOut;