import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import '../../estilos.css';
import { convertArrayOfObjectsToCSV } from '../../Utilidades/Funciones';
import {
    CContainer,
    CFormInput,
    CFormSelect,
    CImage,
    CBadge,
    CFormTextarea,
    CButton,
    CRow,
    CCol,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter
} from '@coreui/react'
import { IMaskMixin } from 'react-imask'
import { jsPDF } from "jspdf";
import {CIcon} from '@coreui/icons-react'
import { cilCheck, cilCloudDownload, cilPlus, cilPrint, cilSave, cilSearch, cilShareAlt, cilShortText, cilTag, cilTrash } from '@coreui/icons'
import { format } from 'date-fns';
import { Rol } from '../../Utilidades/Roles'
import DatePicker,{registerLocale, setDefaultLocale} from 'react-datepicker';
import {es} from 'date-fns/locale/es';
registerLocale('es', es)
import "react-datepicker/dist/react-datepicker.css"

const Almacen = () => {
    //************************************************************************************************************************************************************************** */
    const [vOC, setVOC] = useState(false);
    // ROLES
    const userIs = Rol('Usuario');
    const userIsAdmin = Rol('Admin');
    //Arrays
    const [dtOrdenes, setDTOrdenes] = useState([]);
    // FROMS
    const [nFactura, setFactura] = useState("");
    const [file, setFile] = useState(null);
    const [shRespuesta, setshRespuesta] = useState(false);
    const shDisR = !userIs ? false : true;
    //************************************************************************************************************************************************************************** */
    const getOComprasBtn = () =>{
        Swal.fire({
            title: 'Cargando...',
            text: 'Estamos obteniendo la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                gOC();
            }
        });
    }
    const gOC = async () => {
        var planta = plantasSel;
        if(plantasSel == undefined || plantasSel.length == 0 || plantasSel === ""){
            if(userIsJP && !userIsOperacion)
            {
                Swal.close();
                Swal.fire("Error", "Debes seleccionar alguna planta", "error");
                return false;
            }else {
                setPlantas('0')
                planta = '0'
            }
        }
        const auxFcaI = format(vFechaI, 'yyyy/MM/dd');
        const auxFcaF = format(vFechaF, 'yyyy/MM/dd');
        try{
            const ocList = await getOCompras(planta, auxFcaI, auxFcaF);
            if(ocList)
            {
                setDTOrdenes(ocList);
                setExOc(ocList);
            }
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    
    //************************************************************************************************************************************************************************** */
    
    //------------
    useEffect(() => {
        //getProductosInt_(null);
    }, []);
    const downloadCSV = (e) => {
        const auxFcaI = format(vFechaI, 'yyyy/MM/dd');
        const auxFcaF = format(vFechaF, 'yyyy/MM/dd');
        const link = document.createElement('a');
        let csv = convertArrayOfObjectsToCSV(exOC);
        if (csv == null) return;
    
        const filename = 'OC_'+auxFcaI+'-'+auxFcaF+'.csv';
    
        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`;
        }
    
        link.setAttribute('href', encodeURI(csv));
        link.setAttribute('download', filename);
        link.click();
    };
    //************************************************************************************************************************************************************************** */
    
    const newOC = () =>{
        setVOC(true)
    }
    //************************************************************************************************************************************************************************************** */
    // Maneja el cambio en el select de tipo de mantenimiento
    const handleDescMant = (e) => {
        
    }
    //************************************************************************************************************************************************************************************* */
    
    //************************************************************************************************************************************************************************************** */
    return (
    <>
        <CContainer fluid>
            <h3>Almacen </h3>
            <CRow className='mt-2 mb-2'>
                
            </CRow>
            <CRow className='mt-2 mb-2'>
                <CCol>
                    <DataTable
                        pagination
                        persistTableHead
                        subHeader
                    />
                </CCol>
            </CRow>
            <br />
        </CContainer>
    </>
    )
}
export default Almacen