import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { IclService } from '../../services/calculadora/icl.serivice';


@Component({
  selector: 'app-calculadora',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule],
  templateUrl: './calculadora.component.html',
  styleUrl: './calculadora.component.scss'
})
export class CalculadoraComponent {

  constructor(library: FaIconLibrary, private iclService: IclService) {
    library.addIcons(faXmark);
  }

  /** Control externo del modal */
  @Input() open: boolean = false;

  /** Evento de cierre para el padre */
  @Output() closed = new EventEmitter<void>();

  faXmark = faXmark;
  montoInicial: number = 0;
  fechaInicio: string = '';
  fechaCalculo: string = '';
  frecuencia: number = 12;
  indiceSeleccionado: string = 'ICL';
  resultado: number | null = null;

  frecuencias = [1, 3, 6, 12];
  indicesDisponibles = ['ICL', 'IPC', 'CASA PROPIA'];

  onClose() {
    this.closed.emit();
  }

  Calcular() {
    if (this.montoInicial <= 0 || !this.fechaInicio || !this.fechaCalculo) {
      this.resultado = null;
      return;
    }

    const inicio = new Date(this.fechaInicio);
    const fin = new Date(this.fechaCalculo);

    // Diferencia en meses
    const totalMeses =
      (fin.getFullYear() - inicio.getFullYear()) * 12 +
      (fin.getMonth() - inicio.getMonth());

    if (totalMeses <= 0) {
      this.resultado = null;
      return;
    }

    let monto = this.montoInicial;

    // Aplicamos la frecuencia en ciclos
    for (let i = 0; i < totalMeses; i += this.frecuencia) {
      const fechaBloqueInicio = new Date(inicio);
      fechaBloqueInicio.setMonth(fechaBloqueInicio.getMonth() + i);

      const fechaBloqueFin = new Date(inicio);
      fechaBloqueFin.setMonth(
        fechaBloqueFin.getMonth() + Math.min(i + this.frecuencia, totalMeses)
      );

      const indiceInicio = this.iclService.getIndiceByFecha(
        fechaBloqueInicio.toISOString().substring(0, 7)
      );
      const indiceFin = this.iclService.getIndiceByFecha(
        fechaBloqueFin.toISOString().substring(0, 7)
      );

      if (indiceInicio && indiceFin) {
        monto *= indiceFin.valor / indiceInicio.valor;
      }
    }

    this.resultado = monto;
  }
}
