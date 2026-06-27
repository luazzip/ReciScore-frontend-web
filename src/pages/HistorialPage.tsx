import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { reciclajeService } from '../services/reciclajeService';
import { useAuth } from '../hooks/useAuth';
import Skeleton from '../components/common/Skeleton';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';

const MATERIAL_ICON: Record<string, string> = {
  PLASTICO: '🧴', PAPEL: '📄', VIDRIO: '🍶', METAL: '🔩',
};

const MATERIAL_COLOR: Record<string, string> = {
  PLASTICO: '#3b82f6', PAPEL: '#f97316', VIDRIO: '#6b7280', METAL: '#6b7280',
};

function StatusBadge({ validado }: { validado: boolean }) {
  return validado
    ? <span className="badge-ok">VALIDADO</span>
    : <span className="badge-pending">PENDIENTE</span>;
}

function formatFecha(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
}

const PAGE_SIZE = 10;

export default function HistorialPage() {
  const { usuario } = useAuth();
  const [page, setPage] = useState(0);

  const { data, isLoading, error, refetch } = useFetch(
    (signal) => reciclajeService.getHistorial(usuario!.id, { page, size: PAGE_SIZE }, signal),
    [usuario?.id, page]
  );

  // Totales por categoría (sobre los datos cargados)
  const totales = (data ?? []).reduce(
    (acc, r) => {
      const cat = r.materialCategoria?.toUpperCase() ?? 'OTRO';
      acc[cat] = (acc[cat] ?? 0) + r.numeroArticulos;
      acc.total += r.numeroArticulos;
      return acc;
    },
    { total: 0, PLASTICO: 0, PAPEL: 0, METAL: 0 } as Record<string, number>
  );

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem' }}>Impacto de Actividad</h1>

      {/* Impact summary cards */}
      <div className="historial-impact-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="historial-impact-main">
          <div className="historial-impact-main-label">IMPACTO TOTAL</div>
          <div className="historial-impact-main-value">{totales.total} uds</div>
          <div className="historial-impact-main-sub">+12% desde el mes pasado</div>
        </div>

        {[
          { label: 'PLÁSTICO', cat: 'PLASTICO', color: '#3b82f6' },
          { label: 'PAPEL',    cat: 'PAPEL',    color: '#f97316' },
          { label: 'METAL',    cat: 'METAL',    color: '#6b7280' },
        ].map(({ label, cat, color }) => (
          <div key={cat} className="historial-impact-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>{MATERIAL_ICON[cat]}</span>
              <span className="historial-impact-card-label" style={{ margin: 0 }}>{label}</span>
            </div>
            <div className="historial-impact-card-value">{totales[cat] ?? 0} uds</div>
            <div style={{ height: 4, background: 'var(--gray-200)', borderRadius: 999, marginTop: '0.5rem' }}>
              <div style={{
                height: '100%', borderRadius: 999, background: color,
                width: totales.total ? `${Math.round(((totales[cat] ?? 0) / totales.total) * 100)}%` : '0%'
              }} />
            </div>
            <div className="historial-impact-card-sub">
              {totales.total ? Math.round(((totales[cat] ?? 0) / totales.total) * 100) : 0}% del volumen total
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card">
        <div className="historial-table-header">
          <h2>Depósitos Recientes</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-outline btn-sm" style={{ width: 'auto' }}>
              ⚙ Filtrar
            </button>
            <button className="btn btn-outline btn-sm" style={{ width: 'auto' }}>
              ↓ Exportar
            </button>
          </div>
        </div>

        {isLoading && <Skeleton rows={5} />}
        {error && <ErrorMessage error={error} onRetry={refetch} />}

        {!isLoading && !error && (!data || data.length === 0) && (
          <EmptyState
            title="Aún no tienes reciclajes registrados"
            description="Registra tu primer reciclaje para empezar a sumar puntos."
          />
        )}

        {!isLoading && !error && data && data.length > 0 && (
          <>
            <table className="historial-table">
              <thead>
                <tr>
                  <th>FECHA</th>
                  <th>MATERIAL</th>
                  <th>ARTÍCULOS</th>
                  <th>PUNTOS GANADOS</th>
                  <th>ESTADO</th>
                </tr>
              </thead>
              <tbody>
                {data.map((r) => {
                  const cat = r.materialCategoria?.toUpperCase() ?? 'OTRO';
                  return (
                    <tr key={r.numeroReporte}>
                      <td style={{ color: 'var(--gray-600)', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                        {formatFecha(r.fecha)}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                          <span style={{
                            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                            background: (MATERIAL_COLOR[cat] ?? '#9ca3af') + '22',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem'
                          }}>{MATERIAL_ICON[cat] ?? '📦'}</span>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{r.materialNombre}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                              {r.gpsValidado ? '📍 GPS verificado' : 'Sin verificación GPS'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{r.numeroArticulos}</td>
                      <td className="historial-pts">
                        {r.validadoIa ? `+${r.numeroArticulos * 50}` : '—'}
                      </td>
                      <td><StatusBadge validado={r.validadoIa} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--gray-100)' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--gray-400)' }}>
                Página {page + 1}
              </span>
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                >←</button>
                <button className="pagination-btn pagination-btn-active">{page + 1}</button>
                <button
                  className="pagination-btn"
                  onClick={() => setPage(p => p + 1)}
                  disabled={!data || data.length < PAGE_SIZE}
                >→</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}