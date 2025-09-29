import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})


export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  welcomeMessage = ''; // <-- variable para mostrar nombre y apellido

  constructor() {
    // Creamos el formulario reactivo
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }


  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.loginForm.disable();

    //Llamamos al login
    this.authService.login(email, password).subscribe({
      next: (res) => {
        // Si login correcto, llamamos al endpoint perfil para obtener nombre y apellido
        this.authService.perfil().subscribe({
          next: (perfil) => {
            this.isLoading = false;
            this.welcomeMessage = `¡Bienvenido ${perfil.nombre} ${perfil.apellido}!`;
            this.loginForm.enable();
            // Si querés redirigir después de X segundos:
            // setTimeout(() => this.router.navigate(['/home']), 2000);
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = 'Error al obtener perfil del usuario';
            this.loginForm.enable();
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        console.log(err)
        this.errorMessage = err?.error?.message || 'Error al iniciar sesión';
        this.loginForm.enable();
      }
    });
  }
}
