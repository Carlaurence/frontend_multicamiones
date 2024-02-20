import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import crud from "../backEndConnection/crud";
import swal from "sweetalert";
import axios from 'axios';
import back from "../backEndConnection/back";


const Advertisements = () => {

    const navigate = useNavigate();

    useEffect(() => {

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
                    navigate("/");
                }
            }
        }
        getUserAuthenticated();
        //NOTA IMPORTANTE: TIPOS DE ERROR DEL JSONWEBTOKEN
        //1- {name: 'JsonWebTokenError', message: 'invalid signature'}
        //2- {name: 'JsonWebTokenError', message: 'jwt malformed'}
        //3- {name: 'TokenExpiredError', message: 'jwt expired', expiredAt: '2023-07-23T07:54:29.000Z'}  
    }, [navigate])

    const [visibility, setVisibility] = useState(false) //CONTROLA LA VENTANA MODAL 'LOADING-SPINNER' 
    const [file, setFile] = useState(null)//files SE SETEA CON UN fileList{}
    const [description, setDescription] = useState(null)

    const onChange = (e) => {
        setDescription(e.target.value.trimStart())
    }

    const onSubmit = (e) => {
        e.preventDefault();//impedir que se recargue automaticamente
        createAdvertisementAxios();
    }

    /**post method with Axios*/
    const createAdvertisementAxios = async () => {

        if (file === null) {
            return swal("ERROR", "Para crear publicidad, debe subir una imagen!", "error");
        } else {

            //CREAMOS EL FORMDATA OBJECT
            const formData = new FormData();

            //SETTING 2 CAMPOS EN FORMDATA
            formData.append('description', description)
            formData.append('image', file)

            //ONLY FOR CONFIRMING formData INFORMATION
            /** 
            for (let pair of formData.entries()) {
                console.log(pair)
            }*/

            //RENDERIZAMOS LA VENTANA MODAL UPLADING...
            setVisibility(true)

            const token = localStorage.getItem("token");
            if (!token) {
                swal("ACCION INVALIDA", "No hay token\nVuelva a loguearse ", "error");
                navigate("/")
            } else {
                await axios.post(`${back.api.baseURL}api/advertisements`, formData,
                    {
                        headers: { 'x-auth-token': token },
                    })
                    .then(response => {
                        //console.log(response)//EL OBJETO QUE RETORNA AXIOS 
                        if (response.data.message === "jwt expired") {
                            //console.log(response.data.message)
                            swal("ACCION INVALIDA", "El Token ha expirado\nVuelva a loguearse!", "error");
                            localStorage.removeItem('token');
                            navigate("/");
                        } else if (response.data === "ERROR: No llego ningun file al backend!") {
                            swal("ACCION INVALIDA", "No llego el file al Backend", "error");
                        } else if (response.data === "Error de Try/Catch en el Backend") {
                            swal("ERROR", "Error de Try / Catch en el Backend", "error");
                            localStorage.removeItem('token');
                            navigate("/");
                        } else {
                            swal("BIEN HECHO!", "Las Imagenes se actualizaron exitosamente!", "success");
                            setVisibility(false)// Visibility = FALSE => DESAPARECE LA VENTANA MODAL LOADING SPINNER
                            navigate('/advertisement_list');
                        }
                    }).catch(error => {
                        swal("ERROR", 'Error try/catch Axios: ' + error, "error");
                        setVisibility(false)// Visibility = FALSE => DESAPARECE LA VENTANA MODAL LOADING SPINNER
                    })
            }
        }
    }

    /**MANEJO DEL DRAG && DROP **/
    const inputRef = useRef();

    const handleDragOver = (e) => {
        e.preventDefault();
    }
    const handleDrop = (e) => {
        e.preventDefault();
        setFile(e.dataTransfer.files[0])
    }

    return (

        <div className="overflow-hidden bg-gradient-to-r from-black via-gray-400 to to-white">
            <Navbar />
            <div className="flex flex-row min-h-screen w-screen">
                <Sidebar />
                {/*PANTALLA MD: Y LG:*/}
                <div className={`hidden md:flex justify-center items-center w-screen font-semibold`}>

                    {/*INICIO FORMULARIO*/}
                    <div className="mt-32 mb-14 bg-white flex justify-center items-center border border-black shadow-2xl shadow-red-600 w-[484px] p-3 rounded-xl">
                        <div className="bg-red-600 w-full border border-white shadow-2xl shadow-black rounded-xl">
                            <h1 className="flex justify-center text-xl text-white pt-4 mb-6 font-semibold uppercase">Agregar Publicidad</h1>


                            <form onSubmit={onSubmit} className="flex flex-col justify-center items-center gap-3">

                                <div className="flex flex-col w-[80%]">
                                    <label className="text-white">Description</label>
                                    <textarea className="text-gray-700 px-2 py-1 rounded-md leading-tight border border-black"
                                        id="description"
                                        type="text"
                                        name="description"
                                        rows={2}
                                        placeholder="Description"
                                        //required
                                        onChange={onChange}
                                    ></textarea>
                                </div>

                                <div className="flex flex-col w-[80%]">
                                    <label className="text-white">Fotos Cloudinary. Aspecto Ratio 16:9</label>

                                    {!file && (//SI EL CAMPO "images" ESTA VACIO... ENTONCES => PINTAR ESTE RETURN()
                                        <div className="bg-white flex flex-col justify-between items-center h-[120px] border-black/70 border-dashed border-[2px] p-4"
                                            onDragOver={handleDragOver}
                                            onDrop={handleDrop}
                                        >
                                            <h1 className=" font-semibold text-black/70 ">Arrastrar Imagenes & Soltar Aqui</h1>
                                            <h1 className=" font-semibold"></h1>
                                            <input
                                                type="file"
                                                name="image"
                                                id="image"
                                                accept="image/*"
                                                //multiple
                                                hidden
                                                onChange={(e) => setFile(e.target.files[0])}

                                                ref={inputRef}

                                            >
                                            </input>

                                            <div className="button-select-files">
                                                <div onClick={() => inputRef.current.click()} className=" bg-slate-200 text-red-600 font-semibold rounded-md px-3 py-[2px] border border-black shadow-lg shadow-black hover:bg-opacity-60 active:bg-opacity-50 cursor-pointer">Select File</div>
                                            </div>

                                        </div>
                                    )}
                                    {file && (//SI EL CAMPO "images" CONTIENE FILES... ENTONCES => PINTAR ESTE RETURN()
                                        <div className=" bg-white flex flex-col gap-4 items-center justify-center max-h-[300px] border-black/70 border-dashed border-[2px] p-4">


                                            <div className="overflow-auto bg-slate-200 border-black border-[1px] p-2">
                                                <img src={URL.createObjectURL(file)} alt="#" className="border-black border-[1px] aspect-[16/9]"></img>
                                            </div>

                                            <div className="cancel-buttom">
                                                <button onClick={() => setFile(null)} className="bg-slate-200 text-red-600 font-semibold rounded-full px-3 py-[2px] border border-black shadow-lg shadow-black hover:bg-opacity-60 active:bg-opacity-50" >Cancelar</button>
                                            </div>
                                        </div>
                                    )}

                                </div>

                                <div className="flex flex-col pt-6 gap-5 mb-3 w-[80%]">
                                    <button type="submit" value="Guardar Imagenes" className="bg-white text-red-600 text-sm rounded-xl border border-black shadow-lg shadow-black hover:bg-gray-200 active:bg-opacity-70 w-full h-[36px] flex justify-center items-center font-bold uppercase" >Guardar Publicidad</button>
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

export default Advertisements;