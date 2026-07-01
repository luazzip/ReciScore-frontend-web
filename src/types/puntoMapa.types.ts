export interface PuntoMapa {
  id: number;
  nombre: string;
  latitude: number;
  longitude: number;
  tipo: 'ACOPIO_OFICIAL' | 'ZONA_SUCIA';
  servicios?: Record<string, boolean>;
}

export interface ReporteZona {
  id: number;
  fecha: string;
  procesado: boolean;
  latitude: number;
  longitude: number;
  descripcion: string;
  username: string;
}

export interface NuevoReporteZonaRequest {
  latitude: number;
  longitude: number;
  descripcion: string;
}
