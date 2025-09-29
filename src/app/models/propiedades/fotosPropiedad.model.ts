export class FotoPropiedad {
  id!: number;
  url!: string;
  descripcion?: string;

  constructor(init?: Partial<FotoPropiedad>) {
    Object.assign(this, init);
  }

}