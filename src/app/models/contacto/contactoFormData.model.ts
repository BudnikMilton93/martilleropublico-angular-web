export interface ContactoFormData extends Record<string, unknown> {
  name: string;
  email: string;
  phone?: string;
  localidad: string;
  message: string;
  time: string;
}