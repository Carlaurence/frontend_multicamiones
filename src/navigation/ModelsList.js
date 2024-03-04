/*
* A MODULO SE ACCEDE MENDIENTE EL LINK http://localhost:3000/models_list
* EN ESTE MODULO MANEJAMOS LAS SIGUIENTES OPERACIONES:
* 1- EDITAR UN MODELO CUANDO SE PRESIONA EL BOTTOM [GUARDAR]
* 2- ELIMINAR UN MODELO CUANDO SE PRESIONA EL ICON [TRASH]
* AL EJECUTAR EL REQUEST CON EXITO, VIAJA A OTRA URL
 */

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import crud from "../backEndConnection/crud";
import swal from "sweetalert";
//react-icons
import { BsTrash } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";


const ModelsList = () => {

    const navigate = useNavigate();
    const [reload, setReload] = useState(false)//PARA REFRESCAR LA PAGINA

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
    const [manufacturers, setManufacturers] = useState([]);
    const getManufacturers = async () => {//AQUI SE CARGAN LAS OPCIONES DE SELECCION DE MARCAS
        const response = await crud.GET(`/api/manufacturer/`);
        //console.log(response.msg)
        setManufacturers(response.msg)
    }

    const [isTop, setIsTop] = useState(true)//SETEA [isTop === true] PARA QUE SE RENDERICE EN EL TOP:0

    useEffect(() => {
        getUserAuthenticated();//EJECUTA EL FILTRO DE SEGURIDAD 
        setReload(false);//CUANDO SE CREA EL PRODUCTO TENEMOS QUE DEVOLVER A reload A SU ESTADO (false)

        setIsTop(true)//AL ELIMINAR UNA CargoBoryType SE EJECUTA EL reload Y A SU VEZ EL useEffect, ENTONCES DEBEMOS SETEAR isTop = true PARA QUE VUELVA AL TOP:0
        //EVENTO OYENTE PARA QUE EL MOVERSE EL SCROLL SETE [isTop === false]
        window.addEventListener('scroll', () => {
            setIsTop(window.scrollY === 0);
        });

        getManufacturers();//EJECUTA EL REQUEST PARA TRAER TODAS LAS MARCAS QUE EXISTAN EN NUESTRA BBDD
    }, [navigate, reload])//[navigate] 

    /*SEGUNDA PARTE: *************************************************************************************
     * 1- SE EJECUTA EL getManufacturerById(id) PARA TRAER LA INFO DEL FABRICANTE PRE-SELECCIONADO *******
     * 2- EN EL ESTADO models GUARDAMOS EL ARRAY DE MODELOS DEL FABRICANTE PRE-SELECCIONADO **************
     * 3- MEDIANTE EL ESTADO uneditable DAREMOS EL PERMISO PARA QUE EL CAMPOS MODELO SEA EDITABLE O NO ***
     ****************************************************************************************************/
    const [manufacturer, setManufacturer] = useState(false);//UN SOLO OBJETO TRAIDO MEDIANTE SU ID
    const [models, setModels] = useState([])
    const [uneditable, setUneditable] = useState(true);

    const getManufacturerById = async (id) => {//ESTA FUNCION SE VA A EJECUTAR CADA QUE SE SELECCIONE UNA MARCA
        const response = await crud.GET(`/api/manufacturer/${id}`);
        //console.log(response.msg.model)
        setModels(response.msg.model)//array de modelos
        setManufacturer(response.msg)
    }

    /*TERCERA PARTE: *************************************************************************************
     * 1- SE EJECUTA EL getManufacturerById(id) PARA TRAER LA INFO DEL FABRICANTE PRE-SELECCIONADO *******
     * 2- EL ESTADO dataUpdateModel ALMACENARA LA DATA PARA EDITAR Y/O ELIMINAR UN MODELO ****************
     * 3- EL onChangeManufacturer SE EJECUTA AL SELECCIONAR UN FABRICANTE Y SE ENCARGA DE SETEAR EL CAMPO id: *
     * 4- EL CAMPO updatedModel: SE SETEA DIRECTAMENTE CON LA FUNCION onClick() SOBRE EL ICONO************
     * 5- EL onChangeModel SE EJECUTA AL SOBRE-ESCRIBIR EN EL NPUT MODELO ********************************/
    //AQUI SE ALMACENARA LA DATA EN UN JSON PARA REEMPLAZAR UN MODELO EXISTENTE Y/O ELIMINARLO
    const [dataUpdateModel, setDataUpdateModel] = useState({
        id: '',
        updatedModel: '',
        position: ''
    });

    //console.log(dataUpdateModel)

    const onChangeManufacturer = (e) => {//ESTE onChangeManufacturer SE EJECUTA CUANDO SELECCIONAMOS UN FABRICANTE

        getManufacturerById(e.target.value);

        setDataUpdateModel({
            ...dataUpdateModel,
            [e.target.name]: e.target.value,
            updatedModel: '',
            position: ''
        })

        setUneditable(true);
    }

    const onChangeModel = (e) => {//ESTE onChangeModel SE EJECUTA CUANDO SOBRE-ESCRIBIMOS PARA MODIFICAR EL MODELO 
        setDataUpdateModel({
            ...dataUpdateModel,
            [e.target.name]: e.target.value.trimStart()
        })
    }

    /*CUARTA PARTE: ACTUALIZAR INFORMACION DE UN MODELO EXISTENTE ***************************************
     * 1- EL BOTOM [GUARDAR CAMBIOS] EJECUTA EL onSubmit Y ALLI SE EJECUTA EL REQUEST updateModel() *****
     * **************************************************************************************************/
    const onSubmit = (e) => {
        e.preventDefault();
        updateModel();
    }

    const updateModel = async () => {

        const data = {//ESTA ES LA DATA REQUERIDA DEL BODY req.body
            id: dataUpdateModel.id,
            updatedModel: dataUpdateModel.updatedModel.toUpperCase(),
            position: dataUpdateModel.position
        }
        //console.log(data)

        const response = await crud.PUT(`/api/manufacturer/update_model`, data)
        //console.log(response.msg)

        if (response.msg === "ERROR: data incompleta") {
            swal("ERROR", "Accion Invalida! \nData Requerida Incompleta", "error");
        } else if (response.msg === "ERROR: No hay Marcas con 'id' ingresado") {
            swal("ERROR", "Accion Invalida! \nNo Se Encontro Fabricantes con el ID Ingresado", "error");
        }else if(response.msn === "error de try / catch"){
            swal("ERROR", "Accion Invalida! \nSe Presento Un Error De Try / Catch", "error");
        }else {
            swal("BIEN HECHO!", "El Modelo Se actualizado exitosamente!", "success");
            
            //LIMPIAMOS LA DATA DE LOS CAMPOS DEL OBJETO dataUpdateModel
            Object.keys(dataUpdateModel).map(key => {
                dataUpdateModel[key] = ''
            })

            console.log(dataUpdateModel)

            document.getElementById('make').value = 'DefaultValue'
            setModels([]);
            setManufacturer(false);
            setReload(true);
        }
    }
    /*QUINTA PARTE: ELIMINAR UN MODELO ******************************************************************
     * 1- EL ICON [TRASH] EJECUTA LA FUNCION warningDelete Y ALLI SE LLAMA EL REQUEST deteleteModel() ***
     * **************************************************************************************************/
    
    const deteleteModel = async (index) => {//SE INVOCA DESDE warningDelete() PORQUE 'swal' NO ACEPTA ASYNC/AWAIT
        
        const data = {//ESTA ES LA DATA REQUERIDA DEL BODY req.body
            id: dataUpdateModel.id,
            position: index
        }
        
        //console.log(data)

        const response = await crud.PUT(`/api/manufacturer/delete_model`, data);
        console.log(response.msg)

        if (response.msg === "ERROR: data incompleta") {
            swal("ERROR", "Accion Invalida! \nData Requerida Incompleta", "error");
        } else if (response.msg === "ERROR: No hay Marcas con 'id' ingresado") {
            swal("ERROR", "Accion Invalida! \nNo Se Encontro Fabricantes con el ID Ingresado", "error");
        }else if(response.msn === "error de try / catch"){
            swal("ERROR", "Accion Invalida! \nSe Presento Un Error De Try / Catch", "error");
        }else {
            swal("BIEN HECHO!", "El Modelo fue borrado!", "success");
            document.getElementById('make').value = 'DefaultValue'
            setModels([]);
            setManufacturer(false);
            setReload(true);
        }

    }
    

    const warningDelete = (index) => {
        swal({
            title: "Esta Seguro?",
            text: "Una vez borrado, Usted no podra recuperar este archivo!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    deteleteModel(index);//SE DEBE INVOCAR PORQUE NO 'swal' NO ACEPTA UN ASYNC / AWAIT
                    swal("El nombre del fabricante fue borrado!", {
                        icon: "success",
                    });
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
                    <div className="relative mt-32 mb-14 bg-white flex justify-center items-center border border-black shadow-2xl shadow-red-600 w-[484px] p-3 rounded-xl">
                        <div className="bg-red-600 border border-white shadow-2xl shadow-black rounded-xl w-full">
                            <span className="mb-6 flex justify-center text-xl text-white pt-4 font-semibold uppercase">Lista de Modelos por Fabricante</span>

                            <form onSubmit={onSubmit} className="flex flex-col justify-center items-center gap-3">

                                <div className="flex flex-col">
                                    <label className=" text-white font-medium">Marca</label>
                                    <select className={`text-gray-700 py-2 px-[55px] rounded-xl leading-tight border border-black`}
                                        id="make"
                                        type="text"
                                        name="id"
                                        defaultValue={'DefaultValue'}
                                        onChange={onChangeManufacturer}//EJECUTA onChange CADA QUE LA SELECCION DE MARCA CAMBIE
                                    >
                                        <option value="DefaultValue" disabled >Seleccione una Marca...</option>
                                        {
                                            manufacturers.map((manufacturer, index) => (
                                                <option key={manufacturer._id} value={manufacturer._id}>{manufacturer.make}</option>
                                            ))
                                        }

                                    </select>
                                </div>

                                <div className={`${!manufacturer ? "hidden" : "flex flex-col "}`}>
                                    <label className=" text-white mb-2 font-medium"> Lista de Modelos Disponibles</label>
                                    {
                                        models.map((model, index) => (
                                            <div key={index} className={`flex gap-4 ${uneditable === true || uneditable === index ? "flex" : "hidden"}`}>

                                                <input className={`bg-white text-gray-700 w-[222px] py-2 px-4 rounded-xl leading-tight border border-black`}//opacity-100" : "opacity-50"
                                                    id="model"
                                                    type="text"
                                                    name="updatedModel"
                                                    value={dataUpdateModel.updatedModel.toUpperCase()}
                                                    onChange={onChangeModel}
                                                    placeholder={model}
                                                    disabled={uneditable === index ? false : true}
                                                    /** NOTA IMPORTANTE: CADA VEZ QUE SE PRESS CLICK EN EDITAR UN INPUT, AUTOMATICAMENTE  
                                                     *  SE EJECUTAN TODOS LOS CAMPOS INPUT Y EN CADA UNO SE EJECUTA EL CONDICIONAL TERNARIO 
                                                     *  QUE HAY DENTRO DE disabled={uneditable === index ? false : true}
                                                     *  ESTO PODEMOS COMPROBARLO PONIENDO LOS VALORES false:true DENTRO DE UN console.log
                                                     *  disabled={uneditable === index ? console.log(false) : console.log(true)} 
                                                     *  ESTO NOS MOSTRARA EN CONSOLA CUALES POSICIONES QUEDAN LA POSICION QUE CAMBIA A false(EDITABLE)
                                                     *  MIENTRAS TODAS LAS DEMAS QUEDAN EN TRUE, O SEA, NO EDITABLES. 
                                                     * 
                                                     *  EN LA EJECUCION DEL CONDICIONAL, CADA INPUT COMPARA EL VALOR QUE TRAE EL uneditable
                                                     *  CON SU NUMERO DE INDEX/POSITION EN EL ARRAY {uneditable === index}. EN CASO DE QUE 
                                                     *  SEA IGUAL, ENTONCES PERMITE EDITAR SU CONTENIDO, PERO EN CASO QUE NO SEA IGUAL, NO.
                                                     *  
                                                     *  RECORDEMOS QUE uneditable TRAE EL VALOR DEL INDEX/POSICION DONDE FUE CLICKEADO
                                                     * 
                                                     */

                                                    required
                                                ></input>

                                                <div className="flex items-center gap-4">
                                                    {/*uneditable SE SETEA CON EL NUMERO DE INDEX/POSICION DONDE SE PRESS CLICK MEDIANTE*/}
                                                    <BiEdit className="hover:opacity-50" onClick={() => { uneditable !== index ? setUneditable(index) : setUneditable(true); setIsTop(true); setDataUpdateModel({ ...dataUpdateModel, updatedModel: '', position: index, }) }} style={{ color: 'white', fontSize: '24px', cursor: "pointer" }} />
                                                    <BsTrash className="hover:opacity-50" onClick={() => { warningDelete(index)}}  style={{ color: 'white', fontSize: '24px', cursor: "pointer" }} />
                                                </div>
                                            </div>

                                        ))
                                    }

                                </div>

                                <div className={`flex flex-col mt-5 mb-10 gap-4 font-normal justify-center items-center text-sm`}>
                                    <button type="submit" value="Guardar Cambios" className={`bg-white text-red-600 rounded-full border border-black shadow-lg shadow-black hover:bg-opacity-50 active:bg-opacity-70 w-[200px] h-[36px] justify-center items-center font-bold ${uneditable !== true ? "flex" : "hidden"}`} >Guardar Cambios</button>
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

export default ModelsList;