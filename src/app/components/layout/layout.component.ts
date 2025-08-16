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

  faPhone = faPhone;
  faWhatsapp = faWhatsapp;
  faMapMarkerAlt = faMapMarkerAlt;
  faEnvelope = faEnvelope;

  constructor(library: FaIconLibrary) {
    library.addIcons(faPhone, faWhatsapp, faMapMarkerAlt, faEnvelope);
  }

  mobileMenuOpen = false;

  toggleMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50; // cuando bajes 50px, achica
  }
}
