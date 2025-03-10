import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import '../../estilos.css';
import BuscadorDT from '../../views/base/parametros/BuscadorDT'
import { convertArrayOfObjectsToCSV, getAlmacen, getAlmacenId, getProductos, suAlmacen, delAlmacen } from '../../Utilidades/Funciones';
import {
    CContainer,
    CRow,
    CButton,
    CCol,
    CFormSelect,
    CFormInput,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter
} from '@coreui/react'
import { IMaskMixin } from 'react-imask'
import { jsPDF } from "jspdf";
import {CIcon} from '@coreui/icons-react'
import { cilCheck, cilSave, cilTrash, cilPlus } from '@coreui/icons'
import { format } from 'date-fns';
import { Rol } from '../../Utilidades/Roles'
import DatePicker,{registerLocale, setDefaultLocale} from 'react-datepicker';
import {es} from 'date-fns/locale/es';
registerLocale('es', es)
import "react-datepicker/dist/react-datepicker.css"

const Almacen = () => {
    //************************************************************************************************************************************************************************** */
    const [vMA, setVMA] = useState(false);
    // ROLES
    const userIs = Rol('Usuario');
    const userIsAdmin = Rol('Admin');
    const [btnG, setBtnG] = useState("Guardar");
    //Arrays
    const [dtAlmacen, setDTAlmacen] = useState([]);
    const [dtProductos, setDTProductos] = useState([]);
    // BUSCADOR
    const [fText, setFText] = useState('');
    const [vBuscador, setBuscador] = useState('');
    // FROMS
    const [id, setId] = useState(0);
    const [idProducto, setIdProducto] = useState("");
    const [cantidad, setCantidad] = useState(0);
    const [cantidadMax, setCantidadMax] = useState(0);
    const [cantidadMin, setCantidadMin] = useState(0);
    const shDisR = !userIs ? false : true;
    //************************************************************************************************************************************************************************** */
    useEffect(() => {
        getAlmacen_();
        getProducto_();
    }, []);
    //************************************************************************************************************************************************************************** */
    const getAlmacen_ = () =>{
        Swal.fire({
            title: 'Cargando...',
            text: 'Estamos obteniendo la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                gAlmacen();
            }
        });
    }
    const gAlmacen = async () => {
        try{
            const ocList = await getAlmacen();
            if(ocList)
            {
               setDTAlmacen(ocList) 
            }
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    const getProducto_ = async () => {
        try{
            const ocList = await getProductos();
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
    //************************************************************************************************************************************************************************************* */
    //******* COL *********
    const colAlm = [
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
                            onClick={() => getAlmacenId_(row.id)}
                            size="sm"
                            className="me-2"
                            title="Actualizar"
                        >
                            <CIcon icon={cilCheck} />
                        </CButton>
                    </CCol>
                    <CCol xs={6} md={6} lg={6}>
                        <CButton
                            color="danger"
                            onClick={() => delAlmacen_(row.id)}
                            size="sm"
                            className="me-2"
                            title="Eliminar"
                        >
                            <CIcon icon={cilTrash} />
                        </CButton>
                    </CCol>
                    
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
            name: 'Producto',
            selector: row => {
                const aux = row.producto;
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
            name: 'Cantidad Maxima',
            selector: row => {
                const aux = row.cantidad_max;
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
            name: 'Cantidad Mínima',
            selector: row => {
                const aux = row.cantidad_min;
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
    ];
    //************************************************************************************************************************************************************************** */
    const oMAlm = () =>{
        setVMA(true)
        setId(0)
        setIdProducto(0)
        setCantidad(0)
        setCantidadMax(0)
        setCantidadMin(0)
    }
    //************************************************************************************************************************************************************************************** */
    const getAlmacenId_ = async(id)=>{
        Swal.fire({
            title: 'Cargando...',
            text: 'Espera por favor...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
            }
        });
        try{
            Swal.close();
            setVMA(true);
            const ocList = await getAlmacenId(id);
            setId(ocList[0].id)
            setIdProducto(ocList[0].id_producto)
            setCantidad(ocList[0].cantidad)
            setCantidadMax(ocList[0].cantidad_max)
            setCantidadMin(ocList[0].cantidad_min)
        }catch(error){
            Swal.close();
            console.error(error)
        }
    }
    const delAlmacen_ = (id)=>{
        Swal.fire({
            title: "¿Eliminar Registro?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Eliminar"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteAlmacen(id);
            }
        });
    }
    const deleteAlmacen = async(Id) =>{
            try{
                const ocList = await delAlmacen(Id);  
                console.log(ocList) 
                Swal.close();  // Cerramos el loading
                Swal.fire("Éxito", "Se realizo Correctamente", "success");
                getAlmacen_()
            }catch(error){
                Swal.close();
                Swal.fire("Error", "No se pudo obtener la información", "error");
            }
        }
    //************************************************************************************************************************************************************************************** */
    // Maneja el cambio en el select de tipo de mantenimiento
    const hProducto = (e) => {
        setIdProducto(e.target.value)
    }
    const hCantidad = (e) => {
        setCantidad(e.target.value)
    }
    const hCantidadMax = (e) => {
        setCantidadMax(e.target.value)
    }
    const hCantidadMin = (e) => {
        setCantidadMin(e.target.value)
    }
    //************************************************************************************************************************************************************************************* */
    // Función de búsqueda
    const onFindBusqueda = (e) => {
        setBuscador(e.target.value);
        setFText(e.target.value);
    };
    const fBusqueda = () => {
        if(vBuscador.length != 0){
            const valFiltrados = dtAlmacen.filter(dtAlmacen => 
                dtAlmacen.Producto.includes(fText) 
                );
                setDTAlmacen(valFiltrados);
        }else{
            getAlmacen_();
        }
    };
    const fSAlmacen = dtAlmacen.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.producto.toLowerCase().includes(fText.toLowerCase());
    });
    //************************************************************************************************************************************************************************************** */
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
    const onSaveAlmacen = () =>{
        Swal.fire({
            title: 'Guardar...',
            text: 'Estamos guardando la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                saveAlmacen_()
            }
        });
    };
        
    const saveAlmacen_ = async()=>{
        try{
            const ocList = await suAlmacen(id, idProducto, cantidad, cantidadMax, cantidadMin);
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
            Swal.fire("Éxito", "Se realizo Correctamente", "success");
            setVMA(false);
            getAlmacen_();
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    };
    //************************************************************************************************************************************************************************************** */
    return (
    <>
        <CContainer fluid>
            <h3>Almacen </h3>
            <CRow className='mt-2 mb-2'>
                <CCol xs={8} md={3}>
                    <BuscadorDT value={vBuscador} onChange={onFindBusqueda} onSearch={fBusqueda} />
                </CCol>
                <CCol xs={4} md={3}>
                    <CButton style={{marginTop:'8%'}} onClick={oMAlm}
                    color='primary' size='sm' title='Agregar'>
                    <CIcon icon={cilPlus} /> Nuevo</CButton>
                </CCol>
            </CRow>
            <CRow className='mt-2 mb-2'>
                <CCol>
                    <DataTable
                        columns={colAlm}
                        data={fSAlmacen}
                        pagination
                        persistTableHead
                        subHeader
                    />
                </CCol>
            </CRow>
            {/* VMPRODUCTO */}
            <CModal 
                backdrop="static"
                visible={vMA}
                onClose={() => setVMA(false)}
                className='c-modal-80'
            >
                <CModalHeader>
                    <CModalTitle id="oc_">Producto</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow className='mt-2 mb-2'>
                        <CCol xs={8} md={3}>
                            <label>Producto</label>
                            <CFormSelect size="sm" className="mb-3 mt-2" aria-label="Interfaz"
                                value={idProducto}
                                onChange={hProducto}
                            >
                                <option value="-">-</option>
                                {dtProductos.map(item =>(
                                    <option value={item.id} key={item.id}>{item.nombre}</option>
                                ))}
                            </CFormSelect>
                        </CCol>
                        <CCol xs={4} md={3}>
                            <CFormInput
                                type="text"
                                label="Cantidad"
                                placeholder="Cantidad"
                                value={cantidad}
                                onChange={hCantidad}
                            />
                        </CCol>
                        <CCol xs={6} md={3}>
                            <CFormInput
                                type="text"
                                label="Cantidad Máxima"
                                placeholder="Cantidad Máxima"
                                value={cantidadMax}
                                onChange={hCantidadMax}
                            />
                        </CCol>
                        <CCol xs={6} md={3}>
                            <CFormInput
                                type="text"
                                label="Cantidad Mínima"
                                placeholder="Cantidad Mínima"
                                value={cantidadMin}
                                onChange={hCantidadMin}
                            />
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CCol xs={4} md={4}></CCol>
                    <CCol xs={4} md={3}>
                        <CButton color='primary btnW' onClick={onSaveAlmacen} > 
                            <CIcon icon={cilSave} /> {btnG}
                        </CButton>
                    </CCol>
                    <CCol xs={4} md={3}>
                        <CButton color='danger btnW' onClick={() => setVMA(false)} > 
                            <CIcon icon={cilTrash} />   Cerrar
                        </CButton>
                    </CCol>
                </CModalFooter>
            </CModal>
                    <br />
            <br />
        </CContainer>
    </>
    )
}
export default Almacen