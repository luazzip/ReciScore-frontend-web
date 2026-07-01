import { useEffect } from 'react';
import { useMap, Marker, Popup } from 'react-leaflet';
import { crearIconoUsuario } from './mapaIcons';

interface UserLocationMarkerProps {
  position: { lat: number; lng: number };
}

export default function UserLocationMarker({ position }: UserLocationMarkerProps) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([position.lat, position.lng], map.getZoom(), { duration: 0.6 });
  }, [map, position.lat, position.lng]);

  return (
    <Marker position={[position.lat, position.lng]} icon={crearIconoUsuario()} zIndexOffset={3000}>
      <Popup>
        <span className="font-bold text-sm">Tu ubicación</span>
      </Popup>
    </Marker>
  );
}
