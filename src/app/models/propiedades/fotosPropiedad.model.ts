export class FotoPropiedad {
 id?: number;
  url?: string; // Ruta completa o relativa al backend
  descripcion?: string;
  esPrincipal?: boolean;
  ordenVisualizacion?: number;
  file?: File; // Para cuando el usuario sube una foto nueva

  constructor(init?: Partial<FotoPropiedad>) {
    Object.assign(this, init);
  }

}