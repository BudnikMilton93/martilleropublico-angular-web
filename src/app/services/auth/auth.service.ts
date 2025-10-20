import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiService } from '../api/api.service';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private endpoint = 'auth'; // endpoint del AuthController
    private inactivityTimeout: any;

    constructor(private api: ApiService) { }

    startInactivityTimer(): void {
        this.resetInactivityTimer();
        window.addEventListener('mousemove', () => this.resetInactivityTimer());
        window.addEventListener('click', () => this.resetInactivityTimer());
        window.addEventListener('keydown', () => this.resetInactivityTimer());
    }

    resetInactivityTimer(): void {
        // Cancela cualquier temporizador anterior (por si el usuario mueve el mouse o hace click)
        clearTimeout(this.inactivityTimeout);

        // Crea un nuevo temporizador que se ejecutará dentro de 10 minutos
        this.inactivityTimeout = setTimeout(() => {
            // Si pasan 10 minutos sin actividad, ejecuta esto:
            this.logout(); // borra el token y limpia el estado de autenticación
            window.location.href = '/login'; // redirige al login
        }, 10 * 60 * 1000); // 10 minutos en milisegundos

    }

    /**
     * Hace login con email y contraseña
     * Almacena el token en localStorage para uso posterior
     */
    login(email: string, password: string): Observable<any> {
        return this.api.post<any>(`${this.endpoint}/login`, { email, password }).pipe(
            tap((res: any) => {
                const decoded = this.decodeToken(res.token);
                const exp = decoded?.exp ? decoded.exp * 1000 : Date.now() + 3600000; // fallback 1h

                localStorage.setItem('token', res.token);
                localStorage.setItem('tokenExp', exp.toString());
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
        localStorage.removeItem('tokenExp');
        localStorage.removeItem('perfil');
    }


    /**
     * Devuelve true si el usuario está logueado
     */
    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }


    decodeToken(token: string): any {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch {
            return null;
        }
    }

    isTokenExpired(): boolean {
        const exp = localStorage.getItem('tokenExp');
        if (!exp) return true;
        return Date.now() > parseInt(exp, 10);
    }
}
