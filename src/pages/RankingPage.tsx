import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { rankingService } from '../services/rankingService';
import RankingTable from '../components/ranking/RankingTable';
import RankingFilterByDistrito from '../components/ranking/RankingFilterByDistrito';
import Skeleton from '../components/common/Skeleton';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import { useAuth } from '../hooks/useAuth';

const INSIGNIAS = [
  { icon: '🌿', nombre: 'Guerrero del Plástico', desc: 'Registra 50kg de residuos plásticos', desbloqueada: true },
  { icon: '👥', nombre: 'Núcleo Comunitario', desc: 'Invita a 3 amigos a unirse', desbloqueada: true },
  { icon: '📅', nombre: 'Racha de 7 Días', desc: 'Registra entradas 7 días seguidos', desbloqueada: true },
  { icon: '📋', nombre: 'Club de 100 Registros', desc: 'Llega a los 100 registros de reciclaje', desbloqueada: false },
  { icon: '🏅', nombre: 'Élite de San Isidro', desc: 'Top 10 en el ranking del distrito', desbloqueada: false },
  { icon: '🌲', nombre: 'Guardián del Bosque', desc: 'Compensa 1 tonelada de CO2', desbloqueada: false },
];

const DISTRITOS = [
  { pos: 1, nombre: 'Miraflores', pts: '842,500', tuyo: false },
  { pos: 2, nombre: 'San Isidro', pts: '798,210', tuyo: true },
  { pos: 3, nombre: 'San Borja', pts: '654,100', tuyo: false },
];

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

  return (
    <div>
      {/* Hero title */}
      <h1 className="ranking-hero-title">
        Recicladores de <em>Élite.</em>
      </h1>

      <div className="ranking-layout">
        {/* LEFT COLUMN */}
        <div className="ranking-left">

          {/* Ranking amigos */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ marginBottom: 0, fontSize: '1.25rem' }}>Ranking entre amigos 🏆</h2>
              <span className="badge-ok">Semanal</span>
            </div>

            {isLoading && <Skeleton rows={3} />}
            {error && <ErrorMessage error={error} onRetry={refetch} />}
            {!isLoading && !error && (!data || data.length === 0) && (
              <EmptyState title="Sin datos de ranking todavía" />
            )}
            {!isLoading && !error && data && data.length > 0 && (
              <RankingTable entries={data} />
            )}
          </div>

          {/* Ranking distritos */}
          <div className="card">
            <div style={{ marginBottom: '1rem' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                background: 'var(--green-50)', color: 'var(--green-700)',
                fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.75rem',
                borderRadius: 999, marginBottom: '0.75rem'
              }}>
                📍 DISTRITO: SAN ISIDRO
              </span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ marginBottom: 0, fontSize: '1.25rem' }}>Ranking por Distritos</h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {(['Semanal', 'Histórico'] as Periodo[]).map(p => (
                    <button
                      key={p}
                      onClick={() => setPeriodo(p)}
                      style={{
                        padding: '0.25rem 0.875rem', borderRadius: 999,
                        border: periodo === p ? 'none' : '1px solid var(--gray-200)',
                        background: periodo === p ? 'var(--green-700)' : 'var(--white)',
                        color: periodo === p ? 'var(--white)' : 'var(--gray-600)',
                        fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer'
                      }}
                    >{p}</button>
                  ))}
                </div>
              </div>
            </div>

            <RankingFilterByDistrito
              value={distrito}
              onChange={(d) => setSearchParams(d === 'Todos' ? {} : { distrito: d })}
            />

            <table className="ranking-table" style={{ marginTop: '0.75rem' }}>
              <thead>
                <tr>
                  <th>NRO</th>
                  <th>DISTRITO</th>
                  <th style={{ textAlign: 'right' }}>PUNTAJE TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {DISTRITOS.map(d => (
                  <tr key={d.nombre} style={d.tuyo ? { background: 'var(--green-50)' } : {}}>
                    <td>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 28, height: 28, borderRadius: '50%',
                        background: d.pos === 1 ? '#fbbf24' : d.tuyo ? 'var(--green-600)' : 'var(--gray-200)',
                        color: d.pos === 1 || d.tuyo ? 'white' : 'var(--gray-600)',
                        fontWeight: 700, fontSize: '0.8125rem'
                      }}>{d.pos}</span>
                    </td>
                    <td>
                      <strong>{d.nombre}</strong>
                      {d.tuyo && <div style={{ fontSize: '0.75rem', color: 'var(--green-600)', fontWeight: 600 }}>TUDISTRITO</div>}
                    </td>
                    <td style={{ textAlign: 'right' }} className="ranking-pts">{d.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Insignias */}
          <div style={{ marginTop: '1.5rem' }}>
            <h2 style={{ marginBottom: '0.25rem' }}>Mis Insignias</h2>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Cada insignia representa un compromiso con nuestro planeta.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {INSIGNIAS.map(ins => (
                <div key={ins.nombre} className="card" style={{ textAlign: 'center', opacity: ins.desbloqueada ? 1 : 0.5 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%', margin: '0 auto 0.5rem',
                    background: ins.desbloqueada ? 'var(--green-100)' : 'var(--gray-100)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
                  }}>{ins.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{ins.nombre}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '0.5rem' }}>{ins.desc}</div>
                  <span className={ins.desbloqueada ? 'badge-ok' : 'badge-warning'} style={{ fontSize: '0.6875rem' }}>
                    {ins.desbloqueada ? 'DESBLOQUEADA' : 'BLOQUEADA'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — Tus Estadísticas */}
        <div className="ranking-right">
          <h2 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Tus Estadísticas</h2>

          {/* Próximo rango */}
          <div className="card" style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
              PRÓXIMO RANGO
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Nivel {(usuario?.nivel ?? 14) + 1} Pro
            </div>
            <div className="progress-bar" style={{ marginBottom: '0.5rem' }}>
              <div className="progress-fill" style={{ width: '85%' }} />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textAlign: 'right' }}>
              750 pts para subir de nivel
            </div>
          </div>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>♻️</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-800)' }}>42kg</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Ahorrado</div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🏅</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-800)' }}>12</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Insignias</div>
            </div>
          </div>

          {/* Canjear */}
          <button style={{
            width: '100%', padding: '0.75rem', background: '#f59e0b',
            color: 'white', border: 'none', borderRadius: 999,
            fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
            textTransform: 'uppercase', letterSpacing: '0.04em'
          }}>
            Canjear Premios
          </button>
        </div>
      </div>
    </div>
  );
}