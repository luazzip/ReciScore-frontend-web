const ACCESS_TOKEN_KEY = 'reciscore_access_token';
const REFRESH_TOKEN_KEY = 'reciscore_refresh_token';
const USER_KEY = 'reciscore_user';

export const tokenStorage = {
  getAccessToken(): string | null {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  },
  setAccessToken(token: string): void {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  getRefreshToken(): string | null {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setRefreshToken(token: string): void {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
  },
  getUser<T>(): T | null {
    const raw = sessionStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  setUser<T>(user: T): void {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear(): void {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  },
};
