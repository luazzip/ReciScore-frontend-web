import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from '../utils/tokenStorage';
import type { ApiError } from '../types/api.types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';

const MAX_RETRIES = 3;
const BASE_RETRY_DELAY_MS = 1000;

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
}

const pendingRequests = new Map<string, AbortController>();

function isRecoverableError(error: AxiosError): boolean {
  if (axios.isCancel(error)) return false;
  if (!error.response) return true;
  return error.response.status >= 500 || error.response.status === 429;
}

function delayWithBackoff(attempt: number): Promise<void> {
  const jitter = Math.random() * 200;
  const delay = Math.min(BASE_RETRY_DELAY_MS * 2 ** attempt + jitter, 10000);
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export function cancelPendingRequest(key: string) {
  const controller = pendingRequests.get(key);
  if (controller) {
    controller.abort();
    pendingRequests.delete(key);
  }
}

export function cancelAllPendingRequests() {
  pendingRequests.forEach((controller) => controller.abort());
  pendingRequests.clear();
}

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) throw new Error('No hay refresh token disponible');
  const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
  tokenStorage.setAccessToken(data.token);
  if (data.refreshToken) tokenStorage.setRefreshToken(data.refreshToken);
  return data.token;
}

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig;
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
      originalRequest._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => { refreshPromise = null; });
        }
        const newToken = await refreshPromise;
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return axiosClient(originalRequest);
      } catch {
        tokenStorage.clear();
        cancelAllPendingRequests();
        window.location.href = '/login';
        return Promise.reject(buildApiError(error));
      }
    }

    if (isRecoverableError(error)) {
      originalRequest._retryCount = (originalRequest._retryCount ?? 0) + 1;
      if (originalRequest._retryCount <= MAX_RETRIES) {
        await delayWithBackoff(originalRequest._retryCount);
        return axiosClient(originalRequest);
      }
    }

    return Promise.reject(buildApiError(error));
  }
);

function buildApiError(error: AxiosError): ApiError {
  const status = error.response?.status ?? 0;
  const backendMessage = (error.response?.data as { message?: string } | undefined)?.message;
  const friendlyMessages: Record<number, string> = {
    400: 'Algunos datos enviados no son válidos. Revisa el formulario.',
    401: 'Tu sesión expiró. Inicia sesión nuevamente.',
    403: 'No tienes permisos para realizar esta acción.',
    404: 'No se encontró el recurso solicitado.',
    409: 'Ya existe un registro con esos datos.',
    500: 'Ocurrió un error en el servidor. Intenta de nuevo en unos minutos.',
    0: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
  };
  return {
    status,
    message: friendlyMessages[status] ?? 'Ocurrió un error inesperado.',
    rawMessage: backendMessage ?? error.message,
    fieldErrors: (error.response?.data as { fieldErrors?: Record<string, string> } | undefined)?.fieldErrors,
  };
}

export default axiosClient;
