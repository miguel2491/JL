import { cilAlarm } from '@coreui/icons'
import { element } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
//================================= CATALOGOS =================================================
// ===============> PRODUCTOS <===============
const Productos = React.lazy(() => import('./views/Productos/Productos'))
// ===============> CATEGORIA <===============
const Categoria = React.lazy(() => import('./views/Categoria/Categoria'))
// ===============> PROVEEDOR <===============
const Proveedor = React.lazy(() => import('./views/Proveedor/Proveedor'))
const Mapa = React.lazy(() => import('./views/Mapas/Mapa'))
// ===============> TICKET <===============
const Ticket = React.lazy(() => import('./views/Tickets/Ticket'))
const Almacen = React.lazy(() => import('./views/Tickets/Almacen'))
// ===============> USUARIO <===============
const Usuario = React.lazy(() => import('./views/Usuarios/Usuarios'))
const Permisos = React.lazy(() => import('./views/Usuarios/Permisos'))
const Roles = React.lazy(() => import('./views/Usuarios/Roles'))
//==================================================================================================================================

const routes = [
  //{ path: '/', exact: true, name: 'Home' },
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element:Dashboard },
  //-------------------------- CATALOGOS ------------------------------------------------
  //---------------------------> PRODUCTOS <---------------------------------------------
  { path: '/productos', name: 'Productos', element:Productos },
  //---------------------------> CATEGORIA <---------------------------------------------
  { path: '/categorias', name: 'Categoria', element:Categoria },
  //---------------------------> PROVEEDOR <---------------------------------------------
  { path: '/proveedores', name: 'Proveedor', element:Proveedor },
  { path: '/mapa', name: 'Mapa', element:Mapa },
  //---------------------------> TICKETS <-----------------------------------------------
  { path: '/ticket', name: 'Ticket', element:Ticket },
  { path: '/almacen', name: 'Almacen', element:Almacen },
  //---------------------------> USUARIOS <----------------------------------------------
  { path: '/usuarios', name: 'Usuarios', element:Usuario },
  { path: '/roles', name: 'Roles', element:Roles },
  { path: '/permisos', name: 'Permisos', element:Permisos },
  //------------------------------> ***** <----------------------------------------------
]

export default routes
