import React, { createContext, useState, useEffect } from 'react'
import Cookies from 'universal-cookie'
import { Rol } from '../Utilidades/Roles' // Asegúrate de tener este archivo
import {
  cilCursor,
  cilFilter,
  cilCalendarCheck,
  cilWallet,
  cilUser,
  cilCalculator,
  cilCalendar,
  cilCheck,
  cilGlobeAlt,
  cilGraph,
  cilSearch,
  cilCode,
  cilStar,
  cilClipboard,
  cilCog,
  cilBusAlt,
  cilGarage,
  cilBadge,
  cilBan,
  cilPeople,
  cilPlaylistAdd,
  cilBlur,
  cilCameraRoll,
  cilCc,
  cilBook,
  cilMap,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import CIcon from '@coreui/icons-react'

const cookies = new Cookies()

const NavContext = createContext()

const NavProvider = ({ children }) => {
  const [roles, setRoles] = useState([])
  const [navigation, setNavigation] = useState([])

  useEffect(() => {
    // Obtener roles del cookie y actualizar el estado
    const userRoles = cookies.get('roles') || []
    setRoles(userRoles)

    // Actualizar la navegación según los roles
    let nav = []
    const userIsAdmin = Rol('Admin')
    nav = [
      ...(userIsAdmin
        ? [
            {
              component: CNavTitle,
              name: 'Mesa de Ayuda',
            },
          ]
        : []),
      ...(userIsAdmin
        ? [
            {
              component: CNavTitle,
              name: 'Puntos de Venta',
            },
          ]
        : []),
      ...(userIsAdmin
          ? [
              {
                component: CNavTitle,
                name: 'CheckIn',
              },
            ]
          : []),
      ...(userIsAdmin
          ? [
              {
                component: CNavTitle,
                name: 'Tickets',
              },
              ...(userIsAdmin
                ? [
                    {
                      component: CNavGroup,
                      name: 'Tickets',
                      to: '/theme/admin',
                      icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
                      items: [
                        {
                          component: CNavItem,
                          name: 'Tickets',
                          to: '/ticket',
                          icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
                        },
                        {
                          component: CNavItem,
                          name: 'Almacen',
                          to: '/almacen',
                          icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
                        },
                      ],
                    },
                  ]
                : []),
            ]
          : []),
        ...(userIsAdmin
          ? [
              {
                component: CNavTitle,
                name: 'Catalogos',
              },
              ...(userIsAdmin
                ? [
                    {
                      component: CNavGroup,
                      name: 'Catalogos',
                      to: '/theme/admin',
                      icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
                      items: [
                        {
                          component: CNavItem,
                          name: 'Categoria',
                          to: '/categorias',
                          icon: <CIcon icon={cilCc} customClassName="nav-icon" />,
                        },
                        {
                          component: CNavItem,
                          name: 'Proveedor',
                          to: '/proveedores',
                          icon: <CIcon icon={cilBlur} customClassName="nav-icon" />,
                        },
                        {
                          component: CNavItem,
                          name: 'Mapa',
                          to: '/mapa',
                          icon: <CIcon icon={cilMap} customClassName="nav-icon" />,
                        },
                        {
                          component: CNavItem,
                          name: 'Producto',
                          to: '/productos',
                          icon: <CIcon icon={cilCameraRoll} customClassName="nav-icon" />,
                        },
                      ],
                    },
                  ]
                : []),
            ]
          : []),
          ...(userIsAdmin
            ? [
                {
                  component: CNavTitle,
                  name: 'Usuarios',
                },
                ...(userIsAdmin
                  ? [
                      {
                        component: CNavGroup,
                        name: 'Administración',
                        to: '/theme/admin',
                        icon: <CIcon icon={cilPlaylistAdd} customClassName="nav-icon" />,
                        items: [
                          {
                            component: CNavItem,
                            name: 'Usuario',
                            to: '/usuarios',
                            icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
                          },
                          {
                            component: CNavItem,
                            name: 'Roles',
                            to: '/roles',
                            icon: <CIcon icon={cilBadge} customClassName="nav-icon" />,
                          },
                          {
                            component: CNavItem,
                            name: 'Permisos',
                            to: '/permisos',
                            icon: <CIcon icon={cilBan} customClassName="nav-icon" />,
                          },
                        ],
                      },
                    ]
                  : []),
              ]
            : []),
          ...(userIsAdmin
            ? [
                {
                  component: CNavTitle,
                  name: 'Reportes',
                },
                ...(userIsAdmin
                  ? [
                      {
                        component: CNavGroup,
                        name: 'Almacen',
                        to: '/theme/admin',
                        icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
                        items: [
                          {
                            component: CNavItem,
                            name: 'Crear Producto',
                            to: '/dashboard',
                            icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
                          },
                        ],
                      },
                    ]
                  : []),
              ]
            : []),
    ]

    setNavigation(nav)
  }, []) // Solo se ejecuta cuando el componente se monta

  return <NavContext.Provider value={{ roles, navigation }}>{children}</NavContext.Provider>
}

export { NavContext, NavProvider }
