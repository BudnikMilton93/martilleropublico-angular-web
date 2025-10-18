import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Propiedad } from '../../models/propiedades/propiedad.models';
import { PropiedadesService } from '../../services/propiedades/propiedades.service';
import { TipoPropiedad } from '../../models/propiedades/tipoPropiedad';
import { Barrio, CiudadConBarrios } from '../../models/propiedades/localidades.model';
import { FotoPropiedad } from '../../models/propiedades/fotosPropiedad.model';
import { faSave, faCancel } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-propiedades-menu-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './propiedades-menu-modal.component.html',
  styleUrls: ['./propiedades-menu-modal.component.scss']
})

export class PropiedadesMenuModalComponent implements OnInit, OnChanges {
  @Input() propiedadSeleccionada!: Propiedad;
  @Input() esEdicion = false;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<boolean>();
  @ViewChild('toastError') toastError!: ElementRef;

  // --- Propiedades ---
  public faSave = faSave;
  tiposPropiedad: TipoPropiedad[] = [];
  fotos: FotoPropiedad[] = [];               // Archivos nuevos listos para subir
  fotosPreview: string[] = [];               // Miniaturas base64 para preview de fotos NUEVAS
  fotosOriginales: FotoPropiedad[] = [];     //  COPIA del estado original (fotos guardadas)
  MAX_FOTOS = 7;
  MAX_WIDTH = 1024;
  MINIATURA_WIDTH = 200;
  JPEG_QUALITY = 0.8;
  mensajeError: string = '';
  mensajeExito: string = '';

  // Lista de ciudades con sus barrios
  ciudadesConBarrios: CiudadConBarrios[] = [];
  barriosFiltrados: Barrio[] = [];

  constructor(library: FaIconLibrary, private propiedadesService: PropiedadesService, private cdr: ChangeDetectorRef) { 
    library.addIcons(faSave, faCancel);
  }

  // Getter que calcula el total de fotos (existentes + nuevas)
  get totalFotos(): number {
    const fotosExistentes = this.propiedadSeleccionada?.fotos?.length || 0;
    const fotosNuevas = this.fotos.length;
    return fotosExistentes + fotosNuevas;
  }

  // Verifica si se alcanzó el máximo
  get maxFotosAlcanzado(): boolean {
    return this.totalFotos >= this.MAX_FOTOS;
  }

  // Combina fotos guardadas en S3 y fotos nuevas cargadas
  get fotosTotales(): string[] {
    const guardadas = (this.propiedadSeleccionada?.fotos || [])
      .map(f => f.rutaArchivo)
      .filter((r): r is string => !!r);

    return [...guardadas, ...this.fotosPreview];
  }

  //#region "Eventos"
  ngOnInit(): void {
    try {
      this.ObtenerTiposPropiedad();
      this.ObtenerCiudadesYBarrios();

      // Guardar copia del estado original de las fotos
      if (this.propiedadSeleccionada?.fotos) {
        this.fotosOriginales = JSON.parse(JSON.stringify(this.propiedadSeleccionada.fotos));
      }
    } catch (error) {
      throw error;
    }
  }

