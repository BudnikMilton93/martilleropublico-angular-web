import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { CommonModule } from '@angular/common';
import { EmailService } from '../../services/email/email.service';
import { ContactoFormData } from '../../models/contacto/contactoFormData.model';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { animateOnScroll } from '../../shared/utils/animations';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [FontAwesomeModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.scss'
})

export class ContactoComponent implements AfterViewInit, OnInit{
  contactForm!: FormGroup;
  errorDetalle: string | null = null;
  enviado = false;
  error = false;
  cargando = false;

  enviando = false;          // durante la request
  contador = 0;              // después de enviar (anti-spam)
  private cooldownTimer?: any;

  localidades = [
    { value: 'chos-malal', label: 'Chos Malal' },
    { value: 'andacollo', label: 'Andacollo' },
    { value: 'las-ovejas', label: 'Las Ovejas' },
    { value: 'manzano-amargo', label: 'Manzano Amargo' },
    { value: 'taquimilan', label: 'Taquimilán' },
    { value: 'huingan-co', label: 'Huingan Có' }
  ];

  constructor(private fb: FormBuilder, library: FaIconLibrary, private emailService: EmailService, private el: ElementRef) {
    library.addIcons(faWhatsapp, faPhone, faFacebookF);
  }

  ngAfterViewInit(): void {
    try {
      this.ActivarAnimacion();
    } catch (error) {
      throw error;
    }
  }

  ngOnInit(): void {
    try {
      this.initForm();
    } catch (error) {
      throw error;
    }
  }

  private initForm(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      localidad: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
      website: [''] // Honeypot
    });
  }

  ActivarAnimacion() {
    const section = this.el.nativeElement.querySelector('#contactanos-section');
    animateOnScroll(section);
  }

  // Método de envío del formulario
  onSubmit(): void {
    if (this.contactForm.value.website) {
      this.error = true;
      this.errorDetalle = 'Detectado como spam';
      return;
    }

    // Bloqueo por contador
    if (this.contador) return;

    if (!this.contactForm.valid) {
      this.error = true;
      this.errorDetalle = 'El formulario contiene errores. Revisa los campos.';
      return;
    }

    this.cargando = true;
    this.enviando = true;

    const formData: ContactoFormData = {
      name: this.contactForm.value.name,
      email: this.contactForm.value.email,
      phone: this.contactForm.value.phone || '',
      localidad: this.contactForm.value.localidad,
      message: this.contactForm.value.message,
      time: new Date().toLocaleString('es-AR')
    };

    this.emailService.sendEmail(formData).subscribe({
      next: () => {
        this.enviado = true;
        this.error = false;
        this.contactForm.reset();

        setTimeout(() => {
          this.enviado = false;
        }, 5000); // oculta el mensaje de exito en 5s
      },
      error: (err) => {
        this.error = true;
        this.errorDetalle = err?.text || 'Error desconocido al enviar el mensaje.';
        console.error('Error al enviar email:', err);
      },
      complete: () => {
        this.enviando = false;
        // activá el cooldown por 60s (ajustable)
        this.cooldownTimer(60);
      }
    });
  }
}
