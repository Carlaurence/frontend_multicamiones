//www.localhost:3000/trucks_list
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import swal from "sweetalert";
import crud from "../backEndConnection/crud";
//react-icons
import { BsTrash } from "react-icons/bs";
import { BiEdit, BiFemaleSign } from "react-icons/bi";
import { MdOutlineAddBox } from "react-icons/md";

const FinancialCorpList = () => {

    const navigate = useNavigate();
    const [reload, setReload] = useState(false)
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
                    /**PERMITE LA EJECUCION DEL COMPONENTE */
                    setReload(false)
                } else {
                    swal("ERROR", " Acceso Denegado \nUsuario Sin Loguear ", "error");
                    localStorage.removeItem('token');
                    navigate("/");
                }
            }
        }
        getUserAuthenticated();

        setIsTop(true)
        //EVENTO OYENTE PARA QUE EL MOVERSE EL SCROLL SETE [isTop === false]
        window.addEventListener('scroll', () => {
            setIsTop(window.scrollY === 0);
        });

        getAllFinancialCorps();
    }, [navigate, reload])

    const [financialCorps, setFinancialCorps] = useState([]);

    const getAllFinancialCorps = async () => {
        const response = await crud.GET(`/api/financialcorp`);
        setFinancialCorps(response.msg);
    }

    const deteleteFinancialCorp = async (id) => {
        const response = await crud.DELETE(`/api/financialcorp/${id}`);

        if (response.msg === 'Financiera no existe') {
            return swal("ERROR", "Financiera no existe!", "error");
        } else if (response.msg === 'Error de Try/Catch en el Backend') {
            return swal("ERROR", "Error de Try / Catch!", "error");
        } else {
            swal("HECHO!", "El nombre de la financiera fue borrado!", "success");
            setReload(true)
        }
    }

    const warningDelete = (id) => {
        swal({
            title: "Esta Seguro?",
            text: "Una vez borrado, Usted no podra recuperar este archivo!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    deteleteFinancialCorp(id);
                } else {
                    swal("Accion cancelada!");
                }
            });
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
                    <div className="relative mt-32 mb-14 bg-white flex justify-center items-center border border-black shadow-2xl shadow-red-600 w-[410px] p-3 rounded-xl">
                        <div className="bg-red-600 border border-white shadow-2xl shadow-black rounded-xl w-full">
                            <span className="mb-10 flex justify-center text-xl text-white pt-4 uppercase">Lista Compañias Financieras</span>

                            {financialCorps.map((financialCorp, index) => (

                                <div key={financialCorp._id}>

                                    <div className="flex flex-col justify-center items-center ">
                                        <div className="flex flex-row justify-center items-center gap-3 w-[350px] h-10 bg-black/20 border border-white">
                                            
                                            <div className="overflow-hidden flex w-[170px] h-7 font-semibold text-white text-[15px] opacity-80 rounded-sm border border-white"><h1>{financialCorp.name}</h1></div>
                                            <div className="overflow-hidden flex justify-center w-[85px] h-7 font-semibold text-base text-white opacity-80 rounded-sm border border-white"><h1>{financialCorp.apr + "% E.A"}</h1></div>
                                            
                                            <div className="flex items-center gap-2">
                                                <BiEdit className="hover:opacity-50" onClick={() => { navigate(`/update_financialcorp/${financialCorp._id}`) }} style={{ color: 'white', fontSize: '24px', cursor: "pointer" }} />
                                                <BsTrash className="hover:opacity-50" onClick={() => warningDelete(financialCorp._id)} style={{ color: 'white', fontSize: '24px', cursor: "pointer" }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="flex flex-col mt-8 mb-8 gap-4 justify-center items-center">
                                <Link to={"/create_financialcorp"} className="flex items-center justify-center gap-1 uppercase text-white text-sm underline hover:text-opacity-70 active:text-opacity-50" >Agregar Financiera<MdOutlineAddBox className="flex font-bold text-2xl "/></Link>
                                <Link to={"/admin"} className=" text-white text-sm uppercase underline hover:text-opacity-70 active:text-opacity-50" >Regresar a Modulo Admin</Link>
                            </div>
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

export default FinancialCorpList;