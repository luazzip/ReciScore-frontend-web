import { useState } from 'react';
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
  PLASTICO: '🧴', PAPEL: '📄', VIDRIO: '🍶',
  METAL: '🔩', COMUNIDAD: '👥', GENERAL: '🌿',
};

const CAT_COLOR: Record<string, string> = {
  PLASTICO: '#3b82f6', PAPEL: '#f97316', VIDRIO: '#10b981',
  METAL: '#6b7280', COMUNIDAD: '#8b5cf6', GENERAL: '#22c55e',
};

function diasRestantes(fechaFin: string) {
  const diff = new Date(fechaFin).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function DesafioCard({ d, onInscribirse }: { d: Desafio; onInscribirse: (id: number) => void }) {
  const cat = d.categoria?.toUpperCase() ?? 'GENERAL';
  const color = CAT_COLOR[cat] ?? '#22c55e';
  const icon  = CAT_ICON[cat]  ?? '🌿';
  const dias  = diasRestantes(d.fecha_fin);

  return (
    <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* color stripe */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: color }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '0.25rem', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
            background: color + '18', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '1.25rem'
          }}>{icon}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--gray-800)' }}>{d.titulo}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{d.categoria}</div>
          </div>
        </div>
        <span className="badge-ok" style={{ background: color + '18', color, flexShrink: 0 }}>
          +{d.puntos} pts
        </span>
      </div>

      {d.descripcion && (
        <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.875rem' }}>
          {d.descripcion}
        </p>
      )}

      {/* Progress */}
      <div className="progress-bar" style={{ marginBottom: '0.375rem' }}>
        <div className="progress-fill" style={{ width: d.inscrito ? '30%' : '0%', background: color }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--gray-400)', marginBottom: '1rem' }}>
        <span>Progreso 0/{d.meta_valor}</span>
        <span style={{ color: dias <= 3 ? '#ef4444' : 'var(--gray-400)' }}>
          {dias === 0 ? 'Último día' : `${dias} días restantes`}
        </span>
      </div>

      <button
        onClick={() => onInscribirse(d.id)}
        className="btn"
        style={{
          background: d.inscrito ? 'var(--gray-100)' : color,
          color: d.inscrito ? 'var(--gray-500)' : 'white',
          padding: '0.5rem 1.25rem', fontSize: '0.875rem',
          width: 'auto', borderRadius: 999
        }}
      >
        {d.inscrito ? '✓ Inscrito' : 'Unirme al desafío'}
      </button>
    </div>
  );
}

type Filtro = 'TODOS' | 'PLASTICO' | 'PAPEL' | 'VIDRIO' | 'METAL' | 'COMUNIDAD';

const FILTROS: { key: Filtro; label: string }[] = [
  { key: 'TODOS',     label: 'Todos' },
  { key: 'PLASTICO',  label: '🧴 Plástico' },
  { key: 'PAPEL',     label: '📄 Papel' },
  { key: 'VIDRIO',    label: '🍶 Vidrio' },
  { key: 'COMUNIDAD', label: '👥 Comunidad' },
];

export default function DesafiosPage() {
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

  async function handleInscribirse(desafioId: number) {
    if (!usuario) return;
    try {
      await desafioService.inscribirse(desafioId, usuario.id);
      notify('success', '¡Te inscribiste al desafío!');
      setRefreshKey(k => k + 1);
    } catch {
      notify('error', 'No se pudo completar la inscripción.');
    }
  }

  const desafios: Desafio[] = data ?? [];
  const filtrados = filtro === 'TODOS'
    ? desafios
    : desafios.filter(d => d.categoria?.toUpperCase() === filtro);

  const activos   = filtrados.filter(d => d.activo);
  const inactivos = filtrados.filter(d => !d.activo);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Desafíos Diarios</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9375rem' }}>
            Completa retos ecológicos y acumula puntos extra.
          </p>
        </div>
        {isAdmin && (
          <button
            className="btn btn-primary"
            style={{ width: 'auto', padding: '0.5rem 1.25rem' }}
            onClick={() => setShowForm(s => !s)}
          >
            {showForm ? '✕ Cancelar' : '+ Crear desafío'}
          </button>
        )}
      </div>

      {/* Admin form */}
      {isAdmin && showForm && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-title">Nuevo desafío</div>
          <CrearDesafioForm onSuccess={() => { setShowForm(false); setRefreshKey(k => k + 1); }} />
        </div>
      )}

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {FILTROS.map(f => (
          <button
            key={f.key}
            onClick={() => setFiltro(f.key)}
            style={{
              padding: '0.375rem 1rem', borderRadius: 999, border: 'none', cursor: 'pointer',
              background: filtro === f.key ? 'var(--green-600)' : 'var(--gray-100)',
              color: filtro === f.key ? 'white' : 'var(--gray-600)',
              fontWeight: filtro === f.key ? 700 : 400, fontSize: '0.875rem',
              transition: 'all 0.2s'
            }}
          >{f.label}</button>
        ))}
      </div>

      {isLoading && <Skeleton rows={4} />}
      {error && <ErrorMessage error={error} onRetry={refetch} />}

      {!isLoading && !error && filtrados.length === 0 && (
        <EmptyState title="No hay desafíos en esta categoría" description="Prueba con otro filtro o vuelve más tarde." />
      )}

      {!isLoading && !error && activos.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.125rem', color: 'var(--green-700)' }}>
            ⚡ Activos ({activos.length})
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
            {activos.map(d => (
              <DesafioCard key={d.id} d={d} onInscribirse={handleInscribirse} />
            ))}
          </div>
        </div>
      )}

      {!isLoading && !error && inactivos.length > 0 && (
        <div>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.125rem', color: 'var(--gray-400)' }}>
            Finalizados ({inactivos.length})
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem', opacity: 0.6 }}>
            {inactivos.map(d => (
              <DesafioCard key={d.id} d={d} onInscribirse={handleInscribirse} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}