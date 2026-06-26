export interface ApiError {
  status: number;
  message: string;       // mensaje amigable para mostrar al usuario
  rawMessage?: string;   // mensaje técnico original (solo para logs/debug)
  fieldErrors?: Record<string, string>; // errores de validación por campo (400)
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
