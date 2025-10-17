import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Propiedad } from '../../models/propiedades/propiedad.models';
import { PropiedadesService } from '../../services/propiedades/propiedades.service';
import { CommonModule } from '@angular/common';
import { animateOnScroll } from '../../shared/utils/animations';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faPen, faTrash, faHome } from '@fortawesome/free-solid-svg-icons';
import { PropiedadesMenuModalComponent } from '../../components/propiedades-menu-modal/propiedades-menu-modal.component';

@Component({
  selector: 'app-propiedades-menu',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, PropiedadesMenuModalComponent],
  templateUrl: './propiedades-menu.component.html',
  styleUrls: ['./propiedades-menu.component.scss']
})
export class PropiedadesMenuComponent implements OnInit, AfterViewInit {
  propiedades: Propiedad[] = [];
  cargando = true;
  modalAbierta = false; // controla si el modal se muestra o no
  propiedadSeleccionada: Propiedad = new Propiedad();
  esEdicion = false;

  constructor(library: FaIconLibrary, private el: ElementRef, private propiedadesService: PropiedadesService) {
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

  GuardarPropiedad(prop: Propiedad) {
    if (this.propiedadSeleccionada) {
      // editar
      const index = this.propiedades.findIndex(p => p.id === prop.id);
      if (index > -1) this.propiedades[index] = prop;
    } else {
      // nueva
      prop.id = this.propiedades.length + 1; // o el ID que venga de backend
      this.propiedades.push(prop);
    }
    this.modalAbierta = false;
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

