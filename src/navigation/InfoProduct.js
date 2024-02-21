import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import crud from "../backEndConnection/crud";
import swal from "sweetalert";
/**CAROUSEL TRUCK */
import CarouselTruck from "../components/CarouselTruck"
/**LOAN CALCULATOR */
import LoanCalculator from "../components/LoanCalculator";
/**REACT ICONS */
import { FaWhatsapp } from 'react-icons/fa';

const InfoProduct = () => {

    const { id } = useParams();
    const location = useLocation();/**CONSEGUIR URL CON location.pathname*/
    const navigate = useNavigate();
    console.log(process.env.REACT_APP_HOST_URL+location.pathname)

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

    const [expand, setExpand] = useState(false)
    const [truck, setTruck] = useState()
    const getTruck = async (id) => {
        const response = await crud.GET(`/api/product/idproduct/${id}`)
        setTruck(response.msg)
    }

    const [financialCorps, setFinancialCorps] = useState(null);
    const getAllFinancialCorps = async () => {
        const response = await crud.GET(`/api/financialcorp`);
        if (response.msg.length === 0) {
            swal('ERROR', 'No hay Financieras creadas en la B.D', 'error')
            console.log(response.msg)
        } else { setFinancialCorps(response.msg) }
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

                                <div className="flex flex-col gap-4 w-[100%] md:w-[90%] p-2 lg:p-4 bg-slate-200 border-[2px] border-white">

                                    <ul className="flex flex-col gap-1 text-red-800">
                                        <li className="flex flex-row w-[100%]"><span className="w-[50%] font-bold text-lg md:text-base lg:text-lg">Motor:</span><span className="w-[50%] font-semibold lg:text-[17px]">{truck.engineManufacturer}</span></li>
                                        <li className="flex flex-row w-[100%]"><span className="w-[50%] font-bold text-lg md:text-base lg:text-lg">Kilometraje:</span><span className="w-[50%] font-semibold lg:text-[17px]">{decimalFormatter.format(truck.odometer)}</span></li>
                                        <li className="flex flex-row w-[100%]"><span className="w-[50%] font-bold text-lg md:text-base lg:text-lg">Capacidad:</span><span className="w-[50%] font-semibold lg:text-[17px]">{truck.gvwr + " Toneladas"}</span></li>
                                        <li className="flex flex-row w-[100%]"><span className="w-[50%] font-bold text-lg md:text-base lg:text-lg">Furgon:</span><span className="w-[50%] font-semibold lg:text-[17px]">{truck.cargoBodyType}</span></li>
                                        <li className="flex flex-row w-[100%]"><span className="w-[50%] font-bold text-lg md:text-base lg:text-lg">Dimensiones:</span><span className="w-[50%] font-semibold lg:text-[17px]">{truck.length + " * " + truck.width + " * " + truck.height}</span></li>
                                    </ul>


                                    <div className="flex items-center justify-center w-full">
                                        <button onClick={() => getAllFinancialCorps()} disabled={financialCorps ? true : false} className={`w-[260px] h-7 text-sm md:text-xs lg:text-sm font-semibold text-white rounded-md bg-red-800 hover:bg-red-900 hover:text-gray-400 active:bg-red-800 active:text-white uppercase ${financialCorps ? "hover:bg-red-800 hover:text-white" : ""}`}>Calcular Financiacion</button>
                                    </div>

                                    {financialCorps && (
                                        <LoanCalculator financialCorps={financialCorps} price={truck.price} />
                                    )}

                                    <div className="flex items-center justify-center w-full">
                                        <button onClick={() => navigate(`/contact_us`)} className={`w-[260px] h-7 text-sm md:text-xs lg:text-sm font-semibold text-white rounded-md bg-blue-700 hover:bg-blue-800 hover:text-gray-400 active:bg-blue-700 active:text-white uppercase`}>Hacer un Oferta</button>
                                    </div>
                                    {/**Estoy%20interesado%20en%20el%20camion */}
                                    <div className="button flex items-center justify-center w-full">
                                        <Link type="button" target="_blank" to={`https://wa.me/573187825631?text=${process.env.REACT_APP_HOST_URL}/${location.pathname}`} style={{ background: '#25d366' }} className={`flex justify-center items-center w-[260px] h-7 text-sm md:text-xs lg:text-sm font-semibold text-white rounded-md uppercase`}><FaWhatsapp style={{ color: 'white', fontSize: '20px' }} />&nbsp;Contactar un Asesor</Link>
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