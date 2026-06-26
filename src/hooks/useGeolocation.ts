import { useEffect, useReducer } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  isLoading: boolean;
  error: string | null;
}

type GeolocationAction =
  | { type: 'ERROR'; payload: string }
  | { type: 'SUCCESS'; latitude: number; longitude: number }
  | { type: 'UNSUPPORTED' };

function geolocationReducer(_state: GeolocationState, action: GeolocationAction): GeolocationState {
  switch (action.type) {
    case 'SUCCESS':
      return { latitude: action.latitude, longitude: action.longitude, isLoading: false, error: null };
    case 'ERROR':
      return { latitude: null, longitude: null, isLoading: false, error: action.payload };
    case 'UNSUPPORTED':
      return { latitude: null, longitude: null, isLoading: false, error: 'Tu navegador no soporta geolocalización.' };
    default:
      return { latitude: null, longitude: null, isLoading: true, error: null };
  }
}

export function useGeolocation() {
  const [state, dispatch] = useReducer(geolocationReducer, {
    latitude: null,
    longitude: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      dispatch({ type: 'UNSUPPORTED' });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        dispatch({ type: 'SUCCESS', latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      },
      () => {
        dispatch({ type: 'ERROR', payload: 'No se pudo obtener tu ubicación. Actívala e intenta de nuevo.' });
      }
    );
  }, []);

  return state;
}