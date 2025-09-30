import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { ServiciosComponent } from './components/servicios/servicios.component';
import { PropiedadesComponent } from './components/propiedades/propiedades.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './components/login/login.component';
import { PropiedadesMenuComponent } from './components/propiedades-menu/propiedades-menu.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'servicios', component: ServiciosComponent },
  { path: 'propiedades', component: PropiedadesComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'layout', component: LayoutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'menu', component: PropiedadesMenuComponent },
  { path: '**', redirectTo: '' }
];
