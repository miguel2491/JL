import axios from 'axios'
import {FormatoFca, Fnum} from './Tools'
import { format } from 'date-fns';
import Cookies from 'universal-cookie'
const cookies = new Cookies();
const baseUrl="http://localhost:5005/";
//****************************************************************************************************************************************************************************** */
export async function GetToken(){
    try{
      let confi_ax = 
      {
        headers:
        {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
        }
      }
      axios.get(baseUrl+'token',confi_ax)
      .then(response=>{
        return response.data;
      }).then(response=>{
        cookies.set('token', response, {path: '/'});
      })
      .catch(error=>{
        console.log(error);
      })    
    }catch(error){
      console.log(error);
    }
}
// LOGIN
export async function Sesion(user, pass){
    try{
        const postData = 
        {
          User:user,
          Pass:pass
        }
        let confi_ax = 
        {
          headers:
          {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json',
            "Authorization": "Bearer "+cookies.get('token'),
          }
        }
        //--------------------------------------------------
        const response = await axios.post(baseUrl+'getSesion', postData, confi_ax);
        if (response.data && response.data.length > 0) {
            const obj = response.data;
            if(obj.length > 0)
            {
                return obj;
            }else{return false}
        }else{return false}    
    } catch(error){
        return false
    }
}
export async function updSesion(){
    try{
        let confi_ax = 
        {
          headers:
          {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json',
            "Authorization": "Bearer "+cookies.get('token'),
          }
        }
        //--------------------------------------------------
        const response = await axios.get(baseUrl+'updSesion/'+cookies.get('idUsuario'), confi_ax);
        if (response.data && response.data.length > 0) {
            const obj = response.data;
            if(obj.length > 0)
            {
                return obj;
            }else{return false}
        }else{return false}    
    } catch(error){
        return false
    }
}
export async function getInfoUser(id) {
    try{
      let confi_ax = 
      {
        headers:
        {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
          "Authorization": "Bearer "+cookies.get('token'),
        }
      }
      //--------------------------------------------------
      await axios.get(baseUrl+'Login/GetUserRol/'+id,confi_ax)
      .then(response=>{
        return response.data;
      }).then(response=>{
        cookies.set('roles', JSON.stringify(response), {path: '/'});
        navigate('/panel');
      })
      .catch(err=>{
        if (err.response) {
          // El servidor respondió con un código de estado fuera del rango de 2xx
          console.error('Error de Respuesta:', err.response.data);
          //setError(`Error: ${err.response.status} - ${err.response.data.message || err.response.statusText}`);
        } else if (err.request) {
          // La solicitud fue realizada pero no se recibió respuesta
          //setError('Error: No se recibió respuesta del servidor.');
        } else {
          // Algo sucedió al configurar la solicitud
          console.error('Error:', err.message);
          //setError(`Error: ${err.message}`);
        }
      })    
    } catch(error){
      console.log(error);
    }
}
export async function getRol()
    {
      try{
        let confi_ax = 
          {
            headers:
            {
              'Cache-Control': 'no-cache',
              'Content-Type': 'application/json',
              "Authorization": "Bearer "+cookies.get('token'),
            }
        }
        const response = await axios.get(baseUrl+'getUsuarioRol/'+cookies.get('idUsuario'), confi_ax);
        cookies.set('roles', JSON.stringify(response.data), {path: '/'});
        //getPermisos();
      }
      catch(error)
      {
        console.log(error);
      }finally{
    
      }
}
export async function getPermisos()
{
    try{
    let confi_ax = 
        {
        headers:
        {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json',
            "Authorization": "Bearer "+cookies.get('token'),
        }
    }
    const response = await axios.get(baseUrl+'getUsuarioPermiso/'+cookies.get('idUsuario'), confi_ax);
    cookies.set('permisos', JSON.stringify(response), {path: '/'});
    getPermisos();
    }
    catch(error)
    {
    console.log(error);
    }finally{

    }
}
//****************************************************************************************************************************************************************************** */
// CATALOGOS
//****************************************************************************************************************************************************************************** */
//REPORTES
export async function getPedidoInd(npedido) {
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Logistica/GetPedidoI/'+npedido, confi_ax);
        var obj = response.data[0]?.Rows;
        if(obj && obj.length > 0)
        {
            return obj
        }else{return false}
    } 
    catch(error)
    {
        return false;
    }
}
//****************************************************************************************************************************************************************************** */
//UTILITIES
// Función para formatear el número a formato de dinero
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN', // Cambia a la moneda que necesites
  }).format(value);
};

export const convertArrayOfObjectsToCSV = (array) => {
    if (!array || !array.length) return null;
    const header = Object.keys(array[0]).join(','); // Extrae las claves como cabeceras
    const rows = array.map(obj => Object.values(obj).join(',')); // Mapea los valores en cada fila
    return [header, ...rows].join('\n'); // Une todo en una cadena CSV
};
