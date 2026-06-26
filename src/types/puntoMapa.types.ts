export interface PuntoMapa {
  id: number;
  nombre: string;
  latitude: number;
  longitude: number;
  tipo: 'ACOPIO_OFICIAL' | 'ZONA_SUCIA';
}

export interface ReporteZona {
  id: number;
  fecha: string;
  procesado: boolean;
  latitude: number;
  longitude: number;
  descripcion: string;
}

export interface NuevoReporteZonaRequest {
  latitude: number;
  longitude: number;
  descripcion: string;
}
