import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import crud from "../backEndConnection/crud";
import swal from "sweetalert";
import bgImage from "../assets/images/Fondo_Home.jpg"
/**REACT ICONS */
import { IoMdCloseCircle } from "react-icons/io";

const AdvertisementList = () => {

    const navigate = useNavigate();
    const [reload, setReload] = useState(false)
    const [visibility, setVisibility] = useState(false) //CONTROLA LA VENTANA MODAL 'LOADING-SPINNER'

    useEffect(()=>{

        const getUserAuthenticated = async () => {
            const token = localStorage.getItem('token');            
            if (!token) {
                swal("ERROR", " Acceso Denegado \nNo hay token ", "error");
                navigate("/")
            } else {
                const response = await crud.GET(`/api/login`);
                if (response.user) {
                    /**PERMITE EL ACCESO Y EL PASO A LA SIGUIENTE FUNCION getUserAuthenticated()*/
                } else {
                    swal("ERROR", " Acceso Denegado \nUsuario Sin Loguear ", "error");
                    localStorage.removeItem('token');
                    //console.log(response)
                    navigate("/");
                }
            }
        }
        getUserAuthenticated();
        setReload(false)
        getAllAdvertisements();
    }, [navigate, reload])

    const [advertisements, setAdvertisements] = useState([])
    const getAllAdvertisements = async() => {
        const response = await crud.GET(`/api/advertisements`)
        //console.log(response.msg)
        setAdvertisements(response.msg)  
    }

    /**DELETE PROCCESS*/
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
                    deleteAdvertisement(id);
                } else {
                    swal("Cancelado", 'Accion Cancelada!', 'error');
                }
            });
    }

    const deleteAdvertisement = async(id) => {
        setVisibility(true)//Visibility = TRUE => RENDERIZA LA VENTANA MODAL DEL LOADING SPINNER
        const response = await crud.DELETE(`/api/advertisements/${id}`)
        //console.log(response.msg)
        if(response.msg === "Backend: Publicidad no existe"){
            setVisibility(false)
            swal('Error', "Publicidad no existe", 'error')
        }else if(response.msg === "Error de Try/Catch en el Backend"){
            setVisibility(false)
            swal('Error', "Error de Try/Catch en el Backend", 'error')
        } else{
            swal('Success', 'La Publicidad fue borrada', 'success')
            setVisibility(false)
            setReload(true)//EJECUTA useEffect INICIAL Y REFRESCA LA PAGINA   
        }
    }

    /**VARIABLES DE METODOS DE COMPROBACION*/
    const [isHovering ,setIsHovering] = useState(false)
    const [indeximg, setIndexImg] = useState(null)
    //console.log("isHoverging: "+isHovering+" on Index:"+indeximg)


    return (
        <div className="overflow-hidden bg-gradient-to-r from-black via-gray-400 to to-white">
            <Navbar />
            <div className="flex flex-row min-h-screen w-screen">
                <Sidebar />
                {/*PANTALLA MD: Y LG:*/}
                <div className={`hidden md:flex justify-center items-center w-screen font-semibold`}>

                    {/*LISTA DE PUBLICIDAD*/}
                    <div className="mt-32 mb-14 grid grid-cols-2 gap-3 w-[80%]">

                        {advertisements.map((item, index) => (
                            <div key={index}
                                style={{backgroundImage: `url(${item.image.secure_url})`}}
                                onMouseOver={() => {setIsHovering(true); setIndexImg(index)}} 
                                onMouseOut={() => {setIsHovering(false); setIndexImg(null)}} 
                                className="flex justify-end p-1 aspect-[16/9] hover:opacity-50 rounded-md bg-cover" 
                                >

                                <IoMdCloseCircle 
                                    onClick={() => warningDelete(item._id)}
                                    className={`text-4xl cursor-pointer ${isHovering && index===indeximg ? "flex":"hidden"}`}    
                                />
                            
                            </div>
                        ))}
                        
                    </div>
                    {/*FIN LISTA DE PUBLICIDAD*/}

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

export default AdvertisementList;