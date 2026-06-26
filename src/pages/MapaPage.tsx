import { useState, useCallback } from 'react';
import MapaPuntos from '../components/mapa/MapaPuntos';
import ReportarZonaSuciaForm from '../components/mapa/ReportarZonaSuciaForm';

export default function MapaPage() {
  const [showReportForm, setShowReportForm] = useState(false);

  const toggleReportForm = useCallback(() => {
    setShowReportForm((s) => !s);
  }, []);

  return (
    <section>
      <h1>Mapa de puntos de acopio</h1>
      <MapaPuntos />
      <button onClick={toggleReportForm}>
        {showReportForm ? 'Cancelar' : 'Reportar zona sucia'}
      </button>
      {showReportForm && <ReportarZonaSuciaForm />}
    </section>
  );
}
