import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import ButtomSingUp from "../components/Buttom_SignUp";
import crud from "../backEndConnection/crud";
import swal from 'sweetalert';
import Footer from "../components/Footer";

const SignUp = () => {

    const navigate = useNavigate();

    {/*EL HOOK useState({}) AL SER LLAMADO DENTRO DE LA FUNCION onChange = (e), SE ENCARGARA DE SETEAR LAS VARIABLES 
    [name, lastname, email, password y confirm] CON LOS VALORES TRAIDOS DESDE EL FRONT, MEDIANTE [e.target.name]: e.target.value*/}
    const [newUser, setnewUser] = useState({
        name: '',
        lastname: '',
        email: '',
        password: '',
        confirm: ''
    });

    //ESTA FUNCION onChange = (e) SE ENCARGA DE TRAER LOS VALORES DEL FRONT Y SETTEAR A newUser 
    const onChange = (e) => {
        setnewUser({
            ...newUser,
            [e.target.name]: e.target.value
        })
    };

    //AQUI ARMAMOS UN .JSON{} CON LOS VALORES QUE TOME LA VARIBLE newUser
    const { name, lastname, email, password, confirm } = newUser;

    const createNewUser = async () => {

        const data = {
            name: newUser.name,
            lastname: newUser.lastname,
            email: newUser.email,
            password: newUser.password
        }

        if (password !== confirm) {
            return swal("ERROR", "Contraseñas No Coinciden!", "error");
        } else if (!data.name || !data.lastname || !data.email || !data.password) {
            return swal("ERROR", "Todos los campos son obligatorios!", "error");
        } else {
            const response = await crud.POST(`/api/user`, data);
            const messageReturned = response;//MSG DE RESPUESTA DESDE EL BACK
            //console.log(messageReturned);//respuesta confirmada en consola

            if (messageReturned === "Usuario ya existe") {
                return swal("ERROR", "El usuario " + data.email + " ya existe", "error");
            } else {
                swal("BIEN HECHO!", "El usuario se creo correctamente!", "success");
                //DESPUES DE QUE EL USUARIO HAYA SIDO CREADO EXITOSAMENTE, LIMPIAMOS LAS CASILLAS DEL FRONT
                setnewUser({
                    name: '',
                    lastname: '',
                    email: '',
                    password: '',
                    confirm: ''
                });

                //DESPUES DE QUE EL USUARIO HAYA SIDO CREADO EXITOSAMENTE, LA PAGINA SE REDIRECCIONA A LA PAGINA DE LOGEO
                navigate("/sign_in")
            }
        }
    }

    //CUANDO SE PRESIONA EL BOTON [CREAR USUARIO] LA <form> EJECUTA LA FUNCION {onSubmit}
    const onSubmit = (e) => {
        e.preventDefault();//impedir que se recargue automaticamente
        createNewUser();
    }

    return (
        <>
        <div className="overflow-hidden">
            <Navbar />
            <div className="flex justify-center items-center min-h-screen w-screen bg-gradient-to-r from-black via-gray-400 to to-white">                
                    
                    {/*FORMULARIO*/}{/*PANTALLA MD: Y LG:*/}
                    <div className="relative mt-36 mb-14 bg-white hidden md:flex justify-center items-center border border-black shadow-2xl shadow-red-600 w-[704px] p-3 rounded-xl">
                        <div className="bg-red-600 w-full border border-white shadow-2xl shadow-black rounded-xl">
                            <span className="mb-6 flex justify-center text-xl text-white pt-4 font-semibold uppercase">Crear Usuario</span>

                            <form onSubmit={onSubmit} className="flex flex-col justify-center items-center gap-3">

                                <div className="flex flex-row gap-5">
                                    <div className="flex flex-col">
                                        <label className=" text-white font-medium">Nombres</label>
                                        <input className=" text-gray-700 py-2 px-12 rounded-xl leading-tight border border-black"
                                            id="name"
                                            type="text"
                                            name="name"
                                            placeholder="Ingrese Nombres"
                                            value={name}
                                            onChange={onChange}
                                        ></input>
                                    </div>
                                    <div className="flex flex-col">
                                        <label className=" text-white font-medium">Apellidos</label>
                                        <input className=" text-gray-700 py-2 px-12 rounded-xl leading-tight border border-black"
                                            id="lastname"
                                            type="text"
                                            name="lastname"
                                            placeholder="Ingrese Apellidos"
                                            value={lastname}
                                            onChange={onChange}
                                        ></input>
                                    </div>
                                </div>

                                <div className="flex flex-row gap-5">
                                    <div className="flex flex-col">
                                        <label className=" text-white font-medium">Correo Electronico</label>
                                        <input className=" text-gray-700 py-2 px-12 rounded-xl leading-tight border border-black"
                                            id="email"
                                            type="email"
                                            name="email"
                                            placeholder="username@email.com"
                                            value={email}
                                            onChange={onChange}
                                        ></input>
                                    </div>
                                    <div className="flex flex-col">
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
                                </div>

                                <div className="flex flex-row gap-5 mb-2">
                                    <div className="flex flex-col">
                                        <label className="text-white font-medium">Confirmar Password</label>
                                        <input className="text-gray-700 py-2 px-12 rounded-xl leading-tight border border-black"
                                            id="confirm"
                                            type="password"
                                            name="confirm"
                                            placeholder="***********************"
                                            value={confirm}
                                            onChange={onChange}
                                        ></input>
                                    </div>
                                    <div className="pt-6">
                                        <ButtomSingUp />
                                    </div>
                                </div>

                                <div className="flex flex-col font-normal justify-center items-center text-sm">
                                    <Link className="text-white mb-1 underline hover:text-opacity-70 active:text-opacity-50" to={"/sign_in"}>Regresar a Inicio Sesion</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                    {/*FIN FORMULARIO*/}{/*FIN PANTALLA MD: Y LG:*/}

                    {/*PANTALLA DISPOSITIVOS MOVILES*/}
                    <div className="flex md:hidden w-full items-center justify-center mt-32 mb-14 font-bold uppercase">
                        <span className="text-xl text-center">Modulo no permitido en dispositivos moviles</span>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default SignUp;