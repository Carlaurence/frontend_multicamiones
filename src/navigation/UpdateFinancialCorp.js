import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import swal from "sweetalert";
import crud from "../backEndConnection/crud";
//react-icons
import { BiEdit } from "react-icons/bi";

const UpdateFinancialCorp = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const subtitle = { "name": "Financiera", "apr": "Tasa Interese % E.A" }
    const [isTop, setIsTop] = useState(true)//SETEA [isTop === true] PARA QUE SE RENDERICE EN EL TOP:0

    useEffect(() => {

        const getUserAuthenticated = async () => {//FILTRO DE SEGURIDAD PARA ACCEDER A URL'S PROTEGIDAS
            const token = localStorage.getItem('token');
            if (!token) {
                swal("ERROR", " Acceso Denegado \nUsuario Sin Loguear ", "error");
                navigate("/")
            } else {
                const response = await crud.GET(`/api/login`);
                if (response.user) {
                    /**PERMITE LA EJECUCION DEL MODULO */
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

        getFinancialCorpById();

    }, [navigate])

    const [financialCorp, setFinancialCorp] = useState([]);
    const [edit, setEdit] = useState(false);//EXCLUSIVO PARA MANEJAR EL ICONO [EDITAR]

    const getFinancialCorpById = async () => {
        const response = await crud.GET(`/api/financialcorp/byid/${id}`);
        console.log(response.msg)
        setFinancialCorp(response.msg);
    }
    
    const [dataFinancialCorp, setDataFinancialCorp] = useState({
        name: '',
        apr: ''
    });

    const onChange = (e) => {
        setDataFinancialCorp({
            ...dataFinancialCorp,
            [e.target.name]: e.target.value.trimStart()//trim() PARA EVITAR EL INGRESO DE ESPACIOS EN BLANCO
        })
    };

    //CUANDO SE PRESIONA EL BOTON [ACTUALIZAR] LA <form> EJECUTA LA FUNCION {onSubmit}
    const onSubmit = (e) => {
        e.preventDefault();
        updateFinancialCorp();
    }

    const updateFinancialCorp = async () => {

        const data = {//DATA REQUERIDA PARA ACTUALIZAR UNA FINANCIERA
            name: dataFinancialCorp.name.toUpperCase(),
            apr: dataFinancialCorp.apr
        }

        const response = await crud.PUT(`/api/financialcorp/${id}`, data);
        console.log(response.msg)

        if (response.msg === 'No se encontro Financiera con el ID ingresado') {
            swal("ACCION INVALIDA", "No Se Encontro Financiera con el ID Ingresado", "error");
            navigate('/financialcorp_list');
        }else if(response.msg === 'Error de Try/Catch en el Backend'){
            swal("ERROR", "Error de Try/Catch en el Backend", "error");
            navigate('/financialcorp_list');
        } else {
            swal("BIEN HECHO!", "La Financiera fue actualizado exitosamente!", "success");
            navigate('/financialcorp_list');
        }
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
                            <span className="mb-10 flex justify-center text-xl text-white pt-4 font-semibold uppercase">Editar Corp. Financiera</span>

                            <form onSubmit={onSubmit} className="flex flex-col justify-center items-center gap-3">
                                
                                <div className="flex flex-col w-[80%]">
                                    
                                    <label className=" text-white font-medium">{subtitle.name}</label>
                                    <div className="flex flex-row justify-between">
                                        <input className={`font-bold text-gray-700 py-2 px-4 rounded-xl leading-tight border border-black`}
                                            id="name"
                                            type="text"
                                            name="name"
                                            value={dataFinancialCorp.name.toUpperCase()}
                                            placeholder={financialCorp.name}
                                            disabled={edit === subtitle.name ? false : true}
                                            
                                            onChange={onChange}
                                        ></input>

                                        <div className="flex items-center gap-4">
                                            <BiEdit className="hover:opacity-50 active:opacity-70" onClick={() => { edit !== subtitle.name ? setEdit(subtitle.name) : setEdit("")  }} style={{ color: 'white', fontSize: '24px', cursor: "pointer" }} />
                                        </div>

                                    </div>
                                </div>

                                <div className="flex flex-col w-[80%]">

                                <label className=" text-white font-medium">{subtitle.apr}</label>
                                    <div className="flex flex-row justify-between">
                                        <input className={`font-bold text-gray-700 py-2 px-4 rounded-xl leading-tight border border-black `}
                                            id="apr"
                                            type="number"
                                            name="apr"
                                            value={dataFinancialCorp.apr.toUpperCase()}
                                            placeholder={financialCorp.apr}
                                            disabled={edit === subtitle.apr ? false : true}
                                            
                                            step='0.01'
                                            onChange={onChange}
                                        ></input>

                                        <div className="flex items-center gap-4">
                                            <BiEdit className="hover:opacity-50 active:opacity-70" onClick={() => { edit !== subtitle.apr ? setEdit(subtitle.apr) : setEdit("") }} style={{ color: 'white', fontSize: '24px', cursor: "pointer" }} />
                                        </div>

                                    </div>
                                    
                                </div>

                                <div className="flex flex-col justify-center items-center pt-6 mb-3 w-[80%]">
                                    <button type="submit" value="Guardar Cambios" className="bg-white rounded-xl border border-black shadow-lg shadow-black hover:bg-opacity-90 active:bg-opacity-70 w-full h-[36px] flex justify-center items-center text-red-600 font-bold uppercase" >Guardar Cambios</button>
                                </div>

                                <div className="mb-8 flex flex-col font-normal justify-center items-center text-sm">
                                    <Link to={"/financialcorp_list"} className=" text-white text-sm uppercase underline font-semibold hover:text-opacity-70 active:text-opacity-50" >Regresar</Link>
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

export default UpdateFinancialCorp;