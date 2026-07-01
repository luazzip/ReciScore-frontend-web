import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { desafioService } from '../services/desafioService';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import Skeleton from '../components/common/Skeleton';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';

const CAT_ICON: Record<string, string> = {
  RECICLAJE: ' recycling', COMUNIDAD: 'diversity_3', RACHA: 'local_fire_department',
  IMPACTO: 'monitoring', EVENTO: 'event', GENERAL: 'eco',
};

const CAT_COLOR: Record<string, string> = {
  RECICLAJE: '#16a34a', COMUNIDAD: '#8b5cf6', RACHA: '#ef4444',
  IMPACTO: '#f97316', EVENTO: '#3b82f6', GENERAL: '#16a34a',
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
    (signal) => desafioService.getById(Number(id), signal, usuario?.id),
    [id, usuario?.id]
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

  if (isLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <Skeleton rows={6} />
    </div>
  );
  if (error) return <div className="min-h-screen bg-background flex items-center justify-center p-8"><ErrorMessage error={error} onRetry={refetch} /></div>;
  if (!data) return <div className="min-h-screen bg-background flex items-center justify-center p-8"><EmptyState title="Desafío no encontrado" description="El desafío que buscas no existe o ha sido eliminado." /></div>;

  const cat = data.categoria?.toUpperCase() ?? 'GENERAL';
  const color = CAT_COLOR[cat] ?? '#16a34a';
  const icon = CAT_ICON[cat] ?? 'eco';
  const dias = diasRestantes(data.fecha_fin);
  const unidad = data.categoria === 'RACHA' ? 'días' : 'kg';
  const progreso = data.progresoActual ?? 0;
  const pct = data.inscrito ? Math.min(100, (progreso / data.meta_valor) * 100) : 0;

  return (
    <div className="relative">
      {/* Floating blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary-container floating-blob animate-pulse" />
        <div className="absolute top-1/2 -right-48 w-[500px] h-[500px] rounded-full bg-secondary-container floating-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 rounded-full bg-tertiary-container floating-blob" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/desafios')}
          className="flex items-center gap-1.5 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors group"
        >
          <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Volver a desafíos
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT - main content */}
          <div className="lg:col-span-7 space-y-6">
            {/* Hero card */}
            <div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-xl shadow-on-surface/5 border border-outline-variant/10">
              <div style={{ height: 5, background: `linear-gradient(90deg, ${color}, ${color}66)` }} />
              <div className="p-6 md:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: color + '18' }}>
                    <span className="material-symbols-outlined text-3xl" style={{ color, fontVariationSettings: '"FILL" 1' }}>{icon}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">{data.categoria}</div>
                    <h1 className="font-headline text-2xl md:text-3xl font-extrabold tracking-tight text-on-surface leading-tight">{data.titulo}</h1>
                    <div className="flex gap-2 mt-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full" style={{ background: data.activo ? '#16a34a18' : '#ef444418', color: data.activo ? '#16a34a' : '#ef4444' }}>
                        {data.activo ? 'Activo' : 'Inactivo'}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary-container text-on-primary-container">
                        +{data.puntos} pts
                      </span>
                    </div>
                  </div>
                </div>

                {data.descripcion && (
                  <p className="text-sm md:text-base text-on-surface-variant leading-relaxed mb-8">{data.descripcion}</p>
                )}

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {[
                    { label: 'Recompensa', value: `+${data.puntos} pts`, color: 'text-primary' },
                    { label: 'Meta', value: `${data.meta_valor} ${unidad}`, color: 'text-on-surface' },
                    { label: 'Días rest.', value: dias === 0 ? 'Último día' : `${dias}d`, color: dias <= 3 ? 'text-error' : 'text-on-surface' },
                  ].map(s => (
                    <div key={s.label} className="p-4 rounded-lg text-center bg-surface-container-low border border-outline-variant/20">
                      <div className={`font-headline text-xl md:text-2xl font-extrabold tracking-tight mb-0.5 ${s.color}`}>{s.value}</div>
                      <div className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-on-surface">Progreso</span>
                    <span className="text-sm text-on-surface-variant">
                      {data.inscrito ? `${progreso} / ${data.meta_valor} ${unidad}` : 'No inscrito'}
                    </span>
                  </div>
                  <div className="h-3 bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}88)` }}
                    />
                  </div>
                </div>

                {/* CTA */}
                {data.activo && (
                  data.inscrito ? (
                    <div className="flex gap-3">
                      <button
                        onClick={handleDesistir}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-bold text-sm transition-all active:scale-95 bg-surface-container-high text-on-surface-variant"
                      >
                        <span className="material-symbols-outlined text-lg">logout</span>
                        Retirarme
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleInscribirse}
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-lg font-bold text-sm transition-all active:scale-95 shadow-lg text-white"
                      style={{ background: color }}
                    >
                      <span className="material-symbols-outlined">celebration</span>
                      Unirme al desafío
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Dates card */}
            <div className="bg-surface-container-lowest rounded-lg p-6 shadow-xl shadow-on-surface/5 border border-outline-variant/10">
              <div className="font-headline font-bold text-base mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-primary">calendar_month</span>
                Fechas
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/20">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">INICIO</div>
                  <div className="font-semibold text-sm text-on-surface">{fmt(data.fecha_inicio)}</div>
                </div>
                <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/20">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">FIN</div>
                  <div className="font-semibold text-sm text-on-surface">{fmt(data.fecha_fin)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface-container-lowest rounded-lg p-6 shadow-xl shadow-on-surface/5 border border-outline-variant/10">
              <div className="font-headline font-bold text-base mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-secondary">lightbulb</span>
                Consejos
              </div>
              <div className="space-y-4">
                {[
                  { icon: 'camera', text: 'Fotografía el material con buena iluminación para una validación IA más rápida.' },
                  { icon: 'location_on', text: 'Asegúrate de estar en un punto de reciclaje verificado para que el GPS valide tu registro.' },
                  { icon: 'flag', text: 'Completa el desafío antes de la fecha límite para obtener los puntos bonus.' },
                  { icon: 'group_add', text: 'Invita amigos a sumarse y compite juntos en el ranking del desafío.' },
                ].map((tip, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: color + '18' }}>
                      <span className="material-symbols-outlined text-base" style={{ color, fontVariationSettings: '"FILL" 1' }}>{tip.icon}</span>
                    </div>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{tip.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg p-6 text-center border bg-surface-container-lowest shadow-xl shadow-on-surface/5 border-outline-variant/10">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: color + '20' }}>
                <span className="material-symbols-outlined text-3xl" style={{ color, fontVariationSettings: '"FILL" 1' }}>workspace_premium</span>
              </div>
              <div className="font-headline text-2xl font-extrabold tracking-tight mb-1" style={{ color }}>+{data.puntos} pts</div>
              <p className="text-sm text-on-surface-variant">al completar este desafío</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
