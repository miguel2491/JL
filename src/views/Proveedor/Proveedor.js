import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import '../../estilos.css';
import BuscadorDT from '../../views/base/parametros/BuscadorDT'
import { getProveedores, suProveedores, 
    getProveedoresId, delProveedoresId, getCategorias } from '../../Utilidades/Funciones';
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
import { cilBadge, cilSave, cilTrash, cilBan, cilPin } from '@coreui/icons'
import { Rol } from '../../Utilidades/Roles'
import "react-datepicker/dist/react-datepicker.css"

const Proveedor = () => {
    //************************************************************************************************************************************************************************** */
    const [vMP, setVMP] = useState(false);
    // ROLES
    const userIs = Rol('Usuario');
    const userIsAdmin = Rol('Admin');
    //Arrays
    const [dtProveedores, setDTProveedores] = useState([]);
    const [dtCategoria, setDTCategoria] = useState([]);
    // BUSCADOR
    const [fText, setFText] = useState('');
    const [vBuscador, setBuscador] = useState('');
    // PROVEEDOR
    const [Id, setId] = useState(0);
    const [IdCategoria, setIdCategoria] = useState(0);
    const [Nombre, setNombre] = useState('');
    const [Ubicacion, setUbicacion] = useState('');
    const [Estatus, setEstatus] = useState('');
    // CATEGORIAS
    const [IdC, setIdC] = useState(0);
    // AUX
    const [btnG, setBtnG] = useState("Guardar");
    //************************************************************************************************************************************************************************** */
    useEffect(() => {
        getProveedor_();
        getCategoria_();
    }, []);
    //************************************************************************************************************************************************************************** */
    const getProveedor_ = () =>{
        Swal.fire({
            title: 'Cargando...',
            text: 'Espera por favor...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                gProveedor();
            }
        });
    }

    const gProveedor = async() =>{
        try{
            const ocList = await getProveedores();
            console.log(ocList)
            if(ocList)
            {
                setDTProveedores(ocList);
            }
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    } 
    
    const getCategoria_ = async() =>{
        try{
            const ocList = await getCategorias();
            if(ocList)
            {
                const valFiltrados = ocList.filter(ocList => 
                    ocList.estatus.includes('1') // Filtra los clientes por el número de cliente
                );
                setDTCategoria(valFiltrados);
            }
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    //************************************************************************************************************************************************************************************* */
    const colProv = [
        {
            name: 'Acción',
            selector: row => row.id,
            width:"210px",
            cell: (row) => (
                <div>
                    <CRow>
                    {(userIsAdmin) && (
                        <CCol xs="auto" md="auto" lg="auto">
                            <CButton
                                color="primary"
                                onClick={() => getInfoProv_(row.id)}
                                size="sm"
                                className="me-2"
                                title="Actualizar"
                            >
                                <CIcon icon={cilSave} />
                            </CButton>
                        </CCol>
                    )}
                        <CCol xs="auto" md="auto" lg="auto">
                            <CButton
                                color="danger"
                                onClick={() => delProv(row.id)}
                                size="sm"
                                className="me-2"
                                title="Eliminar"
                            >
                                <CIcon icon={cilTrash} />
                            </CButton>
                        </CCol>
                        <CCol xs="auto" md="auto" lg="auto">
                            <CButton
                                color="info"
                                onClick={() => gtUbicacion(row.id)}
                                size="sm"
                                className="me-2"
                                title="Ubicación"
                            >
                                <CIcon icon={cilPin} />
                            </CButton>
                        </CCol>
                    </CRow>
                </div>
            ),
        },
        {
            name: 'Categoria',
            selector: row => {
                const aux = row.Categoria;
                if (aux === null || aux === undefined) {
                    return "No disponible";
                }
                if (typeof aux === 'object') {
                return "Sin Datos"; // O cualquier mensaje que prefieras
                }
                return aux;
            },
            width:"200px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Nombre',
            selector: row => {
                const aux = row.nombre;
                if (aux === null || aux === undefined) {
                    return "No disponible";
                }
                if (typeof aux === 'object') {
                return "Sin Datos"; // O cualquier mensaje que prefieras
                }
                return aux;
            },
            width:"200px",
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
    const delProv = (id) =>{
         Swal.fire({
            title: "¿Eliminar Registro?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Eliminar"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteProv(id)
            }
        });
    };
    
    const deleteProv = async(id) =>{
        try{
            const ocList = await delProveedoresId(id);   
            Swal.close();  // Cerramos el loading
            Swal.fire("Éxito", "Se realizo Correctamente", "success");
            getProveedor_()
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }

    const getInfoProv_ = async(id)=>{
        try{
            const ocList = await getProveedoresId(id);
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
            setVMP(true);
            setTimeout(function(){setId(ocList[0].id_categoria)},1000)
            setNombre(ocList[0].nombre)
            setUbicacion(ocList[0].ubicacion)
            setEstatus(ocList[0].estatus)
            setBtnG("Actualizar")
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    
    //************************************************************************************************************************************************************************************** */
    // Maneja el cambio en el select de tipo de mantenimiento
    const hProveedor = (e) => {
        setNombre(e.target.value)
    };
    const hCat = (e) => {
        setIdC(e.target.value)
    };
    const hUbicacion = (e) => {
        setUbicacion(e.target.value)
    };
    const hEstatus = (e) => {
        setEstatus(e.target.value)
    };    
    // Función de búsqueda
    const onFindBusqueda = (e) => {
        setBuscador(e.target.value);
        setFText(e.target.value);
    };
    const fBusqueda = () => {
        if(vBuscador.length != 0){
            const valFiltrados = dtUsuario.filter(dtUsuario => 
                dtUsuario.usuario.includes(fText) // Filtra los clientes por el número de cliente
                );
                setDTUsuario(valFiltrados);
        }else{
            getUsuario_();
        }
    };
    const fDProv = dtProveedores.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.nombre.toLowerCase().includes(fText.toLowerCase());
    });
    //**************************************************************************************************************************************************************************************
    
    const onSaveProv = () =>
    {
        Swal.fire({
            title: 'Guardar...',
            text: 'Estamos guardando la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                saveProv_(IdCategoria, Nombre, Ubicacion, Estatus)
            }
        });
    };

    const saveProv_ = async(IdCategoria, Nombre, Ubicacion, Estatus)=>{
        try{
            console.log(Id)
            const ocList = await suProveedores(Id,IdCategoria, Nombre, Ubicacion, Estatus);
            console.log(ocList)
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
            Swal.fire("Éxito", "Se realizo Correctamente", "success");
            setVMP(false);
            getProveedor_();
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    };

    //************************************************************************************************************************************************************************************** */
    return (
    <>
        <CContainer fluid>
            <h3>Proveedor </h3>
            <CRow className='mt-2 mb-2'>
                <CCol xs={8} md={3}>
                    <BuscadorDT value={vBuscador} onChange={onFindBusqueda} onSearch={fBusqueda} />
                </CCol>
                <CCol xs={3} md={3}>
                    <CButton onClick={()=> setVMP(true)}
                        color='primary' size='sm' title='Agregar' className='mt-2 me-2'>
                        <CIcon icon={cilSave} />Nuevo
                    </CButton>
                </CCol>
            </CRow>
            <CRow className='mt-2 mb-2'>
                <CCol>
                    <DataTable
                        columns={colProv}
                        data={fDProv}
                        pagination
                        persistTableHead
                        subHeader
                    />
                </CCol>
            </CRow>
            <CModal 
                backdrop="static"
                visible={vMP}
                onClose={() => setVMP(false)}
                className='c-modal-40'
            >
                <CModalHeader>
                    <CModalTitle id="oc_">Proveedor</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow className='mt-2 mb-2'>
                        <CCol xs={6} md={4}>
                            <label>Categoria</label><br/>
                            <CFormSelect size="sm" className="mb-3" aria-label="Interfaz"
                                value={IdC}
                                onChange={hCat}
                            >
                                <option value="-">-</option>
                                {dtCategoria.map(item =>(
                                    <option value={item.id} key={item.id}>{item.nombre}</option>
                                ))}
                            </CFormSelect>
                        </CCol>
                        <CCol xs={6} md={4}>
                            <CFormInput
                                type="text"
                                label="Proveedor"
                                placeholder="Proveedor"
                                value={Nombre}
                                onChange={hProveedor}
                            />
                        </CCol>
                        <CCol xs={6} md={4}>
                            <CFormInput
                                type="text"
                                label="Ubicacion"
                                placeholder="Ubicacion"
                                value={Ubicacion}
                                onChange={hUbicacion}
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
                    <CCol xs={4} md={2}>
                        <CButton color='primary' onClick={onSaveProv} style={{'color':'white'}} > 
                            <CIcon icon={cilSave} /> {btnG}
                        </CButton>
                    </CCol>
                    <CCol xs={4} md={2}>
                        <CButton color='danger' onClick={() => setVMP(false)} style={{'color':'white'}} > 
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
export default Proveedor