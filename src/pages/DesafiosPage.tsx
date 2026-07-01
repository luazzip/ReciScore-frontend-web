import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { desafioService } from '../services/desafioService';
import { useNotification } from '../hooks/useNotification';
import CrearDesafioForm from '../components/desafios/CrearDesafioForm';
import Skeleton from '../components/common/Skeleton';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import type { Desafio } from '../types/desafio.types';

const CAT_ICON: Record<string, string> = {
  RECICLAJE: ' recycling', COMUNIDAD: 'diversity_3', RACHA: 'local_fire_department',
  IMPACTO: 'monitoring', EVENTO: 'event', GENERAL: 'eco',
};

const CAT_COLOR: Record<string, string> = {
  RECICLAJE: '#16a34a', COMUNIDAD: '#8b5cf6', RACHA: '#ef4444',
  IMPACTO: '#f97316', EVENTO: '#3b82f6', GENERAL: '#16a34a',
};

function diasRestantes(fechaFin: string) {
  const diff = new Date(fechaFin).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function DesafioCard({
  d, onToggleInscripcion, onVerDetalle
}: {
  d: Desafio; onToggleInscripcion: (id: number, inscrito: boolean) => void; onVerDetalle: (id: number) => void;
}) {
  const cat = d.categoria?.toUpperCase() ?? 'GENERAL';
  const color = CAT_COLOR[cat] ?? '#16a34a';
  const icon = CAT_ICON[cat] ?? 'eco';
  const dias = diasRestantes(d.fecha_fin);
  const progreso = d.progresoActual ?? 0;
  const pct = d.inscrito ? Math.min(100, (progreso / d.meta_valor) * 100) : 0;

  return (
    <div
      className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-xl shadow-on-surface/5 border border-outline-variant/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
      onClick={() => onVerDetalle(d.id)}
    >
      <div style={{ height: 4, background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center" style={{ background: color + '18' }}>
              <span className="material-symbols-outlined" style={{ color, fontVariationSettings: '"FILL" 1' }}>{icon}</span>
            </div>
            <div>
              <div className="font-headline font-bold text-base text-on-surface leading-tight">{d.titulo}</div>
              <div className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mt-0.5">{d.categoria}</div>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: color + '18', color }}>
            +{d.puntos} pts
          </span>
        </div>

        {d.descripcion && (
          <p className="text-sm text-on-surface-variant leading-relaxed mb-4 line-clamp-2">{d.descripcion}</p>
        )}

        {d.inscrito ? (
          <div className="space-y-1.5 mb-4">
            <div className="flex justify-between text-xs font-bold">
              <span style={{ color }}>Progreso</span>
              <span className="text-on-surface-variant">{progreso}/{d.meta_valor}</span>
            </div>
            <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}bb)` }}
              />
            </div>
          </div>
        ) : (
          <div className="mb-4" />
        )}

        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-base">schedule</span>
            {dias === 0 ? 'Último día' : `${dias} días`}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleInscripcion(d.id, !!d.inscrito); }}
            className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-all active:scale-95 border ${
              d.inscrito
                ? 'bg-transparent border-primary text-primary'
                : 'text-white border-transparent'
            }`}
            style={d.inscrito ? {} : { background: color }}
          >
            {d.inscrito ? '✕ Desuscribirme' : '✓ Unirme'}
          </button>
        </div>
      </div>
    </div>
  );
}

type Filtro = 'TODOS' | 'RECICLAJE' | 'RACHA' | 'COMUNIDAD' | 'IMPACTO' | 'EVENTO';

const FILTROS: { key: Filtro; label: string; icon: string }[] = [
  { key: 'TODOS', label: 'Todos', icon: 'apps' },
  { key: 'RECICLAJE', label: 'Reciclaje', icon: ' recycling' },
  { key: 'RACHA', label: 'Racha', icon: 'local_fire_department' },
  { key: 'COMUNIDAD', label: 'Comunidad', icon: 'diversity_3' },
  { key: 'IMPACTO', label: 'Impacto', icon: 'monitoring' },
  { key: 'EVENTO', label: 'Evento', icon: 'event' },
];

export default function DesafiosPage() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { notify } = useNotification();
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [filtro, setFiltro] = useState<Filtro>('TODOS');
  const isAdmin = usuario?.role === 'ADMIN';

  const { data, isLoading, error, refetch } = useFetch(
    (signal) => usuario
      ? desafioService.getActivosConInscripcion(usuario.id, signal)
      : desafioService.getActivos(signal),
    [usuario?.id, refreshKey]
  );

  async function handleToggleInscripcion(desafioId: number, inscrito: boolean) {
    if (!usuario) return;
    try {
      if (inscrito) {
        await desafioService.desistir(desafioId, usuario.id);
        notify('info', 'Te desuscribiste del desafío.');
      } else {
        await desafioService.inscribirse(desafioId, usuario.id);
        notify('success', '¡Te inscribiste al desafío!');
      }
      setRefreshKey(k => k + 1);
    } catch {
      notify('error', 'No se pudo completar la operación.');
    }
  }

  const desafios: Desafio[] = data ?? [];
  const filtrados = filtro === 'TODOS'
    ? desafios
    : desafios.filter(d => d.categoria?.toUpperCase() === filtro);

  const activos = filtrados.filter(d => d.activo);
  const inactivos = filtrados.filter(d => !d.activo);

  return (
    <div className="relative">
      {/* Floating blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-container floating-blob animate-pulse" />
        <div className="absolute top-1/3 -left-48 w-[400px] h-[400px] rounded-full bg-secondary-container floating-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-24 right-1/4 w-80 h-80 rounded-full bg-tertiary-container floating-blob" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <section className="text-center lg:text-left">
          <span className="inline-block bg-primary-container text-on-primary-container px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            Retos ecológicos
          </span>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-on-background leading-tight tracking-tight">
                Desafíos.
              </h1>
              <p className="text-on-surface-variant text-lg max-w-2xl mt-4">
                Completa retos ecológicos y acumula puntos extra.
              </p>
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowForm(s => !s)}
                className="flex items-center gap-2 bg-surface-container-lowest px-5 py-2.5 rounded-lg font-bold text-sm shadow-md shadow-on-surface/5 border border-outline-variant/10 hover:shadow-lg transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-base">{showForm ? 'close' : 'add'}</span>
                {showForm ? 'Cancelar' : 'Nuevo desafío'}
              </button>
            )}
          </div>
        </section>

        {/* Admin form */}
        {isAdmin && showForm && (
          <div className="bg-surface-container-lowest rounded-lg p-6 md:p-8 shadow-xl shadow-on-surface/5 border border-outline-variant/10">
            <CrearDesafioForm onSuccess={() => { setShowForm(false); setRefreshKey(k => k + 1); }} />
          </div>
        )}

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap">
          {FILTROS.map(f => (
            <button
              key={f.key}
              onClick={() => setFiltro(f.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all active:scale-95 border ${
                filtro === f.key
                  ? 'bg-primary text-on-primary border-transparent'
                  : 'bg-surface-container text-on-surface-variant border-outline-variant/20'
              }`}
            >
              <span className="material-symbols-outlined text-base">{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>

        {isLoading && <Skeleton rows={4} />}
        {error && <ErrorMessage error={error} onRetry={refetch} />}

        {!isLoading && !error && filtrados.length === 0 && (
          <EmptyState title="No hay desafíos en esta categoría" description="Prueba con otro filtro o vuelve más tarde." />
        )}

        {!isLoading && !error && activos.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <h2 className="font-headline text-lg font-bold text-on-surface">Activos ({activos.length})</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {activos.map(d => (
                <DesafioCard
                  key={d.id} d={d}
                  onToggleInscripcion={handleToggleInscripcion}
                  onVerDetalle={(id) => navigate(`/desafios/${id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {!isLoading && !error && isAdmin && inactivos.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <span className="w-2.5 h-2.5 rounded-full bg-on-surface-variant/40" />
              <h2 className="font-headline text-lg font-bold text-on-surface-variant">Finalizados ({inactivos.length})</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 opacity-60">
              {inactivos.map(d => (
                <DesafioCard
                  key={d.id} d={d}
                  onToggleInscripcion={handleToggleInscripcion}
                  onVerDetalle={(id) => navigate(`/desafios/${id}`)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
