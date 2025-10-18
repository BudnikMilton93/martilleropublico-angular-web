import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCheckCircle, faExclamationCircle, faInfoCircle, IconName, IconPrefix } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
  @Input() mensaje: string = '';
  @Input() tipo: 'exito' | 'error' | 'info' | 'confirm' = 'exito';
  @Input() visible: boolean = false;         // control de visibilidad
  @Output() aceptar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();
  

  constructor(library: FaIconLibrary) {
    library.addIcons(faCheckCircle, faExclamationCircle, faInfoCircle);
  }

  get clases() {
    switch(this.tipo) {
      case 'exito': return 'bg-green-100 border border-green-400 text-green-800';
      case 'error': return 'bg-red-100 border border-red-400 text-red-800';
      case 'info':  return 'bg-blue-100 border border-blue-400 text-blue-800';
      case 'confirm': return 'bg-yellow-100 border border-yellow-400 text-yellow-800';
      default: return '';
    }
  }

  get icon(): [IconPrefix, IconName] {
    switch (this.tipo) {
      case 'exito': return ['fas', 'check-circle'];
      case 'error': return ['fas', 'exclamation-circle'];
      case 'info': return ['fas', 'info-circle'];
      case 'confirm': return ['fas', 'exclamation-circle'];
      default: return ['fas', 'info-circle'];
    }
  }

  cerrar() {
    this.visible = false;
  }

  confirmar() {
    this.aceptar.emit();
    this.cerrar();
  }

  cancelarConfirm() {
    this.cancelar.emit();
    this.cerrar();
  }
}
