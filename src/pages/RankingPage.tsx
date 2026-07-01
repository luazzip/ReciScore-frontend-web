import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { rankingService } from '../services/rankingService';
import { configService } from '../services/configService';
import { useAuth } from '../hooks/useAuth';
import RankingFilterByDistrito from '../components/ranking/RankingFilterByDistrito';
import Skeleton from '../components/common/Skeleton';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';

const ICONOS_DISTRITO: Record<string, string> = {
  'Miraflores': 'park',
  'San Isidro': 'location_on',
  'San Borja': 'apartment',
  'Surco': 'nature',
  'La Molina': 'forest',
  'Barranco': 'palette',
  'Jesús María': 'church',
  'Pueblo Libre': 'museum',
  'San Miguel': 'shopping_cart',
  'Lima': 'location_city',
  'Cercado de Lima': 'location_city',
};

function RankNumber({ pos, isUser }: { pos: number; isUser?: boolean }) {
  if (pos === 1) {
    return <span className="w-8 h-8 flex items-center justify-center rounded-full bg-tertiary-container text-on-tertiary-container font-black text-xs">1</span>;
  }
  if (isUser) {
    return <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-on-primary font-black text-xs">{pos}</span>;
  }
  return <span className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant font-black text-xs">{pos}</span>;
}

