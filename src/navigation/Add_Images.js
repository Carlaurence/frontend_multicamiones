import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import swal from "sweetalert";
import crud from "../backEndConnection/crud";
import axios from 'axios';
import back from "../backEndConnection/back";

const AddImages = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const [isTop, setIsTop] = useState(true)//SETEA [isTop === true] PARA QUE SE RENDERICE EN EL TOP:0

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
                    console.log(response)
                    navigate("/");
                }
            }
        }
        getUserAuthenticated();

        //EVENTO OYENTE PARA QUE EL MOVERSE EL SCROLL SETE [isTop === false]
        window.addEventListener('scroll', () => {
            setIsTop(window.scrollY === 0);
        });
        
        getProductById();
    }, [navigate])


    const [visibility, setVisibility] = useState(false) //CONTROLA LA VENTANA MODAL 'LOADING-SPINNER' 
    const [files, setFiles] = useState(null)//files SE SETEA CON UN fileList{}
    const [product, setProduct] = useState({});

    const getProductById = async () => {
        const response = await crud.GET(`/api/product/idproduct/${id}`);//ID PRODUCTO SELECCIONADO
        setProduct(response.msg);
    }

    const createImagesAxios = async() => {

        if(files === null){
            return swal("ERROR", "No hay imagenes para subir!", "error");
        } else if (((files.length)+(product.images.length)) > 8) {
            //console.log((files.length)+(product.images.length))
            //El tope maximo son 8 imagenes\n el sistema solo acepta N imagenes porque ya haty M imagenes guardadas
            return swal("EXCEDE TOPE MAXIMO", `Este producto tiene espacio para ${Math.abs(8-product.images.length)} imagenes`, "error");
        } else{ 
 
            //CREAMOS EL FORMDATA OBJECT
            const formData = new FormData();

            //SETEAMOS EL CAMPO 'images' DEL FORMDATA CON MULTIPLES FILES-IMAGES useState[files]
            for(let i = 0; i < files.length; i ++){
                formData.append('images', files[i])//METODO PARA INSERTAR UN FILELIST{} EN UN FORMDATA
            }

            setVisibility(true)//Visibility = TRUE => RENDERIZA LA VENTANA MODAL DEL LOADING SPINNER

            const token = localStorage.getItem("token");
            if (!token) {
                swal("ACCION INVALIDA", "No hay token\nVuelva a loguearse ", "error");
                navigate("/")
            }else{
                
                await axios.post(`${back.api.baseURL}/api/product/addimages/${id}`, formData, 
                {
                    headers:{'x-auth-token': token},

                    onUploadProgress: (event) => {
                        //console.log(event.loaded, event.total)
                    } 
                })
                .then(response => {
                    //console.log(response)//EL OBJETO QUE RETORNA AXIOS 
                    if(response.data.message==="jwt expired"){
                        //console.log(response.data.message)
                        swal("ACCION INVALIDA", "El Token ha expirado\nVuelva a loguearse!", "error");
                        localStorage.removeItem('token');
                        navigate("/");
                    }else{

                        if(response.data === "Error de Try/Catch en el Backend"){
                            swal("ERROR", "Error de Try / Catch en el Backend", "error");
                            localStorage.removeItem('token');
                            navigate("/");
                        }else{

                            swal("BIEN HECHO!", "Las Imagenes se actualizaron exitosamente!", "success");
                            setVisibility(false)// Visibility = FALSE => DESAPARECE LA VENTANA MODAL LOADING SPINNER
                            navigate(`/trucks_list`);
                        }
                    }
                }).catch(error => {
                    swal("ERROR", 'Error try/catch Axios: ' + error, "error");
                    setVisibility(false)// Visibility = FALSE => DESAPARECE LA VENTANA MODAL LOADING SPINNER
                })
            } 
        }
    }

    //CUANDO SE PRESIONA EL BOTON [ACTUALIZAR] LA <form> EJECUTA LA FUNCION {onSubmit}
    const onSubmit = (e) => {
        e.preventDefault();//impedir que se recargue automaticamente
        //updateProduct();
        createImagesAxios();
    }

    /**MANEJO DEL DRAG && DROP **/
    const inputRef = useRef();

    const handleDragOver = (e) => {
        e.preventDefault();
    }
    const handleDrop = (e) => {
        e.preventDefault();
        setFiles(e.dataTransfer.files)
    }

    return (
        <div className={`overflow-hidden bg-gradient-to-r from-black via-gray-400 to to-white ${isTop ? window.scrollTo({ top: 0 }) : ''}`}>
            <Navbar />
            {/*AQUI ORGANIZAMOS EL DIV PARA QUE LA PANTALLA SE DIVIDA EN DOS, A LA IZQ EL SIDBAR Y A LA DERECHA EL FORMULARIO*/}
            <div className="flex flex-row min-h-screen w-screen">
                <Sidebar />

                {/*PANTALLA MD: Y LG:*/}
                <div className={`hidden md:flex justify-center items-center w-screen font-semibold`}>

                    {/**/}
                    <div className="mt-32 mb-14 bg-white flex justify-center items-center border border-black shadow-2xl shadow-red-600 w-[484px] p-3 rounded-xl">
                        <div className="bg-red-600 w-full border border-white shadow-2xl shadow-black rounded-xl">
                            <h1 className="flex justify-center text-xl text-white pt-4 font-semibold uppercase">Adicionar Imagenes</h1>
                            <h1 className="mb-6 flex justify-center text-xl text-white font-semibold uppercase">{product.make +" "+ product.model}</h1>

                            <form onSubmit={onSubmit} className="flex flex-col justify-center items-center gap-3">
                                    
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

                                <div className="flex flex-col pt-6 gap-5 mb-3 w-[80%]">
                                    <button type="submit" value="Guardar Imagenes" className="bg-white text-red-600 rounded-xl border border-black shadow-lg shadow-black hover:bg-gray-200 active:bg-opacity-70 w-full h-[36px] flex justify-center items-center font-bold" >Guardar Imagenes</button>
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

export default AddImages;