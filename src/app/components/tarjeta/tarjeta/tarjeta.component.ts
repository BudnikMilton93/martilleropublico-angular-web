import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ITarjetaData } from '../../../models/tarjeta/tarjeta.model';
import { IPropiedades } from '../../../models/propiedades/propiedades.models';

@Component({
  selector: 'app-tarjeta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tarjeta.component.html',
  styleUrl: './tarjeta.component.scss'
})

export class TarjetaComponent {
  //#region Inputs
  @Input() data: IPropiedades = {
    titulo: '',
    subtitulo: '',
    price: '',
    imagenes: [],
    tags: [],
    id: ''
  };
  //#endregion

  //#region Outputs
  @Output() detailRequested = new EventEmitter<ITarjetaData>();
  //#endregion

  //#region Getters
  get imagenPrincipal(): string | null {
    return this.data?.imagenes?.length ? this.data.imagenes[0] : null;
  }
  //#endregion

  //#region Métodos
  openDetail() {
    this.detailRequested.emit(this.data);
  }
  //#endregion

}