function Avatar({ src, name, className = '' }: { src?: string | null; name: string; className?: string }) {
  if (src) {
    return <img alt={name} className={`w-10 h-10 rounded-full object-cover ${className}`} src={src} />;
  }
  return (
    <div className={`w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm ${className}`}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function RankingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { usuario } = useAuth();
  const distrito = searchParams.get('distrito') ?? 'Todos';

  const { data: distritos } = useFetch<string[]>(
    (signal) => configService.getDistritos(signal),
    []
  );

  const { data, isLoading, error, refetch } = useFetch(
    (signal) =>
      distrito === 'Todos'
        ? rankingService.getGlobal(signal)
        : rankingService.getPorDistrito(distrito, signal),
    [distrito]
  );

  const distritosRanking = useMemo(() => {
    if (!data) return [];
    const agrupado = data.reduce<Record<string, number>>((acc, e) => {
      const dist = e.location || 'Sin distrito';
      acc[dist] = (acc[dist] || 0) + e.points;
      return acc;
    }, {});
    return Object.entries(agrupado)
      .map(([nombre, pts]) => ({
        nombre,
        pts: pts.toLocaleString('es-PE'),
        ptsRaw: pts,
        icon: ICONOS_DISTRITO[nombre] ?? 'location_city',
        tuyo: usuario ? nombre === usuario.location : false,
      }))
      .sort((a, b) => b.ptsRaw - a.ptsRaw)
      .map((d, i) => ({ ...d, pos: i + 1 }));
  }, [data, usuario]);

  const ptsBaseNivel = usuario ? (usuario.nivel - 1) * 2500 : 0;
  const pointsProgress = usuario ? Math.min(Math.round(((usuario.points - ptsBaseNivel) / 2500) * 100), 100) : 0;
  const pointsToNext = usuario ? (usuario.nivel * 2500) - usuario.points : 2500;

  return (
    <div className="relative">
      {/* Blobs decorativos como Register */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary-container floating-blob animate-pulse" />
        <div className="absolute top-1/3 -right-48 w-[500px] h-[500px] rounded-full bg-secondary-container floating-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 rounded-full bg-tertiary-container floating-blob" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* Hero */}
        <section className="text-center lg:text-left">
          <span className="inline-block bg-primary-container text-on-primary-container px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            Ranking de Recicladores
          </span>
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-on-background leading-tight tracking-tight">
            Recicladores de <span className="text-primary italic">Élite.</span>
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl mt-4">
            Descubre quiénes están marcando la diferencia. Cada punto cuenta para un futuro más sostenible.
          </p>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ranking */}
          <div className="lg:col-span-2 space-y-8">
            {/* Ranking Global con filtro de distrito */}
            <div className="bg-surface-container-lowest rounded-lg shadow-xl shadow-on-surface/5 border border-outline-variant/10 overflow-hidden">
              <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary-container rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: '"FILL" 1' }}>leaderboard</span>
                    </div>
                    <h2 className="font-headline text-xl font-bold">Ranking General</h2>
                  </div>
                </div>
                <div className="mb-4">
                  <RankingFilterByDistrito
                    value={distrito}
                    onChange={(d) => setSearchParams(d === 'Todos' ? {} : { distrito: d })}
                    distritos={['Todos', ...(distritos ?? [])]}
                  />
                </div>
              </div>

              {isLoading && <Skeleton rows={5} />}
              {error && <ErrorMessage error={error} onRetry={refetch} />}
              {!isLoading && !error && (!data || data.length === 0) && (
                <div className="px-6 pb-6">
                  <EmptyState title="Sin datos de ranking todavía" />
                </div>
              )}

              {!isLoading && !error && data && data.length > 0 && (
                <>
                  <div className="grid grid-cols-12 px-6 py-4 bg-surface-container-low text-on-surface-variant text-[10px] uppercase font-bold tracking-widest border-b border-outline-variant/10">
                    <div className="col-span-1">NRO</div>
                    <div className="col-span-6">Usuario</div>
                    <div className="col-span-2 text-center">Nivel</div>
                    <div className="col-span-3 text-right">Pts Impacto</div>
                  </div>
                  <div className="divide-y divide-surface-container">
                    {data.map((e) => {
                      const esYo = !!(usuario && (e.userId === usuario.id || e.username === usuario.username));
                      return (
                        <div
                          key={e.posicion}
                          className={`grid grid-cols-12 px-6 py-5 items-center transition-colors group ${
                            esYo
                              ? 'bg-primary-container/20 border-x-4 border-primary'
                              : 'hover:bg-surface-container-low'
                          }`}
                        >
                          <div className="col-span-1">
                            <RankNumber pos={e.posicion} isUser={esYo} />
                          </div>
                          <div className="col-span-6 flex items-center gap-3">
                            {esYo ? (
                              <div className="relative">
                                <Avatar src={usuario?.profilePicture} name={e.name ?? e.username} className="border-2 border-primary" />
                                <span className="absolute -bottom-1 -right-1 bg-primary text-white text-[8px] px-1 rounded-full border border-surface">TÚ</span>
                              </div>
                            ) : (
                              <Avatar name={e.name ?? e.username} />
                            )}
                            <div>
                              <p className="font-bold text-on-surface">{e.name ?? e.username}</p>
                            </div>
                          </div>
                          <div className="col-span-2 text-center font-headline font-bold text-secondary">LV. {e.nivel}</div>
                          <div className="col-span-3 text-right font-headline font-black text-primary text-lg">
                            {e.points.toLocaleString('es-PE')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Ranking entre Distritos */}
            <div className="bg-surface-container-lowest rounded-lg shadow-xl shadow-on-surface/5 border border-outline-variant/10 overflow-hidden">
              <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary-container rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: '"FILL" 1' }}>groups</span>
                    </div>
                    <h2 className="font-headline text-xl font-bold">Ranking entre Distritos</h2>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 px-6 py-4 bg-surface-container-low text-on-surface-variant text-[10px] uppercase font-bold tracking-widest border-b border-outline-variant/10">
                <div className="col-span-1">NRO</div>
                <div className="col-span-7">Distrito</div>
                <div className="col-span-4 text-right">Puntaje Total</div>
              </div>
              {distritosRanking.length === 0 ? (
                <div className="p-8">
                  <EmptyState title="Sin datos de distritos" description="Aún no hay suficientes datos para mostrar el ranking entre distritos." />
                </div>
              ) : (
                <div className="divide-y divide-surface-container">
                  {distritosRanking.map(d => (
                    <div
                      key={d.nombre}
                      className={`grid grid-cols-12 px-6 py-5 items-center ${
                        d.tuyo ? 'bg-primary-container/20 border-x-4 border-primary' : 'hover:bg-surface-container-low transition-colors'
                      }`}
                    >
                      <div className="col-span-1">
                        <RankNumber pos={d.pos} isUser={d.tuyo} />
                      </div>
                      <div className="col-span-7 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          d.tuyo ? 'bg-primary-container text-primary-dim' : 'bg-green-100 text-green-700'
                        }`}>
                          <span className="material-symbols-outlined">{d.icon}</span>
                        </div>
                        {d.tuyo ? (
                          <div>
                            <p className="font-bold text-on-surface">{d.nombre}</p>
                            <p className="text-[10px] text-primary uppercase font-bold tracking-tight">Tu Distrito</p>
                          </div>
                        ) : (
                          <p className="font-bold text-on-surface">{d.nombre}</p>
                        )}
                      </div>
                      <div className="col-span-4 text-right font-headline font-black text-primary text-lg">{d.pts}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tus Estadísticas */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-tertiary-container rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary text-lg" style={{ fontVariationSettings: '"FILL" 1' }}>bar_chart</span>
              </div>
              <h2 className="font-headline text-xl font-bold">Tus Estadísticas</h2>
            </div>

            <div className="bg-surface-container-lowest rounded-lg shadow-xl shadow-on-surface/5 border border-outline-variant/10 p-6 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16" />
              <div className="relative z-10">
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Próximo RANGO</p>
                <h3 className="text-2xl font-black text-on-surface mt-1">Nivel {usuario?.nivel ?? 1}</h3>
                <div className="mt-4 h-3 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary shadow-[inset_0_1px_3px_rgba(255,255,255,0.3)]" style={{ width: `${pointsProgress}%` }} />
                </div>
                <p className="text-xs text-on-surface-variant mt-2 text-right">{pointsToNext.toLocaleString()} pts para subir de nivel</p>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12">
                <span className="material-symbols-outlined text-[12rem]">eco</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-lowest rounded-lg shadow-xl shadow-on-surface/5 border border-outline-variant/10 p-4 flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-secondary mb-2" style={{ fontVariationSettings: '"FILL" 1' }}>recycling</span>
                <p className="text-2xl font-black text-on-surface">{usuario?.reciclajes ?? 0} uds</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Total Reciclado</p>
              </div>
              <div className="bg-surface-container-lowest rounded-lg shadow-xl shadow-on-surface/5 border border-outline-variant/10 p-4 flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-tertiary mb-2" style={{ fontVariationSettings: '"FILL" 1' }}>token</span>
                <p className="text-2xl font-black text-on-surface">{usuario?.points.toLocaleString() ?? 0}</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Puntos Totales</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
