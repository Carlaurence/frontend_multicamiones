//Construir el CRUD
//Declarar las variables del fetch

//import { json } from 'react-router-dom';
import back from './back';//IMPORTAMOS EL COMPONENTE back PARA PODER LLAMAR A LA API Y A LA baseURL

class crud {
    async GET(resource, queryParams) {
        const token = localStorage.getItem("token");

        let bearer;
        if (token === "") {
            bearer = "";
        } else {
            bearer = `${token}`;
        }
        
        const data = {
            method: 'GET',
            //body: JSON.stringify(body),//METODO GET NO REQUIERE BODY  

            /**HEADERS DE AUTENTICACION**/
            /**AQUI PONEMOS LA CLAVE Y EL TOKEN EN LOS HEADERS**/
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': bearer
            }
        }
        const url = `${back.api.baseURL}${resource}`;
        let response = (await (await fetch(url, data)).json())//Hace dos await, osea, hace dos pausas en espera de respuesta del back
        return response
    }

    async POST(resource, body) {
        const token = localStorage.getItem("token");
        let bearer;
        if (token === "") {
            bearer = "";
        } else {
            bearer = `${token}`;
        }

        const data = {
            method: 'POST',
            body: JSON.stringify(body),

        /**HEADERS DEAUTENTICACION**/
        /**AQUI PONEMOS LA CLAVE Y EL TOKEN EN LOS HEADERS**/
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': bearer
            }
        }
        const url = `${back.api.baseURL}${resource}`;
        let response = (await (await fetch(url, data)).json())//Hace dos await, osea, hace dos pausas en espera de respuesta del back
        return response
    }

    async PUT(resource, body) {

        const token = localStorage.getItem("token");
        let bearer;
        if (token === "") {
            bearer = "";
        } else {
            bearer = `${token}`;
        }

        const data = {
            method: 'PUT',
            body: JSON.stringify(body),

        /**HEADERS DEAUTENTICACION**/
        /**AQUI PONEMOS LA CLAVE Y EL TOKEN EN LOS HEADERS**/
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': bearer
            }
        }
        const url = `${back.api.baseURL}${resource}`;
        let response = (await (await fetch(url, data)).json())//Hace dos await, osea, hace dos pausas en espera de respuesta del back
        return response

    }

    async DELETE(resource, queryParams) {
        const token = localStorage.getItem("token");

        let bearer;
        if (token === "") {
            bearer = "";
        } else {
            bearer = `${token}`;
        }
        
        const data = {
            method: 'DELETE',
            //body: JSON.stringify(body),//METODO GET NO REQUIERE BODY  

            /**HEADERS DE AUTENTICACION**/
            /**AQUI PONEMOS LA CLAVE Y EL TOKEN EN LOS HEADERS**/
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': bearer
            }
        }
        const url = `${back.api.baseURL}${resource}`;
        let response = (await (await fetch(url, data)).json())//Hace dos await, osea, hace dos pausas en espera de respuesta del back
        return response

    }
}
export default new crud();