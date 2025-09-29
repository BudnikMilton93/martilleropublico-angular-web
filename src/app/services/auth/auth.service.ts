import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiService } from '../api/api.service';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private endpoint = 'auth'; // endpoint del AuthController

    constructor(private api: ApiService) { }

    /**
     * Hace login con email y contraseña
     * Almacena el token en localStorage para uso posterior
     */
    login(email: string, password: string): Observable<any> {
        return this.api.post<any>(`${this.endpoint}/login`, { email, password }).pipe(
            tap(res => {
                if (res?.token) {
                    localStorage.setItem('token', res.token); // guardamos JWT
                }
            })
        );
    }


    /**
     * Obtiene el perfil del usuario logueado
     */
    perfil(): Observable<any> {
        return this.api.get<any>(`${this.endpoint}/perfil`);
    }


    /**
     * Logout: elimina token
     */
    logout() {
        localStorage.removeItem('token');
    }


    /**
     * Devuelve true si el usuario está logueado
     */
    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }
}
