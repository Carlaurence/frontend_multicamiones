import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import swal from "sweetalert";
import crud from "../backEndConnection/crud";
//react-icons
import { BiEdit, BiImages } from "react-icons/bi";

const UpdateProduct = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const subtitle = {"make": "Marca", "model": "Modelo", "year": "Año", "odometer": "Kilometraje", "engineManufacturer": "Fabricante Motor", "gvwr": "Capacidad Carga", "cargoBodyType": "Tipo De Carroceria", "length": "Largo", "width": "Ancho", "height": "Altura", "price": "Precio", "images": "Fotos Vehiculo", "deleteImages": "Eliminar Imagenes Seleccionadas" }

    const [isTop, setIsTop] = useState(true)//SETEA [isTop === true] PARA QUE SE RENDERICE EN EL TOP:0

    useEffect(()=>{

        const getUserAuthenticated = async () => {
            const token = localStorage.getItem('token');
            
            if (!token) {
                swal("ERROR", " Acceso Denegado \nNo hay token ", "error");
                navigate("/")
            } else {//SI HAY TOKEN, EJECUTE EL MICROSERVICIO
                const response = await crud.GET(`/api/login`);//VIAJA AL LOCALSTORAGE(HEADER) Y LEE TOKEN ALMACENADO
    
                if (response.user) {

                    /**PERMITE EL ACCESO Y EL PASO A LA SIGUIENTE FUNCION getUserAuthenticated()*/

                } else {//SI NO RETORNA EL USER, ENTONCES ACCESO DENEGADO
                    swal("ERROR", " Acceso Denegado \nUsuario Sin Loguear ", "error");
                    localStorage.removeItem('token');
                    console.log(response)
                    navigate("/");
                }
            }
        }
        /**CADA QUE SE ACTIVE EL NAVIGATE, AQUI SE EJECUTAN LAS FUNCIONES EN ORDEN*/
        getUserAuthenticated();

        setIsTop(true)//CADA QUE SE EJECUTE UN RELOAD, DEBE LLEVAR LA VENTANA AL TOP:0

        //EVENTO OYENTE PARA QUE EL MOVERSE EL SCROLL SETE [isTop === false]
        window.addEventListener('scroll', () => {
            setIsTop(window.scrollY === 0);
        });

        getProductById();
        getImages();
        getYears();
        getEngineManufacturers();
        getCargoBodyTypes();

    }, [navigate])


    const [visibility, setVisibility] = useState(false) //CONTROLA LA VENTANA MODAL 'LOADING-SPINNER' 
    
    const [product, setProduct] = useState({});//RECIBE UN OBJETO JSON CON UN PRODUCTO
    const [models, setModels] = useState([]);//SETEA LOS MODELOS DEL FABRICANTE
    const [years, setYears] = useState([])
    const [engineManufacturers, setEngineManufacturers] = useState([])
    const [cargoBodyTypes, setcargoBodyTypes] = useState([]);

    const [edit, setEdit] = useState(false);//EXCLUSIVO PARA MANEJAR EL ICONO [EDITAR]

    const getProductById = async () => {//SETTEAR LAS CAJAS DE TEXTO CON LA INFORMACION INICIAL
        const response = await crud.GET(`/api/product/idproduct/${id}`);//ID PRODUCTO SELECCIONADO
        setProduct(response.msg);
        getManufacturerById(response.msg.manufacturerId)//LLAMA LA FUNCION PARA TRAER EL FABRICANTE
    }
    console.log(product)

    const [imagesProduct, setImagesProduct] = useState([])
    /**ESTA FUNCION SE ENCARGA EXCLUSIVAMENTE DE MANEJAR EL CAMPO DE LAS IMAGES QUE SE PINTAN EN EL FRONT*/
    const getImages = async () => {
        const response = await crud.GET(`/api/product/idproduct/${id}`);//ID DEL PRODUCTO SELECCIONADO
        setImagesProduct(response.msg.images)//SETEA LAS IMAGENES QUE SE PINTAN EN EL FRONT
    }

    const getManufacturerById = async(id) => {//TRAER AL FABRICANTE MEDIANTE SU ID
        const response = await crud.GET(`/api/manufacturer/${id}`)
        setModels(response.msg.model)//SETEAR EL ARRAY[] DE MODELOS DEL FABRICANTE
    }

    const getYears = async() => {//TRAER LOS AÑOS
        const response = await crud.GET(`/api/year`)
        setYears(response.msg)//SETEAR LOS AÑOS
    }

    const getEngineManufacturers = async() => {//TRAER LOS FABRICANTES DE MOTORES
        const response = await crud.GET(`/api/enginemanufacturer/`)
        setEngineManufacturers(response.msg)//SETEAR LOS FABRICANTES DE MOTORES
    }

    const getCargoBodyTypes = async () => {//TRAER LOS TIPOS DE FURGONES
        const response = await crud.GET(`/api/cargobodytype`);
        setcargoBodyTypes(response.msg);
    }

    /**** EN ESTE JSON product {} RECAE LA DATA DEL OBJETO [product] TRAIDA CON LA FUNCION getProductById(id)
     * => Y CADA CAMPO SETEA EL VALOR INICIAL QUE ES MOSTRADO EN CADA CASILLA DEL FORMULARIO ***************/
    const { make, model, year, odometer, engineManufacturer, gvwr, cargoBodyType, length, width, height, price } = product;

    const updateProduct = async () => {

        const data = {/****CONSTRUIMOS EL JSON data{nombre} QUE SERA ENVIADO => AL PUT ACTUALIZAR-CAMION*****/
                
                model: product.model,
                year: product.year,
                odometer: product.odometer,
                engineManufacturer: product.engineManufacturer,
                gvwr: product.gvwr,
                cargoBodyType: product.cargoBodyType,
                length: product.length,
                width: product.width,
                height: product.height,
                price: product.price,
                urlImagesDeleted: storageImagesDeleted//ARRAY DE IMAGES QUE SERAN BORRADAS 
            }
        console.log(data)
        
        setVisibility(true)//Visibility = TRUE => RENDERIZA LA VENTANA MODAL DEL LOADING SPINNER

        const token = localStorage.getItem("token");
        if (!token) {
            swal("ERROR", "Accion Invalida\nNo hay token\nVuelva a loguearse ", "error");
            navigate("/")
        }else{
            const response = await crud.PUT(`/api/product/${id}`, data);
            console.log(response)

            if(response.message==="jwt expired"){
                swal("ERROR", "ERROR: Accion Invalida\nEl Token ha expirado\nVuelva a loguearse!", "error");
                localStorage.removeItem('token');
                navigate("/");
            }else{
                if(response.msg === "Error de Try / Catch en el Backend"){
                    swal("ERROR", "ERROR: Accion Invalida\nError de Try / Catch en el Backend", "error");
                    localStorage.removeItem('token');
                    navigate("/");
                }else{
                    swal("BIEN HECHO!", "El Producto fue actualizado exitosamente!", "success");
                    setVisibility(false)// Visibility = FALSE => DESAPARECE LA VENTANA MODAL LOADING SPINNER
                    navigate(`/trucks_list`);
                }
            }
        }
    }

    //CUANDO SE PRESIONA EL BOTON [ACTUALIZAR] LA <form> EJECUTA LA FUNCION {onSubmit}
    const onSubmit = (e) => {
        e.preventDefault();//impedir que se recargue automaticamente
        updateProduct();
    }

    const onChange = (e) => {//SETEA EN [product] TODOS LOS CAMBIOS DE DATA REGISTRADOS DESDE EL FRONT
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        })
    };

    const [storageImagesDeleted, setStorageImagesDeleted] = useState([])//ARRAY DE IMAGES PARA ELIMINAR EN EL BACK
    const [cancelButton, setCancelButton] = useState(false)//RENDERIZAR BOTON CANCELAR
    const [reloadImages, setReloadImages] = useState(false)//RENDERIZAR EL AREA DE IMAGENES
    useEffect(()=> {
        setReloadImages(false)
    }, [reloadImages])//CADA CAMBIO EN LA VARIABLE DE ESTADO reloadImages RENDERIZA EL AREA DE LAS IMAGENES

    /** CADA QUE SE SELECCIONE UNA IMAGEN, SE EJECUTA ESTA FUNCION onSelectImage() LA CUAL REMUEVE
     * LA IMAGEN SELECCIONADA DEL CUADRO DE IMAGENES DEL FRONT Y SETEA UN NUEVO ARRAY storageImagesDeleted
     * EL CUAL ALMACENA LAS IMAGENES QUE SERAN BORRADAS EN EL BACKEND ************************************/
    const onSelectImage = (image) => {

        if(imagesProduct.length<=1){
            swal('Accion Invalida', 'El Producto debe tener al menos una imagen!', 'warning')
        } else {
            let storageImages = storageImagesDeleted

            //AQUI SE ELIMINA LA IMAGEN CLICKEADA DEL ARRAY DE IMAGENES
            imagesProduct.splice((imagesProduct.indexOf(image)), 1)
            //AQUI SE RENDERIZA EL AREA DE LAS IMAGENES DESCONTANDO LA IMG RECIEN ELIMINADA
            setReloadImages(true)
            //RENDERIZA EL BOTON [Cancel Seleccion] EL CUAL RESETEA TODAS LAS IMAGENES A SU VALOR INICIAL
            setCancelButton(true)

            //AQUI SE AGREGA LA IMG CLICKEADA, AL ARRAY storageImages EL CUAL ALMACENA LAS IMAGENES QUE SERAN ELIMINADAS 
            storageImages.push(image)
            //AQUI SE SETEA EL useState[storageImagesDeleted] CON EL ARRAY DE IMAGES QUE SERA ENVIADO AL BACK PARA BORRARLAS DE LA BBDD
            setStorageImagesDeleted(storageImages)
        }
        console.log(storageImagesDeleted)   
    }

    return (
        <div className={`overflow-hidden bg-gradient-to-r from-black via-gray-400 to to-white ${isTop ? window.scrollTo({ top: 0 }) : ''}`}>
            <Navbar />
            {/*AQUI ORGANIZAMOS EL DIV PARA QUE LA PANTALLA SE DIVIDA EN DOS, A LA IZQ EL SIDBAR Y A LA DERECHA EL FORMULARIO*/}
            <div className="flex flex-row min-h-screen w-screen">
                <Sidebar />

                {/*PANTALLA MD: Y LG:*/}
                <div className={`hidden md:flex justify-center items-center w-screen font-semibold`}>

                    {/*FORMULARIO*/}
                    <div className="mt-32 mb-14 bg-white flex justify-center items-center border border-black shadow-2xl shadow-red-600 w-[484px] p-3 rounded-xl">
                        <div className="bg-red-600 border border-white shadow-2xl shadow-black rounded-xl">
                            <span className="mb-6 flex justify-center text-xl text-white pt-4 font-semibold uppercase">Editar</span>

                            <form onSubmit={onSubmit} className="flex flex-col justify-center items-center gap-3">
                                <div className="flex flex-col w-[80%]">
                                    <label className=" text-white font-medium">{subtitle.make}</label>
                                    <div className="flex items-center">
                                        <input className={`bg-white text-gray-700 w-full py-2 px-4 rounded-xl leading-tight border border-black opacity-75`}
                                            id="make"
                                            type="text"
                                            name="make"
                                            placeholder={make}
                                            disabled//LA MARCA ES INEDITABLE
                                            required
                                        ></input>
                                    </div>
                                </div>

                                <div className="flex flex-row space-x-2 w-[80%]">

                                    <div className="flex flex-col w-[60%]">
                                        <label className=" text-white font-medium">{subtitle.model}</label>
                                        <div className="flex items-center justify-around gap-2">
                                            <select className={`bg-white text-gray-700 w-full py-2 px-4 rounded-xl leading-tight border border-black ${edit === subtitle.model ? "opacity-100" : "opacity-75"}`}
                                                id="model"
                                                type="text"
                                                name="model"    
                                                //value={model}
                                                disabled={edit === subtitle.model ? false : true}
                                                required
                                                onChange={onChange}
                                                defaultValue={'DefaultValue'}
                                            >
                                                <option value="DefaultValue" disabled >{model}</option>
                                                {
                                                    models.map((item, index) => (
                                                        <option key={item} value={item}>{item}</option>
                                                    ))
                                                }
                                                
                                            </select>
                                            <div className="flex justify-center items-center text-3xl w-6 h-6">
                                                <BiEdit onClick={() => { edit !== subtitle.model ? setEdit(subtitle.model) : setEdit("") }} style={{ color: 'white', cursor: "pointer", }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-[40%]">
                                        <label className="text-white font-medium">{subtitle.year}</label>
                                        <div className="flex items-center justify-around gap-2">
                                            <select className={`bg-white text-gray-700 w-full py-2 px-4 rounded-xl leading-tight border border-black ${edit === subtitle.year ? "opacity-100" : "opacity-75"}`}
                                                id="year"
                                                type="number"
                                                name="year"
                                                //value={year}
                                                disabled={edit === subtitle.year ? false : true}
                                                required
                                                onChange={onChange}
                                                defaultValue={'DefaultValue'}
                                            >
                                                <option value="DefaultValue" disabled >{year}</option>
                                                {
                                                    years.map((item, index) => (
                                                        <option key={item._id} value={item.year}>{item.year}</option>
                                                    ))
                                                }

                                            </select>
                                            <div className="flex justify-center items-center text-3xl w-6 h-6">
                                                <BiEdit onClick={() => { edit !== subtitle.year ? setEdit(subtitle.year) : setEdit("") }} style={{ color: 'white', cursor: "pointer" }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row space-x-2 w-[80%]">
                                    <div className="flex flex-col w-[60%]">
                                        <label className="text-white font-medium">{subtitle.engineManufacturer}</label>
                                        <div className="flex items-center justify-around gap-2">
                                            <select className={`bg-white text-gray-700 w-full py-2 px-4 rounded-xl leading-tight border border-black ${edit === subtitle.engineManufacturer ? "opacity-100" : "opacity-75"}`}
                                                id="engineManufacturer"
                                                type="text"
                                                name="engineManufacturer"
                                                value={engineManufacturer}
                                                disabled={edit === subtitle.engineManufacturer ? false : true}
                                                required
                                                onChange={onChange}
                                                defaultValue={'DefaultValue'}
                                            >
                                                <option value="DefaultValue" disabled >{engineManufacturer}</option>
                                                {
                                                    engineManufacturers.map((item, index) => (
                                                        <option key={item._id} value={item.make}>{item.make}</option>
                                                    ))
                                                }
                                                
                                            </select>
                                            <div className="flex justify-center items-center text-3xl w-6 h-6">
                                                <BiEdit onClick={() => { edit !== subtitle.engineManufacturer ? setEdit(subtitle.engineManufacturer) : setEdit("") }} style={{ color: 'white', cursor: "pointer" }} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col w-[40%]">
                                        <label className="text-white font-medium">{subtitle.odometer}</label>
                                        <div className="flex items-center justify-around gap-2">
                                            <input className={`bg-white text-gray-700 w-full py-2 px-4 rounded-xl leading-tight border border-black ${edit === subtitle.odometer ? "opacity-100" : "opacity-75"}`}
                                                id="odometer"
                                                type="number"
                                                name="odometer"
                                                value={odometer}
                                                disabled={edit === subtitle.odometer ? false : true}
                                                required
                                                onChange={onChange}
                                            ></input>
                                            <div className="flex justify-center items-center text-3xl w-6 h-6">
                                                <BiEdit onClick={() => { edit !== subtitle.odometer ? setEdit(subtitle.odometer) : setEdit("") }} style={{ color: 'white', cursor: "pointer" }} />
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="flex flex-row space-x-2 w-[80%]">
                                    <div className="flex flex-col w-[60%]">
                                        <label className=" text-white font-medium">{subtitle.cargoBodyType}</label>
                                        <div className="flex items-center justify-around gap-2">
                                            <select className={`bg-white text-gray-700 w-full py-2 px-4 rounded-xl leading-tight border border-black ${edit === subtitle.cargoBodyType ? "opacity-100" : "opacity-75"}`}
                                                id="cargoBodyType"
                                                type="text"
                                                name="cargoBodyType"
                                                //value={cargoBodyType}
                                                disabled={edit === subtitle.cargoBodyType ? false : true}
                                                required
                                                onChange={onChange}
                                                defaultValue={'DefaultValue'}
                                            >
                                                <option value="DefaultValue" disabled >{cargoBodyType}</option>
                                                {
                                                    cargoBodyTypes.map((item, index) => (
                                                        <option key={item._id} value={item.name}>{item.name}</option>
                                                    ))
                                                }
                                                
                                            </select>
                                            <div className="flex justify-center items-center text-3xl w-6 h-6">
                                                <BiEdit onClick={() => { edit !== subtitle.cargoBodyType ? setEdit(subtitle.cargoBodyType) : setEdit("") }} style={{ color: 'white', cursor: "pointer" }} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col w-[40%]">
                                        <label className=" text-white font-medium">{subtitle.gvwr}</label>
                                        <div className="flex items-center justify-around gap-2">
                                            <input className={`bg-white text-gray-700 w-full py-2 px-4 rounded-xl leading-tight border border-black ${edit === subtitle.gvwr ? "opacity-100" : "opacity-75"}`}
                                                id="gvwr"
                                                type="number"
                                                name="gvwr"
                                                value={gvwr}
                                                disabled={edit === subtitle.gvwr ? false : true}
                                                required
                                                onChange={onChange}
                                            ></input>
                                            <div className="flex justify-center items-center text-3xl w-6 h-6">
                                                <BiEdit onClick={() => { edit !== subtitle.gvwr ? setEdit(subtitle.gvwr) : setEdit("") }} style={{ color: 'white', cursor: "pointer" }} />
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="flex flex-row space-x-2 w-[80%]">

                                    <div className="flex flex-col">
                                        <label className=" text-white font-medium">{subtitle.length}</label>
                                        <div className="flex items-center justify-around gap-2">
                                            <input className={`bg-white text-gray-700 w-full py-2 px-4 rounded-xl leading-tight border border-black ${edit === subtitle.length ? "opacity-100" : "opacity-75"}`}
                                                id="length"
                                                type="number"
                                                name="length"
                                                value={length}
                                                step='0.01'//PARA QUE ACEPTE DECIMALES
                                                disabled={edit === subtitle.length ? false : true}
                                                required
                                                onChange={onChange}
                                            ></input>
                                            <div className="flex justify-center items-center text-3xl w-6 h-6">
                                                <BiEdit onClick={() => { edit !== subtitle.length ? setEdit(subtitle.length) : setEdit("") }} style={{ color: 'white', cursor: "pointer" }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-white font-medium">{subtitle.width}</label>
                                        <div className="flex items-center justify-around gap-2">
                                            <input className={`bg-white text-gray-700 w-full py-2 px-4 rounded-xl leading-tight border border-black ${edit === subtitle.width ? "opacity-100" : "opacity-75"}`}
                                                id="width"
                                                type="number"
                                                name="width"
                                                value={width}
                                                step='0.01'//PARA QUE ACEPTE DECIMALES
                                                disabled={edit === subtitle.width ? false : true}
                                                required
                                                onChange={onChange}
                                            ></input>
                                            <div className="flex justify-center items-center text-3xl w-6 h-6">
                                                <BiEdit onClick={() => { edit !== subtitle.width ? setEdit(subtitle.width) : setEdit("") }} style={{ color: 'white', cursor: "pointer" }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-white font-medium">{subtitle.height}</label>
                                        <div className="flex items-center justify-around gap-2">
                                            <input className={`bg-white text-gray-700 w-full py-2 px-4 rounded-xl leading-tight border border-black ${edit === subtitle.height ? "opacity-100" : "opacity-75"}`}
                                                id="height"
                                                type="number"
                                                name="height"
                                                value={height}
                                                step='0.01'//PARA QUE ACEPTE DECIMALES
                                                disabled={edit === subtitle.height ? false : true}
                                                required
                                                onChange={onChange}
                                            ></input>
                                            <div className="flex justify-center items-center text-3xl w-6 h-6">
                                                <BiEdit onClick={() => { edit !== subtitle.height ? setEdit(subtitle.height) : setEdit("") }} style={{ color: 'white', cursor: "pointer" }} />
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                
                                <div className="flex flex-col w-[80%]">
                                    <label className="text-white font-medium">{subtitle.price}</label>
                                    <div className="flex items-center justify-around gap-2">
                                        <input className={`bg-white text-gray-700 w-full py-2 px-12 rounded-xl leading-tight border border-black ${edit === subtitle.price ? "opacity-100" : "opacity-75"}`}
                                            id="price"
                                            type="number"
                                            name="price"
                                            value={price}
                                            disabled={edit === subtitle.price ? false : true}
                                            required
                                            onChange={onChange}
                                        ></input>
                                        <BiEdit onClick={() => { edit !== subtitle.price ? setEdit(subtitle.price) : setEdit("") }} style={{ color: 'white', fontSize: '30px', cursor: "pointer" }} />
                                    </div>
                                </div>

                                <div className="flex flex-col w-[80%]">
                                    <label className="text-white font-medium">{subtitle.deleteImages}</label>
                                    
                                    {/*GRID DE IMAGENES*/}
                                    <div className=" bg-white flex flex-col gap-4 items-center justify-center border-black/70 border-dashed border-[2px] p-4">

                                        <div className="overflow-auto bg-slate-200 grid grid-cols-3 gap-2 min-h-[200px] border-black border-[1px] p-2">

                                            {!reloadImages && (
                                            //product && ()
                                                imagesProduct.map((image, index) => (
                                                    <img key={index} onClick={() =>  onSelectImage(image)  } src={image.secure_url} alt="#" className={`border-black border-[1px] aspect-[5/4] cursor-pointer hover:opacity-80`}></img>
                                                ))
                                            )}

                                        </div>

                                        {cancelButton && (
                                            <div className="cancel-buttom">
                                                <button type="button" onClick={()=> {getImages(); setCancelButton(false); setStorageImagesDeleted([])}} className="bg-slate-200 text-red-600 font-semibold rounded-full px-3 py-[2px] border border-black shadow-lg shadow-black hover:bg-opacity-60 active:bg-opacity-50" >Cancelar Seleccion</button>
                                            </div>
                                        )}
                                    
                                    </div>
                                </div>

                                <div className="flex flex-col pt-6 gap-5 mb-3">
                                    <button type="submit" value="Guardar Cambios" className="bg-white text-red-600 rounded-full border border-black shadow-lg shadow-black hover:bg-opacity-50 active:bg-opacity-70 w-[305px] h-[36px] flex justify-center items-center font-bold" >Guardar Cambios</button>
                                </div>

                                <div className="flex flex-col font-normal justify-center items-center text-sm">
                                    <Link className="mb-1 text-white underline hover:text-opacity-70 active:text-opacity-50" to={"/trucks_list"}>Regresar</Link>
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

export default UpdateProduct;