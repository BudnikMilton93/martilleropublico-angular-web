export interface Barrio {
  id_barrio: number;
  nombre: string;
  ciudad: string;
  provincia: string;
  activo: boolean;
}

export interface CiudadConBarrios {
  ciudad: string;
  barrios: Barrio[];
}
