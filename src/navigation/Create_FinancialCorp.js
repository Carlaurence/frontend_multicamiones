import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import crud from "../backEndConnection/crud";
import swal from "sweetalert";


const CreateFinancialCorp = () => {

    const navigate = useNavigate()
    const [isTop, setIsTop] = useState(true)//SETEA [isTop === true] PARA QUE SE RENDERICE EN EL TOP:0

    useEffect(() => {
        const getUserAuthenticated = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                swal("ERROR", " Acceso Denegado \nUsuario Sin Loguear ", "error");
                navigate("/")
            } else {
                const response = await crud.GET(`/api/login`);
    
                if (response.user) {
                    /**PERMITE INGRESO Y EJECUCION DEL RETURN*/
                } else {
                    swal("ERROR", " Acceso Denegado \nUsuario Sin Loguear ", "error");
                    localStorage.removeItem('token');
                    navigate("/");
                }
            }
        }
        getUserAuthenticated(); 

        //EVENTO OYENTE PARA QUE EL MOVERSE EL SCROLL SETE [isTop === false]
        window.addEventListener('scroll', () => {
            setIsTop(window.scrollY === 0);
        });

    }, [navigate]) 

    const [financialCorp, setFinancialCorp] = useState({
        name: '',
        apr: ''
    });

    const onChange = (e) => {
        setFinancialCorp({
            ...financialCorp,
            [e.target.name]: e.target.value.trimStart()
        })
    };

    const createFinanacialCorp = async () => {

        if (!financialCorp.name) {
            return swal("ERROR", "Todos los campos son obligatorios!", "error");
        } else if(!financialCorp.apr){
            return swal("ERROR", "Todos los campos son obligatorios!", "error");
        }else {

            const data = {
                name: financialCorp.name.toUpperCase(),
                apr: financialCorp.apr
            }

            const response = await crud.POST(`/api/financialcorp`, data);
            console.log(response.msg);//respuesta confirmada en consola  

            if (response.msg === "Error de Try/Catch en el Backend") {
                return swal("ERROR", "Error de Try/Catch en el Backend", "error");
            } else {
                swal("BIEN HECHO!", "La 'Financiera' se creo correctamente!", "success");
                navigate("/financialcorp_list")
            }
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        createFinanacialCorp();
    }

    return (
        <div className={`overflow-hidden bg-gradient-to-r from-black via-gray-400 to to-white ${isTop ? window.scrollTo({ top: 0 }) : ''}`}>
            <Navbar />
            {/*AQUI ORGANIZAMOS EL DIV PARA QUE LA PANTALLA SE DIVIDA EN DOS, A LA IZQ EL SIDBAR Y A LA DERECHA EL FORMULARIO*/}
            <div className="flex flex-row min-h-screen w-screen">
                <Sidebar />
                    
                {/*PANTALLA MD: Y LG:*/}
                <div className="hidden md:flex justify-center items-center w-screen font-semibold">

                    {/*FORMULARIO*/}
                    <div className="relative mt-32 mb-14 bg-white flex justify-center items-center border border-black shadow-2xl shadow-red-600 w-[360px] p-3 rounded-xl">
                        <div className="bg-red-600 border border-white shadow-2xl shadow-black rounded-xl w-full">
                            <span className="mb-10 flex justify-center text-xl text-white pt-4 font-semibold uppercase">Crear Financiera</span>

                            <form onSubmit={onSubmit} className="flex flex-col justify-center items-center gap-3">
                                <div className="flex flex-col w-[80%]">
                                    <label className=" text-white font-medium">Entidad</label>
                                    <input className=" text-gray-700 py-2 px-4 rounded-xl leading-tight border border-black"
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder="Nombre de la Entidad Financiera"
                                        required
                                        //value={make.toUpperCase()}
                                        onChange={onChange}
                                    ></input>
                                </div>

                                <div className="flex flex-col w-[80%]">
                                    <label className=" text-white font-medium">Tasa Interes E.A</label>
                                    <input className=" text-gray-700 py-2 px-4 rounded-xl leading-tight border border-black"
                                        id="apr"
                                        type="number"
                                        name="apr"
                                        placeholder="Tasa Efectiva Anual"
                                        step="0.01"
                                        required
                                        //value={make.toUpperCase()}
                                        onChange={onChange}
                                    ></input>
                                </div>
                                
                                <div className="flex flex-col justify-center items-center pt-6 mb-3 w-[80%]">
                                    <button type="submit" value="make" className="bg-white rounded-xl border border-black shadow-lg shadow-black hover:bg-opacity-90 active:bg-opacity-70 w-full h-[36px] flex justify-center items-center text-red-600 font-bold uppercase" >crear financiera</button>
                                </div>

                                <div className="mb-8 flex flex-col font-normal justify-center items-center text-sm">
                                    <Link to={"/admin"} className=" text-white text-sm uppercase underline font-semibold hover:text-opacity-70 active:text-opacity-50" >Regresar a Modulo Admin</Link>
                                </div>

                            </form>
                        </div>
                    </div>
                    {/*FIN FORMULARIO*/}

                </div>
                {/*FIN PANTALLA MD: Y LG:*/}

                {/*PANTALLA DISPOSITIVOS MOVILES*/}
                <div className="flex md:hidden w-full items-center justify-center mt-32 mb-14 font-bold uppercase">
                    <span className="text-xl text-center">Modulo no permitido en dispositivos moviles</span>
                </div>

            </div>
            <Footer />
        </div>
    )
}

export default CreateFinancialCorp;