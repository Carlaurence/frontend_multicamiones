import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import crud from "../backEndConnection/crud";
import Carousel from "../components/Carousel";
import ButtomLoanCalculator from "../components/ButtomLoanCalculator";
import Footer from "../components/Footer";
//react-icons
import { IoIosSpeedometer } from 'react-icons/io';
import { FaSackDollar } from 'react-icons/fa6';
import { FaTruckMoving, FaWhatsappSquare } from 'react-icons/fa';
import { PiEngineFill } from "react-icons/pi";


const ShowTrucksByCategory = () => {

    //FUNCION PARA DAR FORMATO PESOS COP A LOS VALORES NUMERICOS
    const formatterPesoCOP = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    })
    //FUNCION PARA DAR FORMATO A VALORES DE MILES SEPARADOS POR PUNTO
    const decimalFormatter = new Intl.NumberFormat("es-ES", {
        maximumFractionDigits: 0
    })

    const { id } = useParams();

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    const getTrucksByCategory = async () => {
        const response = await crud.GET(`/api/product/${id}`);
        //console.log(response.msg)
        setProducts(response.msg);
    }

    useEffect(() => {//PARA QUE SE EJECUTE AUTOMATICAMENTE AL INGRESAR AL MODULO Category Y SE PRINTEEN LAS CATEGORIES
        getTrucksByCategory();
    }, [id])/*[] QUE SE EJECUTA UNA SOLA VEZ. PERO EN ESTE CASO [id], SE TIENE QUE EJECUTAR CADA QUE DETECTE UN CAMBIO
    EN EL /:id QUE LLEGA EN LA URL /category/:id POR MEDIO DEL LLAMADO QUE LE HACE EL BOTTOM Icon_ShowTrucksByCategory*/

    return (
        
        <div className="overflow-hidden flex flex-col bg-gradient-to-r from-black via-gray-400 to to-white">
            <Navbar />
            
            <div className="mt-36 mb-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-center min-h-screen">
                {/**CARDS*/}
                {products.map((product, index) => (
                        <div key={product._id} className='group rounded-md md:h-[395px] md:w-[330px] lg:h-[370px] lg:w-[300px] bg-gray-200 border m-auto shadow-md shadow-red-600'>
                            <Carousel images={product.images} product={product}/>
                            <div className="m-1 text-sm px-1">
                                <div className="flex gap-1">
                                    <span>{product.make}</span>
                                    <span>{product.model}</span>
                                    <span>{"["+product.gvwr+" TON]"}</span>
                                    <span>{" - " + product.year}</span>
                                </div>
                                <div>
                                    <span className="flex items-center gap-2"><FaTruckMoving style={{color: '#424949', fontSize:'15px'}} />{product.cargoBodyType + " " + product.length + " * " + product.width + " * " + product.height}</span>
                                </div>
                                <div>
                                    <span className="flex items-center gap-2"><PiEngineFill style={{color: '#424949', fontSize:'15px'}} />{product.engineManufacturer}</span>
                                </div>
                                <div className="flex flex-row mb-2">
                                    <div className="flex flex-col w-[75%] ">
                                        <span className="flex items-center gap-2"><IoIosSpeedometer style={{color: '#424949', fontSize:'15px'}} />{" "+decimalFormatter.format(product.odometer)+" Kms"}</span>
                                        <span className="flex items-center gap-2"><FaSackDollar style={{color: '#424949', fontSize:'15px'}} />{formatterPesoCOP.format(product.price)}</span>
                                    </div>
                                    <div className="flex justify-center items-center w-[25%]">
                                        <Link target="_blank" to={`https://wa.me/573187825631?text=Estoy%20interesado%20en%20el%20camion`}><FaWhatsappSquare style={{color: '#25D366', fontSize:'40px'}} /></Link>
                                    </div>
                                </div>
                                <div className="flex justify-center items-center mb-3">
                                    <ButtomLoanCalculator height ={"25px"} width ={"320px"}/>
                                </div>
                            </div>
                        </div>
                ))}
            
            </div>
            <Footer />

        </div>
    )
}

export default ShowTrucksByCategory;