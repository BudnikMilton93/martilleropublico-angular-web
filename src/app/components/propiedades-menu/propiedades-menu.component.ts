import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { Propiedad } from '../../models/propiedades/propiedad.models';
import { PropiedadesService } from '../../services/propiedades/propiedades.service';
import { CommonModule } from '@angular/common';
import { animateOnScroll } from '../../shared/utils/animations';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faPen, faTrash, faHome } from '@fortawesome/free-solid-svg-icons';
import { PropiedadesMenuModalComponent } from '../../components/propiedades-menu-modal/propiedades-menu-modal.component';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  selector: 'app-propiedades-menu',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, PropiedadesMenuModalComponent, ToastComponent],
  templateUrl: './propiedades-menu.component.html',
  styleUrls: ['./propiedades-menu.component.scss']
})
export class PropiedadesMenuComponent implements OnInit, AfterViewInit {
  propiedades: Propiedad[] = [];
  cargando = true;
  modalAbierta = false; // controla si el modal se muestra o no
  propiedadSeleccionada: Propiedad = new Propiedad();
  esEdicion = false;
  mensajeToast = '';
  tipoToast: 'exito' | 'error' | 'confirm' | 'info' = 'exito';
  toastAceptar?: () => void;
  toastCancelar?: () => void;
  toastVisible: boolean = false;
  eliminarPropiedadIdTemp: number | null = null;

  constructor(library: FaIconLibrary, private el: ElementRef, private propiedadesService: PropiedadesService, private cdr: ChangeDetectorRef) {
    library.addIcons(faPen, faTrash, faHome);
  }

  ngOnInit(): void {
    try {
      this.ObtenerPropiedades();
    } catch (error) {
      throw error;
    }
  }

  ngAfterViewInit(): void {
    try {
      this.ActivarAnimacion();
    } catch (error) {
      throw error;
    }
  }

  ActivarAnimacion() {
    const section = this.el.nativeElement.querySelector('#propiedadesMenu-section');
    animateOnScroll(section);
  }

  AbrirModalNueva() {
    this.modalAbierta = true;
    this.propiedadSeleccionada = new Propiedad();
    this.esEdicion = false;
  }

  AbrirModalEditar(propiedad: Propiedad): void {
    this.propiedadSeleccionada = JSON.parse(JSON.stringify(propiedad)); //  Copia profunda!
    this.esEdicion = true;
    this.modalAbierta = true;
  }

  onGuardarDesdeModal(esEdicion: boolean) {
    // Cerrar modal
    this.modalAbierta = false;

    if (esEdicion) {
      this.mostrarMensaje('¡Propiedad actualizada correctamente!', 'exito');
    } else {
      this.mostrarMensaje('¡Propiedad creada exitosamente!', 'exito');
    }

    this.ObtenerPropiedades();
  }

  mostrarMensaje(mensaje: string, tipo: 'exito' | 'error' | 'confirm' | 'info' = 'exito') {
    this.mensajeToast = mensaje;
    this.tipoToast = tipo;
    this.toastVisible = true;

    // Solo auto-cerrar si NO es de tipo confirm
    if (tipo !== 'confirm') {
      setTimeout(() => this.toastVisible = false, 3000);
    }
  }


  eliminarPropiedad(id: number) {
    console.log('Intentando eliminar propiedad ID:', id);
    this.eliminarPropiedadIdTemp = id;
    this.mostrarMensaje('¿Deseas eliminar esta propiedad?', 'confirm');
  }



  eliminarPropiedadConfirmada() {
    if (this.eliminarPropiedadIdTemp === null) {
      console.warn('No hay ID de propiedad para eliminar');
      return;
    }

    const idAEliminar = this.eliminarPropiedadIdTemp;
    console.log('Iniciando eliminación de propiedad ID:', idAEliminar);
    
    // PASO 1: Cerrar el toast de confirmación
    this.toastVisible = false;
    this.eliminarPropiedadIdTemp = null;

    setTimeout(() => {
      this.propiedadesService.eliminarPropiedad(idAEliminar).subscribe({
        next: () => {
          console.log(' Propiedad eliminada del servidor');
          this.propiedades = this.propiedades.filter(p => p.id !== idAEliminar);
          this.mostrarMensaje('Propiedad eliminada correctamente', 'exito');
        },
        error: (error) => {
          console.error(' Error al eliminar:', error);
          this.mostrarMensaje('Error al eliminar la propiedad', 'error');
        }
      });
    }, 200);
    
  }

  cancelarEliminacion() {
    console.log('Eliminación cancelada');
    this.toastVisible = false;
    this.eliminarPropiedadIdTemp = null;
  }

  ObtenerPropiedades() {
    this.propiedadesService.getPropiedades().subscribe({
      next: (data) => {
        this.propiedades = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

}

