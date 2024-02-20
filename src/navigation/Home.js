import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CarouselHome from "../components/CarouselHome";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import IconTrucksByCategories from "../components/Icon_ShowTrucksByCategory";
import crud from "../backEndConnection/crud";
import imgFondo_Home from '../assets/images/Fondo_Home.jpg'
import imgCategory from '../assets/images/Image_Category.png'


const Home = () => {

    const [leftToRight, setLeftToRight] = useState(false);
    const [upToDown, setUpToDown] = useState(false);

    useEffect(() => {
        setLeftToRight(true);
        setUpToDown(true);
        getCategories();
        getAdvertisements();
    }, [])

    const navigate = useNavigate();

    const getProducts = (arg) => {
        navigate(`/trucks${arg}`)
    }

    const [category, setCategory] = useState([]);//recibe array []

    const getCategories = async () => {
        const response = await crud.GET(`/api/category`);
        setCategory(response.category);
    }

    const [advertisements, setAdvertisements] = useState([]);

    const getAdvertisements = async () => {
        const response = await crud.GET(`/api/advertisements`);
        console.log(response.msg)
        setAdvertisements(response.msg);
    }

    return (
        <div className="overflow-hidden flex flex-col bg-gradient-to-r from-black via-gray-400 to to-white">

            <Navbar />

            <div style={{ backgroundImage: "url(" + imgFondo_Home + ")" }} className="mt-[115px] bg-cover h-[370px] md:h-[450px]">

                {/*IMAGEN CAMION DE FONDO ESTATICA
                <div className="flex justify-center items-center">
                    <div style={{ backgroundImage: "url("+ imgFondo_Home +")" }} className="bg-cover bg-center fixed top-[108px] w-[900px] h-[460px]"></div>
                </div>
                */}

                {/*DIV MOVIMIENTO LAT CON CAROUSEL DE PUBLICIDAD*/}
                <div className={`relative overflow-hidden mb-[120px] flex justify-center left-0 h-full duration-[2000ms] ${leftToRight ? "left-0" : "left-[-100%]"}`}>
                    <div className="relative flex justify-center w-[650px] md:w-[800px]">
                        <div className="w-full h-full">
                            <CarouselHome advertisements={advertisements} />
                        </div>
                    </div>
                </div>


            </div >

            <div style={{ backgroundImage: "url(" + imgFondo_Home + ")" }} className="bg-contain md:bg-cover">
                
                {/*DIV MOVIMIENTO BAJANTE*/}
                <div className={`relative top-0 flex flex-col justify-center items-center text-2xl font-bold h-[500px] md:h-[350px] uppercase duration-[2000ms] ${upToDown ? "top-[-30px]" : "top-[-900px]"}`}>
                    <div className="z-0 flex flex-col md:flex-row justify-center items-center gap-4 text-2xl font-bold uppercase">

                        {/*ALL PRODUCTS*/}
                        <div className="hidden md:flex flex-col justify-center items-center gap-2 ">
                            <div className="bg-red-600 flex justify-center items-center rounded-full border-2 border-white text-white text-sm w-[80px] h-[80px] cursor-pointer shadow-lg shadow-red-600 hover:scale-105 hover:text-opacity-50 active:text-gray-700 underline font-bold" onClick={() => getProducts("All")}>Todos</div>
                            <div onClick={() => getProducts("All")} style={{ backgroundImage: `url(${imgCategory})` }} className='w-52 h-28 rounded-2xl bg-cover border border-black cursor-pointer shadow-lg shadow-red-600 hover:scale-105 opacity-60 hover:opacity-100'></div>
                        </div>

                        {/*PRODUCTS BY CATEGORIES*/}
                        <div className="flex flex-col md:flex-row gap-4">
                            {
                                category.map((itemCategory, index) => (
                                    <IconTrucksByCategories key={itemCategory._id} category={itemCategory} />
                                ))
                            }
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
export default Home;

