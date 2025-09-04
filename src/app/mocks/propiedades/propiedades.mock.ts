import { IPropiedades } from '../../models/propiedades/propiedades.models';

export const PROPIEDADES_MOCK: IPropiedades[] = [
  {
    id: 1,
    titulo: 'Casa en venta situada en Chos Malal',
    subtitulo: '4 ambientes - 126,43 m²',
    descripcion: 'Hermosa y amplia casa en venta en Barrio Canalito, Chos Malal. La propiedad dispone de 2 habitaciones, living comedor luminoso, cocina funcional y un baño completo. Además, cuenta con garage, amplio patio verde y un cómodo quincho ideal para reuniones familiares.',
    imagenes: ['../../../../assets/images/propiedades/lasOvejas/propiedad-lasOvejas.jpg','../../../../assets/images/propiedades/lasOvejas/propiedad-lasOvejas-1.jpg','../../../../assets/images/propiedades/lasOvejas/propiedad-lasOvejas-2.jpg'],
    price: '',
    tags: ['Venta', 'Casa', 'Terreno amplio', 'Quincho', 'Garage', 'Patio'],
    ubicacion: 'Trocomán 851, Chos Malal - Neuquén.',
    area: '300,21 m²',
    habitaciones: 2,
    sanitario: 1
  }
];