//www.localhost:3000/trucks_list
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import Carousel from "../components/Carousel";
import swal from "sweetalert";
import crud from "../backEndConnection/crud";

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
    const [reload, setReload] = useState(false)
    const [visibility, setVisibility] = useState(false) //CONTROLA LA VENTANA MODAL 'LOADING-SPINNER'

    //FILTRO DE SEGURIDAD PARA ACCEDER ACCEDER A URL'S PROTEGIDAS "/trucks_list"
    //SE EJECUTA CON useEfeect()

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
                if (response.user) {//SI EL USER ES TRUE, ENTONCES SE PERMITE EL ACCESO AL MODULO "/ADMIN"
                    //console.log(response.user)
                    setReload(false)
                    getAllTrucks();
                } else {//SI NO RETORNA EL USER, ENTONCES ACCESO DENEGADO
                    swal("ERROR", " Acceso Denegado \nUsuario Sin Loguear ", "error");
                    localStorage.removeItem('token');
                    navigate("/");
                }
            }
        }
        getUserAuthenticated();

    }, [navigate, reload])

    const [products, setProducts] = useState([]);
    const getAllTrucks = async () => {
        const response = await crud.GET(`/api/product`);
        //console.log(response.msg)
        setProducts(response.msg);
    }

    const warningDelete = (id) => {
        swal({
            title: "Estas Seguro?",
            text: "Una vez sea borrado, no se podra recuperar esta informacion!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    deleteProduct(id);
                } else {
                    swal("Cancelado", 'Accion Cancelada!', 'error');
                }
            });
    }

    const deleteProduct = async(id) => {
        setVisibility(true)//Visibility = TRUE => RENDERIZA LA VENTANA MODAL DEL LOADING SPINNER
        const response = await crud.DELETE(`/api/product/${id}`)
        //console.log(response.msg)
        if(response.msg === "productos no existe"){
            setVisibility(false)
            swal('Error', "productos no existe", 'error')
        } else{
            swal('Success', 'Producto borrado', 'success')
            setVisibility(false)
            setReload(true)//ACTUALIZA LA PAGINA   
        }
    }

    return (
        <div className={`overflow-hidden`}>
            <Navbar />

            {/*AQUI ORGANIZAMOS EL DIV PARA QUE LA PANTALLA SE DIVIDA EN DOS, A LA IZQ EL SIDBAR Y A LA DERECHA EL FORMULARIO*/}
            <div className="flex flex-row min-h-screen w-screen bg-gradient-to-r from-black via-gray-400 to to-white">
                <Sidebar />
                    
                {/*PANTALLA MD: Y LG:*/}
                <div className={`hidden md:flex justify-center items-center w-screen`}>

                    {/*LISTA DE CAMIONES*/}
                    <div className="mt-32 mb-14 flex flex-col gap-3">

                        {products.map((product, index) => (
                            /*DIV TIPO FLEX-ROW PARA PONER EL CAROUSEL AL LADO IZQ, LA INFO EN EL MEDIO Y LOS BOTONES AL LADO DERECHO*/
                            <div key={product._id} className="group bg-white flex flex-row gap-2 p-2 rounded-md border-[1px] border-red-600 shadow-md shadow-red-600">

                                {/*EL CAROUSEL AL LADO IZQUIERDO*/}
                                <div className='rounded-md w-[165px]'>
                                    {/*RELACION DE ASPECTO 5:4 => 5 UNID ANCHO X 4 DE ALTO*/}
                                    <Carousel images={product.images}/>
                                </div>
                                {/*LA INFORMACION EN EL MEDIO*/}
                                <div className="overflow-hidden truncate flex flex-col justify-center gap-1 text-[13px] w-[200px]">
                                        
                                        <span className="bg-black/20">Marca:&nbsp;{product.make}</span>
                                        <span className="bg-black/20">Modelo:&nbsp;{product.model}&nbsp;Año: {product.year}</span>
                                        <span className="bg-black/20 lowercase">{product.cargoBodyType}</span>
                                        <span className="bg-black/20">Largo: {product.length} * Ancho: {product.width} * Alto: {product.height}</span>                                        
                                        <span className="bg-black/20">Kilometraje:&nbsp;{decimalFormatter.format(product.odometer)}</span>
                                        <span className="bg-black/20">Precio:&nbsp;&nbsp;{formatterPesoCOP.format(product.price)}</span>
                                    
                                </div>
                                {/*LOS BOTONES AL LADO DERECHO*/}
                                <div className="relative flex flex-col justify-center items-center gap-4">
                                    <button onClick={() => navigate(`/update_product/${product._id}`)} type="button" value="edit" className="bg-yellow-500 rounded-md border border-black shadow-lg shadow-black hover:bg-yellow-600 hover:text-gray-300  active:bg-opacity-70 w-[90px] h-[30px] flex justify-center items-center text-sm text-white font-semibold" >Editar</button>
                                    <button onClick={() => navigate(`/add_images/${product._id}`)} type="button" value="edit" className="bg-blue-500 rounded-md border border-black shadow-lg shadow-black hover:bg-blue-600 hover:text-gray-300  active:bg-opacity-70 w-[90px] h-[30px] flex justify-center items-center text-sm text-white font-semibold" >add Images</button>
                                    <button onClick={()=>{warningDelete(product._id)}} type="button" value="edit" className="bg-red-600 rounded-md border border-black shadow-lg shadow-black hover:bg-red-700 hover:text-gray-300 active:bg-opacity-70 w-[90px] h-[30px] flex justify-center items-center text-sm text-white font-semibold" >Eliminar</button>
                                </div>

                            </div>
                        ))}
                    </div>
                    {/*FIN LISTA DE CAMIONES*/}

                    {/**ESTA ES LA VENTANA MODAL DE LOADING... LA CUAL SE EJECUTA CUANDO visibility = true*/}
                    <div className="fixed z-50 top-40">
                        {visibility && (
                            <div id="loader" className="bg-white flex flex-col justify-center items-center gap-4  w-[540px] h-[380px] rounded-md">
                                <div className="h-[120px] w-[120px] border-solid border-[15px] border-t-red-600 rounded-full animate-spin duration-1000"></div>
                                <span className="font-medium text-3xl">Loading Data ...</span>
                                <span className="font-normal">Espere un momento. El Producto esta siendo borrado...</span>
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

export default TrucksList;