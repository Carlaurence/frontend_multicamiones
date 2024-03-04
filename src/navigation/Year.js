import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import crud from "../backEndConnection/crud";
import swal from "sweetalert";
//react-icons
import { BsTrash } from "react-icons/bs";

const Year = () => {

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
     * 1- SE EJECUTA EL FILTRO DE SEGURIDAD **************************************************************
     * 2- SE EJECUTA EL useEffect() Y LA FUNCION getAllYears=> *******************************************
     * 3- LA FUNCION getAllYears() TRAE TODOS LOS AÑOS EXISTENTES Y LOS PONE EN EL SELECT ****************
     ****************************************************************************************************/
    const [isTop, setIsTop] = useState(true)//SETEA [isTop === true] PARA QUE SE RENDERICE EN EL TOP:0

    useEffect(() => {//AL ACCEDER AL ADMIN "/" AUTOMATICAMENTE SE EJECUTA ESTE USEEFECT
        getUserAuthenticated();//EJECUTA EL FILTRO DE SEGURIDAD 

        //EVENTO OYENTE PARA QUE EL MOVERSE EL SCROLL SETE [isTop === false]
        window.addEventListener('scroll', () => {
            setIsTop(window.scrollY === 0);
        });

        getAllYears();
    }, [navigate])//[navigate] SINTAXIS PARA QUE useEffect SE EJECUTE UNICAMENTE AL DETECTAR UN CAMBIO EN EL navigate 

    const [years, setYears] = useState([]);

    const getAllYears = async () => {
        const response = await crud.GET(`/api/year`);
        //console.log(response.msg)
        if (response.msg === 'error de try / catch') {
            return swal("ERROR", "Error de Try / Catch!", "error");
        } else { setYears(response.msg); }
    }
    /*SEGUNDA PARTE: *************************************************************************************
     * 1- SE CREA UN useState => [dataYear] CON UN CAMPO year: '' **************************************** 
     * 2- EL CAMPO {year:""} GUARDARA LA DATA INGRESADA EN EL INPUT year *********************************
     * 3- EL onChange SE EJECUTARA CADA QUE DETECTE CAMBIOS EN EL INPUT year *****************************
     * 4- CADA QUE SE EJECUTA onChange, SE SETEA setdataYear(year) CON LA DATA CAPTURADA DEL INPUT year **
     * 5- CREAMOS UN JSON { year } = dataYear EL CUAL TOMARA LOS VALORES DEL ONCHANGE ********************
     ****************************************************************************************************/
    const [dataYear, setDataYear] = useState({//DATA REQUERIDA PARA CREAR UN AÑO DE FABRICACION
        year: ''
    });

    const onChange = (e) => {
        setDataYear({
            ...dataYear,
            [e.target.name]: e.target.value.trim()
        })
    };

    //AQUI ARMAMOS UN .JSON{} EL CUAL TOMARA LOS VALORES DEL ONCHANGE 
    const { year } = dataYear;

    /*TERCERA PARTE: *************************************************************************************
     * 1- CUANDO SE PRESS EL BOTON [CREAR AÑO] SE EJECUTA LA FUNCION {onSubmit} ************************** 
     * 2- AL EJECUTARSE EL onSubmit SE EJECUTA EL REQUEST createYear() ***********************************
     ****************************************************************************************************/
    const onSubmit = (e) => {
        e.preventDefault();
        createYear();
    }

    //AQUI LLAMAMOS AL CRUD POST PARA CREAR UN AÑO
    const createYear = async () => {

        const data = {
            year: dataYear.year
        }

        if (data.year.length < 4 || data.year.length > 4) {
            swal("ERROR", "Accion Invalida! \nEl Formato del Año Que Ha Ingresado, es Incorrecto", "error");
        } else if (data.year < 1990) {
            swal("ERROR", "Accion Invalida! \nNo se permite crear Años Inferiores a 1990 ", "error");
        } else if (data.year > 2026) {
            swal("ERROR", "Accion Invalida! \nNo se permite crear Años Superiores a 2026 ", "error");
        } else {

            const response = await crud.POST(`/api/year`, data);
            console.log(response.msg);//respuesta confirmada en consola  

            if (response.msg === "ERROR: data incompleta") {
                swal("ERROR", "Accion Invalida! \nData Requerida Incompleta", "error");
            } else if (response.msg === "el año ya existe") {
                swal("ERROR", "Accion Invalida! \nEl 'Año' que esta intentado crear, Ya Existe!", "error");
                setDataYear({
                    year: ''
                });
            } else if (response.msg === "error de try / catch") {
                swal("ERROR", "Accion Invalida! \nSe Presento Un Error De Try / Catch", "error");
            } else {
                swal("BIEN HECHO!", "El Año se creo correctamente!", "success");
                setDataYear({
                    year: ''
                });

                //DESPUES DE QUE EL USUARIO HAYA SIDO CREADO EXITOSAMENTE, LA PAGINA SE REDIRECCIONA A LA PAGINA DE /admin
                navigate("/admin")//year_list
            }
        }
    }

    /*CUARTA PARTE: ELIMINAR UN AÑO ********************************************************************
    * 1- EL onChangeYearSelected(e) SE EJECUTARA CADA QUE SE SELECCIONE UN AÑO *************************
    * 2- onChangeYearSelected(e) SE ENCARGA DE SETTEAR A idYearSelected CON EL ID DEL AÑO SELECCIONADO *
    * 3- AL PRESS BOTON [ELIMINAR] EJECUTA PRIMERO EL warningDelete PARA EVITAR BORRAR INVOLUNTARIAMENTE ** 
    * 4- DESPUES DE "ACEPTAR", SE LLAMA EL REQUEST deteleteYear() Y EJECUTA ACCION DE ELIMINAR *********
    * **************************************************************************************************/
    const onChangeYearSelected = (e) => {
        setIdYearSelected(e.target.value);
    }

    const [idYearSelected, setIdYearSelected] = useState(false);


    const deleteYear = async (id) => {//SE INVOCA DESDE warningDelete() PORQUE 'swal' NO ACEPTA ASYNC/AWAIT

        const response = await crud.DELETE(`/api/year/${id}`);
        console.log(response.msg)

        if (response.msg === "ERROR: data incompleta") {
            swal("ERROR", "Accion Invalida! \nData Requerida Incompleta", "error");
        } else if (response.msg === "ERROR: no hay años creados con ID ingresado") {
            swal("ERROR", "Accion Invalida! \nNo Se Encontro Año con el ID Ingresado", "error");
        } else if (response.msg === "error de try / catch") {
            swal("ERROR", "Accion Invalida! \nSe Presento Un Error De Try / Catch", "error");
        } else {
            swal("El Registro fue borrado!", {icon: "success"});
            navigate(`/admin`);
        }
    }

    const warningDelete = (id) => {
        swal({
            title: "Esta Seguro?",
            text: "Una vez borrado, Usted no podra recuperar este archivo!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    deleteYear(id);//SE DEBE INVOCAR PORQUE NO 'swal' NO ACEPTA UN ASYNC / AWAIT
                } else {swal("Accion cancelada!");}
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
                            <span className="mb-6 flex justify-center text-xl text-white pt-4 font-semibold uppercase">Años De Fabricacion</span>

                            <form onSubmit={onSubmit} className="flex flex-col justify-center items-center gap-5">
                                <div className="flex flex-col w-[300px]">
                                    <label className=" text-white font-medium">Crear</label>
                                    <div className="flex flex-row gap-4 items-center justify-between">
                                        <input className=" text-gray-700 py-2 px-6 w-[200px] rounded-xl leading-tight border border-black"
                                            id="year"
                                            type="number"
                                            name="year"
                                            placeholder="Año... /YYYY"
                                            required
                                            value={year.toUpperCase()}
                                            onChange={onChange}
                                        ></input>
                                        <button type="submit" value="name" className="bg-white rounded-full border border-black shadow-lg shadow-black hover:bg-opacity-90 active:bg-opacity-70 w-[90px] h-[30px] flex justify-center items-center text-red-600 font-bold" >Guardar</button>
                                    </div>

                                </div>
                                <div className="flex flex-col w-[300px]">
                                    <label className=" text-white font-medium">Eliminar</label>
                                    <div className="flex flex-row gap-4 items-center justify-between">
                                        <select className="text-gray-700 w-[200px] py-2 px-6 rounded-xl leading-tight border border-black"
                                            id="listyear"
                                            type="text"
                                            name="listyear"
                                            defaultValue={'DefaultValue'}
                                            onChange={onChangeYearSelected}
                                        >
                                            <option value="DefaultValue" disabled >Seleccione Año...</option>
                                            {
                                                years.map((item, index) => (
                                                    <option key={item._id} value={item._id}>{item.year}</option>
                                                ))
                                            }
                                        </select>

                                        <div className={`flex items-center gap-4 ${idYearSelected !== false ? "visible" : "invisible"}`}>
                                            <button type="button" onClick={() => warningDelete(idYearSelected)} className="bg-white rounded-full border border-black shadow-lg shadow-black hover:bg-opacity-90 active:bg-opacity-70 w-[90px] h-[30px] flex justify-center items-center text-red-600 font-bold" >Eliminar</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col font-normal justify-center items-center text-sm">
                                    <Link className="mb-10 mt-8 text-white underline hover:text-opacity-70 active:text-opacity-50" to={"/admin"}>Regresar a Modulo Admin</Link>
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

export default Year;