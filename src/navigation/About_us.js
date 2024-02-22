import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CarouselAboutUs from "../components/Carousel_AboutUs";

/**IMAGES FROM ASETS FOLDER */
import bgImage from "../assets/images/Fondo_Home.jpg";
import Img_AboutUs1 from "../assets/images/Img_AboutUs1.jpg"
import Img_AboutUs2 from "../assets/images/Img_AboutUs2.jpg"

/**REACT ICONS */
import { SlTarget } from "react-icons/sl";
import { GiEyeTarget } from "react-icons/gi";

const About_us = () => {

    const images = [Img_AboutUs1, Img_AboutUs2]


    return (
        <div className="overflow-hidden bg-gradient-to-r from-black via-gray-400 to to-white">
            <Navbar />

            <div className="mt-[125px] grid grid-cols-1 md:grid-cols-2 p-4 bg-white md:bg-transparent">

                {/**CAROUSEL*/}
                <div className="flex justify-center">
                    <div className="w-full h-full">
                        <CarouselAboutUs images={images} />
                    </div>
                </div>

                {/**MISION Y VISION*/}
                <div className="flex flex-col justify-center items-center gap-4">
                    <div className="flex flex-col items-center">
                        <div className="-space-y-3">{/**REDUCE ESPACIO ENTRE-LINEAS*/}
                            <h1 className="uppercase text-red-900 text-[23px] font-bold">Multicomerciales</h1>
                            <h1 className="uppercase text-red-900 text-[23px] font-bold">De Occidente S.A.S</h1>
                        </div>

                        <div className="flex text-justify p-5 font-sans text-base md:text-[14px]" style={{ color: "#444444" }}>
                            <p>Somos el primer y único centro especializado en comercialización de vehículos nuevos
                                y usados, ofreciendo un amplio portafolio de Microbuses – Busetas – Camiones – Taxis –
                                Nuevos y Usados en toda el mercado. Contamos con un amplio inventario de vehículos que
                                cumplen su necesidad. Obtenga con nosotros su vehículo, crédito y pólizas de seguros.
                                Retomamos su vehículo como parte de pago del que desea adquirir. Estamos disponibles para
                                asesorarle a realizar su mejor inversión.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 w-full">


                        <div className="flex flex-col justify-center items-center w-auto">
                            <SlTarget className="text-[45px] text-red-900 mb-4" />
                            <h1 className="text-red-900 text-[30px]">Misión</h1>
                            <div className="flex text-justify p-5 font-sans text-base md:text-[14px]" style={{ color: "#444444" }}>
                                <p>
                                    Ser elegida como la Empresa N° 1 en Comercialización de vehículos nuevos y usados
                                    de servicio público en la ciudad de Cali, optimizando el tiempo para el
                                    cumplimiento de los compromisos pactados con nuestros clientes, brindando el
                                    mayor respaldo y confiabilidad.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center items-center w-auto">
                            <GiEyeTarget className="text-[48px] text-red-900 mb-4" />
                            <h1 className="text-red-900 text-[30px] ">Visión</h1>
                            <div className="flex text-justify p-5 font-sans text-base md:text-[14px]" style={{ color: "#444444" }}>
                                <p>
                                    Ser una empresa líder en comercialización de vehículos de servicio público
                                    nuevos y usados haciendo uso del amplio conocimiento en el gremio del
                                    transporte, logrando de esta manera el reconocimiento en el mercado
                                    nacional e internacional y brindando a nuestros clientes seguridad y
                                    confianza.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default About_us;

/**
 * <div className="h-[50vh] relative flex items-center">
                        
                        <div className="text-center">
                            <h2 className="text-4xl font-bold">Quiénes Somos</h2>
                            <p className="text-lg">Multicomerciales de Occidente es una empresa dedicada a la venta de camiones nuevos y usados. Contamos con una amplia experiencia en el sector y un equipo de profesionales altamente cualificados.</p>
                        </div>
                    </div>
                    <div className="bg-white py-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-2xl font-bold">Nuestra Misión</h3>
                                <p>Ofrecer a nuestros clientes la mejor experiencia posible en la compra y mantenimiento de su camión.</p>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">Nuestra Visión</h3>
                                <p>Ser la empresa líder en la venta de camiones en Colombia, reconocida por su calidad, servicio y compromiso con el cliente.</p>
                            </div>
                        </div>
                    </div>
 */