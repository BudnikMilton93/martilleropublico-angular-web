import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withInMemoryScrolling({ 
      scrollPositionRestoration: 'enabled', // Va al top al navegar
      anchorScrolling: 'enabled'           // Para anchors #id
    })),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
})
.catch(err => console.error(err));