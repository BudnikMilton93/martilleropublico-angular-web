import { Metrica } from '../../models/home/metricas.model';

export const METRICAS_MOCK: Metrica[] = [
  {
    valor: 50,
    titulo: 'Ventas Concretadas',
    icono: 'assets/images/home/referencias/casa.png',
    animacion: true,
    info: [
      'Más de 50 operaciones cerradas con clientes satisfechos.',
      'Procesos de compraventa ágiles y transparentes.',
      'Acompañamiento integral durante toda la operación.',
      'Red de contactos que facilita la concreción de negocios.'
    ]
  },
  {
    valor: 30,
    titulo: 'Tasaciones',
    icono: 'assets/images/home/referencias/tasacion.png',
    animacion: true,
    info: [
      'Tasaciones profesionales y actualizadas al mercado.',
      'Urbanas.',
      'Rurales.',
      'Vehiculares.'
    ]
  },
  {
    valor: 5,
    titulo: 'Localidades',
    icono: 'assets/images/home/referencias/localidades.png',
    animacion: true,
    info: [
      'Nuestros servicios llegan a las localidades de:',
      'Huingan Có',
      'Taquimilán',
      'Las Ovejas',
      'Andacollo'
    ]
  },
  {
    valor: 25,
    titulo: 'Calculadora de Indexación',
    icono: 'assets/images/home/referencias/calculadora.png',
    animacion: false,
    info: [] // no aplica
  }
];