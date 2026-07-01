import { useMap } from 'react-leaflet';

interface RecenterButtonProps {
  position: { lat: number; lng: number };
}

export default function RecenterButton({ position }: RecenterButtonProps) {
  const map = useMap();

  return (
    <div className="leaflet-top leaflet-left" style={{ marginTop: '80px' }}>
      <button
        onClick={() => map.flyTo([position.lat, position.lng], 15, { duration: 0.8 })}
        className="leaflet-control-zoom bg-white text-gray-700 border border-gray-300 rounded-md shadow-md px-2 py-2 text-xs font-bold hover:bg-gray-50 transition-colors flex items-center gap-1"
        title="Mi ubicación"
      >
        <span className="material-symbols-outlined text-base">my_location</span>
      </button>
    </div>
  );
}
