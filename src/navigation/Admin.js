import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import crud from "../backEndConnection/crud";
import swal from "sweetalert";
import bgImage from "../assets/images/Fondo_Home.jpg"


const Admin = () => {

    const navigate = useNavigate();

    const [userName, setUserName] = useState();
    const [userLastName, setUserLastName] = useState();

    const getUserAuthenticated = async () => {//ESTE ES UN FILTRO DE SEGURIDAD MAS ESTRICTO PARA ACCEDER AL MODULO /ADMIN

        const token = localStorage.getItem('token');//IR A localStorage Y TRAER VALUE: DE {KEY 'token'}

        //PRIMER FILTRO #1
        if (!token) {//SI NO HAY TOKEN, IMPEDIR ACCESO Y RE-DIRECCIONAR AL HOME "/"
            swal("ERROR", " Acceso Denegado \nUsuario Sin Loguear ", "error");
            navigate("/")
        } else {//SI HAY TOKEN, EJECUTE EL MICROSERVICIO
            const response = await crud.GET(`/api/login`);//VIAJA AL LOCALSTORAGE(HEADER) Y LEE TOKEN ALMACENADO

            /*SI EL TOKEN ES VALIDO, EL "response" NOS DEBE RETORNA LA INFORMACION DEL USUARIO EN UN JSON
             CON key "user" Y VALUE {_id:"xxxx", name:"Mxxxx", lastname:"Cxxxxx", email: "xxx@gmail.com"}*/
            if (response.user) {//SI EL USER ES TRUE, ENTONCES SE PERMITE EL ACCESO AL MODULO "/ADMIN"
                setUserName(response.user.name)//SETTEAMOS [userName] UNICAMENTE CON EL VALOR name: DEL RESPONSE RETORNADO {user : {}}
                setUserLastName(response.user.lastname)//SETTEAMOS [userLastName] CON EL VALOR lastname: DEL RESPONSE RETORNADO {user : {}}
            } else {//SI NO RETORNA EL USER, ENTONCES ACCESO DENEGADO
                swal("ERROR", " Acceso Denegado \nUsuario Sin Loguear ", "error");
                localStorage.removeItem('token');
                navigate("/");
            }

            //NOTA IMPORTANTE: TIPOS DE ERROR DEL JSONWEBTOKEN
            //1- {name: 'JsonWebTokenError', message: 'invalid signature'}
            //2- {name: 'JsonWebTokenError', message: 'jwt malformed'}
            //3- {name: 'TokenExpiredError', message: 'jwt expired', expiredAt: '2023-07-23T07:54:29.000Z'}  
            //4- {msg: 'no hay token'}      
        }
    }

    useEffect(() => {//AL ACCEDER AL ADMIN "/" AUTOMATICAMENTE SE EJECUTA ESTE USEEFECT
        getUserAuthenticated();//EJECUTA EL FILTRO DE SEGURIDAD 
    }, [navigate])//[navigate] SINTAXIS PARA QUE useEffect SE EJECUTE UNICAMENTE AL DETECTAR UN CAMBIO EN EL navigate 

    return (
        <div className="overflow-hidden bg-gradient-to-r from-black via-gray-400 to to-white">
            <Navbar />
            <div className="flex flex-row min-h-screen w-screen bg-cover" style={{backgroundImage: "url("+ bgImage +")" }}>
                <Sidebar />
                {/*PANTALLA MD: Y LG:*/}
                <div className="hidden md:flex flex-col w-full items-center gap-5 mt-32 mb-14 font-bold uppercase">
                    <span className="text-xl text-center">Hola {userName} {userLastName}... Bienvenido al Modulo Administrativo</span>
                </div>
                {/*PANTALLA DISPOSITIVOS MOVILES*/}
                <div className="flex md:hidden w-full items-center justify-center mt-32 mb-14 font-bold uppercase">
                    <span className="text-xl text-center">Modulo no permitido en dispositivos moviles</span>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Admin;

/* 
            if (response.name === 'JsonWebTokenError') {//SI response.name RETORNA 'JsonWebTokenError' => NO LE PERMITA EL ACCESO Y REDIRECCIONE AL "/"
                console.log(response.user._id)
                console.log("Token Invalido")
                localStorage.removeItem('token');//BORRA EL TOKEN ALMACENADO EN EL LOCALSTORAGE
                navigate("/");//REDIRECCIONA AL HOME
            } else if (response.name === 'TokenExpiredError') {
                console.log(response.user._id)
                console.log("El Token Expiro!")
                localStorage.removeItem('token');
                navigate("/");
            } else if (response.msg === 'no hay token') {
                console.log("No hay token")
                localStorage.removeItem('token');
                navigate("/");
            } else {
                //EN CASO CONTRARIO, SETTEAMOS userName Y userLastName Y A SU VEZ PERMITIR EL ACCESO AL "/ADMIN"
                //EL response NOS RETORNA UN JSON DE KEY {user} CON UNA VALUE JSON {name:"xxx", lastname:"xxx"}
                setUserName(response.user.name)//SETTEAMOS [userName] UNICAMENTE CON EL VALOR name: DEL RESPONSE RETORNADO {user : {}}
                setUserLastName(response.user.lastname)//SETTEAMOS [userLastName] CON EL VALOR lastname: DEL RESPONSE RETORNADO {user : {}}
                console.log(response.user._id)
            }
*/