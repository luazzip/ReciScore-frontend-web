export interface Desafio {
  id: number;
  titulo: string;
  descripcion?: string;
  categoria: string;
  meta_valor: number;
  puntos: number;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
}

export interface UsuarioDesafio {
  desafio: Desafio;
  progresoActual: number;
  completado: boolean;
}
