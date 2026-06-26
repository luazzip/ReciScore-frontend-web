import type { RankingEntry } from '../../types/ranking.types';
import { formatPuntos } from '../../utils/formatters';

interface RankingTableProps {
  entries: RankingEntry[];
}

export default function RankingTable({ entries }: RankingTableProps) {
  return (
    <table className="ranking-table">
      <thead>
        <tr>
          <th>#</th><th>Usuario</th><th>Puntos</th><th>Nivel</th><th>Distrito</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((e) => (
          <tr key={e.posicion}>
            <td>{e.posicion}</td>
            <td>{e.username}</td>
            <td>{formatPuntos(e.points)}</td>
            <td>{e.nivel}</td>
            <td>{e.location}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
