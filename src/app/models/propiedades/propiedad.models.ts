import { FotoPropiedad } from "./fotosPropiedad.model";

export class Propiedad {
  id!: number;
  tipoId!: number;
  barrioNombre!: string;
  ciudad!: string;
  provincia!: string;
  barrioCompleto!: string;
  titulo!: string;
  subtitulo!: string;
  descripcion?: string;
  direccion?: string;
  superficieTerreno?: number;
  superficieConstruida?: number;
  superficieResumen!: string;
  antiguedad?: number;
  habitaciones?: number;
  sanitarios?: number;
  cocheras?: number;
  ambientesResumen!: string;
  esDestacada!: boolean;
  fotos!: FotoPropiedad[];
  tags!: string[];
  constructor(init?: Partial<Propiedad>) {
    Object.assign(this, init);
  }

  //#region Getters "universales"
  get imagenes(): string[] {
    return this.fotos?.map(f => f.url) || [];
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
  //#endregion
}