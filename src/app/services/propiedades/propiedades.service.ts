// src/app/services/propiedades.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Propiedad } from '../../models/propiedades/propiedad.models';
import { ApiService } from '../api/api.service';
import { TipoPropiedad } from '../../models/propiedades/tipoPropiedad';
import { CiudadConBarrios } from '../../models/propiedades/localidades.model';

@Injectable({
  providedIn: 'root'
})
export class PropiedadesService {
  private endpoint = 'propiedades'; // endpoint del PropiedadesController

  constructor(private api: ApiService) {}

  getPropiedades(): Observable<Propiedad[]> {
    return this.api.get<Propiedad[]>(`${this.endpoint}/obtenerPropiedades`);
  }

  getTiposPropiedad(): Observable<TipoPropiedad[]> {
    return this.api.get<TipoPropiedad[]>(`${this.endpoint}/obtenerTiposPropiedad`);
  }

  getLocalidades(): Observable<CiudadConBarrios[]> {
    return this.api.get<CiudadConBarrios[]>(`${this.endpoint}/obtenerLocalidades`);
  }

  guardarPropiedad(formData: FormData): Observable<any> {
    return this.api.postFormData(`${this.endpoint}/guardarPropiedad`, formData);
  }

}
