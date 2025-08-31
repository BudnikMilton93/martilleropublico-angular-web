import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule  } from '@angular/router';
import { routes } from './app.routes';
import { LayoutComponent } from './components/layout/layout.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router, NavigationEnd } from '@angular/router';

declare let gtag: Function;
const routing = RouterModule.forRoot(routes);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet, LayoutComponent],
  providers: [], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent  implements OnInit{
  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'G-21ZNRDKBG8', {
          page_path: event.urlAfterRedirects
        });
      }
    });
  }
  
}
