export interface Usuario {
  id: number;
  email: string;
  username: string;
  name: string;
  role: 'USER' | 'ADMIN';
  points: number;
  multiplier: number;
  profilePicture?: string;
  location?: string;
  reciclajes: number;
  nivel: number;
  rachaDias: number;
  fechaRegistro: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  username: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
}
