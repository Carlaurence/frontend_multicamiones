import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import ButtomSingIn from "../components/Buttom_SignIn";
import crud from "../backEndConnection/crud";
import swal from 'sweetalert';
import Footer from "../components/Footer";

const Signin = () => {

    const navigate = useNavigate();

    const [isTop, setIsTop] = useState(true)//SETEA [isTop === true] PARA QUE SE RENDERICE EN EL TOP:0
    useEffect(() => {
        //EVENTO OYENTE PARA QUE EL MOVERSE EL SCROLL SETE [isTop === false]
        window.addEventListener('scroll', () => {
            setIsTop(window.scrollY === 0);
        });
    }, []);

    //{/*EL HOOK useState({}) AL SER LLAMADO DENTRO DE LA FUNCION onChange = (e), SE ENCARGARA DE SETEAR LAS VARIABLES 
    //[email y password] CON LOS VALORES TRAIDOS DESDE EL FRONT, MEDIANTE FUNCION [e.target.name]: e.target.value*/}
    const [user, setUser] = useState({
        email: '',
        password: ''
    });
    //ESTA FUNCION onChange = (e) SE ENCARGA DE TRAER LOS VALORES DEL FRONT Y SETTEAR A user
    const onChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    };
    //AQUI ARMAMOS UN .JSON{} CON LOS VALORES QUE TOME LA VARIBLE user
    const { email, password } = user;


    const login = async () => {
        const data = {//LA DATA TRAIDA DE FRONT
            email: user.email,
            password: user.password
        }

        //CONDICIONES
        if (!data.email || !data.password) {//DATOS DEL FRONT
            return swal("ERROR", "Todos los campos son obligatorios!", "error");
        } else {//EJECUTA EL CRUD
            const response = await crud.POST(`/api/login`, data);
            //console.log(response.msg);//PRINTEA LOS MENSAJES ENVIADOS DESDE EL BACK 
            //console.log(response.token);//PRINTEA EL TOKEN SI EL USUARIO SE LOGUEA CORRECTAMENTE

            if (response.msg === "Todos los campos son obligatorios") {
                return swal("ERROR", "Los datos no llegaron al BackEnd! Chequear la funcion onChange() y los inputs en el <form></form> en el file Signin.js del Front", "error");
            } else if (response.msg === "Password incorrecto!" || response.msg === "Usuario No existe!") {
                return swal("ERROR", "Usuario y/o Passwor Incorrectos", "error");
            } else {
                const jwt = response.token;//const jwt almacena el token
                localStorage.setItem('token', jwt);//Guardar {"token":"Value"} en el localStorage del navegador 
                navigate("/admin");//Navegar hacia el modulo Admin
            }

        }
    }

    //CUANDO SE PRESIONA EL BOTON [INICIAR SESION] LA <form> EJECUTA LA FUNCION {onSubmit}
    const onSubmit = (e) => {
        e.preventDefault();//impedir que se recargue automaticamente
        login();
    }

    return (

        <div className={`overflow-hidden bg-gradient-to-r from-black via-gray-400 to to-white ${isTop ? window.scrollTo({ top: 0 }) : ''}`}>
            <Navbar />
            <div className="flex justify-center items-center min-h-screen w-screen">

                {/*FORMULARIO*/}{/*PANTALLA MD: Y LG:*/}
                <div className="relative mt-36 mb-14 hidden md:flex justify-center items-center bg-white border border-black shadow-2xl shadow-red-600 w-[380px] p-3 rounded-xl">
                    <div className="bg-red-600 w-full border border-white shadow-2xl shadow-black rounded-xl">
                        <span className="mb-6 flex justify-center text-xl text-white pt-4 font-semibold uppercase">Registro de Ingreso</span>

                        <form onSubmit={onSubmit} className="flex flex-col justify-center items-center gap-3">
                            <div className="flex flex-col">
                                <label className=" text-white font-medium">Usuario</label>
                                <input className=" text-gray-700 py-2 px-12 rounded-xl leading-tight border border-black"
                                    id="username"
                                    type="email"
                                    name="email"
                                    placeholder="username@email.com"
                                    value={email}
                                    onChange={onChange}
                                ></input>
                            </div>
                            <div className="flex flex-col mb-8">
                                <label className="text-white font-medium">Password</label>
                                <input className="text-gray-700 py-2 px-12 rounded-xl leading-tight border border-black"
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="***********************"
                                    value={password}
                                    onChange={onChange}
                                ></input>
                            </div>

                            {/**AL PRESIONAR EL BOTON  [Iniciar Sesion] SE EJECUTA EL onSubmit{onSubmit}*/}
                            <ButtomSingIn />

                            <div className="flex flex-col font-normal justify-center items-center text-sm">
                                <Link className="text-white mb-1 underline hover:text-opacity-70 active:text-opacity-50" to={"/sign_up"}>Crear Usuario</Link>
                                <Link className="text-white underline hover:text-opacity-70 active:text-opacity-50" to={"/"}>Olvide mi Contraseña</Link>
                            </div>
                        </form>
                    </div>
                </div>{/*FIN FORMULARIO*/}{/*FIN PANTALLA MD: Y LG:*/}

                {/*PANTALLA DISPOSITIVOS MOVILES*/}
                <div className="flex md:hidden w-full items-center justify-center mt-32 mb-14 font-bold uppercase">
                    <span className="text-xl text-center">Modulo no permitido en dispositivos moviles</span>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Signin;