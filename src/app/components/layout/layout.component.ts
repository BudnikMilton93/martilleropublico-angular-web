import { Component, HostListener  } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faPhone, faMapMarkerAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, CommonModule, FontAwesomeModule],
  templateUrl: './layout.component.html',
   styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

  constructor(library: FaIconLibrary) {
    library.addIcons(faPhone, faWhatsapp, faMapMarkerAlt, faEnvelope);
  }

  //#region Variables
  faPhone = faPhone;
  faWhatsapp = faWhatsapp;
  faMapMarkerAlt = faMapMarkerAlt;
  faEnvelope = faEnvelope;
  mobileMenuOpen = false;
  isScrolled = false;
  //#endregion

  //#region Decoradores
  @HostListener('window:scroll', [])
    onWindowScroll() {
      this.isScrolled = window.scrollY > 50; // cuando bajes 50px, achica
    }
  //#endregion
    
  //#region Procedimientos
  toggleMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
  //#endregion

}
