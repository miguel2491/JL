import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import '../../estilos.css';
import BuscadorDT from '../../views/base/parametros/BuscadorDT'
import { convertArrayOfObjectsToCSV, getProductos, suCategoria, getCategoriaId, delCategoriaId,
    getProveedores,getCategorias, getProductosId, suProductos, delProductosId
 } from '../../Utilidades/Funciones';
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
import { cilBadge, cilSave, cilTrash, cilBan, cilPlus, cilPen } from '@coreui/icons'
import { Rol } from '../../Utilidades/Roles'
import "react-datepicker/dist/react-datepicker.css"

const Productos = () => {
    //************************************************************************************************************************************************************************** */
    const userIs = Rol('Usuario');
    const userIsAdmin = Rol('Admin');
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [hasPermission, setHasPermission] = useState(true);  
    //Arrays
    const [dtProductos, setDTProductos] = useState([]);
    const [dtCategorias, setDTCategorias] = useState([]);
    const [dtProveedores, setDTProveedores] = useState([]);
    // BUSCADOR
    const [fText, setFText] = useState('');
    const [vBuscador, setBuscador] = useState('');
    // FORMS
    const [Id, setId] = useState(0);
    const [IdCat, setIdCat] = useState(0);
    const [IdPro, setIdPro] = useState(0);
    const [Nombre, setNombre] = useState('');
    const [Descripcion, setDescripcion] = useState('');
    const [Precio, setPrecio] = useState(0);
    const [Cantidad, setCantidad] = useState(0);
    const [Estatus, setEstatus] = useState('');
    // AUX
    const [btnG, setBtnG] = useState("Guardar");
    // Views Modal
    const [vMC, setVMC] = useState(false);
    const [vMP, setVMP] = useState(false);
    const [vMPro, setVMPro] = useState(false);
    //************************************************************************************************************************************************************************** */
    useEffect(() => {
        getProductos_();
        getCategorias_();
        getProveedores_();
    }, []);
    useEffect(() => {
        // Verifica si la cámara ya está disponible
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
          navigator.mediaDevices.enumerateDevices()
            .then(devices => {
              console.log('Dispositivos de medios:', devices);
              const hasCamera = devices.some(device => device.kind === 'videoinput');
              if (!hasCamera) {
                console.error('No se detectó una cámara disponible.');
                setHasPermission(false);
              }
            })
            .catch(err => {
              console.error('Error al enumerar dispositivos:', err);
              setHasPermission(false);
            });
        }
      }, []);
    
    //************************************************************************************************************************************************************************** */    
    const getProductos_ = () =>{
        Swal.fire({
            title: 'Cargando...',
            text: 'Espera por favor...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                ReceiveProductos();
            }
        });
    }
    const ReceiveProductos = async () => {
        try{
            const ocList = await getProductos();
            if(ocList)
            {
                setDTProductos(ocList);
            }
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    const getCategorias_ = async() =>{
        try{
            Swal.close();
            const ocList = await getCategorias();
            setDTCategorias(ocList)
        }catch(error){
            Swal.close();
            console.error(error)
        }
    }
    const getProveedores_ = async() =>{
        try{
            Swal.close();
            const ocList = await getProveedores();
            setDTProveedores(ocList)
        }catch(error){
            Swal.close();
            console.error(error)
        }
    }
    //************************************************************************************************************************************************************************** */
    const checkCameraPermission = async () => {
        try {
          await navigator.mediaDevices.getUserMedia({ video: true });
          setHasPermission(true);  // Si se concede el permiso, cambiamos el estado
        } catch (error) {
          setHasPermission(false);  // Si ocurre un error (por ejemplo, no hay cámara o no hay permisos), cambiamos el estado
        }
      };
      
    //********************************** COLS **************************************************************************************************************************************** */
    const colPro = [
    {
        name: 'Acción',
        selector: row => row.id,
        width:"150px",
        cell: (row) => (
            <div>
                <CRow>
                <CCol xs={6} md={6} lg={6}>
                    <CButton
                        color="warning"
                        onClick={() => getProductoInd_(row.id)}
                        size="sm"
                        className="me-2"
                        title="Actualizar"
                    >
                        <CIcon icon={cilPen} />
                    </CButton>
                </CCol>
                {(row.estatus == '1') && (
                <CCol xs={6} md={6} lg={6}>
                    <CButton
                        color="danger"
                        onClick={() => delProducto(row.id)}
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
        width:"200px",
        sortable:true,
        grow:1,
    },
    {
        name: 'Descripcion',
        selector: row => {
            const aux = row.descripcion;
            if (aux === null || aux === undefined) {
                return "-";
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
        name: 'Precio',
        selector: row => {
            const aux = row.precio;
            if (aux === null || aux === undefined) {
                return "-";
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
        name: 'Cantidad',
        selector: row => {
            const aux = row.cantidad;
            if (aux === null || aux === undefined) {
                return "-";
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
    const hCat = (e) => {
        setIdCat(e.target.value)
    };
    const hPro = (e) => {
        setIdPro(e.target.value)
    };
    const hNombre = (e) => {
        setNombre(e.target.value)
    };
    const hPrecio = (e) => {
        setPrecio(e.target.value)
    };
    const hDescripcion = (e) => {
        setDescripcion(e.target.value)
    };
    const hCantidad = (e) => {
        setCantidad(e.target.value)
    };
    const hEstatus = (e) => {
        setEstatus(e.target.value)
    };
    const handleScan = (result) => {
        Swal.fire("Éxito", result, "success");
        if (result) {
          console.log(result.text)
          Swal.fire("Éxito", result.text, "success");
            //setData(result.text); // Guardar el código escaneado
        }
    };
    const handleError = (error) => {
        console.error(error); // Manejar cualquier error de escaneo
        Swal.fire("Error", error, "success");
    };   
    const handleStartCamera = async() => {
        try {
            // Verificar si el navegador tiene permiso para acceder a la cámara
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (stream) {
              setHasPermission(true);
              setIsCameraActive(true);  // Activa la cámara si se tienen permisos
            }
        } catch (error) {
        console.error('Error al acceder a la cámara:', error);
        setHasPermission(false); // No se pudo acceder a la cámara
        }
    };
    
    const handleStopCamera = () => {
    setIsCameraActive(false); // Detiene la cámara cuando el usuario presiona el botón para detenerla
    } 
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
    const fSProducto = dtProductos.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.nombre.toLowerCase().includes(fText.toLowerCase());
    });
    //************************************************************************************************************************************************************************************** */
    const oMPro = () =>{
        setVMPro(true)
        setId(0)
        setIdCat('-')
        setIdPro('-')
        setNombre('')
        setDescripcion('')
        setPrecio(0)
        setCantidad(0)
        setEstatus('-')
    }
    const getProductoInd_ = async(id) =>{
        Swal.fire({
            title: 'Cargando...',
            text: 'Espera por favor...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
            }
        });
        try{
            Swal.close();
            setVMPro(true);
            const ocList = await getProductosId(id);
            console.log(ocList)
            setNombre(ocList[0].nombre)
            setIdCat(ocList[0].id_categoria)
            setIdPro(ocList[0].id_proveedor)
            setDescripcion(ocList[0].descripcion)
            setPrecio(ocList[0].precio)
            setCantidad(ocList[0].cantidad)
            setEstatus(ocList[0].estatus)
            setId(ocList[0].id)
        }catch(error){
            Swal.close();
            console.error(error)
        }
    }
    //************************************************************************************************************************************************************************************** */
    const onSaveProducto = () =>{
        Swal.fire({
            title: 'Guardar...',
            text: 'Estamos guardando la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                saveProducto_(Id, IdCat, IdPro, Nombre, Descripcion, Precio, Cantidad, Estatus)
            }
        });
    };
    
    const saveProducto_ = async(Id, IdCat, IdPro, Nombre, Descripcion, Precio, Cantidad, Estatus)=>{
        try{
            const ocList = await suProductos(Id, IdCat, IdPro, Nombre, Descripcion, Precio, Cantidad, Estatus);
            console.log(ocList)
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
            Swal.fire("Éxito", "Se realizo Correctamente", "success");
            setVMPro(false);
            getProductos_();
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    };
    const delProducto = (Id) =>
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
                    deletePro(Id)
                }
            });
    };
    const deletePro = async(Id) =>{
        try{
            const ocList = await delProductosId(Id);   
            Swal.close();  // Cerramos el loading
            Swal.fire("Éxito", "Se realizo Correctamente", "success");
            getProductos_()
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    //************************************************************************************************************************************************************************************** */
    return (
    <>
        <CContainer fluid>
            <h3>Productos </h3>
            <CRow className='mt-2 mb-2'>
            <div style={{ width: '100%', height: '400px', backgroundColor: '#f3f3f3', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {isCameraActive ? (
                    <BarcodeScannerComponent
                        onScan={handleScan} // Usar onScan para manejar el escaneo
                        onError={handleError} // Usar onError para manejar los errores
                    />                  
                ):(
                    <div>
                    {!hasPermission && <p>No se pudo acceder a la cámara. Asegúrate de que los permisos estén habilitados.</p>}
                    <CButton color="primary" onClick={handleStartCamera}>Iniciar Cámara</CButton>
                </div>
                )}
            </div>
            </CRow>
            <CRow className='mt-2 mb-2'>
                <CCol xs={8} md={3}>
                    <BuscadorDT value={vBuscador} onChange={onFindBusqueda} onSearch={fBusqueda} />
                </CCol>
                <CCol xs={4} md={3}>
                    <CButton style={{marginTop:'8%'}} onClick={oMPro}
                    color='primary' size='sm' title='Agregar'>
                    <CIcon icon={cilPlus} /> Nuevo</CButton>
                </CCol>
            </CRow>
            <CRow className='mt-2 mb-2'>
                <CCol>
                    <DataTable
                        columns={colPro}
                        data={fSProducto}
                        pagination
                        persistTableHead
                        subHeader
                    />
                </CCol>
            </CRow>
            {/* VMPRODUCTO */}
            <CModal 
                backdrop="static"
                visible={vMPro}
                onClose={() => setVMPro(false)}
                className='c-modal-80'
            >
                <CModalHeader>
                    <CModalTitle id="oc_">Producto</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow className='mt-2 mb-2'>
                        <CCol xs="auto" md="auto">
                            <label>Categoria</label><br/>
                            <CFormSelect size="sm" className="mb-3" aria-label="Interfaz"
                                value={IdCat}
                                onChange={hCat}
                            >
                                <option value="-">-</option>
                                {dtCategorias.map(item =>(
                                    <option value={item.id} key={item.id}>{item.nombre}</option>
                                ))}
                            </CFormSelect>
                        </CCol>
                        <CCol xs="auto" md="auto">
                            <label>Proveedores</label><br/>
                            <CFormSelect size="sm" className="mb-3" aria-label="Interfaz"
                                value={IdPro}
                                onChange={hPro}
                            >
                                <option value="-">-</option>
                                {dtProveedores.map(item =>(
                                    <option value={item.id} key={item.id}>{item.nombre}</option>
                                ))}
                            </CFormSelect>
                        </CCol>
                        <CCol xs="auto" md="auto">
                            <CFormInput
                                type="text"
                                label="Nombre"
                                placeholder="Nombre"
                                value={Nombre}
                                onChange={hNombre}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="auto" md="auto">
                            <CFormInput
                                type="text"
                                label="Descripcion"
                                placeholder="Descripcion"
                                value={Descripcion}
                                onChange={hDescripcion}
                            />
                        </CCol>
                        <CCol xs="auto" md="auto">
                            <CFormInput
                                type="text"
                                label="Precio"
                                placeholder="Precio"
                                value={Precio}
                                onChange={hPrecio}
                            />
                        </CCol>
                        <CCol xs="auto" md="auto">
                            <CFormInput
                                type="text"
                                label="Cantidad"
                                placeholder="Cantidad"
                                value={Cantidad}
                                onChange={hCantidad}
                            />
                        </CCol>
                        <CCol xs="auto" md="auto">
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
                        <CButton color='primary' onClick={onSaveProducto} style={{'color':'white'}} > 
                            <CIcon icon={cilSave} /> {btnG}
                        </CButton>
                    </CCol>
                    <CCol xs={4} md={3}>
                        <CButton color='danger' onClick={() => setVMPro(false)} style={{'color':'white'}} > 
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
export default Productos