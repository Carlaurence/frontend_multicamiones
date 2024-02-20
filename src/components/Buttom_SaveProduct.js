import React from "react";

const ButtomSaveProduct = () => {

    return (
        <button
        type="submit"
        value="guardar"
         className="
            bg-white 
            text-red-600  
            w-[305px]
            h-9
            rounded-full
            border border-black 
            shadow-lg shadow-black
            hover:bg-opacity-90
            active:bg-opacity-50"
            >
            Guardar Registro
        </button>
    )
}

export default ButtomSaveProduct;