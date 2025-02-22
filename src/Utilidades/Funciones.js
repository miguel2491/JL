import axios from 'axios'
import {FormatoFca, Fnum} from './Tools'
import { format } from 'date-fns';
import Cookies from 'universal-cookie'
const cookies = new Cookies();
const baseUrl="https://192.168.0.110:5004/";
//****************************************************************************************************************************************************************************** */
export async function GetToken(){
    try{
      let confi_ax = 
      {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
        },
        withCredentials: true, 
      };
      axios.get(baseUrl+'token',confi_ax)
      .then(response=>{
        cookies.set('token', response.data, {path: '/'});
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
          headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
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
          headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
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
        headers: {
          'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
        },
        withCredentials: true, 
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
            headers: {
              'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
            },
            withCredentials: true, 
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
// PERMISOS
export async function getPermisos()
{
    try{
    let confi_ax = 
        {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
    const response = await axios.get(baseUrl+'permisos', confi_ax);
      if (response.data && response.data.length > 0) {
        return response.data;
      }else{return false}
    }
    catch(error)
    {
      return false
    }
}
export async function savePermiso(permiso, estatus)
{
    try{
    let confi_ax = 
        {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
    const data = {
      'Permiso':permiso,
      'estatus':estatus
    }
    const response = await axios.post(baseUrl+'permiso',data, confi_ax);
    console.log(response)
      if (response.data && response.data.length > 0) {
        return response.data;
      }else{return false}
    }
    catch(error)
    {
      return false
    }
}
export async function getInfoPermisos(id)
{
    try{
    let confi_ax = 
        {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
    const response = await axios.get(baseUrl+'permisos/'+id, confi_ax);
      if (response.data && response.data.length > 0) {
        return response.data;
      }else{return false}
    }
    catch(error)
    {
      return false
    }
}
export async function updatePermiso(id, permiso, estatus)
{
    try{
    let confi_ax = 
        {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
    const data = {
      'Id':id,
      'Permiso':permiso,
      'estatus':estatus
    }
    const response = await axios.put(baseUrl+'permiso', data, confi_ax);
      if (response.data && response.data.length > 0) {
        return response.data;
      }else{return false}
    }
    catch(error)
    {
      return false
    }
}
// ROLES
export async function getRoles()
{
    try{
    let confi_ax = 
        {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
    const response = await axios.get(baseUrl+'roles', confi_ax);
      if (response.data && response.data.length > 0) {
        return response.data;
      }else{return false}
    }
    catch(error)
    {
      return false
    }
}
export async function saveRol(rol, estatus)
{
    try{
    let confi_ax = 
        {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
    const data = {
      'Rol':rol,
      'estatus':estatus
    }
    const response = await axios.post(baseUrl+'rol',data, confi_ax);
    console.log(response)
      if (response.data && response.data.length > 0) {
        return response.data;
      }else{return false}
    }
    catch(error)
    {
      return false
    }
}
export async function getInfoRol(id)
{
    try{
    let confi_ax = 
        {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
    const response = await axios.get(baseUrl+'rol/'+id, confi_ax);
      if (response.data && response.data.length > 0) {
        return response.data;
      }else{return false}
    }
    catch(error)
    {
      return false
    }
}
export async function updateRol(id, rol, estatus)
{
    try{
    let confi_ax = 
        {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
    const data = {
      'Id':id,
      'Rol':rol,
      'estatus':estatus
    }
    const response = await axios.put(baseUrl+'rol', data, confi_ax);
      if (response.data && response.data.length > 0) {
        return response.data;
      }else{return false}
    }
    catch(error)
    {
      return false
    }
}
export async function delRol(id,estatus)
{
    try{
    let confi_ax = 
        {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
    const data = {
      'Id':id,
      'estatus':estatus
    }
    const response = await axios.delete(baseUrl+'rol', data, confi_ax);
      if (response.data && response.data.length > 0) {
        return response.data;
      }else{return false}
    }
    catch(error)
    {
      return false
    }
}
// Usuarios
export async function getUsuarios()
{
    try{
    let confi_ax = 
        {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
    const response = await axios.get(baseUrl+'usuarios', confi_ax);
    if (response.data && response.data.length > 0) {
      return response.data;
    }else{return false}
    }
    catch(error)
    {
      return false
    }
}
export async function saveUsuario(usuario, pass, email, estatus)
{
    try{
    let confi_ax = 
        {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
    const data = {
      'usuario':usuario,
      'password':pass,
      'email':email,
      'estatus':estatus
    }
    const response = await axios.post(baseUrl+'login',data, confi_ax);
    console.log(response)
      if (response.data && response.data.length > 0) {
        return response.data;
      }else{return false}
    }
    catch(error)
    {
      return false
    }
}
export async function getInfoUsuario(id)
{
    try{
    let confi_ax = 
        {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
    const response = await axios.get(baseUrl+'login/'+id, confi_ax);
      if (response.data && response.data.length > 0) {
        return response.data;
      }else{return false}
    }
    catch(error)
    {
      return false
    }
}
export async function updateUsuario(id, pass, email, estatus)
{
    try{
    let confi_ax = 
        {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
    const data = {
      'id':id,
      'password':pass,
      'email':email,
      'estatus':estatus
    }
    const response = await axios.put(baseUrl+'loginUpdate', data, confi_ax);
      if (response.data && response.data.length > 0) {
        return response.data;
      }else{return false}
    }
    catch(error)
    {
      return false
    }
}
export async function delUsuario(id,estatus)
{
    try{
    let confi_ax = 
        {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
    const data = {
      'id':id,
      'estatus':estatus
    }
    const response = await axios.delete(baseUrl+'login', data, confi_ax);
      if (response.data && response.data.length > 0) {
        return response.data;
      }else{return false}
    }
    catch(error)
    {
      return false
    }
}
export async function getRolUser(id)
{
    try{
    let confi_ax = 
        {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
    const response = await axios.get(baseUrl+'getUsuarioRol/'+id, confi_ax);
      if (response.data && response.data.length > 0) {
        return response.data;
      }else{return false}
    }
    catch(error)
    {
      return false
    }
}
export async function getPermisoUser(id)
{
    try{
    let confi_ax = 
        {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
    const response = await axios.get(baseUrl+'getUsuarioPermiso/'+id, confi_ax);
      if (response.data && response.data.length > 0) {
        return response.data;
      }else{return false}
    }
    catch(error)
    {
      return false
    }
}
export async function saveUsuarioRol(id,idU,idR)
{
    try{
    let confi_ax = 
        {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
    let data = {
      'IdUsuarioRol':id,
      'IdUsuario':idU,
      'IdRol':idR
    }
    const response = await axios.post(baseUrl+'UsuarioRol', data, confi_ax);
    return response;
    }
    catch(error)
    {
      return false
    }
}

export async function sUsuarioPermiso(id,idU,idP)
{
    try{
    let confi_ax = 
        {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
    let data = {
      'idUsuarioPermiso':id,
      'IdUsuario':idU,
      'IdPermiso':idP
    }
    const response = await axios.post(baseUrl+'UsuarioPermiso', data, confi_ax);
    return response;
    }
    catch(error)
    {
      return false
    }
}
export async function dUsuarioPermiso(id)
{
    try{
    let confi_ax = 
        {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
      const response = await axios.delete(baseUrl+'UsuarioPermiso/'+id, confi_ax);
      return response;
    }
    catch(error)
    {
      return false
    }
}
export async function dUsuarioRol(id)
{
    try{
    let confi_ax = 
        {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
      const response = await axios.delete(baseUrl+'UsuarioRol/'+id, confi_ax);
      return response;
    }
    catch(error)
    {
      return false
    }
}
//****************************************************************************************************************************************************************************** */
// CATALOGOS
// ===> CATEGORIAS
export async function getCategorias()
{
    try{
    let confi_ax = 
        {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
    const response = await axios.get(baseUrl+'categorias', confi_ax);
    if (response.data && response.data.length > 0) {
      return response.data;
    }else{return false}
    }
    catch(error)
    {
      return false
    }
};
export async function getCategoriaId(id)
{
    try{
      let confi_ax = 
        {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
    const response = await axios.get(baseUrl+'categoria/'+id, confi_ax);
    if (response.data && response.data.length > 0) {
      return response.data;
    }else{return false}
    }
    catch(error)
    {
      return false
    }
};
export async function suCategoria(id,nombre,estatus)
{
    try{
    let confi_ax = 
        {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
    let data = {
      'id':id,
      'nombre':nombre,
      'estatus':estatus
    }
    const response = await axios.post(baseUrl+'categoria', data, confi_ax);
    return response;
    }
    catch(error)
    {
      return false
    }
};
export async function delCategoriaId(id)
{
    try{
    let confi_ax = 
        {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
    const response = await axios.delete(baseUrl+'categoria/'+id, confi_ax);
    return response;
    }
    catch(error)
    {
      return false
    }
};
// ===> PROVEEDOR
export async function getProveedores()
{
    try{
    let confi_ax = 
        {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
    const response = await axios.get(baseUrl+'proveedores', confi_ax);
    if (response.data && response.data.length > 0) {
      return response.data;
    }else{return false}
    }
    catch(error)
    {
      return false
    }
};
export async function getProveedoresId(id)
{
    try{
      let confi_ax = 
        {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
    const response = await axios.get(baseUrl+'proveedor/'+id, confi_ax);
    if (response.data && response.data.length > 0) {
      return response.data;
    }else{return false}
    }
    catch(error)
    {
      return false
    }
};
export async function suProveedores(id,nombre,estatus)
{
    try{
    let confi_ax = 
        {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
    let data = {
      'id':id,
      'nombre':nombre,
      'estatus':estatus
    }
    const response = await axios.post(baseUrl+'proveedor', data, confi_ax);
    return response;
    }
    catch(error)
    {
      return false
    }
};
export async function delProveedoresId(id)
{
    try{
    let confi_ax = 
        {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
    const response = await axios.delete(baseUrl+'proveedor/'+id, confi_ax);
    return response;
    }
    catch(error)
    {
      return false
    }
};
// ===> Productos
export async function getProductos()
{
    try{
    let confi_ax = 
        {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
    const response = await axios.get(baseUrl+'productos', confi_ax);
    if (response.data && response.data.length > 0) {
      return response.data;
    }else{return false}
    }
    catch(error)
    {
      return false
    }
};
export async function getProductosId(id)
{
    try{
      let confi_ax = 
        {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
    const response = await axios.get(baseUrl+'categoria/'+id, confi_ax);
    if (response.data && response.data.length > 0) {
      return response.data;
    }else{return false}
    }
    catch(error)
    {
      return false
    }
};
export async function suProductos(id,nombre,estatus)
{
    try{
    let confi_ax = 
        {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
    let data = {
      'id':id,
      'nombre':nombre,
      'estatus':estatus
    }
    const response = await axios.post(baseUrl+'categoria', data, confi_ax);
    return response;
    }
    catch(error)
    {
      return false
    }
};
export async function delProductosId(id)
{
    try{
    let confi_ax = 
        {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
    const response = await axios.delete(baseUrl+'categoria/'+id, confi_ax);
    return response;
    }
    catch(error)
    {
      return false
    }
};
// ===> Mapas
export async function setVisita(id, lat, lng, motivo){
  try{
    let confi_ax = 
        {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
    let fechaHra = format(new Date(),'yyyy-MM-dd HH:mm:ss');
    let data = {
      'idReg':id,
      'lat':lat.toString(),
      'lng':lng.toString(),
      'motivo':motivo,
      'usuario':cookies.get('Usuario'),
      'fecha':fechaHra.toString()
    }
    const response = await axios.post(baseUrl+'visitas', data, confi_ax);
    return response;
    }
    catch(error)
    {
      return false
    }
}
export async function getVisitas(id, motivo){
  try{
    let confi_ax = 
        {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
    }
    const response = await axios.get(baseUrl+'visitas/'+id+'/'+cookies.get('Usuario'), confi_ax);
    var obj = response.data;
      if(obj && obj.length > 0)
      {
          return obj
      }else{return false}
  }
  catch(error)
  {
    return false
  }
}
//****************************************************************************************************************************************************************************** */
//REPORTES
export async function getPedidoInd(npedido) {
    try
    {
        let confi_ax = {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8', // Define el tipo de contenido
          },
          withCredentials: true, 
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
