import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faPhone, faMapMarkerAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, CommonModule, FontAwesomeModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(library: FaIconLibrary, private authService: AuthService, private router: Router) {
    library.addIcons(faPhone, faWhatsapp, faMapMarkerAlt, faEnvelope);
    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.usuarioLogueado();
    });
  }
  
  ngOnInit(): void {
    try {
      this.usuarioLogueado();
    } catch (error) {
      throw error;
    }
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  //#region Variables
  faPhone = faPhone;
  faWhatsapp = faWhatsapp;
  faMapMarkerAlt = faMapMarkerAlt;
  faEnvelope = faEnvelope;
  mobileMenuOpen = false;
  isScrolled = false;
  usuarioNombre = '';  
  userMenuOpen = false; 
  //#endregion

  //#region Decoradores
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50; // cuando bajes 50px, achica
  }
  //#endregion

  //#region Procedimientos
  logout(): void {
    this.authService.logout();
     this.usuarioNombre = '';
     this.userMenuOpen = false;
    this.router.navigate(['/login']);
  }

  toggleMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMenu() {
    this.mobileMenuOpen = false;
  }

  usuarioLogueado() {
    if (this.authService.isLoggedIn()) {
    // Suponiendo que tu perfil ya está en localStorage o lo podés obtener
    const perfil = JSON.parse(localStorage.getItem('perfil') || '{}');
    console.log(perfil);
    this.usuarioNombre = perfil.nombre ? `${perfil.nombre} ${perfil.apellido}` : '';
  }
  }
  //#endregion

}
