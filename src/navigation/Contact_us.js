import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import bgImage from "../assets/images/Fondo_Home.jpg"
import swal from "sweetalert";

/**REACT ICONS*/
import { FaSquareWhatsapp, FaSquareInstagram, FaSquareFacebook } from "react-icons/fa6";

/**INTERNATIONAL CALLPHONE CODES */
import PhoneInput from 'react-phone-input-2'//npm install react-phone-input-2
import 'react-phone-input-2/lib/style.css'
/**LIBRARY FOR GETTING EMAILS FREE*/
import { useForm, ValidationError } from '@formspree/react';//npm install @formspree/react

const Contact_us = () => {

    /**OPCIONES DE TIPO DE DOCUMENTO */
    const idType = ['Cedula de Ciudadania', 'Cedula de Extranjeria', 'Numero de Pasaporte', 'Numero de Licencia']
    /**OPCIONES DE ASUNTO */
    const subject = ['PQR', 'Ventas', 'Hacer una Oferta', 'Vender su Vehiculo', "Vehiculo en Consignacion", 'Felicitaciones']

    const [active, setActivate] = useState(false)

    const [phoneNumber, setPhoneNumber] = useState('')
    const onChangePhoneNummber = (value) => {
        setPhoneNumber(value)
    }
    const [state, handleSubmit] = useForm(process.env.REACT_APP_USEFORM);

    const navigate = useNavigate();

    if (state.succeeded) {
        navigate('/')
        swal("success", "Gracias por contactarnos. Estaremos en contacto con usted, tan pronto como sea posible", "success");
        //<p>Thanks for joining!</p>;
    }

    return (
        <div className="overflow-hidden bg-gradient-to-r from-black via-gray-400 to to-white">
            <Navbar />
            <div className="flex justify-center md:min-h-screen mt-[110px] bg-cover" style={{ backgroundImage: "url(" + bgImage + ")" }}>

                <div className="overflow-hidden flex flex-col gap-5 items-center bg-black opacity-80 border-[2px] rounded-md border-white w-[90vw] md:w-[70vw] md:h-[85vh] mt-6 mb-2">

                    <h1 className="text-white text-3xl font-semibold mt-4">CONTACTENOS</h1>
                    {/*LOS ICONOS DE REDES SOCIALES*/}
                    <div className="flex justify-center md:justify-start gap-3 h-8">
                        <Link target="_blank" to={'https://wa.me/573207062751'}><FaSquareWhatsapp className="text-white text-2xl hover:text-3xl" /></Link>
                        <Link target="_blank" to={'https://www.facebook.com/multicomercialesdeoccidente/'}><FaSquareFacebook className="text-white text-2xl hover:text-3xl" /></Link>
                        <Link target="_blank" to={'https://www.instagram.com/camiones.multicomerciales/'}><FaSquareInstagram className="text-white text-2xl hover:text-3xl" /></Link>

                    </div>

                    {/*FORMULARIO DE CONTACTO*/}
                    <div className=" flex justify-center w-full">

                        
                        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-2 w-[80vw] md:w-[65vw] text-white text-[15px] font-semibold">

                            <input className="text-black px-2 py-1 rounded-md leading-tight border-double border-4 border-black"
                                id="name"
                                type="text"
                                name="name"
                                //value={name}
                                placeholder="Nombres"
                            //onChange={onChange}
                            >
                            </input>

                            <input className="text-black px-2 py-1 rounded-md leading-tight border-double border-4 border-black"
                                id="lastname"
                                type="text"
                                name="lastname"
                                //value={name}
                                placeholder="Apellidos"
                            //onChange={onChange}
                            >
                            </input>

                            <select className="text-black px-2 py-1 rounded-md leading-tight border-double border-4 border-black"
                                id="idtype"
                                type="text"
                                name="idtype"
                                //value={name}
                                placeholder="Seleccione Tipo de Documento"
                                required
                                defaultValue={'DefaultValue'}
                            //onChange={onChange}
                            >
                                <option value="DefaultValue" disabled >Seleccione Tipo de Documento...</option>
                                        {
                                            idType.map((id, index) => (
                                                <option key={index} value={id} >{id}</option>
                                            ))
                                        }
                            </select>

                            <input className="text-black px-2 py-1 rounded-md leading-tight border-double border-4 border-black"
                                id="idnumber"
                                type="text"
                                name="idnumber"
                                //value={name}
                                placeholder="Numero de Documento"
                            //onChange={onChange}
                            >
                            </input>

                            <div className="flex overflow-hidden">
                                <PhoneInput className='bg-white text-black rounded-md leading-tight border-double border-4 border-black'
                                    country={'co'}
                                    value={phoneNumber}
                                    onChange={onChangePhoneNummber}
                                    inputStyle={{ width: 'auto', border: 'white' }}
                                    inputProps={{
                                        required: true

                                    }}
                                />
                                <input className="hidden" id="phone" name="phone" value={phoneNumber}></input>
                            </div>

                            <input className="text-black px-2 py-1 rounded-md leading-tight border-double border-4 border-black"
                                id="email"
                                type="email"
                                name="email"
                                //value={email}
                                placeholder="Correo Electronico"
                                required
                            //onChange={onChange}
                            >
                            </input>

                            <ValidationError prefix="Email" field="email" errors={state.errors} />

                            <div className="flex flex-col gap-2">
                                <select className="text-black px-2 py-1 rounded-md leading-tight border-double border-4 border-black"
                                    id="subject"
                                    type="text"
                                    name="subject"
                                    //value={subject}
                                    placeholder="Seleccione Asunto"
                                    defaultValue={'DefaultValue'}
                                //onChange={onChange}
                                >
                                    <option value="DefaultValue" disabled >Seleccione el Asunto...</option>
                                        {
                                            subject.map((item, index) => (
                                                <option key={index} value={item} >{item}</option>
                                            ))
                                        }
                                </select>

                                <textarea className="text-black px-2 py-1 rounded-md leading-tight border-double border-4 border-black"
                                    id="message"
                                    type="text"
                                    name="message"
                                    //value={message}
                                    rows={4}
                                    placeholder="Escriba su mensaje en este area"
                                //onChange={onChange}
                                ></textarea>

                                <ValidationError prefix="Message" field="message" errors={state.errors} />
                            </div>
                            
                            {/*BOTON PARA ENVIAR LA INFORMACION DEL FORMULARIO*/}
                            <div className="flex flex-col justify-center items-center gap-2 border-[1px] border-white rounded-md mb-4 md:mb-0">
                                <button disabled={active ? false:true} type="submit" className={`mt-2 bg-red-600 text-white rounded-md w-[80px] uppercase text-sm h-7 hover:opacity-70 ${active ? "":"opacity-70"}`}>enviar</button>
                                {/**RADIO BUTTON*/}
                                <div className="flex gap-2">
                                    <input
                                        type="radio"
                                        id="treatmentOfPersonalInformationPolicy"
                                        name="treatmentOfPersonalInformationPolicy"
                                        onClick={()=> setActivate(true)}>

                                    </input>
                                    <label className=" font-normal md:text-xs lg:text-sm">Acepto política de tratamiento de datos</label>
                                </div>
                            </div>
                        </form>

                    </div>
                    
                </div>

            </div>
            <Footer />
        </div>
    )
}

export default Contact_us;