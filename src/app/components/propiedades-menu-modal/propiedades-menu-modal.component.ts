import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Propiedad } from '../../models/propiedades/propiedad.models';
import { PropiedadesService } from '../../services/propiedades/propiedades.service';
import { TipoPropiedad } from '../../models/propiedades/tipoPropiedad';
import { Barrio, CiudadConBarrios } from '../../models/propiedades/localidades.model';

@Component({
  selector: 'app-propiedades-menu-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './propiedades-menu-modal.component.html',
  styleUrls: ['./propiedades-menu-modal.component.scss']
})

export class PropiedadesMenuModalComponent implements OnInit {
  @Input() propiedadSeleccionada!: Propiedad;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<Propiedad>();
  @ViewChild('toastError') toastError!: ElementRef;
  @ViewChild('toastExito') toastExito!: ElementRef;

  // --- Propiedades ---
  tiposPropiedad: TipoPropiedad[] = [];
  fotos: File[] = [];               // Archivos comprimidos listos para subir
  fotosPreview: string[] = [];      // Miniaturas base64 para mostrar
  MAX_FOTOS = 7;                    // Límite máximo de imágenes
  MAX_WIDTH = 1024;                 // Ancho máximo permitido
  MINIATURA_WIDTH = 200;            // Tamaño miniatura
  JPEG_QUALITY = 0.8;               // Compresión JPEG
  mensajeError: string = '';
  mensajeExito: string = '';

  // Lista de ciudades con sus barrios
  ciudadesConBarrios: CiudadConBarrios[] = [];

  // Barrios filtrados según la ciudad seleccionada
  barriosFiltrados: Barrio[] = [];

  constructor(private propiedadesService: PropiedadesService, private cdr: ChangeDetectorRef) {
  }

  get maxFotosAlcanzado(): boolean {
    return this.fotos.length >= this.MAX_FOTOS;
  }

  //#region "Eventos"
  ngOnInit(): void {
    try {
      this.ObtenerTiposPropiedad();
      this.ObtenerCiudadesYBarrios();
    } catch (error) {
      throw error;
    }
  }

  onCerrar(): void {
    this.LimpiarPropiedad();
    this.cerrar.emit();
  }

  onGuardar(): void {
    try {
      if (!this.SePuedeGuardar()) {
        // Si hay errores, no cierres el modal
        return;
      }    
    } catch (error) {
      console.error(error);
    }
  }
  //#endregion 


  //#region "Procedimientos"

  SeleccionarFotos(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const archivos = Array.from(input.files);

    archivos.forEach(file => {
      if (this.fotos.length >= this.MAX_FOTOS) return;
      this.ProcesarImagen(file);
    });

    input.value = '';
  }

  QuitarFoto(index: number): void {
    this.fotos.splice(index, 1);
    this.fotosPreview.splice(index, 1);
  }

  private ProcesarImagen(file: File): void {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result as string;
      if (!result) return;

      const img = new Image();
      img.src = result;

      img.onload = () => {
        // Escalar imagen principal
        const scale = Math.min(1, this.MAX_WIDTH / img.width); // nunca agrandar
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convertir a Blob comprimido (JPEG)
        canvas.toBlob(
          blob => {
            if (!blob) return;

            // Crear archivo comprimido listo para guardar
            const fileProcesado = new File([blob], file.name, { type: 'image/jpeg' });
            this.fotos.push(fileProcesado);

            // Crear miniatura para mostrar en pantalla
            this.GenerarMiniatura(img);

            // Forzar actualización del template
            this.cdr.detectChanges();
          },
          'image/jpeg',
          this.JPEG_QUALITY
        );
      };
    };

