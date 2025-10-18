import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Propiedad } from '../../models/propiedades/propiedad.models'; // ajusta la ruta si es necesario

@Component({
  selector: 'app-tarjeta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tarjeta.component.html',
  styleUrls: ['./tarjeta.component.scss']
})
export class TarjetaComponent {
  //#region Inputs
  @Input() data!: Propiedad;
  //#endregion

  //#region Outputs
  @Output() detailRequested = new EventEmitter<Propiedad>();
  //#endregion

  //#region Getters
  get imagenPrincipal(): string {
  // Si hay fotos y la primera tiene rutaArchivo, la devuelve; sino devuelve una imagen por defecto o string vacío
  return this.data?.fotos?.[0]?.rutaArchivo ?? '';
}
  
  get subtitulo(): string {
    const tipoId = this.data.tipoId;
    const ambientes = this.data.ambientesResumen || '';
    const superficie = this.data.superficieResumen || '';
    const vehiculo = this.data.vehiculoResumen || '';
    const alquiler = this.data.alquilerResumen || '';

    switch (tipoId) {
      case 1: // Casa
        return ambientes && superficie
          ? `${ambientes} - ${superficie}`
          : ambientes || superficie;

      case 2: // Terreno
        return superficie || 'Terreno disponible';

      case 3: // Vehículo
        return vehiculo || 'Vehículo sin detalles';

      case 4: // Alquiler
        return alquiler && superficie
          ? `${alquiler} - ${superficie}`
          : alquiler || superficie;

      default:
        return 'Propiedad';
    }
  }
  //#endregion

  //#region Métodos
  openDetail() {
    this.detailRequested.emit(this.data);
  }
  //#endregion
}
