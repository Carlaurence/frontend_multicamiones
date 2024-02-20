import React from "react";

const ButtomSingUp = () => {

    return (
        <button
        type="submit"
        value="crear usuario"
         className="
            bg-white 
            text-red-600 
            font-bold 
            w-[280px]
            h-9
            rounded-full
            border border-black 
            shadow-lg shadow-black
            hover:bg-opacity-90
            active:bg-opacity-50"
            >
            Crear Usuario
        </button>
    )
}

export default ButtomSingUp;