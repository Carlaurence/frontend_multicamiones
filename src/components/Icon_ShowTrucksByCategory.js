import React from "react";
import { useNavigate } from "react-router-dom";//SE DEBE UTILIZAR PARA RE-DIRECCIONAR PAGINAS WEB

/*RECIBE COMO (ARG) A LA FUNCION retractSlideMenu() QUE VIENE DE <NAVAR> PARA QUE SE EJECUTE CADA VEZ QUE SE HAGA 
CLICK SOBRE EL BOTON [Icon_ShowTrucksByCategory]*/
const ShowTrucksByCategory = ({ category, retractSlideMenu }) => {

    const { image, name, _id } = category;

    const navigate = useNavigate() //SE DEBE UTILIZAR PARA RE-DIRECCIONAR PAGINAS WEB

    const buttomHandler = () => {
        retractSlideMenu();//LA FUNCION retractSlideMenu() SE EJECUTA EN EL COMPONENTE PADRE <NAVAR> Y ESTA SE ENCARGA DE QUE EL SUBMENU "CATEGORIAS" SE ESCONDA HACIA LA IZQUIERDA CON UN 'left-[-100%]' 
        navigate(`/category/${_id}`);
    }

    return (
        <>
            <div className="flex flex-col justify-center items-center gap-2">
                <div className="bg-red-600 flex justify-center items-center rounded-full border-2 border-white text-white text-sm w-[80px] h-[80px] cursor-pointer shadow-lg shadow-red-600 hover:scale-105 hover:text-opacity-50 active:text-gray-700 underline font-bold" onClick={() => buttomHandler()}>{name}</div>
                <div style={{ backgroundImage: `url(${image})`}} className='w-52 h-28 rounded-2xl bg-cover border border-black cursor-pointer shadow-lg shadow-red-600 hover:scale-105 opacity-60 active:opacity-60 hover:opacity-100' onClick={() => buttomHandler()}></div>
            </div>
        </>
    )
}

export default ShowTrucksByCategory;

