import { useState, Fragment } from 'react';
import { useFetch } from '../hooks/useFetch';
import { reciclajeService } from '../services/reciclajeService';
import { useAuth } from '../hooks/useAuth';
import Skeleton from '../components/common/Skeleton';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
const MATERIAL_CONFIG: Record<string, { icon: string; color: string; bg: string }> = {
  PLASTICO: { icon: 'liquor', color: 'text-blue-500', bg: 'bg-blue-50' },
  PAPEL:    { icon: 'description', color: 'text-orange-400', bg: 'bg-orange-50' },
  VIDRIO:   { icon: 'wine_bar', color: 'text-zinc-500', bg: 'bg-zinc-100' },
  METAL:    { icon: 'shopping_bag', color: 'text-zinc-500', bg: 'bg-zinc-100' },
  OTRO:     { icon: 'inventory_2', color: 'text-zinc-400', bg: 'bg-zinc-50' },
};

const MATERIAL_BAR_COLOR: Record<string, string> = {
  PLASTICO: 'bg-blue-500',
  PAPEL: 'bg-orange-400',
  VIDRIO: 'bg-zinc-500',
  METAL: 'bg-zinc-500',
};

function formatFecha(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
  };
}

function StatusBadge({ validado }: { validado: boolean }) {
  if (validado) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold font-label bg-green-100 text-green-800 uppercase tracking-tighter">
        Validado
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold font-label bg-tertiary-container text-on-tertiary-container uppercase tracking-tighter">
      Pendiente
    </span>
  );
}

