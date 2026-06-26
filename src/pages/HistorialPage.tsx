import { useParams } from 'react-router-dom';
import ReciclajeHistorialList from '../components/reciclaje/ReciclajeHistorialList';

export default function HistorialPage() {
  const { reporteId } = useParams<{ reporteId?: string }>();

  return (
    <section>
      <h1>{reporteId ? 'Detalle del reciclaje' : 'Mi historial de reciclajes'}</h1>
      <ReciclajeHistorialList />
    </section>
  );
}
