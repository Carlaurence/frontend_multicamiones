import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import swal from "sweetalert";
import crud from "../backEndConnection/crud";
//react-icons
import { BiEdit } from "react-icons/bi";

const UpdateManufacturer = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    //FILTRO DE SEGURIDAD PARA ACCEDER ACCEDER A URL'S PROTEGIDAS "/trucks_list"
    //SE EJECUTA CON useEfeect()
    const getUserAuthenticated = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            swal("ERROR", " Acceso Denegado \nUsuario Sin Loguear ", "error");
            navigate("/")
        } else {
            const response = await crud.GET(`/api/login`);
            if (response.user) {
            } else {
                swal("ERROR", " Acceso Denegado \nUsuario Sin Loguear ", "error");
                localStorage.removeItem('token');
                navigate("/");
            }
        }
    }

    const [manufacturer, setManufacturer] = useState([]);
    const [uneditable, setUneditable] = useState(true);

    const getManufacturerById = async () => {
        const response = await crud.GET(`/api/manufacturer/${id}`);
        if (response.msg === 'ERROR: data incompleta') {
            swal("ERROR", "Accion Invalida! \nData Requerida Incompleta", "error");
            navigate('/manufacturers_list');
        } else if (response.msg === 'no hay marca y/o fabricante con ese id') {
            swal("ERROR", "Accion Invalida! \nNo Se Encontro Fabricantes con el ID Ingresado", "error");
            navigate('/manufacturers_list');
        } else if (response.msn === "error de try / catch") {
            swal("ERROR", "Accion Invalida! \nSe Presento Un Error De Try / Catch", "error");
            navigate('/manufacturers_lists');
        } else {
            setManufacturer(response.msg);
            console.log(response.msg)
        }
    }

    useEffect(() => {
        getUserAuthenticated();
        getManufacturerById();
    }, [navigate])

    const [dataUpdateManufacturer, setDataUpdateManufacturer] = useState({
        make: ''
    });

    const onChange = (e) => {
        setDataUpdateManufacturer({
            ...dataUpdateManufacturer,
            [e.target.name]: e.target.value.trimStart()//trim() PARA EVITAR EL INGRESO DE ESPACIOS EN BLANCO
        })
    };

    const updateManufacturer = async () => {

        const data = {
            id: id,
            make: dataUpdateManufacturer.make.toUpperCase()
        }

        const response = await crud.PUT(`/api/manufacturer`, data);
        console.log(response.msg)

        if (response.msg === 'data incompleta. ID Missing') {
            swal("ERROR", "Accion Invalida! \nData incompleta. ID Missing", "error");
            navigate('/manufacturers_list');
        }else if(response.msg === 'No se encontro Marca con el ID ingresado'){
            swal("ERROR", "Accion Invalida! \nNo Se Encontro Fabricantes con el ID Ingresado", "error");
            navigate('/manufacturers_list');
        }else if(response.msg === 'la marca ya existe'){
            swal("ERROR", "Accion Invalida! \nLa Marca que esta intentando crear ya existe", "error");
        }else if(response.msg === 'error de try / catch'){
            swal("ERROR", "Accion Invalida! \nSe Presento Un Error De Try / Catch", "error");
            navigate('/enginemanufacturers_list');
        }else {
            swal("BIEN HECHO!", "La Marca fue actualizado exitosamente!", "success");
            navigate(`/manufacturers_list`);
        }
    }

    //CUANDO SE PRESIONA EL BOTON [ACTUALIZAR] LA <form> EJECUTA LA FUNCION {onSubmit}
    const onSubmit = (e) => {
        e.preventDefault();//impedir que se recargue automaticamente
        updateManufacturer();
    }

    return (
        <div className="overflow-hidden">
            <Navbar />
            {/*AQUI ORGANIZAMOS EL DIV PARA QUE LA PANTALLA SE DIVIDA EN DOS, A LA IZQ EL SIDBAR Y A LA DERECHA EL FORMULARIO*/}
            <div className="flex flex-row min-h-screen w-screen bg-gradient-to-r from-black via-gray-400 to to-white">
                <Sidebar />
                    
                {/*PANTALLA MD: Y LG:*/}
                <div className="hidden md:flex justify-center items-center w-screen font-semibold">

                    {/*FORMULARIO*/}
                    <div className="relative mt-32 mb-14 bg-white flex justify-center items-center border border-black shadow-2xl shadow-red-600 w-[484px] p-3 rounded-xl">
                        <div className="bg-red-600 border border-white shadow-2xl shadow-black rounded-xl w-full">
                            <span className="mb-6 flex justify-center text-xl text-white pt-4 font-semibold uppercase">Editar Informacion Fabricante</span>

                            <form onSubmit={onSubmit} className="flex flex-col justify-center items-center mb-4">
                                <div className="flex flex-row gap-4">
                                    <label className=" text-white font-semibold text-lg">Marca</label>
                                    <div className="bg-gray-300 rounded-xl">
                                        <input className={`bg-white font-bold text-gray-700 py-[6px] px-[14px] rounded-xl leading-tight border border-black ${uneditable === true ? "opacity-50" : "opacity-100"}`}
                                            id="make"
                                            type="text"
                                            name="make"
                                            value={dataUpdateManufacturer.make.toUpperCase()}
                                            placeholder={manufacturer.make}
                                            disabled={uneditable}
                                            required
                                            onChange={onChange}
                                        ></input>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <BiEdit className="hover:opacity-50 active:opacity-70" onClick={() => { uneditable === true ? setUneditable(false) : setUneditable(true) }} style={{ color: 'white', fontSize: '24px', cursor: "pointer" }} />
                                    </div>
                                </div>


                                <div className="flex flex-col mt-10 mb-4">
                                    <button type="submit" value="Guardar Cambios" className="bg-white text-red-600 rounded-full border border-black shadow-lg shadow-black hover:bg-opacity-90 active:bg-opacity-70 w-[200px] h-[36px] flex justify-center items-center font-bold" >Guardar Cambios</button>
                                </div>

                                <div className="flex flex-col font-normal justify-center items-center text-sm">
                                    <Link className="mb-1 text-white underline hover:text-opacity-70 active:text-opacity-50" to={"/manufacturers_list"}>Regresar</Link>
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

export default UpdateManufacturer;