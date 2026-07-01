import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useFetch } from '../hooks/useFetch';
import { mapaService } from '../services/mapaService';
import type { PuntoMapa } from '../types/puntoMapa.types';
import Skeleton from '../components/common/Skeleton';

// ── Fix Leaflet default icon paths when bundled con Vite/webpack ──────────────
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ── Tipos y constantes ────────────────────────────────────────────────────────
type Categoria = 'PAPEL' | 'PLASTICO' | 'VIDRIO' | 'METAL';

const SERVICIOS: { cat: Categoria; icon: string; label: string }[] = [
  { cat: 'PAPEL',    icon: 'description', label: 'Papel' },
  { cat: 'PLASTICO', icon: 'smart_toy',   label: 'Plástico' },
  { cat: 'VIDRIO',   icon: 'wine_bar',    label: 'Vidrio' },
  { cat: 'METAL',    icon: 'handyman',    label: 'Metal' },
];

const DEFAULT_CENTER = { lat: -12.046374, lng: -77.042793 };

// ── Icono personalizado para los pines del mapa ───────────────────────────────
function crearIcono(tipo: string, activo: boolean) {
  let color: string;
  let size: number;
  let iconSvg: string;

  if (tipo === 'ZONA_SUCIA') {
    color = activo ? '#dc2626' : '#f87171';
    size  = activo ? 44 : 36;
    iconSvg = `<path d="M12 7v4M12 14.5v.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  } else {
    color = activo ? '#16a34a' : '#4ade80';
    size  = activo ? 44 : 36;
    iconSvg = `<path d="M9 10l1.5 1.5L15 8" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
      <circle cx="12" cy="10" r="9" fill="${color}" stroke="white" stroke-width="1.5"/>
      <path d="M12 21 C12 21 5 15 5 10 A7 7 0 0 1 19 10 C19 15 12 21 12 21Z"
            fill="${color}" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
      ${iconSvg}
    </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize:   [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor:[0, -size],
  });
}

let tempIdCounter = -1;
function nextTempId() {
  return tempIdCounter--;
}

// ── Subcomponente: centra el mapa cuando cambia el punto seleccionado ─────────
function MapCenterer({ punto }: { punto: PuntoMapa }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([punto.latitude, punto.longitude], 15, { duration: 0.8 });
  }, [punto.latitude, punto.longitude, map]);
  return null;
}

// ── Icono rojo para ubicación de reporte ──────────────────────────────────────
function crearIconoReporte() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
      <circle cx="12" cy="10" r="9" fill="#dc2626" stroke="white" stroke-width="1.5"/>
      <path d="M12 21 C12 21 5 15 5 10 A7 7 0 0 1 19 10 C19 15 12 21 12 21Z"
            fill="#dc2626" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M12 7v4M12 14.5v.5" stroke="white" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize:   [40, 40],
    iconAnchor: [20, 40],
    popupAnchor:[0, -40],
  });
}

// ── Subcomponente: captura clics en el mapa ───────────────────────────────────
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// ── Icono azul para la ubicación del usuario ──────────────────────────────────
function crearIconoUsuario() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#2563eb" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="white"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize:   [36, 36],
    iconAnchor: [18, 18],
  });
}

// ── Marcador de ubicación del usuario + botón ─────────────────────────────────
function UserLocationMarker({ position }: { position: { lat: number; lng: number } }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([position.lat, position.lng], map.getZoom(), { duration: 0.6 });
  }, []);

  return (
    <Marker position={[position.lat, position.lng]} icon={crearIconoUsuario()} zIndexOffset={3000}>
      <Popup>
        <span className="font-bold text-sm">Tu ubicación</span>
      </Popup>
    </Marker>
  );
}