    reader.readAsDataURL(file);
  }

  private GenerarMiniatura(img: HTMLImageElement): void {
    const canvasMini = document.createElement('canvas');
    const scaleMini = this.MINIATURA_WIDTH / img.width;

    canvasMini.width = this.MINIATURA_WIDTH;
    canvasMini.height = img.height * scaleMini;

    const ctxMini = canvasMini.getContext('2d');
    if (!ctxMini) return;

    ctxMini.drawImage(img, 0, 0, canvasMini.width, canvasMini.height);

    const urlMini = canvasMini.toDataURL('image/jpeg', this.JPEG_QUALITY);
    this.fotosPreview.push(urlMini);
  }

  private ObtenerTiposPropiedad() {
    this.propiedadesService.getTiposPropiedad().subscribe({
      next: (data) => {
        this.tiposPropiedad = data;
      },
      error: () => {
      }
    });
  }

  private ObtenerCiudadesYBarrios() {
    this.propiedadesService.getLocalidades().subscribe({
      next: (data: CiudadConBarrios[]) => {
        this.ciudadesConBarrios = data;
        if (this.propiedadSeleccionada.ciudad) {
          this.FiltrarBarrios(this.propiedadSeleccionada.ciudad);
        }
      },
      error: () => {
        console.error('Error al obtener ciudades y barrios');
      }
    });
  }

  FiltrarBarrios(ciudad: string) {
    const ciudadObj = this.ciudadesConBarrios.find(c => c.ciudad === ciudad);
    this.barriosFiltrados = ciudadObj ? ciudadObj.barrios : [];
    // Limpiar barrio seleccionado si ya no pertenece a la ciudad
    if (!this.barriosFiltrados.some(b => b.nombre === this.propiedadSeleccionada.barrioNombre)) {
      this.propiedadSeleccionada.barrioNombre = '';
    }
  }

  private SePuedeGuardar(): boolean {
    if (!this.propiedadSeleccionada) return false;

    // Validar primero los campos genéricos
    const erroresGenericos = this.ValidarCamposGenericos(this.propiedadSeleccionada);
    let errores: string[] = [...erroresGenericos];

    // Determinar tipo de propiedad y validar campos específicos
    const tipo = this.tiposPropiedad.find(t => t.tipoId === this.propiedadSeleccionada.tipoId)?.tipoId;
      
    switch (tipo) {
      case 1: // Casa
        errores = errores.concat(this.ValidarCamposCasa(this.propiedadSeleccionada));
        break;

      case 2: // Terreno
        errores = errores.concat(this.ValidarCamposTerreno(this.propiedadSeleccionada));
        break;

      case 3: // Vehículo
        errores = errores.concat(this.ValidarCamposVehiculo(this.propiedadSeleccionada));
        break;

      case 4: // Alquiler
        errores = errores.concat(this.ValidarCamposAlquiler(this.propiedadSeleccionada));
        break;
    }

    // Si hay errores, mostrar mensaje y hacer scroll
    if (errores.length > 0) {
      this.mensajeError = 'Faltan completar o corregir los siguientes campos: ' + errores.join(', ');
      this.mensajeExito = ''; // limpiar mensaje anterior, si había

      // Desplazar el modal hacia el mensaje de error
      setTimeout(() => {
        this.toastError?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);

      return false;
    }

    // Si no hay errores → éxito
    this.mensajeError = '';
    this.mensajeExito = 'Propiedad guardada correctamente!';
    
    // Scroll hacia el mensaje de éxito
    setTimeout(() => {
      this.toastExito?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);

    // Reiniciar el modal después de 2 segundos
    setTimeout(() => {
      this.LimpiarPropiedad();
    }, 2000);

    return true;
  }

  // Devuelve array de mensajes de error (vacío si todo OK)
  private ValidarCamposGenericos(prop: Propiedad): string[] {
    const errores: string[] = [];

    // Título y Subtítulo
    if (!prop.titulo?.trim()) errores.push('Título');
    if (!prop.subtitulo?.trim()) errores.push('Subtítulo');

    // Tipo de propiedad
    if (!prop.tipoId) errores.push('Tipo de propiedad');

    // Descripción
    if (!prop.descripcion?.trim()) errores.push('Descripción');

    // Ciudad, Barrio y Dirección (selects / inputs)
    if (!prop.ciudad) errores.push('Ciudad');
    if (!prop.barrioNombre) errores.push('Barrio');
    if (!prop.direccion?.trim()) errores.push('Dirección');

    // Fotos: puede venir del modelo o de los archivos cargados
    const tieneFotos =
      (prop.fotos && prop.fotos.length > 0) ||
      (this.fotos && this.fotos.length > 0) ||
      (this.fotosPreview && this.fotosPreview.length > 0);

    if (!tieneFotos) errores.push('Al menos una foto');

    return errores;
  }

  private ValidarCamposCasa(prop: Propiedad): string[] {
    const errores: string[] = [];

    // Habitaciones, Cocheras, Baños → enteros positivos
    const camposEnteros = [
      { campo: 'Habitaciones', valor: prop.habitaciones },
      { campo: 'Cocheras', valor: prop.cocheras },
      { campo: 'Baños', valor: prop.sanitario }
    ];

    camposEnteros.forEach(c => {
      if (c.valor === undefined || c.valor === null) {
        errores.push(`${c.campo}`);
      } else if (!Number.isInteger(Number(c.valor)) || Number(c.valor) < 0) {
        errores.push(`${c.campo} debe ser un número entero válido`);
      }
    });

    // Antigüedad → entero (años)
    if (prop.antiguedad === undefined || prop.antiguedad === null) {
      errores.push('Antigüedad');
    } else if (!Number.isInteger(Number(prop.antiguedad)) || Number(prop.antiguedad) < 0) {
      errores.push('Antigüedad debe ser un número entero válido');
    }

    // Superficie Construida y Terreno → decimales positivos
    const camposDecimales = [
      { campo: 'Superficie Construida (m²)', valor: prop.superficieConstruida },
      { campo: 'Superficie del Terreno (m²)', valor: prop.superficieTerreno }
    ];

    camposDecimales.forEach(c => {
      if (c.valor === undefined || c.valor === null) {
        errores.push(`${c.campo}`);
      } else if (isNaN(Number(c.valor)) || Number(c.valor) < 0) {
        errores.push(`${c.campo} debe ser un número válido`);
      }
    });

    return errores;
  }
  
  private ValidarCamposTerreno(prop: Propiedad): string[] {
    const errores: string[] = [];

    // Superficie Construida y Terreno → decimales positivos
    const camposDecimales = [
      { campo: 'Superficie del Terreno (m²)', valor: prop.superficieTerreno }
    ];

    camposDecimales.forEach(c => {
      if (c.valor === undefined || c.valor === null || isNaN(c.valor)) {
        errores.push(`${c.campo}`);
      } else if (isNaN(Number(c.valor)) || Number(c.valor) < 0) {
        errores.push(`${c.campo} debe ser un número válido`);
      }
    });

    return errores;
  }

  private ValidarCamposVehiculo(prop: Propiedad): string[] {
    const errores: string[] = [];

    // Marca, modelo y patente → obligatorios y texto válido
    const camposTexto = [
      { campo: 'Marca', valor: prop.marca },
      { campo: 'Modelo', valor: prop.modelo },
      { campo: 'Patente', valor: prop.patente }
    ];

    camposTexto.forEach(c => {
      if (!c.valor || c.valor.trim() === '') {
        errores.push(`${c.campo} es obligatorio`);
      }
    });

    // Fabricación y Kilometraje → deben ser números positivos
    const camposNumericos = [
      { campo: 'Año de Fabricación', valor: prop.fabricacion },
      { campo: 'Kilometraje', valor: prop.kilometraje }
    ];

    camposNumericos.forEach(c => {
      if (c.valor === undefined || c.valor === null) {
        errores.push(`${c.campo} es obligatorio`);
      } else if (isNaN(c.valor) || c.valor < 0) {
        errores.push(`${c.campo} debe ser un número válido`);
      }
    });

    // Validar que el año de fabricación tenga un rango razonable
    const anioActual = new Date().getFullYear();
    if (
      prop.fabricacion &&
      (prop.fabricacion < 1900 || prop.fabricacion > anioActual)
    ) {
      errores.push(`Año de Fabricación debe estar entre 1900 y ${anioActual}`);
    }

    return errores;
  }

  private ValidarCamposAlquiler(prop: Propiedad): string[] {
    const errores: string[] = [];

    // Superficie cubierta → número decimal positivo
    if (prop.superficieConstruida === undefined || prop.superficieConstruida === null) {
      errores.push('Superficie cubierta (m²) es obligatoria');
    } else if (isNaN(Number(prop.superficieConstruida)) || Number(prop.superficieConstruida) < 0) {
      errores.push('Superficie cubierta (m²) debe ser un número válido');
    }

    // Habitaciones y Sanitarios → números enteros positivos
    const camposEnteros = [
      { campo: 'Habitaciones', valor: prop.habitaciones },
      { campo: 'Sanitarios', valor: prop.sanitarios }
    ];

    camposEnteros.forEach(c => {
      if (c.valor === undefined || c.valor === null) {
        errores.push(`${c.campo} es obligatorio`);
      } else if (!Number.isInteger(c.valor) || c.valor < 0) {
        errores.push(`${c.campo} debe ser un número entero válido`);
      }
    });

    // Servicios incluidos → texto obligatorio
    if (!prop.serviciosIncluidos || prop.serviciosIncluidos.trim() === '') {
      errores.push('Servicios incluidos es obligatorio');
    }

    return errores;
  }

  private LimpiarPropiedad(): void {
    this.propiedadSeleccionada = new Propiedad({
      id: 0,
      tipoId: 0,
      barrioNombre: '',
      ciudad: '',
      provincia: '',
      barrioCompleto: '',
      titulo: '',
      subtitulo: '',
      descripcion: '',
      direccion: '',
      superficieTerreno: undefined,
      superficieConstruida: undefined,
      superficieResumen: '',
      antiguedad: undefined,
      habitaciones: undefined,
      sanitarios: undefined,
      cocheras: undefined,
      ambientesResumen: '',
      marca: '',
      modelo: '',
      fabricacion: undefined,
      kilometraje: undefined,
      patente: '',
      serviciosIncluidos: '',
      esDestacada: false,
      fotos: [],
      tags: []
    });

    this.mensajeError = '';
    this.mensajeExito = '';

    this.fotos = [];               
    this.fotosPreview = []; 
  }
 
  //#endregion

}