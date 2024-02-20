import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import crud from "../backEndConnection/crud";
import swal from "sweetalert";


const CreateModel = () => {

    const navigate = useNavigate();

    const getUserAuthenticated = async () => {//FILTRO DE SEGURIDAD PARA ACCEDER ACCEDER A URL'S PROTEGIDAS "/products"
        const token = localStorage.getItem('token');//IR A localStorage Y TRAER VALUE: DE {KEY 'token'}
        //PRIMER FILTRO #1
        if (!token) {//SI NO HAY TOKEN, IMPEDIR ACCESO Y RE-DIRECCIONAR AL HOME "/"
            swal("ERROR", " Acceso Denegado \nUsuario Sin Loguear ", "error");
            navigate("/")
        } else {//SI HAY TOKEN, EJECUTE EL MICROSERVICIO
            const response = await crud.GET(`/api/login`);//VIAJA AL LOCALSTORAGE(HEADER) Y LEE TOKEN ALMACENADO

            /*SI EL TOKEN ES VALIDO, EL "response" NOS DEBE RETORNA LA INFORMACION DEL USUARIO EN UN JSON
             CON key "user" Y VALUE {_id:"xxxx", name:"Mxxxx", lastname:"Cxxxxx", email: "xxx@gmail.com"}*/
            if (response.user) {
                //SI EL USER ES TRUE, ENTONCES SE PERMITE EL ACCESO AL MODULO "/ADMIN"
            } else {//SI NO RETORNA EL USER, ENTONCES ACCESO DENEGADO
                swal("ERROR", " Acceso Denegado \nUsuario Sin Loguear ", "error");
                localStorage.removeItem('token');
                navigate("/");
            }
        }
    }

    /*PRIMERA PARTE: *************************************************************************************
     * 1- SE EJECUTA EL useEffect() => *******************************************************************
     * 2- SE EJECUTA EL FILTRO DE SEGURIDAD Y EL REQUEST getManufacturers() ******************************
     * 3- AQUI SETEAMOS manufacturers PARA TENER LA PRE-SELECCION DE TODOS LOS FABRICANTES ***************
     ****************************************************************************************************/
    const [manufacturers, setManufacturers] = useState([]);//manufacturers VA A GUARDAR EL ARRAY DE MARCAS
    const getManufacturers = async () => {
        const response = await crud.GET(`/api/manufacturer/`);
        console.log(response.msg)
        setManufacturers(response.msg)
    }

    useEffect(() => {//AL ACCEDER AL MODULO SE EJECUTA AUTOMATICAMENTE ESTE USEEFECT
        getUserAuthenticated();//EJECUTA EL FILTRO DE SEGURIDAD 
        getManufacturers();//EJECUTA EL REQUEST PARA TRAER TODAS LAS MARCAS QUE EXISTAN EN NUESTRA BBDD
    }, [navigate]) 

/*SEGUNDA PARTE: *************************************************************************************
     * 1- CREAMOS USESTATE [dataNewModel] QUE CONTIENE LA DATA NECESARIA PAR CREAR UN NUEVO MODELO *******
     * 2- CAMPO "manufacturerID" SE SETEA CON onChangeManufacturerID CADA QUE SE SELECIONA UN FABRICANTE *
     * 3- CAMPO "model" SE SETEA CON onChangeModel CADA QUE SE SOBRE-ESCRIBE EN EL INPUT MODEL ***********
     ****************************************************************************************************/
    const [dataNewModel, setDataNewModel] = useState({
        manufacturerID: '',
        model: ''
    });

    const { manufacturerID, model } = dataNewModel;
    //console.log(dataNewModel)//VERIFICAR LOS CAMBIOS INSRTADOS CON onChangeManufacturerID && onChangeModel

    const onChangeManufacturerID = (e) => {
        setDataNewModel({
            ...dataNewModel,
            [e.target.name]: e.target.value //ESTO ES UN JSON FORMADO POR EL ATRIBUTO name y value {name : value} 
        })
        //console.log(e.target.value)//CONFIRMAR EL CONTENIDO DEL ATRIBUTO value
    }

    const onChangeModel = (e) => {
        setDataNewModel({
            ...dataNewModel,
            [e.target.name]: e.target.value.trimStart()//trim() PARA EVITAR EL INGRESO DE ESPACIOS EN BLANCO 
            //PODEMOS CAMBIARLO POR trimStart() PARA DARLE OPCION DE GENERAR UN ESPACIO DESPUES DE UN TEXTO
        })
        //console.log(e.target.value)//CONFIRMAR EL CONTENIDO DEL ATRIBUTO value
    }

    /*TERCERA PARTE: ********************************************************************************************
     * 1- EL BOTOM [GUARDAR REGISTRO] EJECUTA EL onSubmit Y SE EJECUTA EL REQUEST createModelByManufacturer *****
     * *********************************************************************************************************/
    const onSubmit = (e) => {
        e.preventDefault();//Form submission canceled because the form is not connected
        createModelByManufacturer();
    }
    
    const createModelByManufacturer = async() => {

        const data = {
            id: dataNewModel.manufacturerID,
            model: dataNewModel.model.toUpperCase()
        }

        const response = await crud.PUT(`/api/manufacturer`, data);
        console.log(response.msg)

        if (response.msg === 'data incompleta. ID Missing') {
            swal("ERROR", "Accion Invalida! \nData incompleta. ID Missing", "error");
        }else if(response.msg === 'No se encontro Marca con el ID ingresado'){
            swal("ERROR", "Accion Invalida! \nNo Se Encontro Fabricantes con el ID Ingresado", "error");
        }else if(response.msg === 'el modelo ya existe'){
            swal("ERROR", "Accion Invalida! \nEl Modelo que esta intentando crear ya existe", "error");
        }else if(response.msg === 'error de try / catch'){
            swal("ERROR", "Accion Invalida! \nSe Presento Un Error De Try / Catch", "error");
        }else{
        swal("BIEN HECHO!", "El Modelo fue creado exitosamente!", "success");
            navigate(`/admin`);
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
                    <div className="relative mt-32 mb-14 bg-white flex justify-center items-center border border-black shadow-2xl shadow-red-600 w-[484px] p-3 rounded-xl">
                        <div className="bg-red-600 border border-white shadow-2xl shadow-black rounded-xl w-full">
                            <span className="mb-6 flex justify-center text-xl text-white pt-4 font-semibold uppercase">Crear Modelo por Fabricante</span>

                            <form onSubmit={onSubmit} className="flex flex-col justify-center items-center gap-3">

                                <div className="flex flex-col">
                                    <label className=" text-white font-medium">Marca</label>
                                    <select className={`text-gray-700 py-2 px-[55px] rounded-xl leading-tight border border-black`}
                                        id="make"
                                        type="text"
                                        name="manufacturerID"
                                        defaultValue={'DefaultValue'}
                                        onChange={onChangeManufacturerID}//CAPTURA LA SELECCION

                                    >
                                        <option value="DefaultValue" disabled >Seleccione una Marca...</option>
                                        {
                                            manufacturers.map((manufacturer, index) => (
                                                <option key={manufacturer._id} value={manufacturer._id}>{manufacturer.make}</option>
                                            ))
                                        }

                                    </select>
                                </div>

                                <div className={`${manufacturerID === "" ? "hidden" : "flex flex-col "}`}>
                                    <label className=" text-white font-medium">Modelo</label>
                                    <input className=" text-gray-700 py-2 px-12 rounded-xl leading-tight border border-black"
                                        id="model"
                                        type="text"
                                        name="model"
                                        placeholder="Modelo"
                                        required
                                        value={model.toUpperCase()}
                                        onChange={onChangeModel}
                                    ></input>
                                </div>

                                <div className={`${manufacturerID === "" ? "hidden" : "flex flex-col mt-5"}`}>
                                    <button type="submit" value="make" className="bg-white rounded-full border border-black shadow-lg shadow-black hover:bg-opacity-90 active:bg-opacity-70 w-[200px] h-[36px] flex justify-center items-center text-red-600 font-bold" >Guardar Registro</button>
                                </div>

                                <div className="flex flex-col mt-5 mb-12 font-normal justify-center items-center text-sm">
                                    <Link className="mb-1 text-white underline hover:text-opacity-70 active:text-opacity-50" to={"/admin"}>Regresar a Modulo Admin</Link>
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

export default CreateModel;