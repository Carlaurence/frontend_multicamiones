import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ButtomAdmin from "./Buttom_Admin";
import IconTrucksByCategories from "../components/Icon_ShowTrucksByCategory";
import crud from "../backEndConnection/crud";
import Logo from "../assets/images/Logo.jpg"

const Navbar = () => {

    const navigate = useNavigate();

    const getProducts = (arg) => {
        navigate(`/trucks${arg}`)
    }

    /**BUSCAR LA FORMA DE AGRUPAR ESTOS USESTATE EN UNO SOLO */
    const [open, setOpen] = useState(false)
    const [isHoveringHome, setIsHoveringHome] = useState(false)
    const [isHoveringTrucks, setIsHoveringTrucks] = useState(false)
    const [isHoveringLocation, setIsHoveringLocation] = useState(false)
    const [isHoveringAboutUs, setIsHoveringAboutUs] = useState(false)
    const [isHoveringContactUs, setIsHoveringContactUs] = useState(false)

    //VAMOS A HACER UN GET QUE ME TRAIGA TODAS LAS CATEGORIAS DISPONIBLE [1 - 3.5] [3.6 - 7] [7 - 11]
    //Y LUEGO LAS VAMOS A PRINTEAR CON UN .MAP PARA MANDARSELAS COMO {ARGUMENTO} A UN BUTON_CATEGORIAS 
    //Y ASI EVITAMOS TENER QUE CREAR UN BOTON APARTE PARA CADA UNA DE LAS CATEGORIAS
    const [category, setCategory] = useState([]);

    const getCategories = async () => {
        const response = await crud.GET(`/api/category`);
        setCategory(response.category);
    }

    /*const leftSlider = (e) => {
        const navTrucks = document.querySelector('.nav-trucks')//navTrucks llama al <div id='nav-trucks'> que deseamos manipular
        //e.preventDefault();//impedir que se recargue automaticamente
        navTrucks.classList.toggle('left-[-100%]');//Isertamos o manipulamos las propiedades del <div id='nav-trucks'>
    }*/

    useEffect(() => {//PARA QUE SE EJECUTE AUTOMATICAMENTE AL INGRESAR AL MODULO Category Y SE PRINTEEN LAS CATEGORIES
        getCategories();
    }, [])//[] QUE SE EJECUTA UNA SOLA VEZ

    const [expand, setExpand] = useState(false)

    return (
        
        <div className="fixed flex bg-white min-h-[105px] w-screen p-2 z-20 shadow-lg shadow-red-600">
            <div className="flex items-center justify-between bg-red-600 shadow-lg shadow-white w-full">

            {/*LOGO MULTICAMIONES*/}
            <div className="relative overflow-hidden w-[45vw] md:w-[28vw] lg:w-[30vw] h-[105px] skew-x-[45deg] bg-white flex justify-between items-center ">

                <div className="flex justify-center w-full skew-x-[-45deg] ">
                    <img src={Logo} alt="Logo" className="h-[90px] lg:h-[105px]"></img>
                </div>  
            </div>
            
            {/**ICON HAMBURGUESA*/}
            <div className="pr-6 text-3xl md:hidden text-white" onClick={() => setOpen(!open)}>
                <ion-icon name={`${open ? "close" : "list"}`}></ion-icon>
            </div>

            {/*Este <div> printea el menu Navbar [HOME CAMIONES UBICACION NOSOTROS CONTACTANOS] en Screen[md: & lg:]*/}
            <div className=" hidden md:flex items-end md:text-sm lg:text-base font-semibold uppercase w-[58vw] h-[105px]">

                {/*Este <div> contiene el "HOME"*/}
                <Link to={"/"} className="w-full pt-[2px] h-[70px] flex flex-col items-center text-white cursor-pointer" onMouseOver={() => setIsHoveringHome(true)} onMouseOut={() => setIsHoveringHome(false)}>
                    <div className={`duration-500 ${isHoveringHome ? "text-[34px]" : "text-[28px]"}`}><ion-icon name="home-outline"></ion-icon></div>
                    <span className={`active:text-gray-700 ${isHoveringHome ? "opacity-50" : ""}`} >Home</span>
                </Link>{/*Fin del <div> que contiene el "HOME"*/}

                {/*Este <div> contiene el Icono "CAMION" y su Sub-Menu desplegable "ON HOVER" con sus CATEGORIAS [TODOS - 3.5 - 7 - 10 TON]:*/}
                <div className="group w-full h-[70px] flex flex-col items-center text-white hover:text-opacity-50 cursor-default" onMouseOver={() => setIsHoveringTrucks(true)} onMouseOut={() => setIsHoveringTrucks(false)}>
                    <img src="https://res.cloudinary.com/depcjbb7q/image/upload/v1683223778/logo_camion_v6qp2i.png" alt="#" className={`invert-0 duration-500 ${isHoveringTrucks ? "w-12" : "w-10"}`}></img>
                    <span>Camiones</span>

                    {/*Este <div> printea el Sub_Menu del Icono "Camiones" con las Categorias on Hover*/}
                    <div className={`nav-trucks absolute bg-gradient-to-r from-black via-gray-400 to to-white top-[113px] left-0 w-full h-screen text-black text-sm uppercase duration-500 ${isHoveringTrucks ? "left-0" : "left-[-100%]"}`}>

                        {/*Este <div> Contiene [All Categories] */}
                        <div className="flex flex-col justify-center items-center gap-2 h-[220px]">
                            <div className="bg-red-600 flex justify-center items-center rounded-full border-2 border-white text-white text-sm w-[80px] h-[80px] cursor-pointer shadow-lg shadow-red-600 hover:scale-105 hover:text-opacity-50 active:text-gray-700 underline font-bold" onClick={() => getProducts("All")}>Todos</div>
                            <div onClick={() => getProducts("All")} style={{ backgroundImage: `url(https://res.cloudinary.com/depcjbb7q/image/upload/v1686534852/Categoria_Multimarcas_xmtzaz.png)` }} className='w-52 h-28 rounded-2xl bg-cover border border-black cursor-pointer shadow-lg shadow-red-600 hover:scale-105 opacity-60 hover:opacity-100'></div>
                        </div>

                        {/*Este <div> Contiene [3.5Categories 7TonCategories 10TonCategories] */}
                        <div className="flex justify-around items-center gap-2 h-[220px]">
                            {
                                category.map((itemCategory, index) => (
                                    <IconTrucksByCategories key={itemCategory._id} category={itemCategory} />
                                ))
                            }
                        </div>
                    </div>
                </div>{/*Fin de las funciones del icono "CAMIONES"*/}

                <Link to={"/location"} className="w-full h-[70px] flex flex-col items-center text-white hover:text-opacity-50 active:text-gray-700 cursor-pointer" onMouseOver={() => setIsHoveringLocation(true)} onMouseOut={() => setIsHoveringLocation(false)}>
                    <img src="https://res.cloudinary.com/depcjbb7q/image/upload/v1686440672/logo_vitrina_jkhlsh.png" alt="#" className={`invert-0 duration-500 ${isHoveringLocation ? "w-12" : "w-10"}`}></img>
                    Ubicacion
                </Link>
                <Link to={"/about_us"} className="w-full h-[70px] flex flex-col items-center text-white hover:text-opacity-50 active:text-gray-700 cursor-pointer" onMouseOver={() => setIsHoveringAboutUs(true)} onMouseOut={() => setIsHoveringAboutUs(false)}>
                    <img src="https://res.cloudinary.com/depcjbb7q/image/upload/v1686440672/logo_aboutUs_nrswrj.png" alt="#" className={`invert-0 duration-500 ${isHoveringAboutUs ? "w-12" : "w-10"}`}></img>
                    Nosotros
                </Link>
                <Link to={"/contact_us"} className="w-full h-[70px] flex flex-col items-center text-white hover:text-opacity-50 active:text-gray-700 cursor-pointer" onMouseOver={() => setIsHoveringContactUs(true)} onMouseOut={() => setIsHoveringContactUs(false)}>
                    <img src="https://res.cloudinary.com/depcjbb7q/image/upload/v1686440672/logo_contactanos_heo69h.png" alt="#" className={`invert-0 duration-500 ${isHoveringContactUs ? "w-12" : "w-10"}`}></img>
                    Contactenos
                </Link>
            </div>

            <div className="md:flex justify-center hidden md:w-[10vw] h-[105px]">
                <div className="flex items-center">
                    <ButtomAdmin />
                </div>
            </div>

            {/*MOBILE DEVICES SCREEN*/}
            <div className={`md:hidden bg-red-600 absolute w-full h-screen bottom-0 top-[121px] p-4 pr-9 duration-500 ${open ? "left-0" : "left-[-100%]"}`}>
                <div className="bg-black/20 py-14 uppercase text-base font-semibold flex flex-col gap-3">
                    <div className="hover:bg-black/10 cursor-pointer">
                        <Link onClick={()=>setOpen(false)} className="text-white" to={"/"}>Principal</Link>
                    </div>
                    <div>
                        <span onClick={()=>{!expand ? setExpand(true):setExpand(false)}} className="flex text-white hover:bg-black/10 cursor-pointer">Nuestros Camiones</span>
                        
                        <ul className={`text-sm text-white pl-10 flex flex-col gap-2 ${expand ? "flex":"hidden"}`}>
                            {/**ALL TRUCKS */}
                            <li onClick={() => {getProducts("All"); setOpen(false)}} className="flex pt-2 hover:bg-black/10 cursor-pointer"><div className="h-5 w-5 bg-black/40 rounded-full text-base flex items-center justify-center py-[-10px]">{"►"}</div>&nbsp;Todos</li>
                            
                            {/**TRUCKS BY CATEGORY */}
                            {
                                category.map((item, index) => (
                                    <li className="flex hover:bg-black/10 cursor-pointer" 
                                        key={item._id}
                                        onClick={()=> {navigate(`/category/${item._id}`); setOpen(false)}} >
                                        <div className="h-5 w-5 bg-black/40 rounded-full text-base flex items-center justify-center py-[-10px]">{"►"}</div>
                                        &nbsp;{item.name}
                                    </li>
                                ))
                            }

                        </ul>
                    </div>
                    <div className="hover:bg-black/10 cursor-pointer">
                        <Link onClick={()=>setOpen(false)} className="text-white" to={"/about_us"}>Nosotros</Link>
                    </div>
                    <div className="hover:bg-black/10 cursor-pointer">
                        <Link onClick={()=>setOpen(false)} className="text-white" to={"/contact_us"}>Contactenos</Link>
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}

export default Navbar;


