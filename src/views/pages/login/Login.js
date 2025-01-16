import React, {useState, useEffect, useRef} from 'react'
import { Link } from 'react-router-dom'
import { Navigate, useNavigate } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CToast,
  CToastBody,
  CToastClose,
  CToastHeader,
  CToaster
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import Cookies from 'universal-cookie';
import axios from 'axios';
import './../login/login.css'

const Login = () => {
//export default function Login(){
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");  
  const [toast, addToast] = useState(0)
  const toaster = useRef()
  const cookies = new Cookies();
  const navigate = useNavigate();
  const baseUrl="http://apicatsa.catsaconcretos.mx:2543/api/";
  const baseUrl2="http://localhost:2548/api/";
  useEffect(()=>{
    if(cookies.get('token') != undefined && cookies.get('idUsuario') != undefined)
    {
      navigate('/panel');
    }else{
      GetToken();
    }
    
  },[]);
  function GetToken(){
    try{
      var postData = 
      {
        UserName:'ProCatsa',
        Password:'ProCatsa2024$.'
      };
      let confi_ax = 
      {
        headers:
        {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
        }
      }
      axios.post(baseUrl+'Login/Login',postData,confi_ax)
      .then(response=>{
        return response.data;
      }).then(response=>{
        cookies.set('token', response, {path: '/'});
      })
      .catch(error=>{
        console.log(error);
        addToast(exampleToast)
      })    
    }catch(error){
      console.log(error);
    }
  }
  
  const handleChange = (e) =>
  {
    const { name, value } = e.target;
    if (name === "username") {
      setUsername(value);
    }
    if (name === "password") {
      setPassword(value);
    }
  };
  async function Sesion(){
    
    if(username == ""|| password == "")
    {
      addToast(exampleToast)
    }else{

      try{
        const postData = 
        {
          usuario:username,
          pass:password
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
        await axios.post(baseUrl+'Login/GetUsuario', JSON.stringify({usuario:username, pass:password}),confi_ax)
        .then(response=>{
          console.log(response);
          return response.data;
        }).then(response=>{
          console.log(response);
          var obj = JSON.stringify(response);
          if(obj.length>0){
            obj = JSON.parse(obj);
            console.log(obj);
            cookies.set('idUsuario', response.id, {path: '/'});
            cookies.set('Usuario', username, {path: '/'});
            getInfoUser(response.id);
            navigate('/panel');
          }else{    
            //setErrorResponse(json.body.error);
            addToast(exampleToast)
          }
        })
        .catch(err=>{
          if (err.response) {
            // El servidor respondió con un código de estado fuera del rango de 2xx
            console.error('Error de Respuesta:', err.response.data);
            addToast(exampleToast)
            //setError(`Error: ${err.response.status} - ${err.response.data.message || err.response.statusText}`);
          } else if (err.request) {
            // La solicitud fue realizada pero no se recibió respuesta
            console.error('Error de Solicitud:', err.request);
            //setError('Error: No se recibió respuesta del servidor.');
          } else {
            // Algo sucedió al configurar la solicitud
            console.error('Error:', err.message);
            //setError(`Error: ${err.message}`);
          }
          //cookies.remove('token', {path: '/'});
        })    
      } catch(error){
        console.log(error);
      }
    }
    
  }
  async function getInfoUser(id) {
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
  const exampleToast = (
    <CToast title="CoreUI for React.js">
      <CToastHeader closeButton>
        <svg
          className="rounded me-2"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          role="img"
        >
          <rect width="100%" height="100%" fill="#007aff"></rect>
        </svg>
        <strong className="me-auto">CoreUI for React.js</strong>
        <small>7 min ago</small>
      </CToastHeader>
      <CToastBody>Hello, world! This is a toast message.</CToastBody>
    </CToast>
  )
  return (
    <div className=" min-vh-100 d-flex flex-row align-items-center">
      <CToaster ref={toaster} push={toast} placement="top-end" />
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4 bg-danger">
                <CCardBody>
                  <CForm>
                    <h1>JULIETA</h1>
                    <p className="text-body-secondary">Ingresa tus credenciales</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput 
                        id="usuario"
                        name="username"
                        type="text"
                        onChange={handleChange}
                        value={username}
                        placeholder="Usuario"
                        autoComplete="username" />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Password"
                        aria-label="Password"
                        aria-describedby="basic-addon1"
                        onChange={handleChange}
                        value={password}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" onClick={Sesion}>
                          Ingresar
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-primary bg-dark py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <img src='./icono.png' className='logoJ' />
                    {/* <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Registrarme
                      </CButton>
                    </Link> */}
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
