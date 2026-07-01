import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useFetch } from '../hooks/useFetch';
import { useNotification } from '../hooks/useNotification';
import { mapaService } from '../services/mapaService';
import type { PuntoMapa } from '../types/puntoMapa.types';
import { crearIcono, crearIconoReporte } from '../components/mapa/mapaIcons';
import MapCenterer from '../components/mapa/MapCenterer';
import MapClickHandler from '../components/mapa/MapClickHandler';
import UserLocationMarker from '../components/mapa/UserLocationMarker';
import RecenterButton from '../components/mapa/RecenterButton';
import MapStatsBar from '../components/mapa/MapStatsBar';
import ReportSection from '../components/mapa/ReportSection';
import PuntoSidePanel from '../components/mapa/PuntoSidePanel';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const DEFAULT_CENTER = { lat: -12.046374, lng: -77.042793 };

let tempIdCounter = -1;

function nextTempId() {
  return tempIdCounter--;
}

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function MapaPage() {
  const { notify } = useNotification();
  const [selected, setSelected]     = useState<PuntoMapa | null>(null);
  const [busqueda, setBusqueda]     = useState('');
  const [reportDesc, setReportDesc] = useState('');
  const [isReporting, setIsReporting] = useState(false);
  const [radio, setRadio]           = useState(2.4);
  const [tipoFilter, setTipoFilter] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
  const esPuntoReporte    = !!(selected && selected.id < 0);
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
    setIsReporting(true);
    try {
      await mapaService.reportarZonaSucia({
        latitude:    puntoSeleccionado.latitude,
        longitude:   puntoSeleccionado.longitude,
        descripcion: reportDesc,
      });
      setReportDesc('');
      notify('success', 'Zona reportada correctamente. Será validada al alcanzar suficientes reportes.');
    } catch {
      notify('error', 'No se pudo enviar el reporte. Intenta de nuevo.');
    } finally {
      setIsReporting(false);
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

        {/* Left column: map + report */}
        <section className="lg:col-span-7 space-y-6">
          <div className="bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant/5 relative overflow-hidden">

            {/* GPS badge */}
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

            {/* Map */}
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

                  {puntoSeleccionado && <MapCenterer punto={puntoSeleccionado} />}

                  <MapClickHandler onMapClick={handleMapClick} />

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

                  {esPuntoReporte && puntoSeleccionado && (
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

                  {userLocation && (
                    <>
                      <UserLocationMarker position={userLocation} />
                      <RecenterButton position={userLocation} />
                    </>
                  )}
                </MapContainer>
              </div>
            )}

            <MapStatsBar
              puntosLength={puntos.length}
              mostrarTodos={mostrarTodos}
              radio={radio}
              userLocation={userLocation}
              locationLoading={locationLoading}
              locationError={locationError}
            />
          </div>

          <ReportSection
            esPuntoReporte={esPuntoReporte}
            puntoSeleccionado={puntoSeleccionado}
            reportDesc={reportDesc}
            isReporting={isReporting}
            onReportDescChange={setReportDesc}
            onReportar={handleReportar}
          />
        </section>

        {/* Right column: search + list + detail */}
        <PuntoSidePanel
          isLoading={isLoading}
          puntos={puntos}
          puntoSeleccionado={puntoSeleccionado}
          selected={selected}
          busqueda={busqueda}
          radio={radio}
          tipoFilter={tipoFilter}
          mostrarTodos={mostrarTodos}
          onSearchChange={setBusqueda}
          onRadioChange={setRadio}
          onTipoFilterChange={setTipoFilter}
          onSelectPunto={setSelected}
        />
      </div>
    </>
  );
}
