import { FotoPropiedad } from "./fotosPropiedad.model";

export class Propiedad {
  id!: number;
  tipoId!: number;
  barrioNombre!: string;
  idBarrio!: number;
  ciudad!: string;
  provincia!: string;
  barrioCompleto!: string;
  titulo!: string;
  subtitulo!: string;
  descripcion!: string;
  direccion!: string;
  direccionMaps!: string;
  fechaAlta!: Date;

  //  Datos específicos de inmuebles
  superficieTerreno!: number;
  terreno?: string;
  construida?: string;
  superficieConstruida!: number;
  superficieResumen!: string;
  vehiculoResumen!: string;
  alquilerResumen!: string;
  antiguedad?: number;
  habitaciones?: number;
  sanitarios?: number;
  cocheras?: number;
  ambientesResumen!: string;

  //  Datos específicos de vehículos
  marca?: string;
  modelo?: string;
  fabricacion?: number;
  kilometraje?: number;
  patente?: string;

   // Alquiler
  serviciosIncluidos?: string;

  //  Datos generales
  esDestacada!: boolean;
  fotos!: FotoPropiedad[];
  tags!: string[];

  constructor(init?: Partial<Propiedad>) {
    Object.assign(this, init);
  }

  //#region Getters "universales"
  get imagenes(): string[] {
  if (!this.fotos) return [];
  return this.fotos
    .map(f => f.rutaArchivo)   // tomar la URL directamente
    .filter(Boolean) as string[]; // eliminar undefined o null
}
  get ubicacion(): string {
    return `${this.direccion || ''} ${this.barrioCompleto || ''}, ${this.ciudad} - ${this.provincia}`;
  }

  get area(): string {
    return this.superficieResumen;
  }

  get sanitario(): number | undefined {
    return this.sanitarios;
  }

  //  Getter opcional para resumen de vehículo
  get resumenVehiculo(): string {
    if (this.marca && this.modelo) {
      const partes = [
        `${this.marca} ${this.modelo}`,
        this.fabricacion ? `(${this.fabricacion})` : "",
        this.kilometraje ? `- ${this.kilometraje.toLocaleString()} km` : ""
      ].filter(Boolean);
      return partes.join(" ");
    }
    return "";
  }
  //#endregion
}
