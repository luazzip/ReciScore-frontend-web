import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { desafioService } from '../services/desafioService';
import { reciclajeService } from '../services/reciclajeService';
import { rankingService } from '../services/rankingService';
import { mapaService } from '../services/mapaService';
import { formatPeso, formatFecha } from '../utils/formatters';
import Spinner from '../components/common/Spinner';

const materialIcons: Record<string, string> = {
  'papel': 'description',
  'vidrio': 'wine_bar',
  'plastico': 'smart_toy',
  'metal': 'handyman',
  'electronico': 'devices',
  'organico': 'compost',
};

const materialColors: Record<string, string> = {
  'papel': 'bg-blue-100 text-blue-600',
  'vidrio': 'bg-amber-100 text-amber-600',
  'plastico': 'bg-purple-100 text-purple-600',
  'metal': 'bg-gray-100 text-gray-600',
  'electronico': 'bg-cyan-100 text-cyan-600',
  'organico': 'bg-green-100 text-green-600',
};

export default function DashboardPage() {
  const { usuario, isLoading: authLoading } = useAuth();

  const { data: desafios, isLoading: desafiosLoading } = useFetch(
    (signal) => desafioService.getActivos(signal),
    []
  );

  const { data: historial } = useFetch(
    (signal) => usuario ? reciclajeService.getHistorial(usuario.id, { page: 0, size: 5 }, signal) : Promise.resolve([]),
    [usuario?.id]
  );

  if (authLoading) return <Spinner fullScreen label="Cargando..." />;

  if (!usuario) {
    return (
      <section className="text-center py-20">
        <h1 className="text-3xl font-headline font-bold mb-4">Bienvenido a ReciScore</h1>
        <p className="text-on-surface-variant mb-6">Inicia sesión para ver tu información.</p>
        <Link to="/login" className="bg-primary text-on-primary px-6 py-3 rounded-lg font-bold">Iniciar sesión</Link>
      </section>
    );
  }

  const pointsProgress = Math.min(Math.round((usuario.points / 5000) * 100), 100);
  const displayChallenges = desafios?.slice(0, 2) ?? [];
  const recentActivity = historial?.slice(0, 3) ?? [];

  const PESO_POR_TAMANO: Record<string, number> = {
    PEQUENO: 0.8,
    MEDIANO: 2.4,
    GRANDE: 5.2,
  };
  const totalPeso = (historial ?? []).reduce(
    (acc, r) => acc + (PESO_POR_TAMANO[r.tamanoObjeto] ?? 0) * r.numeroArticulos,
    0
  );

  const { data: reportesZona } = useFetch(
    (signal) => mapaService.getReportesZona(signal),
    []
  );

  const { data: ranking } = useFetch(
    (signal) => rankingService.getGlobal(signal),
    []
  );
  const miRanking = ranking?.find(r => r.userId === usuario?.id) ?? null;

  return (
    <>
      <section className="relative overflow-hidden rounded-lg min-h-[320px] flex flex-col justify-end p-8 md:p-12 mb-12 group">
        <div className="absolute inset-0 z-0 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1749266002449-965994ab68b1?w=1600&q=80" alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black/90" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-white font-headline text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            ¡Hola de nuevo, <br /><span className="text-primary-container">{usuario.name}!</span>
          </h1>
          <p className="text-on-primary font-body text-lg mb-8 opacity-90 leading-relaxed">
            Has ahorrado {usuario.reciclajes} residuos. Cada acción tuya suma al cambio positivo.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/reciclaje/nuevo"
              className="bg-gradient-to-r from-primary to-primary-dim text-white px-8 py-4 font-bold shadow-xl hover:shadow-primary/20 transition-all active:scale-95 rounded-full"
            >
              Registrar reciclaje
            </Link>
            <Link
              to="/ranking"
              className="glass-panel text-white border border-white/20 px-8 py-4 font-bold hover:bg-white/20 transition-all rounded-full"
            >
              Ver Ranking
            </Link>
          </div>
        </div>
        <div className="absolute top-8 right-8 md:top-12 md:right-12 glass-panel-dark p-6 rounded-lg text-right hidden lg:block">
          <p className="text-white/80 text-[10px] uppercase tracking-widest mb-1">PUNTOS ACUMULADOS</p>
          <div className="text-white font-headline text-5xl font-extrabold tracking-tighter">
            {usuario.points.toLocaleString()}<span className="text-primary-container text-2xl ml-1">pts</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="font-headline text-2xl font-bold">Desafíos Diarios</h2>
            <Link to="/desafios" className="text-primary font-bold text-sm hover:underline">Ver Todo</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {desafiosLoading ? (
              <div className="md:col-span-2 text-center py-8 text-on-surface-variant">Cargando desafíos...</div>
            ) : displayChallenges.length === 0 ? (
              <div className="md:col-span-2 text-center py-8 text-on-surface-variant">No hay desafíos activos por ahora.</div>
            ) : (
              displayChallenges.map((d, i) => (
                <div key={d.id} className="bg-surface-container-lowest p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-12 h-12 rounded-full ${i === 1 ? 'bg-secondary-container text-secondary' : 'bg-primary-container text-primary'} flex items-center justify-center`}>
                      <span className="material-symbols-outlined">{i === 1 ? 'wrong_location' : 'eco'}</span>
                    </div>
                    <span className="bg-surface-container-high px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">+{d.puntos} pts</span>
                  </div>
                  <h3 className="font-headline font-bold text-lg mb-2">{d.titulo}</h3>
                  <p className="text-on-surface-variant text-sm mb-6">{d.descripcion}</p>
                  <div className="space-y-2">
                    <div className={`flex justify-between text-xs font-bold ${i === 1 ? 'text-secondary' : 'text-primary'}`}>
                      <span>Progreso</span>
                      <span>0/{d.meta_valor}</span>
                    </div>
                    <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                      <div className={`h-full ${i === 1 ? 'bg-secondary' : 'bg-primary'} shadow-[inset_0_0_8px_rgba(255,255,255,0.4)]`} style={{ width: '0%' }} />
                    </div>
                  </div>
                </div>
              ))
            )}

            <div className="md:col-span-2 bg-gradient-to-br from-secondary to-secondary-dim p-6 rounded-lg relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-headline font-bold text-lg text-white">Reportes de Zona</h3>
                  <Link to="/mapa" className="text-white/80 font-bold text-sm hover:underline">Ir al mapa</Link>
                </div>
                {!reportesZona || reportesZona.length === 0 ? (
                  <p className="text-white/70 text-sm">No hay reportes de zona aún.</p>
                ) : (
                  <div className="space-y-2">
                    {reportesZona.slice(0, 3).map((r) => (
                      <div key={r.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/10">
                        <span className="material-symbols-outlined text-white/80">
                          {r.procesado ? 'check_circle' : 'warning'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {r.descripcion || 'Zona reportada'}
                          </p>
                          <p className="text-xs text-white/60">
                            {r.username} · {formatFecha(r.fecha)}
                          </p>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${r.procesado ? 'bg-green-200 text-green-800' : 'bg-amber-200 text-amber-800'}`}>
                          {r.procesado ? 'Procesado' : 'Pendiente'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <span className="material-symbols-outlined absolute -bottom-6 -right-6 text-white/10 text-[120px] pointer-events-none">location_on</span>
              </div>
            </div>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-8">
          <section className="bg-surface-container-lowest p-8 rounded-lg shadow-sm">
            <h2 className="font-headline text-xl font-bold mb-6">
              Estadísticas de Impacto <span className="block text-primary">Personales</span>
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined text-xl">verified</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest font-label text-on-surface-variant">Residuos Verificados</span>
                </div>
                <p className="text-3xl font-headline font-extrabold tracking-tight">
                  {usuario.reciclajes}<span className="text-sm font-normal ml-1">uds</span>
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-secondary">
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: '"FILL" 1' }}>scale</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest font-label text-on-surface-variant">Peso Total Reciclado</span>
                </div>
                <p className="text-3xl font-headline font-extrabold tracking-tight">
                  {formatPeso(totalPeso)}
                </p>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-surface-container-high">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold">Meta Personal</span>
                <span className="text-sm text-primary font-bold">{pointsProgress}%</span>
              </div>
              <div className="h-3 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-inverse-primary" style={{ width: `${pointsProgress}%` }} />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="font-headline text-xl font-bold">Actividad Reciente</h2>
              <button className="material-symbols-outlined text-on-surface-variant">more_horiz</button>
            </div>
            <div className="space-y-3">
              {recentActivity.length === 0 ? (
                <p className="text-center py-6 text-on-surface-variant text-sm">Aún no hay actividad. ¡Empieza a reciclar!</p>
              ) : (
                recentActivity.map((r, i) => {
                  const cat = r.materialCategoria?.toLowerCase() ?? '';
                  const icon = materialIcons[cat] ?? ' Recycling';
                  const color = materialColors[cat] ?? 'bg-gray-100 text-gray-600';
                  const bgClass = i % 2 === 0 ? 'bg-surface-container-low' : 'bg-surface-container-lowest';
                  const pesoKg = PESO_POR_TAMANO[r.tamanoObjeto] ?? 0;
                  return (
                    <div key={r.numeroReporte} className={`${bgClass} p-4 rounded-lg flex items-center gap-4 transition-transform hover:scale-[1.02]`}>
                      <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center`}>
                        <span className="material-symbols-outlined">{icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold truncate">{r.materialNombre}</h4>
                        <p className="text-xs text-on-surface-variant truncate">{r.numeroArticulos} ítems • {formatPeso(pesoKg)}</p>
                      </div>
                      <span className="text-xs font-bold text-primary">+{r.numeroArticulos * 12} pts</span>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          <Link to="/ranking" className="block">
            <div className="bg-tertiary p-6 rounded-lg text-on-tertiary relative overflow-hidden hover:brightness-110 transition-all">
              <div className="relative z-10">
                <h3 className="font-headline font-bold text-xl mb-2">Tu Ranking</h3>
                {miRanking ? (
                  <>
                    <p className="text-4xl font-headline font-extrabold mb-1">#{miRanking.posicion}</p>
                    <p className="text-sm opacity-90 mb-4">{miRanking.name} · Nivel {miRanking.nivel} · {miRanking.points.toLocaleString()} pts</p>
                  </>
                ) : (
                  <p className="text-sm opacity-90 mb-4">Aún no apareces en el ranking. ¡Empieza a reciclar!</p>
                )}
                <span className="inline-block bg-white text-tertiary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
                  Ver ranking completo
                </span>
              </div>
              <span className="material-symbols-outlined absolute -top-4 -right-4 text-white/10 text-8xl">leaderboard</span>
            </div>
          </Link>
        </aside>
      </div>
    </>
  );
}
