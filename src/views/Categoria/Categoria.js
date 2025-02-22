import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import '../../estilos.css';
import BuscadorDT from '../../views/base/parametros/BuscadorDT'
import { convertArrayOfObjectsToCSV, getCategorias, suCategoria, getCategoriaId, delCategoriaId } from '../../Utilidades/Funciones';
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
import { cilBadge, cilSave, cilTrash, cilBan, cilPlus } from '@coreui/icons'
import { Rol } from '../../Utilidades/Roles'
import "react-datepicker/dist/react-datepicker.css"

const Categoria = () => {
    //************************************************************************************************************************************************************************** */
    const [vMC, setMCategoria] = useState(false);
    // ROLES
    const userIs = Rol('Usuario');
    const userIsAdmin = Rol('Admin');
    //Arrays
    const [dtCategoria, setDTCategoria] = useState([]);
    // BUSCADOR
    const [fText, setFText] = useState('');
    const [vBuscador, setBuscador] = useState('');
    // FORMS
    const [Id, setId] = useState(0);
    const [Nombre, setNombre] = useState('');
    const [Estatus, setEstatus] = useState('');
    // AUX
    const [btnG, setBtnG] = useState("Guardar");
    const [shRespuesta, setshRespuesta] = useState(false);
    const shDisR = !userIs ? false : true;
    //************************************************************************************************************************************************************************** */
    useEffect(() => {
        getCategoria_();
    }, []);
    //************************************************************************************************************************************************************************** */    
    const getCategoria_ = () =>{
        Swal.fire({
            title: 'Cargando...',
            text: 'Espera por favor...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                ReceiveCategoria();
            }
        });
    }
    const ReceiveCategoria = async () => {
        try{
            const ocList = await getCategorias();
            if(ocList)
            {
                setDTCategoria(ocList);
            }
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }    
    //********************************** COLS **************************************************************************************************************************************** */
    const colCat = [
    {
        name: 'Acción',
        selector: row => row.id,
        width:"150px",
        cell: (row) => (
            <div>
                <CRow>
                {(userIsAdmin) && (
                <CCol xs={6} md={6} lg={6}>
                    <CButton
                        color="primary"
                        onClick={() => openMCategoria(row.id)}
                        size="sm"
                        className="me-2"
                        title="Actualizar"
                    >
                        <CIcon icon={cilSave} />
                    </CButton>
                </CCol>
                )}
                {(row.estatus == '1') && (
                <CCol xs={6} md={6} lg={6}>
                    <CButton
                        color="danger"
                        onClick={() => delCategoria(row.id)}
                        size="sm"
                        className="me-2"
                        title="Eliminar"
                    >
                        <CIcon icon={cilBan} />
                    </CButton>
                </CCol>
                )}
            </CRow>
            </div>
        ),
    },
    {
        name: 'ID',
        selector: row => {
            const aux = row.id;
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return aux;
        },
        width:"60px",
        sortable:true,
        grow:1,
    },
    {
        name: 'Nombre',
        selector: row => {
            const aux = row.nombre;
            if (aux === null || aux === undefined) {
                return "-";
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
    ];
    //************************************************************************************************************************************************************************** */
    const addCategoria = (id) =>{
        Swal.fire({
            title: 'Cargando...',
            text: 'Obteniendo información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                getInfoUsuario_(id)
            }
        });
    }
    const getInfoUsuario_ = async(id)=>{
        try{
            const ocList = await getInfoUsuario(id);
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
            setVOC(true);
            setUsuario(ocList[0].Usuario)
            setPassword(ocList[0].Password)
            setEmail(ocList[0].Email)
            setEstatus(ocList[0].estatus)
            setIdUsuario(id)
            setBtnG("Actualizar")
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    //************************************************************************************************************************************************************************************** */
    // Maneja el cambio en el select de tipo de mantenimiento
    const hNombre = (e) => {
        setNombre(e.target.value)
    };
    const hEstatus = (e) => {
        setEstatus(e.target.value)
    };
    //************************************************************************************************************************************************************************************* */
    // Función de búsqueda
    const onFindBusqueda = (e) => {
        setBuscador(e.target.value);
        setFText(e.target.value);
    };
    const fBusqueda = () => {
        if(vBuscador.length != 0){
            const valFiltrados = dtCategoria.filter(dtCategoria => 
                dtCategoria.nombre.includes(fText) // Filtra los clientes por el número de cliente
                );
                setDTCategoria(valFiltrados);
        }else{
            getCategoria_();
        }
    };
    const fDCategoria = dtCategoria.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.nombre.toLowerCase().includes(fText.toLowerCase());
    });
    //************************************************************************************************************************************************************************************** */
    const oMCat = () =>{
        setMCategoria(true)
        setId(0)
        setNombre('')
        setEstatus('-')
    }
    const openMCategoria = (id) =>{
        setMCategoria(true);
        getCategoriaInd_(id);
        setBtnG("Actualizar")
    }
    const getCategoriaInd_ = async(id) =>{
        Swal.fire({
            title: 'Cargando...',
            text: 'Espera por favor...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
            }
        });
        try{
            Swal.close();
            const ocList = await getCategoriaId(id);
            setNombre(ocList[0].nombre)
            setEstatus(ocList[0].estatus)
            setId(ocList[0].id)
            console.log(ocList)
        }catch(error){
            Swal.close();
            console.error(error)
        }
    }
    //************************************************************************************************************************************************************************************** */
    const onSaveCategoria = () =>{
        Swal.fire({
            title: 'Guardar...',
            text: 'Estamos guardando la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                saveCategoria_(Id, Nombre, Estatus)
            }
        });
    };
    const saveCategoria_ = async(Id, Nombre, Estatus)=>{
        try{
            const ocList = await suCategoria(Id, Nombre, Estatus);
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
            Swal.fire("Éxito", "Se realizo Correctamente", "success");
            setMCategoria(false);
            getCategoria_();
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    };
    const delCategoria = (Id) =>
        {
            Swal.fire({
                title: "¿Eliminar Registro?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Eliminar"
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteCat(Id)
                }
            });
    };
    const deleteCat = async(Id) =>{
        try{
            const ocList = await delCategoriaId(Id);   
            Swal.close();  // Cerramos el loading
            Swal.fire("Éxito", "Se realizo Correctamente", "success");
            getCategoria_()
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    //************************************************************************************************************************************************************************************** */
    return (
    <>
        <CContainer fluid>
            <h3>Categorias </h3>
            <CRow className='mt-2 mb-2'>
                <CCol xs={3} md={3}>
                    <BuscadorDT value={vBuscador} onChange={onFindBusqueda} onSearch={fBusqueda} />
                </CCol>
                <CCol xs={3} md={3}>
                    <CButton style={{'margin-top':'8%'}} onClick={oMCat}
                    color='primary' size='sm' title='Agregar'>
                    <CIcon icon={cilPlus} /> Nuevo</CButton>
                </CCol>
            </CRow>
            <CRow className='mt-2 mb-2'>
                <CCol>
                    <DataTable
                        columns={colCat}
                        data={fDCategoria}
                        pagination
                        persistTableHead
                        subHeader
                    />
                </CCol>
            </CRow>
            <CModal 
                backdrop="static"
                visible={vMC}
                onClose={() => setMCategoria(false)}
                className='c-modal-40'
            >
                <CModalHeader>
                    <CModalTitle id="oc_">Categoria</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow className='mt-2 mb-2'>
                        <CCol xs={6} md={8}>
                            <CFormInput
                                type="text"
                                label="Categoria"
                                placeholder="Categoria"
                                value={Nombre}
                                onChange={hNombre}
                            />
                        </CCol>
                        <CCol xs={6} md={4}>
                            <label>Estatus</label><br/>
                            <CFormSelect size="sm" className="mb-3" aria-label="Interfaz"
                                value={Estatus}
                                onChange={hEstatus}
                            >
                                <option value="-">-</option>
                                <option value="1">ACTIVO</option>
                                <option value="0">INACTIVO</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CCol xs={4} md={4}></CCol>
                    <CCol xs={4} md={3}>
                        <CButton color='primary' onClick={onSaveCategoria} style={{'color':'white'}} > 
                            <CIcon icon={cilSave} /> {btnG}
                        </CButton>
                    </CCol>
                    <CCol xs={4} md={3}>
                        <CButton color='danger' onClick={() => setMCategoria(false)} style={{'color':'white'}} > 
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
export default Categoria