import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { AuthService } from './services/auth/auth.service';

declare let gtag: Function;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, LayoutComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    // Iniciar seguimiento de navegación (Google Analytics)
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'G-21ZNRDKBG8', {
          page_path: event.urlAfterRedirects
        });
      }
    });

    //  Si el usuario tiene sesión iniciada, activar el temporizador de inactividad
    if (this.authService.isLoggedIn()) {
      this.authService.startInactivityTimer();
    }
  }
}
