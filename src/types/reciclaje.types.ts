export type TamanoObjeto = 'PEQUENO' | 'MEDIANO' | 'GRANDE';

export interface RegistrarReciclajeRequest {
  materialId: number;
  fotoUrl: string;
  tamanoObjeto: TamanoObjeto;
  numeroArticulos: number;
  latitud: number;
  longitud: number;
}

export interface ReporteReciclaje {
  numeroReporte: number;
  userId: number;
  userName: string;
  materialNombre: string;
  materialCategoria: string;
  fotoUrl: string;
  tamanoObjeto: string;
  numeroArticulos: number;
  materialDetectadoIa: boolean;
  confianzaIa: number;
  validadoIa: boolean;
  gpsValidado: boolean;
  fecha: string;
}
