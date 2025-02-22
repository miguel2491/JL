import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine'; 
import DataTable from 'react-data-table-component';
import '../../estilos.css';
import BuscadorDT from '../../views/base/parametros/BuscadorDT'
import { getProveedores, setVisita, 
    getProveedoresId, getVisitas, getCategorias } from '../../Utilidades/Funciones';
import {
    CContainer,
    CBadge,
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
import { cilSave, cilTrash, cilPin, cilMap } from '@coreui/icons'
import { Rol } from '../../Utilidades/Roles'
import "react-datepicker/dist/react-datepicker.css"

const Mapas = () => {
    //************************************************************************************************************************************************************************** */
    const [vMP, setVMP] = useState(false);
    // ROLES
    const userIs = Rol('Usuario');
    const userIsAdmin = Rol('Admin');
    //Arrays
    const [dtProveedores, setDTProveedores] = useState([]);
    // BUSCADOR
    const [fText, setFText] = useState('');
    const [vBuscador, setBuscador] = useState('');
    // POCISIÓN
    const [mapInstance, setMapInstance] = useState(null);
    const [mapCenter, setMapCenter] = useState([19.023968543290614,-98.2954168461941])
    const [zoom, setZoom] = useState(10);
    const [dtRuta, setDTRuta] = useState([]);
    // AUX
    const [btnG, setBtnG] = useState("Guardar");
    //const map = useMap();
    //************************************************************************************************************************************************************************** */
    useEffect(() => {
        getProveedor_();
        getCategoria_();
    }, []);
    useEffect(() =>{
        console.log(dtRuta, mapInstance)
        if (dtRuta.length > 0 && mapInstance) {
            // Llamamos a la función para trazar la ruta cada vez que dtRuta cambie
            trazarRuta(mapInstance, dtRuta);
        }else{
            console.log("Esperando cargar Mapa...")
        }
    },[dtRuta, mapInstance])
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
                        <CCol xs="auto" md="auto" lg="auto">
                            <CButton
                                color="primary"
                                onClick={() => setVisita_(row.id)}
                                size="sm"
                                className="me-2 iconocLis"
                                title="Registrar Mapa"
                            >
                                <CIcon icon={cilPin} />
                            </CButton>
                        </CCol>
                        <CCol xs="auto" md="auto" lg="auto">
                            <CButton
                                color="warning"
                                onClick={() => viewMapa(row.id)}
                                size="sm"
                                className="me-2 iconocLis"
                                title="Mapa"
                            >
                                <CIcon icon={cilMap} />
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
    const viewMapa = (id) =>{
        setVMP(true);
        mMapa(id)
    };
    const mMapa = async(idc) =>{
        try{
          const ocList = await getVisitas(idc, "Visita");
          if(ocList)
          {
            Swal.close();
            setDTRuta(ocList)
            setMapInstance(map);
            //setTimeout(function(){trazarRuta(ocList)},8000);
          }
        }catch(error){
          Swal.close();
          Swal.fire("Error al guardar", error.message, "error");
        }
    };
    const trazarRuta = (map, ocList) =>{
        const waypoints = ocList
        .map((point) => {
          if (point.lat && point.lng) {
            return L.latLng(point.lat, point.lng);
          }
          return null;
        }).filter((point) => point !== null);
        console.log("WAYPOINTS",waypoints.length);
        if(waypoints.length > 1) {
          // Eliminar rutas anteriores
            // map.eachLayer((layer) => {
            //     if (layer instanceof L.Routing.Control) {
            //     map.removeLayer(layer); // Eliminar la ruta anterior
            //     }
            // });
          
          // Crear y añadir la nueva ruta
          L.Routing.control({
            waypoints: waypoints,
            lineOptions: {
              styles: [{ color: "#6FA1EC", weight: 4 }]
            },
            routeWhileDragging: true,
          }).addTo(map);
          map.fitBounds(L.latLngBounds(waypoints));
        } else {
          Swal.fire("No hay suficientes puntos", "Se necesitan al menos dos puntos para trazar una ruta.", "info");
        }
      
      }
    const setVisita_ = (id) =>{
         Swal.fire({
            title: "¿Registrar visita?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Registrar"
        }).then((result) => {
            if (result.isConfirmed) {
                regVisita(id)
            }
        });
    };
    
    const regVisita = async(id) =>{
        if(navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(
                (position)=>{
                    const {latitude, longitude} = position.coords;
                    console.log(position.coords)
                    console.log(position.coords.latitude)
                    //setUserPosition({lat:position.coords.latitude, lng:position.coords.longitude});
                    savePos(id,latitude, longitude)
                },
                (error) => {
                    console.error(error);
                    Swal.fire("Error", "No se pudo obtener la Ubicación", "error");
                }
            );
        }else{
            Swal.fire("Error", "Geolocalización no disponible en este navegador", "error");
        }
    }

    const savePos = async(id,lat,lng) =>{
        try{
            const ocList = await setVisita(id,lat,lng,"Visita");  
            if(ocList){
                Swal.fire("Éxito", "Visita agregada", "success");
            } 
            //Swal.close();  // Cerramos el loading
            //getProveedor_()
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    //************************************************************************************************************************************************************************************** */
    // Maneja el cambio en el select de tipo de mantenimiento
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
    
    //************************************************************************************************************************************************************************************** */
    return (
    <>
        <CContainer fluid>
            <h3>Localización </h3>
            <CRow className='mt-2 mb-2'>
                <CCol xs={3} md={3}>
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
                    <CModalTitle id="oc_">Mapa</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <MapContainer
                        center={mapCenter} // Centro de México como ejemplo
                        zoom={zoom}
                        style={{ height: '400px', width: '100%' }}
                        id="map"
                        whenCreated={(map) =>{
                            console.log("Mapa Creado", map)
                            map.on('moveend', () =>{
                                setMapCenter(map.getCenter());
                            });
                        }}
                    >
                        <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">
                        OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Circle
                        center={mapCenter} // Usamos el centro actualizado
                        radius={30000} // Radio de 1000 metros (ajustar según lo necesites)
                        color="blue"   // Color del borde
                        fillColor="blue" // Color de relleno
                        fillOpacity={0.1} // Opacidad del relleno
                        />
                        {dtRuta.map((point, index) => (
                        <>
                        <Marker key={index} position={[point.lat, point.lng]}>
                        <Popup>
                            <b>Visita {index + 1}</b><br />
                            Usuario: {point.usuario}<br />
                            Registro: {point.idReg}<br />
                            Fecha: {point.fecha}
                        </Popup>
                        </Marker>
                        
                        </>          
                        ))}
                    </MapContainer>
                </CModalBody>
                <CModalFooter>
                    <CCol xs={8} md={10}></CCol>
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
export default Mapas