import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import type { PuntoMapa } from '../../types/puntoMapa.types';

interface MapCentererProps {
  punto: PuntoMapa;
}

export default function MapCenterer({ punto }: MapCentererProps) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([punto.latitude, punto.longitude], 15, { duration: 0.8 });
  }, [punto.latitude, punto.longitude, map]);

  return null;
}
