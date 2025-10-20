import { AfterViewInit, Component, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { animateOnScroll } from '../../shared/utils/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private el = inject(ElementRef);

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngAfterViewInit(): void {
    try {
      this.ActivarAnimacion();
    } catch (error) {
      console.error('Error en animación:', error);
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.loginForm.disable();

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res: any) => {
        // Guardamos token y usuario
        localStorage.setItem('token', res.accessToken);
        localStorage.setItem('perfil', JSON.stringify(res.user));
        
        this.isLoading = false;
        this.loginForm.enable();
        this.router.navigate(['/menu']);
      },
      error: (err: any) => {
        console.error('Error en login:', err);
        this.errorMessage = err?.error?.message || 'Error al iniciar sesión';
        this.isLoading = false;
        this.loginForm.enable();
      }
    });
  }

  ActivarAnimacion() {
    const section = this.el.nativeElement.querySelector('#login-section');
    animateOnScroll(section);
  }
}
