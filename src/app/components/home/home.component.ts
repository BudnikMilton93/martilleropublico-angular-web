import { AfterViewInit, Component, NgZone, ElementRef, ViewChildren, QueryList, Inject, PLATFORM_ID, OnInit  } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { animateOnScroll } from '../../shared/utils/animations';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { IPropiedades } from '../propiedades/models/propiedades.models';
import { PROPIEDADES_MOCK } from '../propiedades/mock/propiedades.mock';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule], 
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements AfterViewInit, OnInit {

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private ngZone: NgZone, private router: Router, private el: ElementRef, library: FaIconLibrary) {
    // arrancamos el loop fuera de Angular
    this.ngZone.runOutsideAngular(() => this.EmpezarCarrusel());
    library.addIcons(faWhatsapp);
  }
  

  //#region Decoradores
  @ViewChildren('metric') metrics!: QueryList<ElementRef>;
  //#endregion

  //#region Eventos
  ngAfterViewInit(): void {
    try {
      this.IncremenarValores();
      this.ActivarAnimacion();
      this.EvitarSSR();
    } catch (error) {
      throw error;
    }
  }

  ngOnInit(): void {
    try {
      // Tomamos las primeras 3 propiedades como destacadas
    this.propiedadesDestacadas = PROPIEDADES_MOCK.slice(0, 3);
    } catch (error) {
      
    }
  }
  //#endregion

  //#region Variables
  images: string[] = [
    'assets/images/home/home.jpg',
    'assets/images/home/home1.jpg',
    'assets/images/home/home2.jpg'
  ];

  metricsData = [
    { label: 'Propiedades Vendidas', value: 50 },
    { label: 'Tasaciones', value: 30 },
    { label: 'Alquileres', value: 25 },
    { label: 'Localidades', value: 5 }
  ];

  propiedadesDestacadas: IPropiedades[] = [];
  currentImageIndex = 0;
  fadeOut = false;
  //#endregion
  
  //#region Procedimientos
  EmpezarCarrusel() {
    setTimeout(() => {
      this.ngZone.run(() => {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
      });
      this.EmpezarCarrusel();
    }, 5000);
  }

  IncremenarValores() {
  // Verifica que estamos en un navegador y que IntersectionObserver está disponible
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {

    // Crea un nuevo IntersectionObserver para detectar cuando los elementos entran en la vista
    const observer = new IntersectionObserver((entries, obs) => {

      // Itera sobre cada elemento observado
      entries.forEach(entry => {

        // Si el elemento está visible en la pantalla
        if (entry.isIntersecting) {

          // Obtiene el elemento HTML que está intersectando
          const el = entry.target as HTMLElement;

          // Obtiene el valor objetivo desde el atributo 'data-value' (o 0 si no existe)
          const value = parseInt(el.getAttribute('data-value') || '0', 10);

          // Inicializa el valor actual en 0
          let current = 0;

          // Intervalo que incrementa el número mostrado gradualmente
          const interval = setInterval(() => {
            current++; // Incrementa el número actual

            // Busca el <p> dentro del elemento para actualizar el número
            const numberEl = el.querySelector('p');
            if (numberEl) numberEl.textContent = current + '+'; // Muestra el número + símbolo

            // Cuando el número alcanza el valor objetivo, detiene el intervalo
            if (current >= value) clearInterval(interval);
          }, 30); // Incrementa cada 30 milisegundos

          // Deja de observar este elemento, ya que la animación se completó
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 }); // El callback se activa cuando el 30% del elemento es visible

    // Observa cada elemento que tenga referencia en this.metrics
    this.metrics.forEach(m => observer.observe(m.nativeElement));
  }
  }

  NavegarAServicios() {
    this.router.navigate(['/servicios']).then(() => {
      const el = document.getElementById('servicios-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  ActivarAnimacion() {
      const section = this.el.nativeElement.querySelector('#home-section');
      animateOnScroll(section);
  }

  EvitarSSR() {
    if (!isPlatformBrowser(this.platformId)) return; // evita SSR
    const section = this.el.nativeElement.querySelector('#servicios-section') as HTMLElement;
    if (section) animateOnScroll(section);
  }
  //#endregion

}