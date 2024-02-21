import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import Navbar from "../components/Navbar";
import crud from "../backEndConnection/crud";
import Carousel from "../components/Carousel";
import ButtomLoanCalculator from "../components/ButtomLoanCalculator";
import Footer from "../components/Footer";
//react-icons
import { IoIosSpeedometer } from 'react-icons/io';
import { FaSackDollar } from 'react-icons/fa6';
import { FaTruckMoving, FaWhatsappSquare } from 'react-icons/fa';
import { Link } from "react-router-dom";
import { PiEngineFill } from "react-icons/pi";

const ShowAllTrucks = () => {

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

    const [products, setProducts] = useState([]);

    const getAllTrucks = async () => {
        const response = await crud.GET(`/api/product`);
        //const msg = response;
        //console.log(response.msg)
        setProducts(response.msg);

    }

    useEffect(() => {//PARA QUE SE EJECUTE AUTOMATICAMENTE AL INGRESAR AL MODULO Category Y SE PRINTEEN LAS CATEGORIES
        getAllTrucks();
    }, [])//[] QUE SE EJECUTA UNA SOLA VEZ
    console.log(products)

    /*NOTA IMPORTANTE: LAS IMAGENES DE LOS VEHICULOS DEBEN CONSERVAR UNA RELACION DE ASAPECTO DE 4:3
     */
    return (
        <div className="overflow-hidden flex flex-col bg-gradient-to-r from-black via-gray-400 to to-white">
            <Navbar />
            
            <div className="mt-36 mb-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-center min-h-screen">
                {/**CARDS*/}
                {products.map((product, index) => (
                        <div key={product._id} className='group rounded-md md:h-[395px] md:w-[330px] lg:h-[370px] lg:w-[300px] bg-gray-200 border m-auto shadow-md shadow-red-600'>
                            <Carousel images={product.images} product={product} />
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

                                    {/**WHATSAPP BUTTOM*/}
                                    <div className="flex justify-center items-center w-[25%]">
                                        <Link target="_blank" to={`https://wa.me/${process.env.REACT_APP_WHATSAPP_LINK}?text=${process.env.REACT_APP_HOST_URL}/info_product/${product._id}`}><FaWhatsappSquare style={{color: '#25D366', fontSize:'40px'}} /></Link>
                                    </div>
                                </div>
                                <div className="flex justify-center items-center mb-3">
                                    <ButtomLoanCalculator url={`/info_product/${product._id}`} height ={"25px"} width ={"320px"}/>
                                </div>
                            </div>
                        </div>
                    
                ))}
            
            </div>
            <Footer />
        </div>
    )
}

export default ShowAllTrucks;