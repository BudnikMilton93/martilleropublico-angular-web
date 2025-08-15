import { Component } from '@angular/core';
import { RouterOutlet, RouterModule  } from '@angular/router';
import { routes } from './app.routes';
import { LayoutComponent } from './components/layout/layout.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';


const routing = RouterModule.forRoot(routes);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet, LayoutComponent],
  providers: [], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  
}
