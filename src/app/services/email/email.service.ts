import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { ContactoFormData } from '../../models/contacto/contactoFormData.model';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private serviceId = 'service_lsddtyu';
  private templateId = 'template_gvp75f4';
  private publicKey = 'i9CapxDa0oVT2trKL'; //Public Key de EmailJS, no Secret

  constructor() {}

  sendEmail(formData: ContactoFormData): Observable<EmailJSResponseStatus> {
    return from(emailjs.send(this.serviceId, this.templateId, formData, this.publicKey));
  }
}