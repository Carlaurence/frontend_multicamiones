//https://hostIp:port/create_product/:idCategory
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import ButtomSaveProduct from "../components/Buttom_SaveProduct";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import crud from "../backEndConnection/crud";
import swal from "sweetalert";
import axios from 'axios';
import back from "../backEndConnection/back";

const Product = () => {//AQUI SE CREA UN PRODUCTO NUEVO CON SU RESPECTIVO ID DE CATEGORIA

    //HOOK useParams{} PARA TRAER EL PARAMETRO/ID-CATEGORIA DESDE LA URL
    //CATEGORIA LIVIANOS, MEDIANOS Y PESADOS
    const { id } = useParams();//CON ESTE ID VAMOS A LLENAR EL CAMPO categoria: "id" del Producto

    const navigate = useNavigate();

    const [reload, setReload] = useState(false)//PARA REFRESCAR LA PAGINA
    const [visibility, setVisibility] = useState(false) //CONTROLA LA VENTANA MODAL 'LOADING-SPINNER' 

    /*PRIMERA PARTE: ******************************************************************************************** 
     * 1- CREAMOS UN OBJETO product CON TODOS SUS CAMPOS, PARA RECOGER LA DATA DEL FRONT Y POSTERIORMENTE => ****
     * => ENVIARLA MEDIANTE UNA PROMESA async() HACIA LA API PARA QUE SE REGISTRE CORRECTAMENTE EN LA BBDD ******
     * 2- CREAMOS UNA FUNCION onChange PARA SETEAR LOS CAMPOS DE [product] CON LA DATA DEL FORMULARIO MEDIANTE => 
     * LA FUNCION setProduct({...product, [e.target.name]:[e.target.value]}) ************************************ 
     ****************************************************************************************************/
    const [files, setFiles] = useState(null)//[files] CONTIENE EL CAMPO 'images' Y SE SETEA CON UN fileList{}
    const [product, setProduct] = useState({
        make: '',
        manufacturerId: '',
        model: '',
        year: '',
        odometer: '',
        engineManufacturer: '',
        gvwr: '',
        cargoBodyType: '',
        length: '',
        width: '',
        height: '',
        price: ''
    });

    //ESTA FUNCION onChange = (e) SE ENCARGA DE TRAER LOS VALORES DEL FRONT Y SETTEAR A product 
    const onChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value.trimStart()
        })
    };    
    console.log(product)
    //console.log(reload)
    //console.log(files)

    /*SEGUNDA PARTE: *************************************************************************************
     * 1- AL INGRESAR AL LINK "//create_product/:id" SE EJECUTA EL useEffect CON EL FILTRO DE SEGURIDAD **
     * 2- SI NO CUMPLE CON LOS CRITERIOS DE SEGURIDAD, IMPIDE EL ACCESO AL LINK Y LO DESVIA AL "/home" ***
     * 3- SI CUMPLE LAS CONDICIONES DE SEGURIDAD, SE EJECUTAN LAS FUNCIONES getAllCategories() => ********
     * => getAllEngineManufacturers(); / getAllCargoBodyTypes(); / getAllYears(); ************************
     * 4- ESTAS MULTIPLES FUNCIONES RETORNAN UN OBJETO CADA UNA CON LA INFO TRAIDA DE LA BBDD ************
     * 5- LA INFORMACION DE CADA OBJETO RETORNADO SE USA PARA SETEAR LAS OPCIONES PREDEFINIDAS DE SELECCION DEL USUARIO *
     ****************************************************************************************************/
    useEffect(()=>{

        const getUserAuthenticated = async () => {
            const token = localStorage.getItem('token');
            
            if (!token) {
                swal("ERROR", " Acceso Denegado \nNo hay token ", "error");
                navigate("/")
            } else {//SI HAY TOKEN, EJECUTE EL MICROSERVICIO
                const response = await crud.GET(`/api/login`);//VIAJA AL LOCALSTORAGE(HEADER) Y LEE TOKEN ALMACENADO
    
                /*SI EL TOKEN ES VALIDO, EL "response" NOS DEBE RETORNA LA INFORMACION DEL USUARIO EN UN JSON
                 CON key "user" Y VALUE {_id:"xxxx", name:"Mxxxx", lastname:"Cxxxxx", email: "xxx@gmail.com"}*/
                if (response.user) {

                    /**PERMITE EL ACCESO Y EL PASO A LA SIGUIENTE FUNCION getCategory()*/
                    
                } else {//SI NO RETORNA EL USER, ENTONCES ACCESO DENEGADO
                    swal("ERROR", " Acceso Denegado \nUsuario Sin Loguear ", "error");
                    localStorage.removeItem('token');
                    console.log(response)
                    navigate("/");
                }
            }
        }
        getUserAuthenticated();
        getCategory();//TRAE EL NOMBRE DE LA CATEGORIA MEDIANTE EL ID, PARA PINTARLO EN EL TITULO
        getManufacturers();//TRAE TODAS LAS MARCAS PARA SU PRE-SELECCION
        getAllEngineManufacturers();//TRAE TODOS LOS FABRICANTES DE MOTOR PARA SU PRE-SELECCION 
        getAllCargoBodyTypes();//TRAE TODOS LOS TIPOS DE CARROCERIAS PARA SU PRE-SELECCION
        getAllYears();//TRAE TODOS LOS AÑOS CREADOS EN LA BBDD
        setReload(false);//CUANDO SE CREA EL PRODUCTO TENEMOS QUE DEVOLVER A reload A SU ESTADO (false)

    }, [navigate, reload])

     //FUNCION PARA SETEAR EL NOMBRE DE LA CATEGORIA EN EL TITULO DE LA VENTANA DE 'CREAR PRODUCTO'
     const [categoryName, setCategoryName] = useState()
     const getCategory = async () => {
         const response = await crud.GET(`/api/category/${id}`)
         if(response.msg === 'Categoria No Existe'){
             setCategoryName(response.msg)
         }else if(response.msg === 'Error de Try/Catch en el Backend'){
             setCategoryName(response.msg)
         }else{
             setCategoryName(response.msg.name)
         }
     }

    /*TERCERA PARTE: *************************************************************************************
     * 1- AL EJECUTARSE EL FILTRO DE SEGURIDAD Y CUMPLIR CON LAS CONICIONES, SE EJECUTAN LAS 4 FUNCIONES * 
     * => PRE-SELECCION: getEngineManufacturers(); getAllEngineManufacturers(); getAllCargoBodyTypes(); getAllYears();
     * 2- ESTAS MULTIPLES FUNCIONES RETORNAN UN OBJETO CADA UNA CON LA INFORMACION TRAIDA DE LA BBDD *****
     * 3- LA INFORMACION DE CADA OBJETO RETORNADO SE USA PARA SETEAR LAS OPCIONES DE PRE-SELECCION DEL USUARIO *
     ****************************************************************************************************/
    const [manufacturers, setManufacturers] = useState([]);
    const [engineManufacturers, setEngineManufacturers] = useState([]);
    const [cargoBodyTypes, setcargoBodyTypes] = useState([]);
    const [years, setYears] = useState([]);
    /***********************************************************************************************************
     * LA VARIABLE DE ESTADO [manufacturers] SE PINTA EN EL FRONT CON UN .map PARA MOSTRAR LAS OPCIONES DE => **
     * => FABRICANTES DE CAMIONES EN LA PRE-SELECCION **********************************************************
     * *********************************************************************************************************/
    const getManufacturers = async () => {
        const response = await crud.GET(`/api/manufacturer/`);
        //console.log(response.msg)
        setManufacturers(response.msg)
    }
    /***********************************************************************************************************
     * LA VARIABLE [engineManufacturers] SE PINTA EN EL FRONT CON UN .map PARA MOSTRAR LAS OPCIONES DE => ******
     * => FABRICANTES DE MOTORES EN LA PRE-SELECCION ***********************************************************
     * *********************************************************************************************************/
    const getAllEngineManufacturers = async () => {
        const response = await crud.GET(`/api/enginemanufacturer`);
        //console.log(response.msg)
        setEngineManufacturers(response.msg);
    }
    /***********************************************************************************************************
     * LA VARIABLE DE ESTADO [cargoBodyTypes] SE PINTA EN EL FRONT CON UN .map PARA MOSTRAR LAS OPCIONES DE => *
     * => FABRICANTES DE CARROCERIAS Y FURGONES EN LA PRE-SELECCION ********************************************
     * *********************************************************************************************************/
    const getAllCargoBodyTypes = async () => {
        const response = await crud.GET(`/api/cargobodytype`);
        //console.log(response.msg)
        setcargoBodyTypes(response.msg);
    }
    /***********************************************************************************************************
     * LA VARIABLE DE ESTADO [years] SE PINTA EN EL FRONT CON UN .map PARA MOSTRAR LOS AÑOS DE PRE-SELECCION ***
     * *********************************************************************************************************/
    const getAllYears = async () => {
        const response = await crud.GET(`/api/year`);
        //console.log(response.msg)
        setYears(response.msg)
    }

    /*CUARTA PARTE: *************************************************************************************
     * 1- CADA QUE SE SELECCIONE UN MANUFACTURER, SE EJECUTA EL onChangeManufacturer *********************
     * 2- AL EJECUTARSE EL onChangeManufacturer, SE ACTIVA EL REQUEST getManufacturerById(id) ************
     * 3- SE EJECUTA EL getManufacturerById(id) PARA TRAER LA INFO DEL FABRICANTE PRE-SELECCIONADO Y SUS MODELOS *******
     * 4- EL (id), SE TRAE DEL DEL INPUT-MANUFACTURER SELECCIONADO, MEDIANTE e.target.value **************
     * 5- EN EL ESTADO models GUARDAMOS EL ARRAY DE MODELOS DEL FABRICANTE PRE-SELECCIONADO **************
     * 6- EL ARRAY models[] SE UTILIZA CON UN .map EN EL INPUT model PARA MOSTRAR LOS MODELOS DEL MANUFACTURER SELECCIONADO  ***
     ****************************************************************************************************/
    const [disabled, setDisabled] = useState(true);//INHABILITA LA MANIPULACION DE LOS INPUTS HASTA QUE SE ESCOJA UNA MARCA

    const onChangeManufacturer = (e) => {//ESTE onChangeManufacturer SE EJECUTA CUANDO SELECCIONAMOS UN FABRICANTE
        setDisabled(false);//AL SELECCIONAR UNA MARCA/FABRICANTE,SE HABILITA LA MANIPULACION DE LOS INPUTS
        getManufacturerById(e.target.value);//SETEA FABRICANTE Y SUS MODELOS DISPONIBLES.
        //EL ARG (e.target.value) ES EL ID DEL FABRICANTE DE CAMIONES PRE-SELECCIONADO
        
        /**CADA QUE SE CAMBIA LA OPCION DEL FABRICANTE, SE DEBEN LIMPIAR TODOS LOS CAMPOS DEL FORMULARIO DE  
         * LOS INPUTS DEL FRONT A SU VALOR POR DEFECTO, EXCEPTO EL FABRICANTE SELECCIONADO ****************/
        document.getElementById("model").value = 'DefaultValue'
        document.getElementById("year").value = 'DefaultValue'
        document.getElementById("engineManufacturer").value = 'DefaultValue'
        document.getElementById("cargoBodyType").value = 'DefaultValue'
        document.getElementById("odometer").value = ''
        document.getElementById("gvwr").value = ''
        document.getElementById("length").value = ''
        document.getElementById("width").value = ''
        document.getElementById("height").value = ''
        document.getElementById("price").value = ''
        
        //TAMBIEN SE TIENE QUE LIMPIAR LA DATA DE LOS CAMPOS DEL OBJETO [product] 
        const resetProductValues = Object.keys(product).map(key => {
            product[key] = ''
        })

        //TAMBIEN SE LIMPIA EL AREA DEL DRAG&&DROP
        setFiles(null);//files TOMA EL VALOR 'null'
    }

    //const [manufacturer, setManufacturer] = useState(false);  
    const [models, setModels] = useState([]);
    /*LA FUNCION getManufacturerById() SE EJECUTA CADA QUE SE SELECCIONE UNA MARCA Y SE ENCARGA 
    * DE SETEAR LOS CAMPOS "make", "modelos" Y EL "manufacturerId".*/
    const getManufacturerById = async (idManufacturer) => {
        const response = await crud.GET(`/api/manufacturer/${idManufacturer}`);
        
        //SETEAMOS EL ARRAY DE MODELOS CORRESPONDIENTES AL MANUFACTURER SELECCIONADO
        setModels(response.msg.model)
        
        //SETEAMOS LOS CAMPOS "make" Y "manufacturerId" DEL OBJETO [product]
        setProduct({ ...product, make: response.msg.make, manufacturerId: idManufacturer }) 
    }
    
    const onSubmit = (e) => {
        e.preventDefault();
        createProductAxios();
    }

    /**CREAR PRODUCTO**/
    const createProductAxios = async() => {
 
        if(!product.make){
            return swal("ERROR", "Seleccione un Fabricante!", "error");
        } else if(files === null){
            return swal("ERROR", "ERROR: El cargue de imagenes es obligatorio!", "error");
        } else if (files.length > 8) {
            //console.log(files.length)
            return swal("ERROR", "El tope maximo son 8 imagenes!", "error");
        } else{
            //CREAMOS EL FORMDATA OBJECT
            const formData = new FormData();

            //SETEAR LOS CAMPOS DEL FORMDATA CON LA DATA DEL useState[product]
            Object.keys(product).map(key => {
                const value = product[key]//RETURN VALUE
                formData.append(`${key}`, value)
            })

            //SETEAMOS EL CAMPO 'images' DEL FORMDATA CON MULTIPLES FILES-IMAGES useState[files]
            for(let i = 0; i < files.length; i ++){
                formData.append('images', files[i])//METODO PARA INSERTAR UN FILELIST{} EN UN FORMDATA
            }

            //METODO PARA VERIFICAR TODOS LOS CAMPOS DEL FORMDATA
            /*for(let [key, value] of formData.entries()){
                console.log(key, value)
            }*/

            setVisibility(true)//Visibility = TRUE => RENDERIZA LA VENTANA MODAL DEL LOADING SPINNER

            const token = localStorage.getItem("token");
            if (!token) {
                swal("ERROR", "Accion Invalida\nNo hay token\nVuelva a loguearse ", "error");
                navigate("/")
            }else{

                await axios.post(`${back.api.baseURL}/api/product/${id}`, formData, 
                
                {
                    headers:{'x-auth-token': token}
                })
                .then(response => {
                    console.log(response)//EL OBJETO QUE RETORNA AXIOS 
                    if(response.data.message==="jwt expired"){
                        swal("ERROR", "ERROR: Accion Invalida\nEl Token ha expirado\nVuelva a loguearse!", "error");
                        localStorage.removeItem('token');
                        navigate("/");
                    }else{

                        if(response.data === "ERROR: Todos los campos son obligatorios!"){
                            setVisibility(false)
                            return swal("ERROR", "ERROR: Todos los campos son obligatorios!", "error");

                        } else if(response.data === "ERROR: El ID de Categoria no existe en la BBDD"){
                            setVisibility(false)
                            return swal("ERROR",    "ERROR: El ID de Categoria no existe en la BBDD", "error");

                        } else if(response.data === "ERROR: El cargue de imagenes es obligatorio!"){
                            setVisibility(false)
                            return swal("ERROR",    "ERROR: El cargue de imagenes es obligatorio!", "error");

                        } else if(response.data === "Error de Try/Catch en el Backend"){
                            setVisibility(false)
                            return swal("ERROR",    "Error de Try/Catch en el Backend", "error");

                        }else {
                            //console.log(response.data) // => RETURN EL OBJETO PRODUCT
                            //console.log(response.status) // => RETURN 200
                                                
                            swal("BIEN HECHO!", "El producto se creo correctamente!", "success");
                            setVisibility(false)// Visibility = FALSE => DESAPARECE LA VENTANA MODAL LOADING SPINNER

                            //LIMPIAMOS LA DATA DE LOS CAMPOS DEL OBJETO product
                            const resetProductValues = Object.keys(product).map(key => {
                                product[key] = ''
                            })

                            //LIMPIAMOS LA DATA DEL useState[files] = null
                            setFiles(null)

                            //LIMPIAMOS LA DATA DEL FORMULARIO Y LOS INPUTS DEL FRONT
                            let myForm = document.getElementById('myForm');
                            myForm.reset();

                            //RECARGAR LA PAGINA CON EL OBJETO files VACIO PARA QUE EL CAMPO DRAG&&DROP SE LIMPIE
                            setReload(true)
                        }
                    }
                }).catch(error => {
                    console.log(error)
                    swal("ERROR", 'Error try/catch Axios: ' + error, "error");
                    setVisibility(false)// Visibility = FALSE => DESAPARECE LA VENTANA MODAL LOADING SPINNER
                })
            }
        }
    }

    /*ULTIMA PARTE: *************************************************************************************
     * 1- CREAMOS UN VARIABLE DE ESTADO "files" LA INICIALIZAMOS EN NULL ********************************
     * 2- LA VARIABLE DE ESTADO "files" CONTIENE LA DATA DE LOS FILES / FOTOS QUE SE VAN A SUBIR ********
     * 3- UTILIZAMOS LOS METODOS onDragOver && onDrop PARA PODER INSERTAR FILES ARRASTRADOS DENTRO DEL DIV **** 
     * 4- CREAMOS UN VALOR DE REFERENCIA inputRef ASIGNADO AL INPUT CUANDO SE SUBAN IMAGENES MEDIANTE EL BOTON [SELECT FILES] ***********
     * 5- UTILIZAMOS LOS METODOS onDragOver && onDrop PARA INSERTAR FILES ARRASTRADOS DENTRO DEL DIV ****
     * ****************************************************************************************************/
    const inputRef = useRef();

    const handleDragOver = (e) => {
        e.preventDefault();
    }
    const handleDrop = (e) => {
        e.preventDefault();
        //setProduct({ ...product, images: e.dataTransfer.files})
        setFiles(e.dataTransfer.files)
    }
    
    return (
        <div className={`overflow-hidden bg-gradient-to-r from-black via-gray-400 to to-white`}>
            <Navbar />
            {/*AQUI ORGANIZAMOS EL DIV PARA QUE LA PANTALLA SE DIVIDA EN DOS, A LA IZQ EL SIDBAR Y A LA DERECHA EL FORMULARIO*/}
            <div className="flex flex-row min-h-screen w-screen ">
                <Sidebar />
                    
                {/*PANTALLA MD: Y LG:*/}
                <div className="hidden md:flex justify-center items-center w-screen font-semibold">

                    {/*FORMULARIO*/}
                    <div className="relative mt-32 mb-14 bg-white flex justify-center items-center border border-black shadow-2xl shadow-red-600 w-[484px] p-3 rounded-xl">
                        <div className="bg-red-600 border border-white shadow-2xl shadow-black rounded-xl">
                            <span className="mb-6 flex justify-center text-xl text-white pt-4 font-semibold uppercase">Crear Camiones {categoryName}</span>

                            <form onSubmit={onSubmit} id="myForm" className="flex flex-col justify-center items-center gap-3">

                                <div className="flex flex-col w-[80%]">
                                    <label className=" text-white">Marca</label>
                                    <select className=" text-gray-700 w-full py-2 px-6 rounded-xl leading-tight border border-black"
                                        id="make"
                                        type="text"
                                        name="make"
                                        required
                                        onChange={onChangeManufacturer}
                                        defaultValue={'DefaultValue'}
                                    >
                                        <option value="DefaultValue" disabled >Seleccione una Marca...</option>
                                        {
                                            manufacturers.map((manufacturer, index) => (
                                                <option key={manufacturer._id} value={manufacturer._id}>{manufacturer.make}</option>
                                            ))
                                        }

                                    </select>
                                </div>
                                
                                <div className="flex flex-row space-x-2 w-[80%]">

                                    <div className="flex flex-col w-[65%]">
                                        <label className=" text-white">Modelo</label>
                                        <select className=" text-gray-700 w-full py-2 px-6 font-semibold rounded-xl leading-tight border border-black"
                                            id="model"
                                            type="text"
                                            name="model"
                                            required
                                            disabled={disabled}
                                            onChange={onChange}
                                            defaultValue={'DefaultValue'}
                                        >
                                            <option value="DefaultValue" disabled >Seleccione un Modelo...</option>
                                            {
                                                models.map((model, index) => (
                                                    <option key={index} value={model}>{model}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="flex flex-col w-[35%]">
                                        <label className="text-white font-medium">Año</label>
                                        <select className=" text-gray-700 w-full py-2 text-center font-semibold rounded-xl leading-tight border border-black"
                                            id="year"
                                            type="number"
                                            name="year"
                                            required
                                            disabled={disabled}
                                            onChange={onChange}
                                            defaultValue={'DefaultValue'}
                                        >
                                            <option value="DefaultValue" disabled >Año...</option>
                                            {
                                                years.map((year, index) => (
                                                    <option key={year._id} value={year.year}>{year.year}</option>
                                                ))
                                            }
                                        </select>
                                    </div>

                                </div>

                                <div className="flex flex-row space-x-2 w-[80%]">
                                
                                    <div className="flex flex-col w-[65%]">
                                        <label className="text-white">Fabricante Motor</label>
                                        <select className=" text-gray-700 w-full py-2 px-6 font-semibold rounded-xl leading-tight border border-black"
                                            id="engineManufacturer"
                                            type="text"
                                            name="engineManufacturer"
                                            required
                                            disabled={disabled}
                                            onChange={onChange}
                                            defaultValue={'DefaultValue'}

                                        >
                                            <option value="DefaultValue" disabled >Seleccion Fabricantes...</option>
                                            {
                                                engineManufacturers.map((engineManufacturer, index) => (
                                                    <option key={engineManufacturer._id} value={engineManufacturer.make}>{engineManufacturer.make}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="flex flex-col w-[35%]">
                                        <label className="text-white font-medium">Kilometraje</label>
                                        <input className="text-gray-700 w-full py-2 text-center font-semibold rounded-xl leading-tight border border-black"
                                            id="odometer"
                                            type="number"
                                            name="odometer"
                                            placeholder="Kilometraje"
                                            required
                                            //value={odometer}
                                            disabled={disabled}
                                            onChange={onChange}
                                        ></input>
                                    </div>

                                </div>

                                <div className="flex flex-row space-x-2 w-[80%]">
                                
                                    <div className="flex flex-col w-[65%]">
                                        <label className=" text-white">Tipo De Carroceria</label>
                                        <select className=" text-gray-700 w-full py-2 px-6 font-semibold rounded-xl leading-tight border border-black"
                                            id="cargoBodyType"
                                            type="text"
                                            name="cargoBodyType"
                                            required
                                            disabled={disabled}
                                            onChange={onChange}
                                            defaultValue={'DefaultValue'}
                                        >
                                            <option value="DefaultValue" disabled >Seleccione un Tipo...</option>
                                            {
                                                cargoBodyTypes.map((cargoBodyType, index) => (
                                                    <option key={cargoBodyType._id} value={cargoBodyType.name}>{cargoBodyType.name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="flex flex-col w-[35%]">
                                        <label className=" text-white font-medium">Capacidad Carga</label>
                                        <input className=" text-gray-700 w-full py-2 text-center font-semibold rounded-xl leading-tight border border-black"
                                            id="gvwr"
                                            type="number"
                                            step='0.01'//PARA QUE ACEPTE DECIMALES
                                            name="gvwr"
                                            placeholder="Toneladas"
                                            required
                                            //value={gvwr}
                                            disabled={disabled}
                                            onChange={onChange}
                                        ></input>
                                    </div>
                                
                                </div>

                                <div className="dimensions flex flex-row space-x-2 w-[80%]">

                                    <div className="flex flex-col">
                                        <label className=" text-white">Largo</label>
                                        <input className=" text-gray-700 w-full py-2 font-semibold text-center rounded-xl leading-tight border border-black"
                                            id="length"
                                            type="number"
                                            step='0.01'//PARA QUE ACEPTE DECIMALES
                                            name="length"
                                            placeholder="Metros"
                                            required
                                            //value={length}
                                            disabled={disabled}
                                            onChange={onChange}
                                        ></input>
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-white font-medium">Ancho</label>
                                        <input className="text-gray-700 w-full py-2 font-semibold text-center rounded-xl leading-tight border border-black"
                                            id="width"
                                            type="number"
                                            step='0.01'//PARA QUE ACEPTE DECIMALES
                                            name="width"
                                            placeholder="Metros"
                                            required
                                            //value={width}
                                            disabled={disabled}
                                            onChange={onChange}
                                        ></input>
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-white font-medium">Altura</label>
                                        <input className="text-gray-700 w-full py-2 font-semibold text-center rounded-xl leading-tight border border-black"
                                            id="height"
                                            type="number"
                                            step='0.01'//PARA QUE ACEPTE DECIMALES
                                            name="height"
                                            placeholder="Metros"
                                            required
                                            //value={height}
                                            disabled={disabled}
                                            onChange={onChange}
                                        ></input>
                                    </div>
                                    
                                </div>

                                <div className="flex flex-col w-[80%]">
                                    <label className="text-white">Precio</label>
                                    <input className="text-gray-700 w-full py-2 px-7 rounded-xl leading-tight border border-black"
                                        id="price"
                                        type="number"
                                        name="price"
                                        placeholder="Precio Venta"
                                        required
                                        //value={price}
                                        disabled={disabled}
                                        onChange={onChange}
                                    ></input>
                                </div>

                                <div className="flex flex-col w-[80%]">
                                    <label className="text-white">Fotos Cloudinary. Aspecto Ratio 4:3</label>
                                    
                                    {!files && (//SI EL CAMPO "images" ESTA VACIO... ENTONCES => PINTAR ESTE RETURN()
                                        <div className="bg-white flex flex-col justify-between items-center h-[120px] border-black/70 border-dashed border-[2px] p-4"
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                        >
                                            <h1 className=" font-semibold text-black/70 ">Arrastrar Imagenes & Soltar Aqui</h1>
                                            <h1 className=" font-semibold"></h1>
                                            <input
                                            type="file"
                                            name="images"
                                            id="images"
                                            accept="image/*"
                                            multiple
                                            hidden
                                            onChange={(e) => setFiles(e.target.files)}

                                            ref={inputRef}
                                            //autoFocus
                                            //onChange={onChangeFiles}
                                            //required
                                            >
                                            </input>

                                            <div className="button-select-files">
                                                <div onClick={() => inputRef.current.click()} className=" bg-slate-200 text-red-600 font-semibold rounded-full px-3 py-[2px] border border-black shadow-lg shadow-black hover:bg-opacity-60 active:bg-opacity-50 cursor-pointer">Select Files</div>
                                            </div>
                                        
                                        </div>
                                    )}
                                    {files && (//SI EL CAMPO "images" CONTIENE FILES... ENTONCES => PINTAR ESTE RETURN()
                                        <div className=" bg-white flex flex-col gap-4 items-center justify-center max-h-[300px] border-black/70 border-dashed border-[2px] p-4">
                                            
                                            {/*EL ATRIBUTO 'overflow-auto' IMPIDE QUE EL <DIV> HIJO SE DESBORDE DEL <DIV> PADRE*/}
                                            <div className="overflow-auto bg-slate-200 grid grid-cols-3 gap-2 border-black border-[1px] p-2">
                                                {Array.from(files).map((file, index) => 
                                                
                                                    <img key={index} src={URL.createObjectURL(file)} alt="#" className="border-black border-[1px] aspect-[5/4]"></img>
                                                
                                                )}
                                            </div>
                        
                                            <div className="cancel-buttom">
                                                <button onClick={()=> setFiles(null)} className="bg-slate-200 text-red-600 font-semibold rounded-full px-3 py-[2px] border border-black shadow-lg shadow-black hover:bg-opacity-60 active:bg-opacity-50" >Cancelar</button>
                                            </div>
                                    </div>
                                    )}

                                </div>

                                <div className="flex flex-col pt-6 gap-5 mb-3">
                                    <ButtomSaveProduct />
                                </div>

                                <div className="flex flex-col font-normal justify-center items-center text-sm">
                                    <Link className="mb-1 text-white underline hover:text-opacity-70 active:text-opacity-50" to={"/admin"}>Regresar a Modulo Admin</Link>
                                </div>

                            </form>
                        </div>
                    </div>
                    {/*FIN FORMULARIO*/}

                    {/**ESTA ES LA VENTANA MODAL DE LOADING... LA CUAL SE EJECUTA CUANDO visibility = true*/}
                    <div className="fixed z-50 top-40">
                        {visibility && (
                            <div id="loader" className="bg-white flex flex-col justify-center items-center gap-4  w-[540px] h-[380px] rounded-md">
                                <div className="h-[120px] w-[120px] border-solid border-[15px] border-t-red-600 rounded-full animate-spin duration-1000"></div>
                                <span className="font-medium text-3xl">Loading Data ...</span>
                                <span className="font-normal">Espere un momento mientras se carga la informacion</span>

                            </div>
                        )}
                    </div>

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

export default Product;