// src/app/services/propiedades.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Propiedad } from '../../models/propiedades/propiedad.models';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class PropiedadesService {
  private endpoint = 'propiedades'; // endpoint del PropiedadesController

  constructor(private api: ApiService) {}

  getPropiedades(): Observable<Propiedad[]> {
    return this.api.get<Propiedad[]>(`${this.endpoint}/obtenerPropiedades`);
  }

//   getPropiedadById(id: number): Observable<Propiedad> {
//     return this.http.get<Propiedad>(`${this.apiUrl}/${id}`);
//   }

//   crearPropiedad(propiedad: Propiedad): Observable<Propiedad> {
//     return this.http.post<Propiedad>(this.apiUrl, propiedad);
//   }

//   actualizarPropiedad(propiedad: Propiedad): Observable<void> {
//     return this.http.put<void>(`${this.apiUrl}/${propiedad.id}`, propiedad);
//   }

//   eliminarPropiedad(id: number): Observable<void> {
//     return this.http.delete<void>(`${this.apiUrl}/${id}`);
//   }
}
