import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { desafioService } from '../services/desafioService';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import Skeleton from '../components/common/Skeleton';
import ErrorMessage from '../components/common/ErrorMessage';

const CAT_ICON: Record<string, string> = {
  PLASTICO: '🧴', PAPEL: '📄', VIDRIO: '🍶',
  METAL: '🔩', COMUNIDAD: '👥', GENERAL: '🌿',
};

const CAT_COLOR: Record<string, string> = {
  PLASTICO: '#3b82f6', PAPEL: '#f97316', VIDRIO: '#10b981',
  METAL: '#6b7280', COMUNIDAD: '#8b5cf6', GENERAL: '#22c55e',
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' });
}

function diasRestantes(fechaFin: string) {
  const diff = new Date(fechaFin).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function DesafioDetallePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { notify } = useNotification();

  const { data, isLoading, error, refetch } = useFetch(
    (signal) => desafioService.getById(Number(id), signal),
    [id]
  );

  async function handleInscribirse() {
    if (!usuario || !data) return;
    try {
      await desafioService.inscribirse(data.id, usuario.id);
      notify('success', '¡Te inscribiste al desafío!');
      refetch();
    } catch {
      notify('error', 'No se pudo completar la inscripción.');
    }
  }

  async function handleDesistir() {
    if (!usuario || !data) return;
    try {
      await desafioService.desistir(data.id, usuario.id);
      notify('info', 'Te retiraste del desafío.');
      refetch();
    } catch {
      notify('error', 'No se pudo procesar la acción.');
    }
  }

  if (isLoading) return <div style={{ padding: '2rem' }}><Skeleton rows={5} /></div>;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;
  if (!data) return null;

  const cat   = data.categoria?.toUpperCase() ?? 'GENERAL';
  const color = CAT_COLOR[cat] ?? '#22c55e';
  const icon  = CAT_ICON[cat]  ?? '🌿';
  const dias  = diasRestantes(data.fecha_fin);
  const unidad = data.categoria === 'RACHA' ? 'días' : 'artículos';

  return (
    <div>
      {/* Back */}
      <button
        onClick={() => navigate('/desafios')}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--gray-500)', fontSize: '0.875rem', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: '0.375rem',
          marginBottom: '1.5rem', padding: 0
        }}
      >
        ← Volver a desafíos
      </button>

      <div className="ranking-layout">
        {/* LEFT — detail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Hero card */}
          <div className="card" style={{ position: 'relative', overflow: 'hidden', padding: '2rem' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: color }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: color + '18', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem'
              }}>{icon}</div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                  {data.categoria}
                </div>
                <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{data.titulo}</h1>
                <span className={data.activo ? 'badge-ok' : 'badge-warning'}>
                  {data.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>

            {data.descripcion && (
              <p style={{ color: 'var(--gray-500)', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                {data.descripcion}
              </p>
            )}

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Recompensa',     value: `+${data.puntos} pts`, color: 'var(--green-600)' },
                { label: 'Meta',           value: `${data.meta_valor} ${unidad}`, color: 'var(--gray-800)' },
                { label: 'Días restantes', value: dias === 0 ? 'Último día' : `${dias}d`, color: dias <= 3 ? '#ef4444' : 'var(--gray-800)' },
              ].map(s => (
                <div key={s.label} style={{
                  padding: '1rem', background: 'var(--gray-50)',
                  borderRadius: 'var(--radius)', textAlign: 'center',
                  border: '1px solid var(--gray-200)'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color, marginBottom: '0.25rem' }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--gray-600)', fontWeight: 600 }}>Progreso</span>
                <span style={{ color: 'var(--gray-400)' }}>
                  {data.inscrito ? `0 / ${data.meta_valor} ${unidad}` : 'No inscrito'}
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{
                  width: data.inscrito ? '10%' : '0%',
                  background: color
                }} />
              </div>
            </div>

            {/* CTA */}
            {data.activo && (
              data.inscrito ? (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn btn-primary" style={{ flex: 1, background: color }}>
                    Registrar avance
                  </button>
                  <button
                    onClick={handleDesistir}
                    className="btn"
                    style={{ width: 'auto', padding: '0.75rem 1.25rem', background: 'var(--gray-100)', color: 'var(--gray-500)', fontSize: '0.875rem' }}
                  >
                    Retirarme
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleInscribirse}
                  className="btn btn-primary"
                  style={{ background: color }}
                >
                  🚀 Unirme al desafío
                </button>
              )
            )}
          </div>

          {/* Dates card */}
          <div className="card">
            <div className="card-title">Fechas</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                  INICIO
                </div>
                <div style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{fmt(data.fecha_inicio)}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                  FIN
                </div>
                <div style={{ fontWeight: 600, color: dias <= 3 ? '#ef4444' : 'var(--gray-800)' }}>
                  {fmt(data.fecha_fin)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — tips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card">
            <div className="card-title">💡 Consejos</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                'Fotografía el material con buena iluminación para una validación IA más rápida.',
                'Asegúrate de estar en un punto de reciclaje verificado para que el GPS valide tu registro.',
                'Completa el desafío antes de la fecha límite para obtener los puntos bonus.',
                'Invita amigos a sumarse y compite juntos en el ranking del desafío.',
              ].map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                    background: color + '18', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color
                  }}>{i + 1}</div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', margin: 0, lineHeight: 1.6 }}>{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ background: color + '10', border: `1px solid ${color}30` }}>
            <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏆</div>
              <div style={{ fontWeight: 700, fontSize: '1.25rem', color, marginBottom: '0.25rem' }}>+{data.puntos} pts</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>al completar este desafío</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}