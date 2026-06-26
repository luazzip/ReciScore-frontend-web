import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { desafioService } from '../services/desafioService';
import Skeleton from '../components/common/Skeleton';
import ErrorMessage from '../components/common/ErrorMessage';

export default function DesafioDetallePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useFetch(
    (signal) => desafioService.getById(Number(id), signal),
    [id]
  );

  if (isLoading) return <Skeleton rows={4} />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;
  if (!data) return null;

  const fechaInicio = new Date(data.fecha_inicio).toLocaleDateString();
  const fechaFin = new Date(data.fecha_fin).toLocaleDateString();

  return (
    <section>
      <button className="btn btn-secondary" style={{ width: 'auto', marginBottom: '1rem' }} onClick={() => navigate('/desafios')}>
        ← Volver
      </button>
      <article className="desafio-card">
        <div className="desafio-card-header">
          <h2>{data.titulo}</h2>
        </div>
        <p>{data.descripcion}</p>
        <p><strong>Categoría:</strong> {data.categoria}</p>
        <p><strong>Meta:</strong> {data.meta_valor} {data.categoria === 'RACHA' ? 'días' : 'kg'}</p>
        <p><strong>Puntos al completar:</strong> +{data.puntos} pts</p>
        <p><strong>Inicio:</strong> {fechaInicio}</p>
        <p><strong>Fin:</strong> {fechaFin}</p>
        <span className={`badge-${data.activo ? 'ok' : 'warning'}`}>
          {data.activo ? 'Activo' : 'Inactivo'}
        </span>
      </article>
    </section>
  );
}
