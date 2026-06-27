import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/common/Spinner';
import { useFetch } from '../hooks/useFetch';
import { desafioService } from '../services/desafioService';

export default function DashboardPage() {
  const { usuario, isLoading } = useAuth();

  const { data: desafios } = useFetch(
    (signal) => desafioService.getActivos(signal),
    []
  );

  const stats = useMemo(() => {
    if (!usuario) return null;
    return [
      { label: 'Puntos', value: usuario.points.toLocaleString(), emoji: '⭐' },
      { label: 'Nivel', value: usuario.nivel, emoji: '🏅' },
      { label: 'Racha', value: `${usuario.rachaDias} días`, emoji: '🔥' },
      { label: 'Reciclajes', value: usuario.reciclajes, emoji: '♻️' },
    ];
  }, [usuario]);

  if (isLoading) return <Spinner fullScreen label="Cargando..." />;

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
    <div>
      {/* Hero */}
      <div className="dashboard-hero">
        <div>
          <h1>
            ¡Hola de nuevo, <span>{usuario.name}</span>!
          </h1>
          <p>
            Has completado {usuario.reciclajes} reciclajes. Sigue sumando puntos para subir de nivel.
          </p>
          <div className="dashboard-hero-actions">
            <Link to="/reciclaje/nuevo" className="dashboard-hero-btn dashboard-hero-btn-primary">
              Registrar reciclaje
            </Link>
            <Link to="/ranking" className="dashboard-hero-btn dashboard-hero-btn-secondary">
              Ver Ranking
            </Link>
          </div>
        </div>
        <div className="dashboard-hero-pts">
          <div className="dashboard-hero-pts-label">Puntos acumulados</div>
          <div className="dashboard-hero-pts-value">
            {usuario.points.toLocaleString()}<span>pts</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="dashboard-stats-row">
        {stats?.map((s) => (
          <div key={s.label} className="stat-card">
            <span className="stat-emoji">{s.emoji}</span>
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="dashboard-grid">
        {/* Desafíos */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ marginBottom: 0 }}>Desafíos Diarios</h2>
            <Link to="/desafios" style={{ fontSize: '0.875rem', color: 'var(--green-600)', fontWeight: 600 }}>Ver Todo</Link>
          </div>
          <div className="desafios-list">
            {desafios?.slice(0, 2).map((d) => (
              <div key={d.id} className="desafio-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4>{d.titulo}</h4>
                  <span className="badge-ok">+{d.puntos} pts</span>
                </div>
                <p>{d.descripcion}</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '30%' }} />
                </div>
                <span style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>Progreso 0/{d.meta_valor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats personales */}
        <div>
          <div className="card">
            <div className="card-title">
              Estadísticas de Impacto <span style={{ color: 'var(--green-600)' }}>Personales</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Residuos verificados</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{usuario.reciclajes} <span style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>uds</span></div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Nivel actual</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{usuario.nivel}</div>
              </div>
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '0.5rem' }}>
              Meta Personal
              <span style={{ float: 'right', fontWeight: 600, color: 'var(--green-600)' }}>
                {Math.min(Math.round((usuario.points / 5000) * 100), 100)}%
              </span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${Math.min(Math.round((usuario.points / 5000) * 100), 100)}%` }} />
            </div>
          </div>

          <div className="card" style={{ marginTop: '1rem' }}>
            <div className="card-title">Actividad Reciente</div>
            <Link to="/reciclaje/historial" style={{ fontSize: '0.875rem', color: 'var(--green-600)', display: 'block', textAlign: 'center', padding: '0.5rem' }}>
              Ver historial completo →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}