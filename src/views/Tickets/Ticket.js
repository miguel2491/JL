import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import '../../estilos.css';
import { convertArrayOfObjectsToCSV, getProductos } from '../../Utilidades/Funciones';
import {
    CContainer,
    CRow,
    CCard,
    CCardBody,
    CCardImage,
    CCardTitle,
    CCardText,
    CButton,
    CCol,
    CBadge
} from '@coreui/react'
import { cilCarAlt, cilCheck } from '@coreui/icons'
import { format } from 'date-fns';
import { Rol } from '../../Utilidades/Roles'
import "react-datepicker/dist/react-datepicker.css"
import CIcon from '@coreui/icons-react';

const Ticket = () => {
    //************************************************************************************************************************************************************************** */
    const [vOC, setVOC] = useState(false);
    // ROLES
    const userIs = Rol('Usuario');
    const userIsAdmin = Rol('Admin');
    //Arrays
    const [dtProductos, setDTProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    // FROMS
    
    //******************************************************************************* */
    useEffect(() => {
        getProductos_();
    }, []);
    //***************************************************************************** */
    const getProductos_ = () =>{
        Swal.fire({
            title: 'Cargando...',
            text: 'Obteniendo Productos...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                gProd();
            }
        });
    }
    const gProd = async () => {
        try{
            const ocList = await getProductos();
            console.log(ocList)
            if(ocList)
            {
                setDTProductos(ocList)
            }
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }    
    //************************************************************************************************************************************************************************** */

    //************************************************************************************************************************************************************************** */
    const hProductos = (e) => {
        
    }
    //************************************************************************************************************************************************************************************** */
    return (
    <>
        <CContainer fluid>
            <h3>Ticket </h3>
            <CRow className='mt-3 mb-3'>
                <CCol xs={9} md={9}>
                </CCol>
                <CCol xs={3} md={3}>
                    <CBadge color='primary'> 
                        <CIcon icon={cilCarAlt} />
                    </CBadge>
                </CCol>
            </CRow>
            <CRow className='mt-2 mb-2'>
            {dtProductos.map(item =>(
            <CCard style={{ width: '18rem', marginLeft:'1rem' }} className='mr-2'>
                <CCardImage orientation="top" src="../../images/react.jpg" />
                <CCardBody>
                    <CCardTitle>{item.nombre}</CCardTitle>
                    <CCardText>
                    {item.descripcion}
                    </CCardText>
                    <CButton color="primary" href="#">
                    Agregar
                    </CButton>
                </CCardBody>
            </CCard>
            ))}
            </CRow>
            <br />
        </CContainer>
    </>
    )
}
export default Ticket