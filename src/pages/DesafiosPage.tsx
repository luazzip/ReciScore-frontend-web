import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import DesafiosList from '../components/desafios/DesafiosList';
import CrearDesafioForm from '../components/desafios/CrearDesafioForm';

export default function DesafiosPage() {
  const { usuario } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const isAdmin = usuario?.role === 'ADMIN';

  function handleCreated() {
    setShowForm(false);
    setRefreshKey((k) => k + 1);
  }

  return (
    <section>
      <h1>Desafíos activos</h1>
      {isAdmin && !showForm && (
        <button onClick={() => setShowForm(true)}>Crear desafío</button>
      )}
      {isAdmin && showForm && (
        <CrearDesafioForm onSuccess={handleCreated} />
      )}
      <DesafiosList key={refreshKey} />
    </section>
  );
}
