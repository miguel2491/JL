import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import '../../estilos.css';
import BuscadorDT from '../../views/base/parametros/BuscadorDT'
import { convertArrayOfObjectsToCSV, getRoles, saveRol, getInfoRol, updateRol, delRol } from '../../Utilidades/Funciones';
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
import {CIcon} from '@coreui/icons-react'
import { cilSave, cilTrash } from '@coreui/icons'
import { Rol } from '../../Utilidades/Roles'
import "react-datepicker/dist/react-datepicker.css"

const Roles = () => {
    //************************************************************************************************************************************************************************** */
    const [vOC, setVOC] = useState(false);
    // ROLES
    const userIs = Rol('Usuario');
    const userIsAdmin = Rol('Admin');
    //Arrays
    const [dtRol, setDTRol] = useState([]);
    // BUSCADOR
    const [fText, setFText] = useState('');
    const [vBuscador, setBuscador] = useState('');
    // FROMS
    const [IdRol, setIdRol] = useState(0);
    const [rol, setRol] = useState("");
    const [estatus, setEstatus] = useState("");
    const [btnG, setBtnG] = useState("Guardar");
    const [shRespuesta, setshRespuesta] = useState(false);
    const shDisR = !userIs ? false : true;
    //************************************************************************************************************************************************************************** */
    const getRol_ = () =>{
        Swal.fire({
            title: 'Cargando...',
            text: 'Espera por favor...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                gRol();
            }
        });
    }
    const gRol = async () => {
        try{
            const ocList = await getRoles();
            if(ocList)
            {
                setDTRol(ocList);
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
        getRol_();
    }, []);

    //************************************************************************************************************************************************************************** */
    
    const addRol = (id) =>{
        Swal.fire({
            title: 'Cargando...',
            text: 'Obteniendo información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                getInfoRol_(id)
            }
        });
    }
    const getInfoRol_ = async(id)=>{
        try{
            const ocList = await getInfoRol(id);
            console.log(ocList[0])
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
            setVOC(true);
            setRol(ocList[0].Permiso)
            setEstatus(ocList[0].estatus)
            setIdRol(id)
            setBtnG("Actualizar")
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    //************************************************************************************************************************************************************************************** */
    // Maneja el cambio en el select de tipo de mantenimiento
    const hRol = (e) => {
        setRol(e.target.value)
    }
    const hEstatus = (e) => {
        setEstatus(e.target.value)
    }
    //************************************************************************************************************************************************************************************* */
    const colRol = [
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
            name: 'Roles',
            selector: row => {
                const aux = row.Rol;
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
            const valFiltrados = dtRol.filter(dtRol => 
                dtRol.Rol.includes(fText) // Filtra los clientes por el número de cliente
                );
                setDTRol(valFiltrados);
        }else{
            getRol_();
        }
    };
    const fDRol = dtRol.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.Rol.toLowerCase().includes(fText.toLowerCase());
    });
    //************************************************************************************************************************************************************************************** */
    const onSaveRol = () =>{
        Swal.fire({
            title: 'Guardar...',
            text: 'Estamos guardando la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                saveRol_(IdRol,rol, estatus)
            }
        });
    }
    const saveRol_ = async(IdRol, rol, estatus)=>{
        try{
            if(IdRol != 0)
            {
                const ocList = await updateRol(IdRol, rol, estatus);
            }else{
                const ocList = await saveRol(rol, estatus);
            }
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
            Swal.fire("Éxito", "Se realizo Correctamente", "success");
            setVOC(false);
            getRol_();
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    //************************************************************************************************************************************************************************************** */
    return (
    <>
        <CContainer fluid>
            <h3>Roles </h3>
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
                        columns={colRol}
                        data={fDRol}
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
                    <CModalTitle id="oc_">Roles</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow className='mt-2 mb-2'>
                        <CCol xs={6} md={6}>
                            <CFormInput
                                type="text"
                                label="Rol"
                                placeholder="Rol"
                                value={rol}
                                onChange={hRol}
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
                        <CButton color='primary' onClick={onSaveRol} style={{'color':'white'}} > 
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
export default Roles