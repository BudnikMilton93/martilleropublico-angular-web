import { Component, AfterViewInit, ElementRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faSearch, faGavel, faCircleQuestion, faRulerCombined, faCheckCircle, faUser, faAward } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { animateOnScroll } from '../../shared/utils/animations';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.scss'
})

export class ServiciosComponent implements AfterViewInit {
  constructor(library: FaIconLibrary, private el: ElementRef) {
    library.addIcons(faSearch, faGavel, faCircleQuestion, faRulerCombined, faWhatsapp, faCheckCircle, faUser, faAward);
  }

  //#region Eventos
  ngAfterViewInit(): void {
    try {
      this.ActivarAnimacion();
    } catch (error) {
      throw error;
    }
  }
  //#endregion

  //#region Variables
  servicios = [
    { 
      title: 'Compra de propiedades', 
      description: 'Asesoramiento completo para adquirir inmuebles.',
      icon: faSearch
    },
    { 
      title: 'Venta de propiedades', 
      description: 'Gestión integral de ventas y remates.',
      icon: faGavel
    },
    { 
      title: 'Tasaciones', 
      description: 'Valoración profesional de inmuebles y terrenos.',
      icon: faRulerCombined
    },
    { 
      title: 'Asesoría legal', 
      description: 'Asistencia en documentación y contratos.',
      icon: faCircleQuestion
    }
  ];
  //#endregion

  //#region Procedimientos
  ActivarAnimacion() {
    const section = this.el.nativeElement.querySelector('#servicios-section');
    animateOnScroll(section);
  }
  //#endregion

}
