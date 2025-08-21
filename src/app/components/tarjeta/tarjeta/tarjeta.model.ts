export interface ITarjetaData {
  id: string | number;
  titulo: string;         // Título principal (ej: "Casa en el centro")
  subtitulo?: string;     // Subtítulo opcional (ej: "3 ambientes")
  descripcion?: string;  // Breve descripción
  imagenes: string[];        // Imagenes 
  tags?: string[];       // Chips/categorías (ej: ["Venta", "Lote"])
  price?: number | string; // Si aplica (ej: "$120.000")
  extra?: any;           // Campo libre para datos adicionales según el contexto
}