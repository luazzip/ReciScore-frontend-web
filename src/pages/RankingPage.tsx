import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { rankingService } from '../services/rankingService';
import { useAuth } from '../hooks/useAuth';
import RankingFilterByDistrito from '../components/ranking/RankingFilterByDistrito';
import Skeleton from '../components/common/Skeleton';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';

const LEVEL_TITLES = [
  { max: 10, title: 'Aprendiz Verde' },
  { max: 20, title: 'Estrella Naciente' },
  { max: 30, title: 'Maestro Upcycler' },
  { max: 40, title: 'Leyenda Eco' },
  { max: Infinity, title: 'Guardián del Planeta' },
];

function getLevelTitle(nivel: number): string {
  return LEVEL_TITLES.find(t => nivel <= t.max)?.title ?? 'Curador';
}

const DISTRITOS = [
  { pos: 1, nombre: 'Miraflores', pts: '842,500', icon: 'park', tuyo: false },
  { pos: 2, nombre: 'San Isidro', pts: '798,210', icon: 'location_on', tuyo: true },
  { pos: 3, nombre: 'San Borja', pts: '654,100', icon: 'apartment', tuyo: false },
];

function RankNumber({ pos, isUser }: { pos: number; isUser?: boolean }) {
  if (pos === 1) {
    return <span className="w-8 h-8 flex items-center justify-center rounded-full bg-tertiary-container text-on-tertiary-container font-black text-xs">1</span>;
  }
  if (isUser) {
    return <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-on-primary font-black text-xs">{pos}</span>;
  }
  return <span className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-200 text-zinc-600 font-black text-xs">{pos}</span>;
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

type Periodo = 'Semanal' | 'Histórico';

export default function RankingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [periodo, setPeriodo] = useState<Periodo>('Semanal');
  const { usuario } = useAuth();
  const distrito = searchParams.get('distrito') ?? 'Todos';

  const { data, isLoading, error, refetch } = useFetch(
    (signal) =>
      distrito === 'Todos'
        ? rankingService.getGlobal(signal)
        : rankingService.getPorDistrito(distrito, signal),
    [distrito]
  );

  const pointsNextLevel = 5000;
  const pointsProgress = usuario ? Math.min(Math.round((usuario.points / pointsNextLevel) * 100), 100) : 0;
  const pointsToNext = usuario ? pointsNextLevel - usuario.points : 5000;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="space-y-4 lg:col-span-12">
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-on-background leading-tight tracking-tight">
            Recicladores de <span className="text-primary italic">Élite.</span>
          </h1>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="font-headline text-2xl font-bold">Ranking entre amigos</h2>
                <span className="text-2xl">🏆</span>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-full">Semanal</button>
              </div>
            </div>

            {isLoading && <Skeleton rows={5} />}
            {error && <ErrorMessage error={error} onRetry={refetch} />}
            {!isLoading && !error && (!data || data.length === 0) && (
              <EmptyState title="Sin datos de ranking todavía" />
            )}

            {!isLoading && !error && data && data.length > 0 && (
              <div className="bg-surface-container-lowest rounded-lg overflow-hidden border border-outline-variant/10">
                <div className="grid grid-cols-12 px-6 py-4 bg-surface-container-low text-on-surface-variant text-[10px] uppercase font-bold tracking-widest border-b border-outline-variant/10">
                  <div className="col-span-1">NRO</div>
                  <div className="col-span-6">Usuario</div>
                  <div className="col-span-2 text-center">Nivel</div>
                  <div className="col-span-3 text-right">Pts Impacto</div>
                </div>
                <div className="divide-y divide-surface-container">
                  {data.map((e) => {
                    const esYo = usuario && (e.userId === usuario.id || e.username === usuario.username);
                    const title = getLevelTitle(e.nivel);
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
                            <p className="text-xs text-on-surface-variant italic">{title}</p>
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
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold uppercase tracking-widest">
                <span className="material-symbols-outlined text-xs">location_on</span>
                Distrito: {distrito}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-2xl font-bold">Ranking por Distritos</h2>
              <div className="flex gap-2">
                {(['Semanal', 'Histórico'] as Periodo[]).map(p => (
                  <button
                    key={p}
                    onClick={() => setPeriodo(p)}
                    className={`px-4 py-2 text-xs font-bold rounded-full ${
                      periodo === p
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container text-on-surface'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <RankingFilterByDistrito
              value={distrito}
              onChange={(d) => setSearchParams(d === 'Todos' ? {} : { distrito: d })}
            />

            <div className="bg-surface-container-lowest rounded-lg overflow-hidden border border-outline-variant/10">
              <div className="grid grid-cols-12 px-6 py-4 bg-surface-container-low text-on-surface-variant text-[10px] uppercase font-bold tracking-widest border-b border-outline-variant/10">
                <div className="col-span-1">NRO</div>
                <div className="col-span-7">Distrito</div>
                <div className="col-span-4 text-right">Puntaje Total</div>
              </div>
              <div className="divide-y divide-surface-container">
                {DISTRITOS.map(d => (
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
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="font-headline text-2xl font-bold">Tus Estadísticas</h2>

          <div className="bg-surface-container-high rounded-lg p-6 space-y-6 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Próximo RANGO</p>
              <h3 className="text-2xl font-black text-on-surface mt-1">Nivel {(usuario?.nivel ?? 14) + 1} Pro</h3>
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
            <div className="bg-surface-container-lowest p-4 rounded-lg flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-secondary mb-2" style={{ fontVariationSettings: '"FILL" 1' }}>recycling</span>
              <p className="text-2xl font-black text-on-surface">{usuario?.reciclajes ?? 0} uds</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Total Reciclado</p>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded-lg flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-tertiary mb-2" style={{ fontVariationSettings: '"FILL" 1' }}>token</span>
              <p className="text-2xl font-black text-on-surface">{usuario?.points.toLocaleString() ?? 0}</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Puntos Totales</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
