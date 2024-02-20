import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import crud from "../backEndConnection/crud";
import swal from "sweetalert";
/**CAROUSEL TRUCK */
import CarouselTruck from "../components/CarouselTruck"
/**REACT ICONS */
import { FaWhatsapp } from 'react-icons/fa';

const InfoProduct = () => {

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
    const [expand, setExpand] = useState(false)
    const [truck, setTruck] = useState()
    const getTruck = async (id) => {
        const response = await crud.GET(`/api/product/idproduct/${id}`)
        setTruck(response.msg)
    }

    useEffect(() => {
        getTruck(id);
    }, [navigate])

    return (
        <div className="overflow-hidden flex flex-col bg-gradient-to-r from-black via-gray-400 to to-white">
            <Navbar />

            <div className="flex flex-col md:min-h-screen">

                
                {truck && (

                    /*PANTALLA MD: Y LG:*/
                    <div className="flex flex-col gap-4 w-full md:min-h-screen mt-32 pl-2 pr-2 md:pl-10 md:pr-10">

                        {/**DIV SUPERIOR*/}
                        <div className="flex h-[8vh] md:h-[10vh] p-2 w-full mt-4 bg-slate-200 border-[2px] border-white text-[16px] md:text-[22px] text-red-800 font-bold">

                            <div className="flex w-[58%] h-full">
                                <h1>{truck.year + " " + truck.make + " " + truck.model}</h1>
                            </div>

                            <div className="flex justify-end w-[42%] h-full">
                                <h1>{formatterPesoCOP.format(truck.price) + " COP"}</h1>
                            </div>

                        </div>

                        {/**DIV COMPUESTO POR DOS PARTES */}
                        <div className="flex flex-col md:flex-row gap-5 md:gap-0 w-full mb-10">

                            {/**LADO IZQUIERDO CAROUSEL*/}
                            <div className="flex w-[100%] md:w-[65%]">

                                <div className="w-full border-[2px] border-white">
                                    <CarouselTruck truck={truck} />
                                </div>

                            </div>
                            {/**FIN DIV LADO IZQUIERDO */}

                            {/**LADO DERECHO INFO && FINANCIAL*/}
                            <div className="flex flex-col items-end w-[100%] md:w-[35%] h-full ">

                                <div className="flex flex-col gap-4 w-[100%] md:w-[90%] p-2 bg-slate-200 border-[2px] border-white">
                                
                                    <ul className="flex flex-col gap-2 text-red-800">
                                        <li className="flex flex-row w-[100%] font-bold text-base lg:text-lg"><span className="w-[50%]">Motor:</span><span className="w-[50%]">{truck.engineManufacturer}</span></li>
                                        <li className="flex flex-row w-[100%] font-bold text-base lg:text-lg"><span className="w-[50%]">Kilometraje:</span><span className="w-[50%]">{decimalFormatter.format(truck.odometer)}</span></li>
                                        <li className="flex flex-row w-[100%] font-bold text-base lg:text-lg"><span className="w-[50%]">Capacidad:</span><span className="w-[50%]">{truck.gvwr+ " Toneladas"}</span></li>
                                        <li className="flex flex-row w-[100%] font-bold text-base lg:text-lg"><span className="w-[50%]">Furgon:</span><span className="w-[50%]">{truck.cargoBodyType}</span></li>
                                        <li className="flex flex-row w-[100%] font-bold text-base lg:text-lg"><span className="w-[50%]">Dimensiones:</span><span className="w-[50%]">{truck.length + " x " + truck.width + " x " + truck.height}</span></li>
                                    </ul>


                                    <div className="flex items-center justify-center w-full">
                                        <button disabled={expand ? true : false} onClick={() => setExpand(true)} className={`w-[260px] h-7 text-sm md:text-xs lg:text-sm font-semibold text-white rounded-md bg-red-800 hover:bg-red-900 hover:text-gray-400 active:bg-red-800 active:text-white uppercase`}>Calcular Financiacion</button>
                                    </div>

                                    {expand && (
                                        <div className="">
                                            <h1>Seleccione la Finaciera</h1>
                                            <h1>tasa interes</h1>
                                            <h1>Tiempo en años</h1>
                                            <h1>Cuota inicial automatica</h1>
                                            <h1>Valor Aprox cuota mensual</h1>

                                        </div>
                                    )}

                                    <div className="button flex items-center justify-center w-full">
                                        <Link type="button" target="_blank" to={`https://wa.me/573187825631?text=Estoy%20interesado%20en%20el%20camion`} style={{ background: '#25d366' }} className={`flex justify-center items-center w-[260px] h-7 text-sm md:text-xs lg:text-sm font-semibold text-white rounded-md uppercase`}><FaWhatsapp style={{ color: 'white', fontSize: '20px' }} />&nbsp;Contactar un Asesor</Link>
                                    </div>

                                </div>

                            </div>
                            {/**FIN DIV LADO DERECHO */}

                        </div>
                    </div>
                    /**FIN DIV COMPUESTO POR DOS PARTES */
                )}
                {/**FIN DEL CONDICIONAL truck===true*/}

            </div>
            <Footer />
        </div>
    );
}

export default InfoProduct;