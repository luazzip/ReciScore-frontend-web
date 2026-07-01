interface MapStatsBarProps {
  puntosLength: number;
  mostrarTodos: boolean;
  radio: number;
  userLocation: { lat: number; lng: number } | null;
  locationLoading: boolean;
  locationError: string | null;
}

export default function MapStatsBar({ puntosLength, mostrarTodos, radio, userLocation, locationLoading, locationError }: MapStatsBarProps) {
  return (
    <div className="p-6 flex flex-wrap gap-4">
      <div className="flex-1 min-w-[140px] p-4 bg-surface rounded-lg border border-outline-variant/10">
        <p className="text-[10px] font-bold uppercase text-on-surface-variant tracking-widest mb-1">
          Puntos Activos
        </p>
        <p className="text-sm font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          {puntosLength} {mostrarTodos ? 'en total' : `en ${radio.toFixed(1)} km`}
        </p>
      </div>
      <div className="flex-1 min-w-[140px] p-4 bg-surface rounded-lg border border-outline-variant/10">
        <p className="text-[10px] font-bold uppercase text-on-surface-variant tracking-widest mb-1">
          Tu Ubicación
        </p>
        <p className="text-sm font-semibold flex items-center gap-2">
          {userLocation ? (
            <>
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-sm text-on-surface-variant">gps_off</span>
              <span className="text-on-surface-variant">{locationLoading ? 'Buscando...' : locationError ?? 'No disponible'}</span>
            </>
          )}
        </p>
      </div>
      <div className="flex-1 min-w-[140px] p-4 bg-surface rounded-lg border border-outline-variant/10">
        <p className="text-[10px] font-bold uppercase text-on-surface-variant tracking-widest mb-1">
          Cobertura
        </p>
        <p className="text-sm font-semibold">{radio.toFixed(1)} km a la redonda</p>
      </div>
    </div>
  );
}
