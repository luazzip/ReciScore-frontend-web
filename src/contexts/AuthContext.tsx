import { createContext, useEffect, useReducer, useCallback, type ReactNode } from 'react';
import { authService } from '../services/authService';
import { tokenStorage } from '../utils/tokenStorage';
import type { LoginRequest, RegisterRequest, Usuario } from '../types/usuario.types';
import type { ApiError } from '../types/api.types';

interface AuthState {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: Usuario }
  | { type: 'AUTH_FAILURE' }
  | { type: 'LOGOUT' };

const initialState: AuthState = {
  usuario: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true };
    case 'AUTH_SUCCESS':
      return { usuario: action.payload, isAuthenticated: true, isLoading: false };
    case 'AUTH_FAILURE':
    case 'LOGOUT':
      return { usuario: null, isAuthenticated: false, isLoading: false };
    default:
      return state;
  }
}

interface AuthContextValue extends AuthState {
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
  error: ApiError | null;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [error, setError] = useReducer((_: ApiError | null, next: ApiError | null) => next, null);

  useEffect(() => {
    if (!tokenStorage.getAccessToken()) {
      dispatch({ type: 'AUTH_FAILURE' });
      return;
    }
    const restored = authService.restoreSession();
    if (restored) {
      dispatch({ type: 'AUTH_SUCCESS', payload: restored });
    } else {
      tokenStorage.clear();
      dispatch({ type: 'AUTH_FAILURE' });
    }
  }, []);

  const login = useCallback(async (payload: LoginRequest) => {
    dispatch({ type: 'AUTH_START' });
    setError(null);
    try {
      const usuario = await authService.login(payload);
      dispatch({ type: 'AUTH_SUCCESS', payload: usuario });
    } catch (err) {
      dispatch({ type: 'AUTH_FAILURE' });
      setError(err as ApiError);
      throw err;
    }
  }, []);

  const register = useCallback(async (payload: RegisterRequest) => {
    dispatch({ type: 'AUTH_START' });
    setError(null);
    try {
      const usuario = await authService.register(payload);
      dispatch({ type: 'AUTH_SUCCESS', payload: usuario });
    } catch (err) {
      dispatch({ type: 'AUTH_FAILURE' });
      setError(err as ApiError);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}
