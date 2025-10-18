import { AfterViewInit, Component, NgZone, ElementRef, ViewChildren, QueryList, Inject, PLATFORM_ID, OnInit, ViewChild, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { animateOnScroll } from '../../shared/utils/animations';
import { faWhatsapp, faFacebook  } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { CalculadoraComponent } from '../calculadora/calculadora.component';
import { METRICAS_MOCK } from '../../mocks/home/metricas.mock';
import { Metrica } from '../../models/home/metricas.model';
import { InformacionModalComponent } from '../informacion-modal/informacion-modal.component';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { Propiedad } from '../../models/propiedades/propiedad.models';
import { PropiedadesService } from '../../services/propiedades/propiedades.service';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, InformacionModalComponent, CalculadoraComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements AfterViewInit, OnInit {

  constructor(private propiedadesService: PropiedadesService, @Inject(PLATFORM_ID) private platformId: Object, private ngZone: NgZone, private router: Router, private el: ElementRef, library: FaIconLibrary) {
    // arrancamos el loop fuera de Angular
    this.ngZone.runOutsideAngular(() => this.EmpezarCarrusel());
    library.addIcons(faWhatsapp, faPhone, faFacebook );
  }

  //#region Decoradores
  @ViewChildren('metrica') metricas!: QueryList<ElementRef>;
  
  @ViewChild('contactSection') contactSection!: ElementRef<HTMLElement>;

  @HostListener('window:scroll')
  OnWindowScroll() {
    if (!this.contactSection) return;

    const rect = this.contactSection.nativeElement.getBoundingClientRect();
    
    // Si la sección está visible en viewport
    this.mostrarBotonFlotante = !(rect.top < window.innerHeight && rect.bottom >= 0);
  }  
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
      this.CargarImagenesCarrusel();
      this.cargarPropiedades();
    } catch (error) {
      throw error;
    }
  }

  OnMetricClick(metrica: { valor: number; titulo: string; icono: string; animacion: boolean; info: string[] }) {
    
    if (metrica.titulo === 'Calculadora de Indexación') {
      this.AbrirCalculadora();
      
    } else {
      this.selectedMetricTitle = metrica.titulo;
      this.selectedMetricInfo = metrica.info;
      this.showInfoModal = true;
    }
  }
  //#endregion

  //#region Variables
  images: string[] = [];
  metricasData: Metrica[] = METRICAS_MOCK;
  propiedades: Propiedad[] = [];
  selectedMetricInfo: string[] = [];
  
  currentImageIndex = 0;
  selectedMetricTitle = '';
  
  fadeOut = false;
  showInfoModal = false;
  showCalculadora = false;
  mostrarBotonFlotante = true;
  cargando = true;

  getResumen(propiedad: any): string {
  switch (propiedad.tipoId) {
    case 1:
      return `Superficie construida y del terreno: ${propiedad.superficieResumen ?? ''}`;
    case 2:
      return `Superficie total: ${propiedad.superficieResumen ?? ''}`;
    case 3:
      return propiedad.vehiculoResumen ?? '';
    case 4:
      return propiedad.alquilerResumen ?? '';
    default:
      return '';
  }
}
  //#endregion

  //#region Procedimientos
  CargarImagenesCarrusel() {
    fetch('assets/images/home/carrusel/carrusel.json')
    .then(res => res.json())
    .then(data => {
      this.images = data.images.map((img: string) => `assets/images/home/carrusel/${img}`);
    });
  }

  EmpezarCarrusel() {
    setTimeout(() => {
      this.ngZone.run(() => {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
      });
      this.EmpezarCarrusel();
    }, 5000);
  }

  IncremenarValores() {
    // Verificamos que estemos en un navegador (no en SSR) 
    // y que la API IntersectionObserver esté disponible.
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {

      // Creamos un observer que detecta cuando los elementos entran en pantalla
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {

          // Si el elemento está visible en el viewport
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;

            // Sólo animamos si el atributo data-animacion = true
            if (el.getAttribute('data-animacion') === 'true') {

              // Obtenemos el valor objetivo (número final a mostrar)
              const valor = parseInt(el.getAttribute('data-valor') || '0', 10);
              let current = 0; // valor inicial

              // Creamos una animación con setInterval que va incrementando el número
              const interval = setInterval(() => {
                current++; // incrementamos en 1

                // Buscamos dentro del elemento el span/p que mostrará el valor
                const numberEl = el.querySelector('.metrica-valor');
                if (numberEl) numberEl.textContent = current + '+'; // Actualizamos el texto

                // Cuando llegamos al valor final, detenemos el intervalo
                if (current >= valor) clearInterval(interval);

              }, 30); // cada 30ms actualiza el valor (≈33 fps)
            }

            // Dejamos de observar este elemento porque ya fue animado
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      // threshold: 0.3 → se dispara cuando al menos el 30% del elemento está visible

      // Asignamos el observer a cada métrica del template (QueryList de @ViewChildren)
      this.metricas.forEach(m => observer.observe(m.nativeElement));
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

  CloseModal() {
    this.showInfoModal = false;
    this.selectedMetricTitle = '';
    this.selectedMetricInfo = [];
  }

  cargarPropiedades(): void {
    this.cargando = true;
    this.propiedadesService.getPropiedades().subscribe({
      next: (data) => {
        this.propiedades = data
          .filter(p => p.esDestacada) // solo destacadas
          .sort((a, b) => new Date(b.fechaAlta).getTime() - new Date(a.fechaAlta).getTime()) // orden descendente
          .slice(0, 3); // solo las 3 últimas
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando propiedades', err);
        this.cargando = false;
      }
    });
  }

  AbrirCalculadora() { this.showCalculadora = true; }

  CerrarCalculadora() { this.showCalculadora = false; }
  //#endregion

}