  // Se ejecuta cada vez que cambia el @Input() propiedadSeleccionada
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['propiedadSeleccionada'] && this.propiedadSeleccionada) {
      // Guardar copia del estado original de las fotos
      this.GuardarEstadoOriginal();
      
      // Limpiar fotos nuevas al abrir el modal
      this.fotos = [];
      this.fotosPreview = [];
    }
  }

  onCerrar(): void {
    //  Restaurar fotos originales al cancelar
    if (this.fotosOriginales.length > 0) {
      this.propiedadSeleccionada.fotos = JSON.parse(JSON.stringify(this.fotosOriginales));
    }

    this.LimpiarPropiedad();
    this.cerrar.emit();
  }

  onGuardar(): void {
    try {      
      if (!this.SePuedeGuardar()) {
        return;
      } else {
        this.GuardarPropiedad(this.propiedadSeleccionada);
      }
    } catch (error) {
      console.log(error);
      console.error('Error guardando la propiedad:', error);
      this.mensajeError = 'Ocurrió un error inesperado al guardar la propiedad.';
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.propiedadSeleccionada) {
      event.preventDefault();
      this.onCerrar();
    }
  }
  //#endregion 

  private GuardarEstadoOriginal(): void {
    if (this.propiedadSeleccionada?.fotos) {
      this.fotosOriginales = JSON.parse(JSON.stringify(this.propiedadSeleccionada.fotos));
    } else {
      this.fotosOriginales = [];
    }
  }

  //  Seleccionar fotos con validación correcta
  SeleccionarFotos(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const archivos = Array.from(input.files);

    //  Validar límite total (existentes + nuevas)
    if (this.totalFotos >= this.MAX_FOTOS) {
      this.mensajeError = `Ya alcanzaste el máximo de ${this.MAX_FOTOS} fotos permitidas.`;
      setTimeout(() => this.mensajeError = '', 3000);
      input.value = '';
      return;
    }

    //  Calcular cuántas fotos se pueden agregar
    const espacioDisponible = this.MAX_FOTOS - this.totalFotos;
    const archivosPermitidos = archivos.slice(0, espacioDisponible);

    // Si se intentaron cargar más de las permitidas, avisar
    if (archivos.length > espacioDisponible) {
      this.mensajeError = `Solo puedes agregar ${espacioDisponible} foto(s) más. Máximo: ${this.MAX_FOTOS} fotos.`;
      setTimeout(() => this.mensajeError = '', 3000);
    }

    archivosPermitidos.forEach(file => this.ProcesarImagen(file));
    input.value = '';
  }

  // Elimina una foto, ya sea de las guardadas o nuevas
  QuitarFoto(index: number): void {
    const guardadasCount = this.propiedadSeleccionada?.fotos?.length || 0;

    if (index < guardadasCount) {
      // Foto guardada en BD → eliminar de la lista
      this.propiedadSeleccionada!.fotos.splice(index, 1);
    } else {
      // Foto nueva (preview) → eliminar del array de nuevas
      const previewIndex = index - guardadasCount;
      this.fotosPreview.splice(previewIndex, 1);
      this.fotos.splice(previewIndex, 1);
    }
  }

  private ProcesarImagen(file: File): void {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result as string | null;
      if (!result) return;

      const img = new Image();
      img.src = result;

      img.onload = () => {
        // Escala máxima (no agrandar imágenes)
        const scale = Math.min(1, this.MAX_WIDTH / img.width);

        // Crear canvas proporcional
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Dibujar imagen escalada
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Generar blob comprimido
        canvas.toBlob(
          blob => {
            if (!blob) return;

            // Crear archivo comprimido JPEG
            const fileProcesado = new File([blob], file.name, { type: 'image/jpeg' });

            // Crear objeto FotoPropiedad
            const nuevaFoto = new FotoPropiedad({
              file: fileProcesado,
              rutaArchivo: '', // Se llenará al subir
              descripcion: '',
              esPrincipal: this.totalFotos === 0, // primera imagen = principal
              ordenVisualizacion: this.totalFotos + 1
            });

            this.fotos.push(nuevaFoto);

            // Generar miniatura para preview
            this.GenerarMiniatura(img);

            this.cdr.detectChanges();
          },
          'image/jpeg',
          this.JPEG_QUALITY
        );
      };

      img.onerror = () => console.error('Error al cargar la imagen');
    };

    reader.onerror = () => console.error('Error al leer el archivo');
    reader.readAsDataURL(file);
  }

  //Generar miniatura optimizada
  private GenerarMiniatura(img: HTMLImageElement): void {
    const scaleMini = Math.min(1, this.MINIATURA_WIDTH / img.width);

    const canvasMini = document.createElement('canvas');
    canvasMini.width = img.width * scaleMini;
    canvasMini.height = img.height * scaleMini;

    const ctxMini = canvasMini.getContext('2d');
    if (!ctxMini) return;

    ctxMini.drawImage(img, 0, 0, canvasMini.width, canvasMini.height);

    // Base64 de miniatura para preview
    const urlMini = canvasMini.toDataURL('image/jpeg', this.JPEG_QUALITY);
    this.fotosPreview.push(urlMini);
  }

  //#region "Procedimientos"

  private ObtenerTiposPropiedad() {
    this.propiedadesService.getTiposPropiedad().subscribe({
      next: (data) => {
        this.tiposPropiedad = data;
      },
      error: () => { }
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
    if (!this.barriosFiltrados.some(b => b.nombre === this.propiedadSeleccionada.barrioNombre)) {
      this.propiedadSeleccionada.barrioNombre = '';
      this.propiedadSeleccionada.idBarrio = this.propiedadSeleccionada.idBarrio;
    }
  }

  OnBarrioSeleccionado(barrioNombre: string) {
    const barrio = this.barriosFiltrados.find(b => b.nombre === barrioNombre);
    if (barrio) {
      this.propiedadSeleccionada.barrioNombre = barrio.nombre;
      this.propiedadSeleccionada.idBarrio = barrio.id_barrio;
    }
  }

  private SePuedeGuardar(): boolean {
    if (!this.propiedadSeleccionada) return false;

    const erroresGenericos = this.ValidarCamposGenericos(this.propiedadSeleccionada);
    let errores: string[] = [...erroresGenericos];

    const tipo = this.tiposPropiedad.find(t => t.tipoId === this.propiedadSeleccionada.tipoId)?.tipoId;

    switch (tipo) {
      case 1:
        errores = errores.concat(this.ValidarCamposCasa(this.propiedadSeleccionada));
        break;
      case 2:
        errores = errores.concat(this.ValidarCamposTerreno(this.propiedadSeleccionada));
        break;
      case 3:
        errores = errores.concat(this.ValidarCamposVehiculo(this.propiedadSeleccionada));
        break;
      case 4:
        errores = errores.concat(this.ValidarCamposAlquiler(this.propiedadSeleccionada));
        break;
    }

    if (errores.length > 0) {
      this.mensajeError = 'Faltan completar o corregir los siguientes campos: ' + errores.join(', ');
      this.mensajeExito = '';

      return false;
    }

    this.mensajeError = '';
    return true;
  }

  private ValidarCamposGenericos(prop: Propiedad): string[] {
    const errores: string[] = [];

    if (!prop.titulo?.trim()) errores.push('Título');
    if (!prop.subtitulo?.trim()) errores.push('Subtítulo');
    if (!prop.tipoId) errores.push('Tipo de propiedad');
    if (!prop.descripcion?.trim()) errores.push('Descripción');
    if (!prop.ciudad) errores.push('Ciudad');
    if (!prop.barrioNombre) errores.push('Barrio');
    if (!prop.direccion?.trim()) errores.push('Dirección');

    // Validar fotos totales
    const tieneFotos = this.totalFotos > 0;
    if (!tieneFotos) errores.push('Al menos una foto');

    return errores;
  }

  private ValidarCamposCasa(prop: Propiedad): string[] {
    const errores: string[] = [];

    const camposEnteros = [
      { campo: 'Habitaciones', valor: prop.habitaciones },
      { campo: 'Baños', valor: prop.sanitarios }
    ];

    camposEnteros.forEach(c => {
      if (c.valor === undefined || c.valor === null) {
        errores.push(`${c.campo}`);
      } else if (!Number.isInteger(Number(c.valor)) || Number(c.valor) <= 0) {
        errores.push(`${c.campo} debe ser un número entero válido`);
      }
    });

    if (prop.cocheras !== undefined && prop.cocheras !== null && prop.cocheras) {
      if (!Number.isInteger(Number(prop.cocheras)) || Number(prop.cocheras) < 0) {
        errores.push(`Cocheras debe ser un número entero válido`);
      }
    }

    if (prop.antiguedad === undefined || prop.antiguedad === null) {
      errores.push('Antigüedad');
    } else if (!Number.isInteger(Number(prop.antiguedad)) || Number(prop.antiguedad) < 0) {
      errores.push('Antigüedad debe ser un número entero válido');
    }

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

    if (prop.superficieConstruida === undefined || prop.superficieConstruida === null) {
      errores.push('Superficie cubierta (m²) es obligatoria');
    } else if (isNaN(Number(prop.superficieConstruida)) || Number(prop.superficieConstruida) < 0) {
      errores.push('Superficie cubierta (m²) debe ser un número válido');
    }

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
    this.fotosOriginales = [];
  }

  private PrepararPropiedad(propiedad: Propiedad, fotos: FotoPropiedad[]) {
    const formData = new FormData();

    if (propiedad.id && propiedad.id > 0) {
      formData.append('id', propiedad.id.toString());
    }

    formData.append('titulo', propiedad.titulo);
    formData.append('subtitulo', propiedad.subtitulo);
    formData.append('tipoId', propiedad.tipoId.toString());
    formData.append('descripcion', propiedad.descripcion);
    formData.append('idBarrio', propiedad.idBarrio.toString());
    formData.append('ciudad', propiedad.ciudad);
    formData.append('direccionMaps', propiedad.direccion);
    formData.append('esDestacada', propiedad.esDestacada.toString());

    propiedad.terreno = propiedad.superficieTerreno?.toString();
    propiedad.construida = propiedad.superficieConstruida?.toString();

    switch (propiedad.tipoId) {
      case 1:
        if (propiedad.habitaciones) formData.append('habitaciones', propiedad.habitaciones.toString());
        if (propiedad.cocheras) formData.append('cocheras', propiedad.cocheras.toString());
        if (propiedad.sanitarios) formData.append('sanitarios', propiedad.sanitarios.toString());
        if (propiedad.superficieConstruida) formData.append('superficieConstruida', propiedad.construida);
        if (propiedad.superficieTerreno) formData.append('superficieTerreno', propiedad.terreno);
        if (propiedad.antiguedad) formData.append('antiguedad', propiedad.antiguedad.toString());
        break;
      case 2:
        if (propiedad.superficieTerreno) formData.append('superficieTerreno', propiedad.terreno);
        break;
      case 3:
        if (propiedad.marca) formData.append('marca', propiedad.marca.toString());
        if (propiedad.modelo) formData.append('modelo', propiedad.modelo.toString());
        if (propiedad.fabricacion) formData.append('fabricacion', propiedad.fabricacion.toString());
        if (propiedad.kilometraje) formData.append('kilometraje', propiedad.kilometraje.toString());
        if (propiedad.patente) formData.append('patente', propiedad.patente.toString());
        break;
      case 4:
        if (propiedad.habitaciones) formData.append('habitaciones', propiedad.habitaciones.toString());
        if (propiedad.cocheras) formData.append('cocheras', propiedad.cocheras.toString());
        if (propiedad.sanitarios) formData.append('sanitarios', propiedad.sanitarios.toString());
        if (propiedad.serviciosIncluidos) formData.append('serviciosIncluidos', propiedad.serviciosIncluidos.toString());
        if (propiedad.superficieConstruida) formData.append('superficieConstruida', propiedad.construida);
    }

    const fotosDTO = fotos.map((f, i) => ({
      id: f.id || 0,
      descripcion: f.descripcion || '',
      ordenVisualizacion: i,
      esPrincipal: (f as any).esPrincipal || false,
    }));
    formData.append('fotos', JSON.stringify(fotosDTO));

    fotos.forEach(foto => {
      if ((foto as any).file instanceof File) {
        formData.append('archivos', (foto as any).file, (foto as any).file.name);
      }
    });

    return formData;
  }

  private GuardarPropiedad(propiedad: Propiedad) {
    const todasLasFotos = [
      ...(propiedad.fotos || []),  // Fotos que ya estaban guardadas
      ...this.fotos                // Fotos nuevas
    ];
    const formData = this.PrepararPropiedad(propiedad, todasLasFotos);
    
    if (propiedad.id > 0) {
      this.propiedadesService.actualizarPropiedad(formData).subscribe({
        next: () => {
          this.guardar.emit(true);
          setTimeout(() => this.LimpiarPropiedad(), 2000);
        },
        error: (err) => console.error('Error guardando propiedad', err)
      });
    } else {
      this.propiedadesService.guardarPropiedad(formData).subscribe({
        next: () => {
          this.guardar.emit(false);
          setTimeout(() => this.LimpiarPropiedad(), 2000);
        },
        error: (err) => console.error('Error guardando propiedad', err)
      });
    }
    
  }
  //#endregion
}