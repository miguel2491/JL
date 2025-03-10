import React, {useState, useEffect, useRef} from 'react'
import Swal from "sweetalert2";
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import Cookies from 'universal-cookie';
import {GetToken, Sesion, updSesion, getRol} from '../../../Utilidades/Funciones'
import './../login/login.css'

const Login = () => {
//export default function Login(){
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");  
  const cookies = new Cookies();
  const navigate = useNavigate();
  useEffect(()=>{
    if(cookies.get('token') != undefined && cookies.get('idUsuario') != undefined)
    {
      navigate('/panel');
    }else{
      GetToken();
    }
    
  },[]);
  
  const Sesion_ = () =>{
    Swal.fire({
      title: 'Cargando...',
      text: 'Estamos obteniendo la información...',
      didOpen: () => {
          Swal.showLoading();  // Muestra la animación de carga
          loadSesion(username, password);
      }
    });
  };

  const loadSesion = async(username, password) =>{
    try{
      const ocList = await Sesion(username, password);
      if(ocList)
      {
        cookies.set("idUsuario", ocList[0].id, { path: "/" });
        cookies.set("Usuario", username, { path: "/" });
        updSesion();
        setTimeout(() => {
          Swal.close()
          getRol();
          navigate("/dashboard");
        }, 1000);
      }else{
        Swal.close();
        Swal.fire("Error", "Usuario/Contraseña incorrecta, vuelve a intentar", "error");
      }
      
  }catch(error){
      Swal.close();
      Swal.fire("Error", "Usuario/Contraseña incorrecta, vuelve a intentar", "error");
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
  
  return (
    <div className=" min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8} xs={12}>
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
                        <CButton color="primary" className="px-4" onClick={Sesion_}>
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