function ImpactCard({ label, cat, total, totalGlobal }: { label: string; cat: string; total: number; totalGlobal: number }) {
  const cfg = MATERIAL_CONFIG[cat] ?? MATERIAL_CONFIG.OTRO;
  const barColor = MATERIAL_BAR_COLOR[cat] ?? 'bg-zinc-500';
  const pct = totalGlobal > 0 ? Math.round((total / totalGlobal) * 100) : 0;

  return (
    <div className="bg-surface-container-lowest p-6 rounded-lg flex flex-col justify-between h-48 border border-outline-variant/10">
      <div className="flex justify-between items-start">
        <span className={`material-symbols-outlined ${cfg.color} ${cfg.bg} p-2 rounded-full`}>{cfg.icon}</span>
        <span className="text-[10px] font-label uppercase tracking-wider text-on-surface-variant">{label}</span>
      </div>
      <div>
        <p className="font-headline text-3xl font-bold">{total} uds</p>
        <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-2 overflow-hidden">
          <div className={`h-full ${barColor}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
      <p className="text-[10px] text-on-surface-variant">{pct}% del volumen total</p>
    </div>
  );
}

const PAGE_SIZE = 10;

export default function HistorialPage() {
  const { usuario } = useAuth();
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data, isLoading, error, refetch } = useFetch(
    (signal) => reciclajeService.getHistorial(usuario!.id, { page, size: PAGE_SIZE }, signal),
    [usuario?.id, page]
  );

  const reportes = data ?? [];

  const totales = reportes.reduce(
    (acc, r) => {
      const cat = r.materialCategoria?.toUpperCase() ?? 'OTRO';
      acc[cat] = (acc[cat] ?? 0) + r.numeroArticulos;
      acc.total += r.numeroArticulos;
      acc.pesoTotal += r.pesoTotal ?? 0;
      return acc;
    },
    { total: 0, pesoTotal: 0, PLASTICO: 0, PAPEL: 0, VIDRIO: 0, METAL: 0 } as Record<string, number>
  );

  return (
    <>
      <section className="mb-12">
        <h3 className="font-headline text-3xl font-extrabold mb-6 tracking-tight text-on-background">
          Impacto de Actividad
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-primary bg-[linear-gradient(135deg,#176a21,#9df197)] p-6 rounded-lg text-on-primary shadow-xl shadow-primary/10 flex flex-col justify-between h-48 relative overflow-hidden">
            <span className="material-symbols-outlined opacity-20 absolute -right-4 -bottom-4 text-9xl">eco</span>
            <div>
              <p className="font-label text-xs uppercase tracking-widest opacity-80 mb-1">Impacto Total</p>
              <p className="font-headline text-4xl font-black">{totales.total} uds</p>
              <p className="font-headline text-xl font-bold mt-1 opacity-90">{totales.pesoTotal.toFixed(3)} kg</p>
            </div>
          </div>

          <ImpactCard label="Plástico" cat="PLASTICO" total={totales.PLASTICO} totalGlobal={totales.total} />
          <ImpactCard label="Papel" cat="PAPEL" total={totales.PAPEL} totalGlobal={totales.total} />
          <ImpactCard label="Vidrio" cat="VIDRIO" total={totales.VIDRIO} totalGlobal={totales.total} />
          <ImpactCard label="Metal" cat="METAL" total={totales.METAL} totalGlobal={totales.total} />
        </div>
      </section>

      <section className="bg-surface-container-lowest rounded-lg p-8 shadow-sm">
          <h3 className="font-headline text-xl font-bold tracking-tight mb-8">Depósitos Recientes</h3>

        {isLoading && <Skeleton rows={5} />}
        {error && <ErrorMessage error={error} onRetry={refetch} />}

        {!isLoading && !error && reportes.length === 0 && (
          <EmptyState
            title="Aún no tienes reciclajes registrados"
            description="Registra tu primer reciclaje para empezar a sumar puntos."
          />
        )}

        {!isLoading && !error && reportes.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left font-label text-[10px] uppercase tracking-widest text-on-surface-variant border-b border-surface-container">
                    <th className="pb-4 px-4 font-semibold">Fecha</th>
                    <th className="pb-4 px-4 font-semibold">Material</th>
                    <th className="pb-4 px-4 font-semibold">Artículos</th>
                    <th className="pb-4 px-4 font-semibold">Puntos Ganados</th>
                    <th className="pb-4 px-4 font-semibold">Estado</th>
                    <th className="pb-4 px-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-low">
                  {reportes.map((r) => {
                    const cat = r.materialCategoria?.toUpperCase() ?? 'OTRO';
                    const cfg = MATERIAL_CONFIG[cat] ?? MATERIAL_CONFIG.OTRO;
                    const fmt = formatFecha(r.fecha);
                    const isOpen = expandedId === r.numeroReporte;

                    return (
                      <Fragment key={r.numeroReporte}>
                        <tr
                          className="group hover:bg-surface-container-low transition-colors duration-150 cursor-pointer"
                          onClick={() => setExpandedId(isOpen ? null : r.numeroReporte)}
                        >
                          <td className="py-5 px-4">
                            <p className="text-sm font-semibold">{fmt.date}</p>
                            <p className="text-[10px] text-on-surface-variant">{fmt.time}</p>
                          </td>
                          <td className="py-5 px-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-full ${cfg.bg} flex items-center justify-center`}>
                                <span className={`material-symbols-outlined ${cfg.color} text-lg`}>{cfg.icon}</span>
                              </div>
                              <span className="text-sm font-medium">{r.materialNombre}</span>
                            </div>
                          </td>
                          <td className="py-5 px-4 text-sm font-medium">{r.numeroArticulos}</td>
                          <td className="py-5 px-4">
                            {r.validadoIa ? (
                              <span className="text-sm font-bold text-primary">+{r.puntosGanados ?? 0}</span>
                            ) : (
                              <span className="text-sm font-bold text-on-surface-variant">Pendiente</span>
                            )}
                          </td>
                          <td className="py-5 px-4">
                            <StatusBadge validado={r.validadoIa} />
                          </td>
                          <td className="py-5 px-4 text-right">
                            <span className="material-symbols-outlined text-on-surface-variant transition-transform duration-200"
                              style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                              chevron_right
                            </span>
                          </td>
                        </tr>
                        {isOpen && (
                          <tr className="bg-surface-container-low/40">
                            <td colSpan={6} className="px-4 py-4">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="flex flex-col gap-1">
                                  <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Peso Total</span>
                                  <span className="font-semibold">{r.pesoTotal ?? 0} kg</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Puntos</span>
                                  <span className="font-semibold">{r.puntosGanados ?? 0} pts</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Confianza IA</span>
                                  <span className="font-semibold">{(r.confianzaIa * 100).toFixed(0)}%</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">GPS</span>
                                  <span className={`font-semibold ${r.gpsValidado ? 'text-primary' : 'text-red-500'}`}>
                                    {r.gpsValidado ? 'Verificado' : 'No verificado'}
                                  </span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <p className="text-xs text-on-surface-variant font-medium">
                Página {page + 1}
              </p>
              <div className="flex gap-2">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-on-primary font-bold text-xs">
                  {page + 1}
                </button>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  onClick={() => setPage(p => p + 1)}
                  disabled={reportes.length < PAGE_SIZE}
                >
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
}
