import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.urlBaseApi;

  constructor(private http: HttpClient) {}

  // GET genérico
  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, { params });
  }

  // POST genérico, con opción de JSON o x-www-form-urlencoded
  post<T>(endpoint: string, body: any, json: boolean = true): Observable<T> {
    const headers = json
      ? new HttpHeaders({ 'Content-Type': 'application/json' })
      : new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, { headers });
  }

  // PUT genérico
  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body);
  }

  // DELETE genérico
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }

  postFormData<T>(endpoint: string, body: any, json: boolean = true): Observable<T> {
  // Si el body es una instancia de FormData, no seteamos headers manualmente
  if (body instanceof FormData) {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body);
  }

  // Caso normal JSON o x-www-form-urlencoded
  const headers = json
    ? new HttpHeaders({ 'Content-Type': 'application/json' })
    : new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

  return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, { headers });
}
}
