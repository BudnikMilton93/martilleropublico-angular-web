import { ITarjetaData } from '../../models/tarjeta/tarjeta.model';

export interface IPropiedades extends ITarjetaData {
  ubicacion?: string;
  area?: string; // ej: "120 m²"
  habitaciones?: number;
  sanitario?: number;
}