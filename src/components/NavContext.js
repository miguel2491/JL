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
              name: 'Tickets',
            },
            ...(userIsAdmin
              ? [
                  {
                    component: CNavGroup,
                    name: 'Crear Ticket',
                    to: '/theme/admin',
                    icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
                    items: [
                      {
                        component: CNavItem,
                        name: 'Cotizador',
                        to: '/dashboard',
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
                      name: 'Productos',
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
                    {
                      component: CNavGroup,
                      name: 'Proveedor',
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
