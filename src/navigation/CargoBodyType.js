import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import crud from "../backEndConnection/crud";
import swal from "sweetalert";


const CargoBodyType = () => {

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
     * 2- SE EJECUTA EL FILTRO DE SEGURIDAD **************************************************************
     ****************************************************************************************************/
    const [isTop, setIsTop] = useState(true)//SETEA [isTop === true] PARA QUE SE RENDERICE EN EL TOP:0

    useEffect(() => {//AL ACCEDER AL ADMIN "/" AUTOMATICAMENTE SE EJECUTA ESTE USEEFECT
        getUserAuthenticated();//EJECUTA EL FILTRO DE SEGURIDAD 

        //EVENTO OYENTE PARA QUE EL MOVERSE EL SCROLL SETE [isTop === false]
        window.addEventListener('scroll', () => {
            setIsTop(window.scrollY === 0);
        });
        
    }, [navigate])//[navigate] SINTAXIS PARA QUE useEffect SE EJECUTE UNICAMENTE AL DETECTAR UN CAMBIO EN EL navigate 

    /*SEGUNDA PARTE: *************************************************************************************
     * 1- SE CREA UN useState => [cargoBody] CON UN CAMPO name: '' *************************************** 
     * 2- EL CAMPO {name:""} GUARDARA LA DATA INGRESADA EN EL INPUT name *********************************
     * 3- EL onChange SE EJECUTARA CADA QUE DETECTE CAMBIOS EN EL INPUT name *****************************
     * 4- CADA QUE SE EJECUTA onChange, SE SETEA setCargoBody(cargoBody) CON LA DATA CAPTURADA DEL INPUT name *
     ****************************************************************************************************/
    const [cargoBody, setCargoBody] = useState({//DATA REQUERIDA PARA CREAR UNA NUEVO TIPO DE FURGON
        name: ''
    });

    const onChange = (e) => {
        setCargoBody({
            ...cargoBody,
            [e.target.name]: e.target.value.trimStart()
        })
    };

    //AQUI ARMAMOS UN .JSON{} EL CUAL TOMARA LOS VALORES DEL ONCHANGE 
    const { name } = cargoBody;

    /*TERCERA PARTE: *************************************************************************************
     * 1- CUANDO SE PRESS EL BOTON [CREAR FURGON] SE EJECUTA LA FUNCION {onSubmit} ************************ 
     * 2- AL EJECUTARSE EL onSubmit SE EJECUTA EL REQUEST createCargoBodyType() **************************
     * 3- createCargoBodyType() CREA UN NUEVO TIPO DE FURGON CON LA DATA DE cargoBody{name: ''} **********
     ****************************************************************************************************/
    const onSubmit = (e) => {
        e.preventDefault();
        createCargoBodyType();
    }

    //AQUI LLAMAMOS AL CRUD POST PARA CREAR UN NUEVO TIPO DE FURGON
    const createCargoBodyType = async () => {

        const data = {
            name: cargoBody.name.toUpperCase()
        }

        const response = await crud.POST(`/api/cargobodytype`, data);
        console.log(response.msg);//respuesta confirmada en consola  

        if (response.msg === "ERROR: data incompleta") {
            swal("ERROR", "Accion Invalida! \nData Requerida Incompleta", "error");
        }else if (response.msg === "la marca ya existe") {
            swal("ERROR", "Accion Invalida! \nLa 'Marca' que esta intentado crear, Ya Existe!", "error");
        }else if(response.msg === "error de try / catch"){
            swal("ERROR", "Accion Invalida! \nSe Presento Un Error De Try / Catch", "error");
        }else {
            swal("BIEN HECHO!", "El Tipo de Furgon se creo correctamente!", "success");
            setCargoBody({
                name: ''
            });

            //DESPUES DE QUE EL USUARIO HAYA SIDO CREADO EXITOSAMENTE, LA PAGINA SE REDIRECCIONA A LA PAGINA DE /admin
            navigate("/cargobodytype_list")
        }

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
                            <span className="mb-6 flex justify-center text-xl text-white pt-4 font-semibold uppercase">Crear Tipo de Furgon</span>

                            <form onSubmit={onSubmit} className="flex flex-col justify-center items-center gap-3">
                                <div className="flex flex-col">
                                    <label className=" text-white font-medium">Tipo de Furgon</label>
                                    <input className=" text-gray-700 py-2 px-12 rounded-xl leading-tight border border-black"
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder="Ingrese Nombre del Fabricante"
                                        required
                                        value={name.toUpperCase()}
                                        onChange={onChange}
                                    ></input>
                                </div>

                                <div className="flex flex-col pt-6 gap-5 mb-3">
                                    <button type="submit" value="name" className="bg-white rounded-full border border-black shadow-lg shadow-black hover:bg-opacity-90 active:bg-opacity-70 w-[200px] h-[36px] flex justify-center items-center text-red-600 font-bold" >Crear Furgon</button>
                                </div>

                                <div className="flex flex-col font-normal justify-center items-center text-sm">
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

export default CargoBodyType;