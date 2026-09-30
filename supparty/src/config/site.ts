// src/config/site.ts
// ⭐ Datos editables del sitio: links de la navbar, columnas del footer, contacto y redes.
// Cuando tengan los datos reales, solo se cambia este archivo.
import {
  IconBrandFacebook, IconBrandInstagram, IconBrandTiktok, IconBrandX,
} from '@tabler/icons-react';

export const siteConfig = {
  name: 'Supparty',
  legalName: 'Grupo Supparty',

  // Contacto (valores simulados del Figma)
  contact: {
    phoneLabel: 'México +52 55 1234 5678',
    phone: '+525512345678',
    email: 'hola@supparty.com.mx',
  },

  // Redes sociales: mientras `href` esté vacío el ícono se muestra sin link.
  // TODO: poner las URLs reales, ej. 'https://instagram.com/supparty'
  socials: [
    { name: 'Instagram', icon: IconBrandInstagram, href: '' },
    { name: 'Facebook', icon: IconBrandFacebook, href: '' },
    { name: 'TikTok', icon: IconBrandTiktok, href: '' },
    { name: 'X', icon: IconBrandX, href: '' },
  ],

  // Links de la franja superior de la navbar
  topLinks: [
    { label: 'Cómo funciona', href: '/como-funciona' },
    { label: 'Facturación', href: '/facturacion' },
    { label: 'Ayuda', href: '/ayuda' },
  ],

  // Categorías de la navbar (círculos). "Categorías" funciona como el Catálogo.
  categories: [
    { key: 'catalogo', label: 'Categorías', href: '/categorias' },
    { key: 'ofertas', label: 'Ofertas', href: '/ofertas' },
    { key: 'mobiliario', label: 'Mobiliario', href: '/mobiliario' },
    { key: 'juegos', label: 'Juegos', href: '/juegos' },
    { key: 'salones', label: 'Salones', href: '/salones' },
    { key: 'experiencias', label: 'Experiencias', href: '/experiencias' },
  ],

  // Columnas del footer
  footerColumns: [
    {
      title: 'Servicio al cliente',
      links: [
        { label: 'Ayuda', href: '/ayuda' },
        { label: 'Facturación electrónica', href: '/facturacion' },
        { label: 'Consultar reservación', href: '/reservaciones' },
        { label: 'Modificar reservación', href: '/reservaciones' },
        { label: 'Cancelar reservación', href: '/reservaciones' },
      ],
    },
    {
      title: 'Información útil',
      links: [
        { label: 'Nuestra historia', href: '/nosotros' },
        { label: 'Sala de prensa', href: '/prensa' },
        { label: 'Revista', href: '/revista' },
        { label: 'Términos de uso', href: '/terminos' },
        { label: 'Política de privacidad', href: '/privacidad' },
        { label: 'Política de cookies', href: '/cookies' },
      ],
    },
    {
      title: 'Suppartners',
      links: [
        { label: 'Registrarse', href: '/suppartners' },
        { label: 'Perfil Suppartner', href: '/suppartners' },
      ],
    },
  ],
} as const;