function RecenterButton({ position }: { position: { lat: number; lng: number } }) {
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

// ── Componente principal ──────────────────────────────────────────────────────
export default function MapaPage() {
  const [selected, setSelected]     = useState<PuntoMapa | null>(null);
  const [busqueda, setBusqueda]     = useState('');
  const [reportDesc, setReportDesc] = useState('');
  const [radio, setRadio]           = useState(2.4);
  const [tipoFilter, setTipoFilter] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocalización no soportada');
      setLocationLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationLoading(false);
      },
      (err) => {
        setLocationError(err.code === err.PERMISSION_DENIED ? 'Permiso denegado' : 'No disponible');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const { data, isLoading } = useFetch(
    (signal) => mapaService.getPuntos(signal),
    []
  );

  function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  const refLocation = userLocation ?? (data && data.length > 0
    ? { lat: data[0].latitude, lng: data[0].longitude }
    : null);

  const mostrarTodos = radio >= 48;

  const puntos = (data ?? []).filter(p => {
    if (!p.nombre.toLowerCase().includes(busqueda.toLowerCase())) return false;
    if (tipoFilter && p.tipo !== tipoFilter) return false;
    if (mostrarTodos || !refLocation) return true;
    return getDistance(refLocation.lat, refLocation.lng, p.latitude, p.longitude) <= radio;
  });

  const puntoSeleccionado = selected ?? puntos[0] ?? null;
  const serviciosPunto    = puntoSeleccionado?.servicios ?? {};
  const esPuntoReporte    = selected && selected.id < 0;
  const esZonaSucia       = puntoSeleccionado?.tipo === 'ZONA_SUCIA';
  const mapCenter         = puntoSeleccionado
    ? { lat: puntoSeleccionado.latitude, lng: puntoSeleccionado.longitude }
    : (refLocation ?? DEFAULT_CENTER);

  function handleMapClick(lat: number, lng: number) {
    setSelected({
      id: nextTempId(),
      nombre: 'Ubicación para reporte',
      latitude: lat,
      longitude: lng,
      tipo: 'ZONA_SUCIA',
    });
  }

  async function handleReportar() {
    if (!reportDesc.trim() || !puntoSeleccionado) return;
    try {
      await mapaService.reportarZonaSucia({
        latitude:    puntoSeleccionado.latitude,
        longitude:   puntoSeleccionado.longitude,
        descripcion: reportDesc,
      });
      setReportDesc('');
    } catch {
      // silent
    }
  }

  return (
    <>
      <header className="mb-10 text-left">
        <h1 className="text-5xl font-extrabold text-on-surface tracking-tight leading-none mb-2">
          Mapa de Puntos.
        </h1>
        <p className="text-on-surface-variant font-body text-lg">
          Encuentra puntos de reciclaje cercanos y verifica su disponibilidad.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ── COLUMNA IZQUIERDA: Mapa real ── */}
        <section className="lg:col-span-7 space-y-6">
          <div className="bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant/5 relative overflow-hidden">

            {/* Badge GPS */}
            <div className="absolute top-4 right-4 z-[1000]">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm flex items-center gap-1 ${
                userLocation
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${userLocation ? 'bg-green-500 animate-pulse' : 'bg-on-surface-variant'}`} />
                {userLocation ? 'Ubicación detectada' : locationLoading ? 'Obteniendo ubicación...' : 'Ubicación no disponible'}
              </span>
            </div>

            {/* Mapa Leaflet */}
            {isLoading ? (
              <div className="h-96 flex flex-col items-center justify-center gap-4 bg-surface-container/20">
                <span className="material-symbols-outlined text-5xl text-primary animate-pulse">
                  my_location
                </span>
                <p className="text-lg font-bold text-on-surface">
                  Cargando puntos de reciclaje...
                </p>
              </div>
            ) : (
              <div className="h-96 w-full rounded-t-lg overflow-hidden">
                  <MapContainer
                  center={[mapCenter.lat, mapCenter.lng]}
                  zoom={14}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={true}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />

                  {/* Centra el mapa al cambiar selección */}
                  {puntoSeleccionado && <MapCenterer punto={puntoSeleccionado} />}

                  {/* Clic en el mapa → selecciona ubicación para reporte */}
                  <MapClickHandler onMapClick={handleMapClick} />

                  {/* Pines de reciclaje */}
                  {puntos.map((p) => {
                    const activo = puntoSeleccionado?.id === p.id;
                    return (
                      <Marker
                        key={p.id}
                        position={[p.latitude, p.longitude]}
                        icon={crearIcono(p.tipo, activo)}
                        eventHandlers={{ click: () => setSelected(p) }}
                        zIndexOffset={activo ? 1000 : 0}
                      >
                        <Popup>
                          <span className="font-bold text-sm">{p.nombre}</span>
                          <br />
                          <span className="text-xs text-gray-500 capitalize">
                            {p.tipo.replace('_', ' ').toLowerCase()}
                          </span>
                        </Popup>
                      </Marker>
                    );
                  })}

                  {/* Pin rojo de la ubicación de reporte */}
                  {esPuntoReporte && (
                    <Marker
                      position={[puntoSeleccionado.latitude, puntoSeleccionado.longitude]}
                      icon={crearIconoReporte()}
                      zIndexOffset={2000}
                    >
                      <Popup>
                        <span className="font-bold text-sm text-error">Ubicación para reporte</span>
                        <br />
                        <span className="text-xs text-gray-500">
                          {puntoSeleccionado.latitude.toFixed(4)}, {puntoSeleccionado.longitude.toFixed(4)}
                        </span>
                      </Popup>
                    </Marker>
                  )}

                  {/* Pin azul de la ubicación del usuario */}
                  {userLocation && (
                    <>
                      <UserLocationMarker position={userLocation} />
                      <RecenterButton position={userLocation} />
                    </>
                  )}
                </MapContainer>
              </div>
            )}

            {/* Stats bajo el mapa */}
            <div className="p-6 flex flex-wrap gap-4">
              <div className="flex-1 min-w-[140px] p-4 bg-surface rounded-lg border border-outline-variant/10">
                <p className="text-[10px] font-bold uppercase text-on-surface-variant tracking-widest mb-1">
                  Puntos Activos
                </p>
                <p className="text-sm font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  {puntos.length} {mostrarTodos ? 'en total' : `en ${radio.toFixed(1)} km`}
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
          </div>

          {/* Reportar punto sucio */}
          <div className="bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant/5 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-headline font-bold">Reportar punto sucio</h3>
              <span className="material-symbols-outlined text-error text-xl">warning</span>
            </div>
            <p className="text-sm text-on-surface-variant mb-4">
              Haz clic en el mapa para marcar la ubicación o selecciona un punto existente.
            </p>
            {esPuntoReporte ? (
              <div className="flex items-center gap-2 mb-4 p-3 bg-error/5 rounded-lg border border-error/20">
                <span className="material-symbols-outlined text-error text-base">location_on</span>
                <span className="text-sm font-bold text-on-surface">
                  {puntoSeleccionado.latitude.toFixed(4)}, {puntoSeleccionado.longitude.toFixed(4)}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-4 p-3 bg-surface-container rounded-lg">
                <span className="material-symbols-outlined text-on-surface-variant text-base">touch_app</span>
                <span className="text-sm text-on-surface-variant">Toca el mapa para elegir una ubicación</span>
              </div>
            )}
            <textarea
              value={reportDesc}
              onChange={e => setReportDesc(e.target.value)}
              placeholder="Describe el problema (ej: acumulación de residuos en la vereda)..."
              className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/20 focus:border-error focus:ring-0 rounded-t-lg p-3 text-sm font-bold transition-colors resize-none"
              rows={3}
            />
            <button
              onClick={handleReportar}
              className="mt-4 w-full bg-error text-on-error font-bold py-3 rounded-lg text-xs uppercase tracking-wider hover:brightness-110 transition-all active:scale-95"
            >
              Enviar reporte
            </button>
          </div>
        </section>

        {/* ── COLUMNA DERECHA: Búsqueda + Detalle ── */}
        <aside className="lg:col-span-5 space-y-6">
          {isLoading ? (
            <div className="bg-surface-container-lowest rounded-lg p-8 shadow-sm">
              <Skeleton rows={4} />
            </div>
          ) : (
            <>
              {/* Búsqueda */}
              <div className="bg-surface-container-lowest rounded-lg p-8 shadow-sm border border-outline-variant/5">
                <h3 className="text-xl font-headline font-bold mb-6">Buscar Puntos</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                      Radio de búsqueda (KM)
                    </label>
                    <input
                      type="range"
                      value={radio}
                      onChange={e => setRadio(Number(e.target.value))}
                      min={0.5}
                      max={50}
                      step={0.5}
                      className="w-full h-2 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between mt-2 text-[10px] font-bold text-on-surface-variant">
                      <span>0.5 km</span>
                      <span className="text-primary text-sm">{radio >= 48 ? 'Todos' : `${radio.toFixed(1)} km`}</span>
                      <span>Todos</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                        Buscar
                      </label>
                      <input
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        placeholder="Nombre del punto"
                        className="w-full px-4 py-3 bg-surface-container-low border-0 border-b-2 border-outline-variant/20 focus:border-secondary focus:ring-0 rounded-t-lg transition-colors font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                        Tipo
                      </label>
                      <select
                        value={tipoFilter}
                        onChange={e => setTipoFilter(e.target.value)}
                        className="w-full px-4 py-3 bg-surface-container-low border-0 border-b-2 border-outline-variant/20 focus:border-secondary focus:ring-0 rounded-t-lg transition-colors font-bold appearance-none"
                      >
                        <option value="">Todos</option>
                        <option value="ACOPIO_OFICIAL">Acopio oficial</option>
                        <option value="ZONA_SUCIA">Zona reportada</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lista de puntos */}
              <div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm border border-outline-variant/5">
                {puntos.length === 0 ? (
                  <div className="p-8 text-center">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
                      search_off
                    </span>
                    <p className="text-sm font-bold text-on-surface mt-2">
                      {mostrarTodos ? 'No hay puntos disponibles' : `No hay puntos en ${radio.toFixed(1)} km`}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-1">
                      {mostrarTodos ? 'Intenta con otro término de búsqueda' : 'Prueba aumentando el radio de búsqueda'}
                    </p>
                  </div>
                ) : (
                  puntos.map((p) => {
                    const activo = puntoSeleccionado?.id === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setSelected(p)}
                        className={`w-full text-left flex items-center gap-4 px-6 py-4 border-b border-outline-variant/10 transition-colors last:border-0 ${
                          activo
                            ? 'bg-primary/5 border-l-4 border-l-primary'
                            : 'hover:bg-surface-container/40'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            activo ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
                          }`}
                        >
                          <span
                            className="material-symbols-outlined text-base"
                            style={{ fontVariationSettings: '"FILL" 1' }}
                          >
                            recycling
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-bold truncate ${activo ? 'text-primary' : 'text-on-surface'}`}>
                            {p.nombre}
                          </p>
                          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-0.5">
                            {p.tipo.replace('_', ' ').toLowerCase()}
                          </p>
                        </div>
                        {activo && (
                          <span className="material-symbols-outlined text-primary text-sm">
                            chevron_right
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Detalle del punto seleccionado */}
              {puntoSeleccionado && (
                <div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm border border-outline-variant/5">
                  <div className="p-6 border-b border-outline-variant/10">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {esPuntoReporte ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-error/10 text-error text-[10px] font-bold uppercase tracking-widest mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-error" />
                            Ubicación de reporte
                          </span>
                        ) : esZonaSucia ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-warning/10 text-warning text-[10px] font-bold uppercase tracking-widest mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                            Zona reportada
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            Punto de reciclaje
                          </span>
                        )}
                        <h3 className="text-lg font-bold text-on-surface">
                          {puntoSeleccionado.nombre}
                        </h3>
                        <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">location_on</span>
                          {puntoSeleccionado.latitude.toFixed(4)},{' '}
                          {puntoSeleccionado.longitude.toFixed(4)}
                        </p>
                      </div>
                      {!esPuntoReporte && !esZonaSucia && (
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full whitespace-nowrap">
                          Abierto
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Servicios del punto (solo para puntos oficiales) */}
                  {!esPuntoReporte && !esZonaSucia && (
                    <div className="grid grid-cols-4 divide-x divide-outline-variant/10">
                      {SERVICIOS.map(({ cat, icon, label }) => {
                        const acepta = serviciosPunto[cat] !== false;
                        return (
                          <div
                            key={cat}
                            className={`flex flex-col items-center gap-1 py-4 ${
                              acepta ? 'bg-primary/5' : ''
                            }`}
                          >
                            <span
                              className={`material-symbols-outlined text-2xl ${
                                acepta ? 'text-primary' : 'text-on-surface-variant/30'
                              }`}
                              style={acepta ? { fontVariationSettings: '"FILL" 1' } : {}}
                            >
                              {icon}
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">
                              {label}
                            </span>
                            <span
                              className={`text-[9px] font-bold ${
                                acepta ? 'text-primary' : 'text-on-surface-variant/50'
                              }`}
                            >
                              {acepta ? 'Aceptado' : 'Sin servicio'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {(esPuntoReporte || esZonaSucia) && (
                    <div className="p-6 text-center">
                      <span className="material-symbols-outlined text-4xl text-warning/40">warning</span>
                      <p className="text-sm text-on-surface-variant mt-2">
                        {esZonaSucia
                          ? 'Esta zona ha sido reportada como punto de acumulación de basura.'
                          : 'Esta ubicación se usará para el reporte. Escribe una descripción y envía el reporte.'}
                      </p>
                    </div>
                  )}
                </div>
              )}


            </>
          )}
        </aside>
      </div>
    </>
  );
}
