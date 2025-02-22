import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import '../../estilos.css';
import BuscadorDT from '../../views/base/parametros/BuscadorDT'
import { convertArrayOfObjectsToCSV, getUsuarios, saveUsuario, 
    getInfoUsuario, updateUsuario, delUsuario, getRoles, getPermisos,
getRolUser, getPermisoUser, sUsuarioPermiso, dUsuarioPermiso, dUsuarioRol, saveUsuarioRol } from '../../Utilidades/Funciones';
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
import { cilBadge, cilSave, cilTrash, cilBan } from '@coreui/icons'
import { Rol } from '../../Utilidades/Roles'
import "react-datepicker/dist/react-datepicker.css"

const Usuarios = () => {
    //************************************************************************************************************************************************************************** */
    const [vOC, setVOC] = useState(false);
    const [mRol, setMRol] = useState(false);
    const [mPermiso, setMPermiso] = useState(false);
    // ROLES
    const userIs = Rol('Usuario');
    const userIsAdmin = Rol('Admin');
    //Arrays
    const [dtUsuario, setDTUsuario] = useState([]);
    const [dtRol, setDTRol] = useState([]);
    const [dtPermiso, setDTPermiso] = useState([]);
    const [aRol, setARol] = useState([]);
    const [aPermiso, setAPermiso] = useState([]);
    // BUSCADOR
    const [fText, setFText] = useState('');
    const [vBuscador, setBuscador] = useState('');
    // Usuario
    const [IdUsuario, setIdUsuario] = useState(0);
    const [Usuario, setUsuario] = useState('');
    const [Password, setPassword] = useState('');
    const [Email, setEmail] = useState('');
    const [Estatus, setEstatus] = useState('');
    // ROL PERMISO
    const [IdUserRol, setIdUserRol] = useState(0);
    const [IdRol, setIdRol] = useState(0);
    const [IdUserPermiso, setIdUserPermiso] = useState(0);
    const [IdPermiso, setIdPermiso] = useState(0);
    // AUX
    const [btnG, setBtnG] = useState("Guardar");
    const [shRespuesta, setshRespuesta] = useState(false);
    const shDisR = !userIs ? false : true;
    //************************************************************************************************************************************************************************** */
    const getUsuario_ = () =>{
        Swal.fire({
            title: 'Cargando...',
            text: 'Espera por favor...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                gUsuario();
            }
        });
    }
    const gUsuario = async () => {
        try{
            const ocList = await getUsuarios();
            if(ocList)
            {
                setDTUsuario(ocList);
            }
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }    
    //************************************************************************************************************************************************************************** */
    useEffect(() => {
        getUsuario_();
        getRoles_();
        getPermisos_();
    }, []);
    //************************************************************************************************************************************************************************** */
    const addUsuario = (id) =>{
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
    const getRoles_ = async()=>{
        try{
            const ocList = await getRoles();
            setARol(ocList)
        }catch(error){
            console.error(error)
        }
    }
    const getPermisos_ = async()=>{
        try{
            const ocList = await getPermisos();
            setAPermiso(ocList)
        }catch(error){
            console.error(error)
        }
    }
    const getRolUser_ = async(id)=>{
        try{
            const ocList = await getRolUser(id);
            console.log(ocList)
            setDTRol(ocList)
        }catch(error){
            console.error(error)
        }
    }
    const getPermisoUser_ = async(id)=>{
        try{
            const ocList = await getPermisoUser(id);
            console.log(ocList)
            setDTPermiso(ocList)
        }catch(error){
            console.error(error)
        }
    }
    //************************************************************************************************************************************************************************************** */
    // Maneja el cambio en el select de tipo de mantenimiento
    const hUsuario = (e) => {
        setUsuario(e.target.value)
    };
    const hPassword = (e) => {
        setPassword(e.target.value)
    };
    const hEmail = (e) => {
        setEmail(e.target.value)
    };
    const hEstatus = (e) => {
        setEstatus(e.target.value)
    };
    const hRol = (e) => {
        setIdRol(e.target.value)
    };
    const hPermiso = (e) => {
        setIdPermiso(e.target.value)
    };
    //************************************************************************************************************************************************************************************* */
    const colUsuario = [
    {
        name: 'Acción',
        selector: row => row.id,
        width:"300px",
        cell: (row) => (
            <div>
                <CRow>
                {(userIsAdmin) && (
                    <CCol xs={6} md={2} lg={2}>
                        <CButton
                            color="primary"
                            onClick={() => addUsuario(row.id)}
                            size="sm"
                            className="me-2"
                            title="Actualizar"
                        >
                            <CIcon icon={cilSave} />
                        </CButton>
                    </CCol>
                )}
                    <CCol xs={6} md={2} lg={2}>
                        <CButton
                            color="success"
                            onClick={() => addRoles(row.id)}
                            size="sm"
                            className="me-2"
                            title="Roles"
                        >
                            <CIcon icon={cilBadge} />
                        </CButton>
                    </CCol>
                    <CCol xs={6} md={2} lg={2}>
                        <CButton
                            color="warning"
                            onClick={() => addPermisos(row.id)}
                            size="sm"
                            className="me-2"
                            title="Permisos"
                        >
                            <CIcon icon={cilBan} />
                        </CButton>
                    </CCol>
                </CRow>
            </div>
        ),
    },
    {
        name: 'Usuario',
        selector: row => {
            const aux = row.usuario;
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
        name: 'Email',
        selector: row => {
            const aux = row.email;
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
    const colRol = [
        {
            name: 'Acción',
            selector: row => row.id,
            width:"300px",
            cell: (row) => (
                <div>
                    <CRow>
                    {(userIsAdmin) && (
                        <CCol xs={6} md={2} lg={2}>
                            <CButton
                                color="danger"
                                onClick={() => delRolUsuario(row.id)}
                                size="sm"
                                className="me-2"
                                title="Eliminar"
                            >
                                <CIcon icon={cilTrash} />
                            </CButton>
                        </CCol>
                    )}
                    </CRow>
                </div>
            ),
        },
        {
            name: 'Rol',
            selector: row => {
                const aux = row.roleName;
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
    ];
    const colPermiso = [
        {
            name: 'Acción',
            selector: row => row.id,
            width:"300px",
            cell: (row) => (
                <div>
                    <CRow>
                    {(userIsAdmin) && (
                        <CCol xs={6} md={2} lg={2}>
                            <CButton
                                color="danger"
                                onClick={() => delPermisoUsuario(row.id)}
                                size="sm"
                                className="me-2"
                                title="Eliminar Permiso"
                            >
                                <CIcon icon={cilTrash} />
                            </CButton>
                        </CCol>
                    )}
                    </CRow>
                </div>
            ),
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
            width:"200px",
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
            const valFiltrados = dtUsuario.filter(dtUsuario => 
                dtUsuario.usuario.includes(fText) // Filtra los clientes por el número de cliente
                );
                setDTUsuario(valFiltrados);
        }else{
            getUsuario_();
        }
    };
    const fDUsuario = dtUsuario.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.usuario.toLowerCase().includes(fText.toLowerCase());
    });
    //************************************************************************************************************************************************************************************** */
    const addRoles = (id) =>{
        setIdUsuario(id)
        setMRol(true);
        getRolUser_(id);
        setIdRol('0');
    }
    const addPermisos = (id) =>{
        setIdUsuario(id);        
        setMPermiso(true);
        getPermisoUser_(id);
        setIdPermiso('0')
    }
    //************************************************************************************************************************************************************************************** */
    const onSaveUsuario = () =>{
        Swal.fire({
            title: 'Guardar...',
            text: 'Estamos guardando la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                saveUsuario_(IdUsuario, Usuario, Password, Email, Estatus)
            }
        });
    };
    const saveUsuario_ = async(IdUsuario, Usuario, Password, Email, Estatus)=>{
        try{
            if(IdUsuario != 0)
            {
                const ocList = await updateUsuario(IdUsuario, Usuario, Password, Email, Estatus);
            }else{
                const ocList = await saveUsuario(Usuario, Password, Email, Estatus);
            }
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
            Swal.fire("Éxito", "Se realizo Correctamente", "success");
            setVOC(false);
            getUsuario_();
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    };
    const onSaveUsuarioRol = () =>{
        Swal.fire({
            title: 'Guardar...',
            text: 'Estamos guardando la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                saveUsuarioRol_(IdUserRol, IdUsuario, IdRol)
            }
        });
    };
    const saveUsuarioRol_ = async(IdUserRol, IdUsuario, IdRol)=>{
        try{
            const ocList = await saveUsuarioRol(IdUserRol,IdUsuario, IdRol);
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
            Swal.fire("Éxito", "Se realizo Correctamente", "success");
            setIdRol('0');
            getRolUser_(IdUsuario);
        }catch(error){
            console.log(error)
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    };
    const delRolUsuario = async(IdUserPermiso) =>
        {
            try{
                const ocList = await dUsuarioRol(IdUserPermiso);   
                // Cerrar el loading al recibir la respuesta
                Swal.close();  // Cerramos el loading
                Swal.fire("Éxito", "Se realizo Correctamente", "success");
                setIdRol('0');
                getRolUser_(IdUsuario);
            }catch(error){
                console.log("Error Try: "+error)
                Swal.close();
                Swal.fire("Error", "No se pudo obtener la información", "error");
            }
    };
    const onSaveUsuarioPermiso = () =>{
        Swal.fire({
            title: 'Guardar...',
            text: 'Estamos guardando la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                saveUsuarioPermiso_(IdUserPermiso, IdUsuario, IdPermiso)
            }
        });
    };
    const saveUsuarioPermiso_ = async(IdUserPermiso, IdUsuario, IdPermiso)=>{
        try{
            if(IdUserPermiso != 0)
            {
                const ocList = await sUsuarioPermiso(IdUserPermiso, IdUsuario, IdPermiso);
                console.log(ocList)
            }else{
                const ocList = await sUsuarioPermiso(IdUserPermiso, IdUsuario, IdPermiso);
                console.log(ocList)
            }
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
            Swal.fire("Éxito", "Se realizo Correctamente", "success");
            //setMPermiso(false);
            getPermisoUser_(IdUsuario);
            setIdPermiso('0');
        }catch(error){
            console.log(error)
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    };
    const delPermisoUsuario = async(IdUserPermiso) =>
    {
        try{
            const ocList = await dUsuarioPermiso(IdUserPermiso);   
            console.log(ocList)         
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
            Swal.fire("Éxito", "Se realizo Correctamente", "success");
            setIdPermiso('0');
            getPermisoUser_(IdUsuario);
        }catch(error){
            console.log("Error Try: "+error)
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    };
    //************************************************************************************************************************************************************************************** */
    return (
    <>
        <CContainer fluid>
            <h3>Usuario </h3>
            <CRow className='mt-2 mb-2'>
                <CCol xs={3} md={3}>
                    <BuscadorDT value={vBuscador} onChange={onFindBusqueda} onSearch={fBusqueda} />
                </CCol>
                <CCol xs={3} md={3}>
                    <CButton onClick={()=> setVOC(true)}
                        color='primary' size='sm' title='Agregar' className='mt-2 me-2'>Nuevo Usuario</CButton>
                </CCol>
            </CRow>
            <CRow className='mt-2 mb-2'>
                <CCol>
                    <DataTable
                        columns={colUsuario}
                        data={fDUsuario}
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
                    <CModalTitle id="oc_">Usuario</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow className='mt-2 mb-2'>
                        <CCol xs={6} md={4}>
                            <CFormInput
                                type="text"
                                label="Usuario"
                                placeholder="Usuario"
                                value={Usuario}
                                onChange={hUsuario}
                            />
                        </CCol>
                        <CCol xs={6} md={4}>
                            <CFormInput
                                type="password"
                                label="Password"
                                placeholder="Password"
                                value={Password}
                                onChange={hPassword}
                            />
                        </CCol>
                        <CCol xs={6} md={4}>
                            <CFormInput
                                type="text"
                                label="Email"
                                placeholder="Email"
                                value={Email}
                                onChange={hEmail}
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
                        <CButton color='primary' onClick={onSaveUsuario} style={{'color':'white'}} > 
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
            <CModal 
                backdrop="static"
                visible={mRol}
                onClose={() => setMRol(false)}
                className='c-modal-80'
            >
                <CModalHeader>
                    <CModalTitle id="oc_">Rol / Usuario</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow className='mt-2 mb-2'>
                        <CCol xs={4} md={4}>
                            <label>Rol</label>
                            <CFormSelect size="sm" className="mb-3" aria-label="Interfaz"
                                value={IdRol}
                                onChange={hRol}
                            >
                                <option value="0">-</option>
                                {aRol.map((rol, index) =>(
                                    <option value={rol.id} key={`${index}`}>
                                        {rol.Rol}
                                    </option>
                                ))}
                            </CFormSelect>
                        </CCol>
                        <CCol xs={4} md={4}>
                            <br />
                            <CButton color="primary" onClick={onSaveUsuarioRol}>Agregar</CButton>
                        </CCol>
                    </CRow>
                    <CRow>
                    <DataTable
                        columns={colRol}
                        data={dtRol}
                        pagination
                        persistTableHead
                        subHeader
                    />
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CCol xs={4} md={4}></CCol>
                    <CCol xs={4} md={2}>
                        <CButton color='danger' onClick={() => setMRol(false)} style={{'color':'white'}} > 
                            <CIcon icon={cilTrash} />   Cerrar
                        </CButton>
                    </CCol>
                </CModalFooter>
            </CModal>
            <CModal 
                backdrop="static"
                visible={mPermiso}
                onClose={() => setMPermiso(false)}
                className='c-modal-80'
            >
                <CModalHeader>
                    <CModalTitle id="oc_">Permisos / Usuario</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                    <CCol xs={4} md={4}>
                            <label>Permiso</label>
                            <CFormSelect size="sm" className="mb-3" aria-label="Interfaz"
                                value={IdPermiso}
                                onChange={hPermiso}
                            >
                                <option value="0">-</option>
                                {aPermiso.map((permiso, index) =>(
                                    <option value={permiso.id} key={`${index}`}>
                                        {permiso.Permiso}
                                    </option>
                                ))}
                            </CFormSelect>
                        </CCol>
                        <CCol xs={4} md={4}>
                        <br />
                            <CButton color="primary" onClick={onSaveUsuarioPermiso}>Agregar</CButton>
                        </CCol>
                    </CRow>
                    <CRow>
                        <DataTable
                            columns={colPermiso}
                            data={dtPermiso}
                            pagination
                            persistTableHead
                            subHeader
                        />
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CCol xs={4} md={4}></CCol>
                    <CCol xs={4} md={2}>
                        <CButton color='danger' onClick={() => setMPermiso(false)} style={{'color':'white'}} > 
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
export default Usuarios