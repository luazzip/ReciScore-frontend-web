import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

const DEMO_PUNTOS: PuntoMapa[] = [
  { id: 1, nombre: 'Reciclaje Sunset Valley', latitude: -12.097, longitude: -77.050, tipo: 'ACOPIO_OFICIAL' },
  { id: 2, nombre: 'Eco-Centro San Isidro',   latitude: -12.103, longitude: -77.035, tipo: 'ACOPIO_OFICIAL' },
  { id: 3, nombre: 'Punto Verde Miraflores',  latitude: -12.121, longitude: -77.029, tipo: 'ACOPIO_OFICIAL' },
];

const SERVICIOS_PUNTO: Record<number, Partial<Record<Categoria, boolean>>> = {
  1: { PAPEL: true,  PLASTICO: true,  VIDRIO: false, METAL: true  },
  2: { PAPEL: true,  PLASTICO: false, VIDRIO: true,  METAL: true  },
  3: { PAPEL: false, PLASTICO: true,  VIDRIO: true,  METAL: false },
};

// ── Icono personalizado para los pines del mapa ───────────────────────────────
function crearIcono(activo: boolean) {
  const color = activo ? '#16a34a' : '#4ade80';
  const size  = activo ? 44 : 36;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
      <circle cx="12" cy="10" r="9" fill="${color}" stroke="white" stroke-width="1.5"/>
      <path d="M12 21 C12 21 5 15 5 10 A7 7 0 0 1 19 10 C19 15 12 21 12 21Z"
            fill="${color}" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M9 10l1.5 1.5L15 8" stroke="white" stroke-width="1.8"
            stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize:   [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor:[0, -size],
  });
}

// ── Subcomponente: centra el mapa cuando cambia el punto seleccionado ─────────
function MapCenterer({ punto }: { punto: PuntoMapa }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([punto.latitude, punto.longitude], 15, { duration: 0.8 });
  }, [punto.id]);
  return null;
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function MapaPage() {
  const [selected, setSelected]     = useState<PuntoMapa | null>(null);
  const [busqueda, setBusqueda]     = useState('');
  const [showReport, setShowReport] = useState(false);
  const [reportDesc, setReportDesc] = useState('');
  const [radio, setRadio]           = useState(2.4);

  const { data, isLoading } = useFetch(
    (signal) => mapaService.getPuntos(signal),
    []
  );

  const puntos = (data && data.length > 0 ? data : DEMO_PUNTOS).filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const puntoSeleccionado = selected ?? puntos[0] ?? DEMO_PUNTOS[0];
  const serviciosPunto    = SERVICIOS_PUNTO[puntoSeleccionado?.id] ?? {};

  async function handleReportar() {
    if (!reportDesc.trim()) return;
    try {
      await mapaService.reportarZonaSucia({
        latitude:    puntoSeleccionado.latitude,
        longitude:   puntoSeleccionado.longitude,
        descripcion: reportDesc,
      });
      setShowReport(false);
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
              <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                GPS Habilitado
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
                  center={[puntoSeleccionado.latitude, puntoSeleccionado.longitude]}
                  zoom={14}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={true}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />

                  {/* Centra el mapa al cambiar selección */}
                  <MapCenterer punto={puntoSeleccionado} />

                  {/* Pines */}
                  {puntos.map((p) => {
                    const activo = puntoSeleccionado?.id === p.id;
                    return (
                      <Marker
                        key={p.id}
                        position={[p.latitude, p.longitude]}
                        icon={crearIcono(activo)}
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
                </MapContainer>
              </div>
            )}

            {/* Stats bajo el mapa */}
            <div className="p-6 flex flex-wrap gap-4">
              <div className="flex-1 min-w-[140px] p-4 bg-surface rounded-lg border border-outline-variant/10">
                <p className="text-[10px] font-bold uppercase text-on-surface-variant tracking-widest mb-1">
                  Estado
                </p>
                <p className="text-sm font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  {puntos.length} puntos activos
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

          {/* Filtros de Material */}
          <div className="bg-surface-container-low rounded-lg p-8">
            <h3 className="text-xl font-headline font-bold mb-6">Filtros de Material</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {SERVICIOS.map(({ cat, icon, label }) => {
                const acepta = serviciosPunto[cat] !== false;
                return (
                  <button
                    key={cat}
                    className={`flex flex-col items-center gap-3 p-4 bg-surface-container-lowest rounded-lg border-2 transition-colors ${
                      acepta
                        ? 'border-primary shadow-sm'
                        : 'border-transparent hover:border-outline-variant'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-3xl ${
                        acepta ? 'text-primary' : 'text-on-surface-variant/50'
                      }`}
                      style={acepta ? { fontVariationSettings: '"FILL" 1' } : {}}
                    >
                      {icon}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── COLUMNA DERECHA: Búsqueda + Detalle + CTA ── */}
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
                      max={10}
                      step={0.1}
                      className="w-full h-2 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between mt-2 text-[10px] font-bold text-on-surface-variant">
                      <span>0.5km</span>
                      <span className="text-primary text-sm">{radio.toFixed(1)} km</span>
                      <span>10km</span>
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
                      <select className="w-full px-4 py-3 bg-surface-container-low border-0 border-b-2 border-outline-variant/20 focus:border-secondary focus:ring-0 rounded-t-lg transition-colors font-bold appearance-none">
                        <option>Todos</option>
                        <option>Acopio oficial</option>
                        <option>Zona reportada</option>
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
                      No se encontraron puntos
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
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          Punto seleccionado
                        </span>
                        <h3 className="text-lg font-bold text-on-surface">
                          {puntoSeleccionado.nombre}
                        </h3>
                        <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">location_on</span>
                          {puntoSeleccionado.latitude.toFixed(4)},{' '}
                          {puntoSeleccionado.longitude.toFixed(4)}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full whitespace-nowrap">
                        Abierto
                      </span>
                    </div>
                  </div>

                  {/* Servicios del punto */}
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
                </div>
              )}

              {/* CTA: Reportar */}
              <div className="pt-2">
                <button
                  onClick={() => setShowReport(!showReport)}
                  className="w-full group relative py-6 bg-gradient-to-br from-primary to-primary-dim text-on-primary rounded-lg font-headline font-bold text-lg overflow-hidden transition-all active:scale-95 duration-150"
                >
                  <div className="flex items-center justify-center gap-3">
                    <span>{showReport ? 'Cerrar reporte' : 'Reportar punto sucio'}</span>
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 h-1 bg-tertiary w-3/4" />
                </button>

                {showReport && (
                  <div className="mt-4 space-y-4">
                    <textarea
                      value={reportDesc}
                      onChange={e => setReportDesc(e.target.value)}
                      placeholder="Describe el problema..."
                      className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/20 focus:border-error focus:ring-0 rounded-t-lg p-3 text-sm font-bold transition-colors resize-none"
                      rows={3}
                    />
                    <button
                      onClick={handleReportar}
                      className="w-full bg-error text-on-error font-bold py-3 rounded-full text-xs uppercase tracking-wider hover:brightness-110 transition-all active:scale-95"
                    >
                      Enviar reporte
                    </button>
                  </div>
                )}

                <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-widest text-on-surface-variant flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm text-tertiary">bolt</span>
                  {puntos.length} puntos de reciclaje disponibles
                </p>
              </div>
            </>
          )}
        </aside>
      </div>
    </>
  );
}