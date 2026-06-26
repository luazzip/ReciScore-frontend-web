import axiosClient from '../api/axiosClient';
import { tokenStorage } from '../utils/tokenStorage';
import type { AuthResponse, LoginRequest, RegisterRequest, Usuario } from '../types/usuario.types';

function decodeToken(token: string): { sub: string; userId: number; role: string } {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    throw new Error('Token inválido');
  }
}

async function fetchUser(userId: number): Promise<Usuario> {
  const { data } = await axiosClient.get<Usuario>(`/users/${userId}`);
  return data;
}

export const authService = {
  async login(payload: LoginRequest): Promise<Usuario> {
    const { data } = await axiosClient.post<AuthResponse>('/auth/login', payload);
    tokenStorage.setAccessToken(data.token);
    tokenStorage.setRefreshToken(data.refreshToken);
    const decoded = decodeToken(data.token);
    const usuario = await fetchUser(decoded.userId);
    const usuarioConRol: Usuario = { ...usuario, role: decoded.role as Usuario['role'] };
    tokenStorage.setUser(usuarioConRol);
    return usuarioConRol;
  },
  async register(payload: RegisterRequest): Promise<Usuario> {
    const { data } = await axiosClient.post<AuthResponse>('/auth/register', payload);
    tokenStorage.setAccessToken(data.token);
    tokenStorage.setRefreshToken(data.refreshToken);
    const decoded = decodeToken(data.token);
    const usuario = await fetchUser(decoded.userId);
    const usuarioConRol: Usuario = { ...usuario, role: decoded.role as Usuario['role'] };
    tokenStorage.setUser(usuarioConRol);
    return usuarioConRol;
  },
  restoreSession(): Usuario | null {
    return tokenStorage.getUser<Usuario>();
  },
  logout(): void {
    tokenStorage.clear();
  },
};
