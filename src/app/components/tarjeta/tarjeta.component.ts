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
  get imagenPrincipal(): string | null {
    return this.data?.fotos?.length ? this.data.fotos[0].url : null;
  }

  get subtitulo(): string {
    const ambientes = this.data.ambientesResumen || '';
    const superficie = this.data.superficieResumen || '';
    return ambientes && superficie ? `${ambientes} - ${superficie}` : ambientes || superficie;
  }
  //#endregion

  //#region Métodos
  openDetail() {
    this.detailRequested.emit(this.data);
  }
  //#endregion
}
