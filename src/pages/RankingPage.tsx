import { useSearchParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { rankingService } from '../services/rankingService';
import RankingTable from '../components/ranking/RankingTable';
import RankingFilterByDistrito from '../components/ranking/RankingFilterByDistrito';
import Skeleton from '../components/common/Skeleton';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';

export default function RankingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const distrito = searchParams.get('distrito') ?? 'Todos';

  const { data, isLoading, error, refetch } = useFetch(
    (signal) =>
      distrito === 'Todos'
        ? rankingService.getGlobal(signal)
        : rankingService.getPorDistrito(distrito, signal),
    [distrito]
  );

  return (
    <section>
      <h1>Ranking</h1>
      <RankingFilterByDistrito
        value={distrito}
        onChange={(d) => setSearchParams(d === 'Todos' ? {} : { distrito: d })}
      />
      {isLoading && <Skeleton rows={6} />}
      {error && <ErrorMessage error={error} onRetry={refetch} />}
      {!isLoading && !error && (!data || data.length === 0) && (
        <EmptyState title="Sin datos de ranking todavía" />
      )}
      {!isLoading && !error && data && data.length > 0 && <RankingTable entries={data} />}
    </section>
  );
}
