import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import swal from "sweetalert";
import crud from "../backEndConnection/crud";
//react-icons
import { BiEdit } from "react-icons/bi";

const UpdateCargoBodyType = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const getUserAuthenticated = async () => {//FILTRO DE SEGURIDAD PARA ACCEDER A URL'S PROTEGIDAS
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

    /*PRIMERA PARTE: *************************************************************************************
     * 1- SE RECIBE EL ID DEL FABRICANTE MEDIANTE LA URL Y LO CAPTURAMOS MEDIANTE EL useParams() *********
     * 2- SE EJECUTA EL useEffect() => Y ADENTRO SE EJECUTA EL FILTRO DE SEGURIDAD Y getCargoBodyTypeById ** 
     * 3- PARA TRAER LA INFORMACION PRECISA DEL getCargoBodyTypeById, UTILIZAMOS EL ID DEL useParams() ***
     * 4- AL EJECUTARSE getCargoBodyTypeById, TRAEMOS UN OBJ BY ID DESDE LA BBDD Y SETEAMOS cargoBody ****
     * 5- EL OBJETO cargoBody SE UTILIZARA EN EL RENDER PARA PINTAR EN NOMBRE DEL FURGON EN EL placeholder{} **
     ****************************************************************************************************/
    useEffect(() => {
        getUserAuthenticated();
        getCargoBodyTypeById();
    }, [navigate])

    const [cargoBody, setCargoBody] = useState([]);
    const [uneditable, setUneditable] = useState(true);

    const getCargoBodyTypeById = async () => {
        const response = await crud.GET(`/api/cargobodytype/${id}`);

        if (response.msg === 'ERROR: data incompleta') {
            swal("ERROR", "Accion Invalida! \nData Requerida Incompleta", "error");
            navigate('/cargobodytype_list');
        } else if (response.msg === 'no hay ningun tipo de furgon con ese id') {
            swal("ERROR", "Accion Invalida! \nNo Se Encontro Ningun Furgon con el ID Ingresado", "error");
            navigate('/cargobodytype_list');
        } else if (response.msn === "error de try / catch") {
            swal("ERROR", "Accion Invalida! \nSe Presento Un Error De Try / Catch", "error");
            navigate('/cargobodytype_list');
        } else {
            setCargoBody(response.msg);
            console.log(response.msg)
        }
    }
    /*SEGUNDA PARTE: *****************************************************************************************
     * 1- SE CREA UN useState [dataUpdateCargoBody] QUE CONTIENE LA DATA REQUERIDA {name:''} PARA ACTUALIZAR EL NOMBRE DE UN FURGON**
     * 2- LA DATA REQUERIDA PARA ACTUALIZAR UN FURGON ES {id:''} Y {name:''} **********************************
     * 3- LA DATA {id:''} LA CAPTURAMOS DE LA URL CON EL useParams() ******************************************
     * 4- LA DATA {name:''} LA CAPTURAMOS DEL useState [dataUpdateCargoBody] **********************************
     * 5- SE CREA UN onChange QUE CAPTURA LOS CAMBIOS INSERTADOS EN EL INPUT name CUANDO SE SOBRE-ESCRIBE *****
     * 6- CADA QUE SE EJECUTA EL onChange SE SETEA dataUpdateCargoBody CON LA NUEVA DATA PARA ACTUALIZAR ******
     * 7- dataUpdateManufacturer YA CONTIENE LA NUEVA DATA {name:''} REQUERIDA PARA ACTUALIZAR EL FURGON ******
     *********************************************************************************************************/
    const [dataUpdateCargoBody, setDataUpdateCargoBody] = useState({
        name: ''
    });

    const onChange = (e) => {
        setDataUpdateCargoBody({
            ...dataUpdateCargoBody,
            [e.target.name]: e.target.value.trimStart()//trim() PARA EVITAR EL INGRESO DE ESPACIOS EN BLANCO
        })
    };

    /*TERCERA PARTE: *****************************************************************************************
     * 1- AL PRESIONAR EL BOTON [GUARDAR CAMBIOS] SE EJECUTA LA FUNCION onSubmit() DESDE EL FORM<> ***********
     * 2- AL EJECUTARSE LA FUNCION onSubmit(), SE EJECUTA LA FUNCION updateCargoBodyType() **************
     * 3- AQUI SE ACTUALIZA LA INFORMACION DEL FURGON CON LA NUEVA DATA INGRESDA *************************
     ********************************************************************************************************/
    //CUANDO SE PRESIONA EL BOTON [ACTUALIZAR] LA <form> EJECUTA LA FUNCION {onSubmit}
    const onSubmit = (e) => {
        e.preventDefault();//impedir que se recargue automaticamente
        updateCargoBodyType();
    }

    const updateCargoBodyType = async () => {

        const data = {//DATA REQUERIDA PARA ACTUALIZAR UN FABRICANTE
            id: id,
            name: dataUpdateCargoBody.name.toUpperCase()
        }

        const response = await crud.PUT(`/api/cargobodytype`, data);
        console.log(response.msg)

        if (response.msg === 'ERROR: data incompleta. ID Missing') {
            swal("ERROR", "Accion Invalida! \nData incompleta. ID Missing", "error");
            navigate('/cargobodytype_list');
        }else if(response.msg === 'No se encontro Ningun Furgon con el ID ingresado'){
            swal("ERROR", "Accion Invalida! \nNo Se Encontro Ningun Furgon con el ID Ingresado", "error");
            navigate('/cargobodytype_list');
        }else if(response.msg === 'ERROR: data incompleta. NAME Missing'){
            swal("ERROR", "Accion Invalida! \nData incompleta. NAME Missing", "error");
            navigate('/cargobodytype_list');
        }else if(response.msg === 'el nombre del furgon ya existe'){
            swal("ERROR", "Accion Invalida! \nEl Nombre que esta intentando reemplazar ya existe", "error");
        }else if(response.msg === 'error de try / catch'){
            swal("ERROR", "Accion Invalida! \nSe Presento Un Error De Try / Catch", "error");
            navigate('/cargobodytype_list');
        } else {
            swal("BIEN HECHO!", "El nombre del Furgon fue actualizado exitosamente!", "success");
            navigate(`/cargobodytype_list`);
        }

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
                    <div className="relative mt-32 mb-14 bg-white border border-black shadow-2xl shadow-red-600 h-[324px] w-[484px] rounded-xl flex justify-center items-center">
                        <div className="bg-red-600 border border-white shadow-2xl shadow-black h-[300px] w-[460px] rounded-xl ">
                            <span className="mb-6 flex justify-center text-xl text-white pt-4 font-semibold uppercase">Editar Informacion Tipo De Furgon</span>

                            <form onSubmit={onSubmit} className="flex flex-col justify-center items-center mb-4">
                                <div className="flex flex-row gap-4">
                                    <label className=" text-white font-semibold text-lg">Furgon</label>
                                    <div className="bg-gray-300 rounded-xl">
                                        <input className={`bg-white font-bold text-gray-700 py-[6px] px-[14px] rounded-xl leading-tight border border-black ${uneditable === true ? "opacity-50" : "opacity-100"}`}
                                            id="name"
                                            type="text"
                                            name="name"
                                            value={dataUpdateCargoBody.name.toUpperCase()}
                                            placeholder={cargoBody.name}
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
                                    <Link className="mb-1 text-white underline hover:text-opacity-70 active:text-opacity-50" to={"/cargobodytype_list"}>Regresar</Link>
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

export default UpdateCargoBodyType;