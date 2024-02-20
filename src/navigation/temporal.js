//www.localhost:3000/trucks_list
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import Carousel from "../components/Carousel";
import ButtomUpdate from "../components/Buttom_Update";
import ButtomAddImage from "../components/Buttom_AddImage";
import swal from "sweetalert";
import crud from "../backEndConnection/crud";
//react-icons
import { BiEdit } from "react-icons/bi";

const TrucksList = () => {

    //FUNCION PARA DAR FORMATO PESOS COP A LOS VALORES NUMERICOS
    const formatterPesoCOP = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
        
    })
    //FUNCION PARA DAR FORMATO A VALORES DE MILES SEPARADOS POR PUNTO
    const decimalFormatter = new Intl.NumberFormat("es-ES", {
        maximumFractionDigits: 0
    })

    const navigate = useNavigate();

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

    const [products, setProducts] = useState([]);
    const [edit, setEdit] = useState(true);
    const [id, setId] = useState("");
    

    const getAllTrucks = async () => {
        const response = await crud.GET(`/api/product`);
        //const msg = response;
        //console.log(msg)
        setProducts(response.products);
    }

    useEffect(() => {//AL ACCEDER AL ADMIN "/" AUTOMATICAMENTE SE EJECUTA ESTE USEEFECT
        getUserAuthenticated();//EJECUTA EL FILTRO DE SEGURIDAD 
        getAllTrucks();//
    }, [navigate])//[navigate] SINTAXIS PARA QUE useEffect SE EJECUTE UNICAMENTE AL DETECTAR UN CAMBIO EN EL navigate


    return (
        <div className="relative overflow-hidden flex flex-col items-center bg-gradient-to-r from-black via-gray-400 to to-white h-full">
            <Navbar />

            {/*ESTE FLEX-ROW ES PARA DIVIDIR EL SIDEBAR A LA IZQ Y LA LISTA A LA DERECHA*/}
            <div className="relative flex flex-row w-screen">
                <Sidebar /> {/*SIDEBAR A LA IZQUIERDA*/}
                <div className="relative flex justify-center items-center w-screen"> {/*PANTALLA LADO DERECHO*/}
                    <div className="relative mt-36 mb-14 flex flex-col gap-4 w-[95%]">{/*DIV QUE CONTIENE LA LISTA TOTAL DE PUBLICACIONES EN COLUMNA*/}

                        {products.map((product, index) => (
                            /*DIV TIPO FLEX-ROW PARA PONER EL CAROUSEL AL LADO IZQ, LA INFO EN EL MEDIO Y LOS BOTONES AL LADO DERECHO*/
                            <div key={product._id} className="group flex w-full rounded-md shadow-md shadow-red-600">
                                
                                {/*EL CAROUSEL AL LADO IZQUIERDO*/}
                                <div className='rounded-md'>
                                    {/*RELACION DE ASPECTO 5:4 => 5 UNID ANCHO X 4 DE ALTO*/}
                                    <Carousel images={product.images} height={'280px'} width={'350px'} />
                                </div>
                                {/*LA INFORMACION EN EL MEDIO*/}
                                <div className="flex flex-col justify-center items-center w-[48%] font-semibold text-[13px]">                                    
                                        <form  className="flex flex-col gap-1 w-[90%]">
                                            
                                            <div className="flex gap-2 w-full">
                                                <label className="w-[28%]">NUMERO VIN:</label>
                                                <input className={`w-[210px] border-[1px] border-black rounded-md ${edit === product.vin && id === product._id ? "opacity-100" : "opacity-50"}`}
                                                id="vin"
                                                name="vin"
                                                type="text"
                                                required
                                                value={product.vin}
                                                disabled={edit === product.vin && id === product._id ? false : true}
                                                ></input>
                                                <BiEdit onClick={() => {edit !==  product.vin ? setEdit(product.vin) : setEdit(""); setId(product._id)}} style={{color: '#424949', fontSize:'20px', cursor: "pointer"}} />
                                            </div>

                                            <div className="flex gap-2 w-full">
                                                <label className="w-[28%]">MARCA:</label>
                                                <input className={`w-[210px] border-[1px] border-black rounded-md ${edit === product.make && id === product._id ? "opacity-100" : "opacity-50"}`}
                                                id="make"
                                                name="make"
                                                type="text"
                                                required
                                                value={product.make}
                                                disabled={edit === product.make && id === product._id ? false : true}//COMPROBACION DOBLE GARANTIZA QUE VALOR SEA UNICO
                                                ></input>
                                                <BiEdit onClick={() => {edit !==  product.make ? setEdit(product.make) : setEdit(""); setId(product._id)}} style={{color: '#424949', fontSize:'20px', cursor: "pointer"}} />
                                            </div>

                                            <div className="flex gap-2 w-full"> 
                                                <label className="w-[28%]">MODELO: </label>
                                                <input className={`w-[210px] border-[1px] border-black rounded-md ${edit === product.model && id === product._id ? "opacity-100" : "opacity-50"}`}
                                                id="model"
                                                name="model"
                                                type="text"
                                                required
                                                value={product.model}
                                                style={{width:"210px"}}
                                                disabled={edit === product.model && id === product._id ? false : true}
                                                ></input>
                                                <BiEdit onClick={() => {edit !==  product.model ? setEdit(product.model) : setEdit(""); setId(product._id)}} style={{color: '#424949', fontSize:'20px', cursor: "pointer"}} />
                                            </div>

                                            <div className="flex gap-2 w-full"> 
                                                <label className="w-[28%]">AÑO: </label>
                                                <input className={`w-[210px] border-[1px] border-black rounded-md ${edit === product.year && id === product._id ? "opacity-100" : "opacity-50"}`}
                                                id="year"
                                                name="year"
                                                type="number"
                                                required
                                                value={product.year}
                                                style={{width:"210px"}}
                                                disabled={edit === product.year && id === product._id ? false : true}
                                                ></input>
                                                <BiEdit onClick={() => {edit !==  product.year ? setEdit(product.year) : setEdit(""); setId(product._id)}} style={{color: '#424949', fontSize:'20px', cursor: "pointer"}} />
                                            </div>

                                            <div className="flex gap-2 w-full"> 
                                                <label className="w-[28%]">TIPO CARROCERIA: </label>
                                                <input className={`w-[210px] border-[1px] border-black rounded-md ${edit === product.cargoBodyType && id === product._id ? "opacity-100" : "opacity-50"}`}
                                                id="cargoBodyType"
                                                name="cargoBodyType"
                                                type="text"
                                                required
                                                value={product.cargoBodyType}
                                                style={{width:"210px"}}
                                                disabled={edit === product.cargoBodyType && id === product._id ? false : true}
                                                ></input>
                                                <BiEdit onClick={() => {edit !==  product.cargoBodyType ? setEdit(product.cargoBodyType) : setEdit(""); setId(product._id)}} style={{color: '#424949', fontSize:'20px', cursor: "pointer"}} />
                                            </div>

                                            <div className="flex gap-2 w-full"> 
                                                <label className="w-[28%]">LARGO: </label>
                                                <input className={`w-[210px] border-[1px] border-black rounded-md ${edit === product.length && id === product._id ? "opacity-100" : "opacity-50"}`}
                                                id="length"
                                                name="length"
                                                type="number"
                                                required
                                                value={product.length}
                                                style={{width:"210px"}}
                                                disabled={edit === product.length && id === product._id ? false : true}
                                                ></input>
                                                <BiEdit onClick={() => {edit !==  product.length ? setEdit(product.length) : setEdit(""); setId(product._id)}} style={{color: '#424949', fontSize:'20px', cursor: "pointer"}} />
                                            </div>

                                            <div className="flex gap-2 w-full"> 
                                                <label className="w-[28%]">ANCHO: </label>
                                                <input className={`w-[210px] border-[1px] border-black rounded-md ${edit === product.width && id === product._id ? "opacity-100" : "opacity-50"}`}
                                                id="width"
                                                name="width"
                                                type="number"
                                                required
                                                value={product.width}
                                                style={{width:"210px"}}
                                                disabled={edit === product.width && id === product._id ? false : true}
                                                ></input>
                                                <BiEdit onClick={() => {edit !==  product.width ? setEdit(product.width) : setEdit(""); setId(product._id)}} style={{color: '#424949', fontSize:'20px', cursor: "pointer"}} />
                                            </div>

                                            <div className="flex gap-2 w-full"> 
                                                <label className="w-[28%]">ALTURA: </label>
                                                <input className={`w-[210px] border-[1px] border-black rounded-md ${edit === product.height && id === product._id ? "opacity-100" : "opacity-50"}`}
                                                id="height"
                                                name="height"
                                                type="number"
                                                value={product.height}
                                                style={{width:"210px"}}
                                                disabled={edit === product.height && id === product._id ? false : true}
                                                ></input>
                                                <BiEdit onClick={() => {edit !==  product.height ? setEdit(product.height) : setEdit(""); setId(product._id)}} style={{color: '#424949', fontSize:'20px', cursor: "pointer"}} />
                                            </div>

                                            <div className="flex gap-2 w-full">
                                                <label className="w-[28%]">KILOMETRAJE: </label>
                                                <input className={`w-[210px] border-[1px] border-black rounded-md ${edit === product.odometer && id === product._id ? "opacity-100" : "opacity-50"}`}
                                                id="odometer"
                                                name="odometer"
                                                type="number"
                                                required
                                                value={decimalFormatter.format(product.odometer)}
                                                style={{width:"210px"}}
                                                disabled={edit === product.odometer && id === product._id ? false : true}
                                                ></input>
                                                <BiEdit onClick={() => {edit !==  product.odometer ? setEdit(product.odometer) : setEdit(""); setId(product._id)}} style={{color: '#424949', fontSize:'20px', cursor: "pointer"}} />
                                            </div>

                                            <div className="flex gap-2 w-full">
                                                <label className="w-[28%]">PRECIO: </label>
                                                <input className={`w-[210px] border-[1px] border-black rounded-md ${edit === product.price && id === product._id ? "opacity-100" : "opacity-50"}`}
                                                id="price"
                                                name="price"
                                                type="tel"//TUVE QUE PONERLE TEL PORQUE EL NUMERO ES MUY LARGO PARA FORMATO NUMBER
                                                required
                                                value={formatterPesoCOP.format(product.price)}
                                                style={{width:"210px"}}
                                                disabled={edit === product.price && id === product._id ? false : true}
                                                ></input>
                                                <BiEdit onClick={() => {edit !==  product.price ? setEdit(product.price) : setEdit(""); setId(product._id)}} style={{color: '#424949', fontSize:'20px', cursor: "pointer"}} />
                                            </div>

                                            <div className="flex gap-2 w-full"> 
                                                <label className="w-[28%]">IMAGENES: </label>
                                                <input className={`w-[210px] border-[1px] border-black rounded-md ${edit === product.images && id === product._id ? "opacity-100" : "opacity-50"}`}
                                                id="images"
                                                name="images"
                                                type="text"
                                                required
                                                value={product.images}
                                                style={{width:"210px"}}
                                                disabled={edit === product.images && id === product._id ? false : true}
                                                ></input>
                                                <BiEdit onClick={() => {edit !==  product.images ? setEdit(product.images) : setEdit(""); setId(product._id)}} style={{color: '#424949', fontSize:'20px', cursor: "pointer"}} />
                                            </div>

                                        </form>
                                </div>
                                {/*LOS BOTONES AL LADO DERECHO*/}
                                <div className="flex flex-col justify-center items-center gap-4">
                                    <ButtomUpdate width={"120px"} height={"30px"} fontSize={'14px'}/>
                                    <ButtomAddImage width={"120px"} height={"30px"} fontSize={'14px'}/>
                                    

                                </div>

                            </div>
                        ))}


                    </div>

                </div>
            </div>

            <Footer />

        </div>
    )
}

export default TrucksList;