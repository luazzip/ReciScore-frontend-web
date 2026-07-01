import type { PuntoMapa } from '../../types/puntoMapa.types';
import Skeleton from '../common/Skeleton';

type Categoria = 'PAPEL' | 'PLASTICO' | 'VIDRIO' | 'METAL';

const SERVICIOS: { cat: Categoria; icon: string; label: string }[] = [
  { cat: 'PAPEL',    icon: 'description', label: 'Papel' },
  { cat: 'PLASTICO', icon: 'smart_toy',   label: 'Plástico' },
  { cat: 'VIDRIO',   icon: 'wine_bar',    label: 'Vidrio' },
  { cat: 'METAL',    icon: 'handyman',    label: 'Metal' },
];

interface PuntoSidePanelProps {
  isLoading: boolean;
  puntos: PuntoMapa[];
  puntoSeleccionado: PuntoMapa | null;
  selected: PuntoMapa | null;
  busqueda: string;
  radio: number;
  tipoFilter: string;
  mostrarTodos: boolean;
  onSearchChange: (value: string) => void;
  onRadioChange: (value: number) => void;
  onTipoFilterChange: (value: string) => void;
  onSelectPunto: (punto: PuntoMapa) => void;
}

export default function PuntoSidePanel({
  isLoading, puntos, puntoSeleccionado, selected,
  busqueda, radio, tipoFilter, mostrarTodos,
  onSearchChange, onRadioChange, onTipoFilterChange, onSelectPunto,
}: PuntoSidePanelProps) {
  const serviciosPunto = puntoSeleccionado?.servicios ?? {};
  const esPuntoReporte = !!(selected && selected.id < 0);
  const esZonaSucia = puntoSeleccionado?.tipo === 'ZONA_SUCIA';

  return (
    <aside className="lg:col-span-5 space-y-6">
      {isLoading ? (
        <div className="bg-surface-container-lowest rounded-lg p-8 shadow-sm">
          <Skeleton rows={4} />
        </div>
      ) : (
        <>
          {/* Search */}
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
                  onChange={e => onRadioChange(Number(e.target.value))}
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
                    onChange={e => onSearchChange(e.target.value)}
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
                    onChange={e => onTipoFilterChange(e.target.value)}
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

          {/* Point list */}
          <div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm border border-outline-variant/5">
            {puntos.length === 0 ? (
              <div className="p-8 text-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">search_off</span>
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
                    onClick={() => onSelectPunto(p)}
                    className={`w-full text-left flex items-center gap-4 px-6 py-4 border-b border-outline-variant/10 transition-colors last:border-0 ${
                      activo
                        ? 'bg-primary/5 border-l-4 border-l-primary'
                        : 'hover:bg-surface-container/40'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activo ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
                    }`}>
                      <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: '"FILL" 1' }}>
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
                      <span className="material-symbols-outlined text-primary text-sm">chevron_right</span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Point detail */}
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

              {/* Services */}
              {!esPuntoReporte && !esZonaSucia && (
                <div className="grid grid-cols-4 divide-x divide-outline-variant/10">
                  {SERVICIOS.map(({ cat, icon, label }) => {
                    const acepta = serviciosPunto[cat] !== false;
                    return (
                      <div key={cat} className={`flex flex-col items-center gap-1 py-4 ${acepta ? 'bg-primary/5' : ''}`}>
                        <span className={`material-symbols-outlined text-2xl ${acepta ? 'text-primary' : 'text-on-surface-variant/30'}`}
                          style={acepta ? { fontVariationSettings: '"FILL" 1' } : {}}
                        >
                          {icon}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">
                          {label}
                        </span>
                        <span className={`text-[9px] font-bold ${acepta ? 'text-primary' : 'text-on-surface-variant/50'}`}>
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
  );
}
