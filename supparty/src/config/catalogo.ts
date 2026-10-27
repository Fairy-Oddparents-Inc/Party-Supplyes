// Opciones de los filtros del catálogo (según Figma). `term` es el texto que se busca en categoría/título.
export const TIPOS_MOBILIARIO = [
  { key: 'mesas', label: 'Mesas', term: 'mesa' },
  { key: 'sillas', label: 'Sillas', term: 'silla' },
  { key: 'carpa', label: 'Carpa', term: 'carpa' },
  { key: 'lounge', label: 'Salas Lounge', term: 'lounge' },
  { key: 'barras', label: 'Barras y estaciones', term: 'barra' },
  { key: 'inflables', label: 'Inflables', term: 'inflable' },
] as const;

export const CAPACIDADES = ['Hasta 20 personas', '21 a 40 personas', '41 a 60 personas', '61 a 80 personas', '81 a 100+ personas'];

export const SERVICIOS = ['Entrega incluida', 'Montaje incluido', 'Desmontaje incluido'];

export const PRECIO_MIN = 100;
export const PRECIO_MAX = 30000;
export const POR_PAGINA = 9;
