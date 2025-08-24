import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-informacion-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './informacion-modal.component.html',
  styleUrl: './informacion-modal.component.scss'
})
export class InformacionModalComponent {
  @Input() show = false;              // Controla visibilidad
  @Input() title = '';                // Título dinámico
  @Input() description: string[] = []; // Contenido dinámico como lista

  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
