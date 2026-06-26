import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/common/Spinner';

export default function DashboardPage() {
  const { usuario, isLoading } = useAuth();

  const stats = useMemo(() => {
    if (!usuario) return null;
    return [
      { label: 'Puntos', value: usuario.points },
      { label: 'Nivel', value: usuario.nivel },
      { label: 'Racha', value: `${usuario.rachaDias} días` },
    ];
  }, [usuario]);

  if (isLoading) {
    return <Spinner fullScreen label="Cargando tu información..." />;
  }

  if (!usuario) {
    return (
      <section>
        <h1>Bienvenido a ReciScore</h1>
        <p>Inicia sesión para ver tu información.</p>
        <Link to="/login">Iniciar sesión</Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Hola, {usuario.name}</h1>
      <div className="dashboard-stats">
        {stats?.map((s) => (
          <div key={s.label} className="stat-card">
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="dashboard-actions">
        <Link to="/reciclaje/nuevo">Registrar reciclaje</Link>
        <Link to="/reciclaje/historial">Ver historial</Link>
        <Link to="/desafios">Mis desafíos</Link>
      </div>
    </section>
  );
}
