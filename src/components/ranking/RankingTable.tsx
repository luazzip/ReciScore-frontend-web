import type { RankingEntry } from '../../types/ranking.types';
import { useAuth } from '../../hooks/useAuth';

interface RankingTableProps {
  entries: RankingEntry[];
}

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function RankingTable({ entries }: RankingTableProps) {
  const { usuario } = useAuth();

  return (
    <table className="ranking-table">
      <thead>
        <tr>
          <th>NRO</th>
          <th>USUARIO</th>
          <th>NIVEL</th>
          <th style={{ textAlign: 'right' }}>PTS IMPACTO</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((e) => {
          const esYo = usuario?.username === e.username;
          return (
            <tr key={e.posicion} style={esYo ? { background: 'var(--green-50)' } : {}}>
              <td>
                {MEDAL[e.posicion] ? (
                  <span style={{ fontSize: '1.1rem' }}>{MEDAL[e.posicion]}</span>
                ) : (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 28, height: 28, borderRadius: '50%',
                    background: esYo ? 'var(--green-600)' : 'var(--gray-200)',
                    color: esYo ? 'white' : 'var(--gray-600)',
                    fontWeight: 700, fontSize: '0.8125rem'
                  }}>{e.posicion}</span>
                )}
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: esYo ? 'var(--green-600)' : 'var(--gray-300)',
                    color: 'white', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem'
                  }}>
                    {e.name?.charAt(0).toUpperCase() ?? e.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--gray-800)' }}>
                      {e.name ?? e.username}
                      {esYo && <span style={{ marginLeft: '0.375rem', fontSize: '0.7rem', background: 'var(--green-100)', color: 'var(--green-700)', padding: '0.1rem 0.5rem', borderRadius: 999, fontWeight: 700 }}>TÚ</span>}
                    </div>
                    {e.location && <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{e.location}</div>}
                  </div>
                </div>
              </td>
              <td style={{ color: 'var(--green-600)', fontWeight: 600 }}>LV. {e.nivel}</td>
              <td style={{ textAlign: 'right' }} className="ranking-pts">
                {e.points.toLocaleString('es-PE')}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
