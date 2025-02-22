import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import '../../estilos.css';
import BuscadorDT from '../../views/base/parametros/BuscadorDT'
import { convertArrayOfObjectsToCSV, getPermisos, savePermiso, getInfoPermisos, updatePermiso } from '../../Utilidades/Funciones';
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

const Permisos = () => {
    //************************************************************************************************************************************************************************** */
    const [vOC, setVOC] = useState(false);
    // ROLES
    const userIs = Rol('Usuario');
    const userIsAdmin = Rol('Admin');
    //Arrays
    const [dtPermiso, setDTPermiso] = useState([]);
    // BUSCADOR
    const [fText, setFText] = useState('');
    const [vBuscador, setBuscador] = useState('');
    // FROMS
    const [IdPermiso, setIdPermiso] = useState(0);
    const [permiso, setPermiso] = useState("");
    const [estatus, setEstatus] = useState("");
    const [btnG, setBtnG] = useState("Guardar");
    const [shRespuesta, setshRespuesta] = useState(false);
    const shDisR = !userIs ? false : true;
    //************************************************************************************************************************************************************************** */
    const getPermisos_ = () =>{
        Swal.fire({
            title: 'Cargando...',
            text: 'Espera por favor...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                gPR();
            }
        });
    }
    const gPR = async () => {
        try{
            const ocList = await getPermisos();
            if(ocList)
            {
                setDTPermiso(ocList);
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
        getPermisos_();
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
    
    const addPR = (id) =>{
        Swal.fire({
            title: 'Cargando...',
            text: 'Obteniendo información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                getInfoPermiso_(id)
            }
        });
    }
    const getInfoPermiso_ = async(id)=>{
        try{
            const ocList = await getInfoPermisos(id);
            console.log(ocList[0])
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
            setVOC(true);
            setPermiso(ocList[0].Permiso)
            setEstatus(ocList[0].estatus)
            setIdPermiso(id)
            setBtnG("Actualizar")
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    //************************************************************************************************************************************************************************************** */
    // Maneja el cambio en el select de tipo de mantenimiento
    const hPermiso = (e) => {
        setPermiso(e.target.value)
    }
    const hEstatus = (e) => {
        setEstatus(e.target.value)
    }
    //************************************************************************************************************************************************************************************* */
    const colPermiso = [
        {
            name: 'Acción',
            selector: row => row.id,
            width:"200px",
            cell: (row) => (
                <div>
                    <CRow>
                    {(userIsAdmin) && row.estatus === '1' && (
                        <CCol xs={6} md={2} lg={2}>
                        <CButton
                            color="primary"
                            onClick={() => addPR(row.id)}
                            size="sm"
                            className="me-2"
                            title="Actualizar"
                        >
                            <CIcon icon={cilSave} />
                        </CButton>
                        </CCol>
                    )}
                    </CRow>
                </div>
            ),
        },
        {
            name: 'Estatus',
            selector: row => {
                const aux = row.estatus;
                if (aux === '0' ) {
                    return <CBadge textBgColor='danger'>Inactivo</CBadge>;
                }else{
                    return <CBadge color='primary' shape='rounded-pill'>Activa</CBadge>;
                }
                return aux;
            },
            width:"150px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Permiso',
            selector: row => {
                const aux = row.Permiso;
                if (aux === null || aux === undefined) {
                    return "No disponible";
                }
                if (typeof aux === 'object') {
                return "Sin Datos"; // O cualquier mensaje que prefieras
                }
                return aux;
            },
            width:"300px",
            sortable:true,
            grow:1,
        },
    ];
    // Función de búsqueda
    const onFindBusqueda = (e) => {
        setBuscador(e.target.value);
        setFText(e.target.value);
    };
    const fBusqueda = () => {
        if(vBuscador.length != 0){
            const valFiltrados = dtPermiso.filter(dtPermiso => 
                dtPermiso.Permiso.includes(fText) // Filtra los clientes por el número de cliente
                );
                setDTPermiso(valFiltrados);
        }else{
            getPermisos_();
        }
    };
    const fDPermiso = dtPermiso.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.Permiso.toLowerCase().includes(fText.toLowerCase());
    });
    //************************************************************************************************************************************************************************************** */
    const onSavePR = () =>{
        Swal.fire({
            title: 'Guardar...',
            text: 'Estamos guardando la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                savePermiso_(IdPermiso,permiso, estatus)
            }
        });
    }
    const savePermiso_ = async(IdPermiso, permiso, estatus)=>{
        try{
            if(IdPermiso != 0)
            {
                const ocList = await updatePermiso(IdPermiso, permiso, estatus);
            }else{
                const ocList = await savePermiso(permiso, estatus);
            }
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
            Swal.fire("Éxito", "Se realizo Correctamente", "success");
            setVOC(false);
            getPermisos_();
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    //************************************************************************************************************************************************************************************** */
    return (
    <>
        <CContainer fluid>
            <h3>Permisos </h3>
            <CRow className='mt-2 mb-2'>
                <CCol xs={3} md={3}>
                    <BuscadorDT value={vBuscador} onChange={onFindBusqueda} onSearch={fBusqueda} />
                </CCol>
                <CCol xs={3} md={3}>
                    <CButton onClick={()=> setVOC(true)}
                        color='primary' size='sm' title='Agregar' className='mt-2 me-2'>Nuevo</CButton>
                </CCol>
            </CRow>
            <CRow className='mt-2 mb-2'>
                <CCol>
                    <DataTable
                        columns={colPermiso}
                        data={fDPermiso}
                        pagination
                        persistTableHead
                        subHeader
                    />
                </CCol>
            </CRow>
            <CModal 
                backdrop="static"
                visible={vOC}
                onClose={() => setVOC(false)}
                className='c-modal-40'
            >
                <CModalHeader>
                    <CModalTitle id="oc_">Permisos</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow className='mt-2 mb-2'>
                        <CCol xs={6} md={6}>
                            <CFormInput
                                type="text"
                                label="Permiso"
                                placeholder="Permiso"
                                value={permiso}
                                onChange={hPermiso}
                            />
                        </CCol>
                        <CCol xs={6} md={4}>
                            <label>Estatus</label><br/>
                            <CFormSelect size="sm" className="mb-3" aria-label="Interfaz"
                                value={estatus}
                                onChange={hEstatus}
                            >
                                <option>-</option>
                                <option value="1">ACTIVO</option>
                                <option value="0">INACTIVO</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CCol xs={4} md={4}></CCol>
                    <CCol xs={4} md={2}>
                        <CButton color='primary' onClick={onSavePR} style={{'color':'white'}} > 
                            <CIcon icon={cilSave} /> {btnG}
                        </CButton>
                    </CCol>
                    <CCol xs={4} md={2}>
                        <CButton color='danger' onClick={() => setVOC(false)} style={{'color':'white'}} > 
                            <CIcon icon={cilTrash} />   Cerrar
                        </CButton>
                    </CCol>
                </CModalFooter>
            </CModal>
            <br />
        </CContainer>
    </>
    )
}
export default Permisos