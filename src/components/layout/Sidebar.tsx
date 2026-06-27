import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { to: '/', label: 'Panel', icon: '▦' },
  { to: '/reciclaje/nuevo', label: 'Registrar', icon: '+' },
  { to: '/mapa', label: 'Mapa', icon: '⊞' },
  { to: '/ranking', label: 'Ranking', icon: '▐' },
  { to: '/reciclaje/historial', label: 'Historial', icon: '↺' },
  { to: '/marketplace', label: 'Marketplace', icon: '🛍' },
];

export default function Sidebar() {
  const { usuario, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">♻</span>
        <span className="sidebar-logo-text">ReciScore</span>
      </div>

      {isAuthenticated && usuario && (
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {usuario.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="sidebar-username">{usuario.username}</div>
            <div className="sidebar-level">Nivel {usuario.nivel}</div>
          </div>
        </div>
      )}

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {isAuthenticated ? (
          <button className="sidebar-canjear" onClick={handleLogout}>
            Cerrar sesión
          </button>
        ) : (
          <NavLink to="/login" className="sidebar-canjear">
            Iniciar sesión
          </NavLink>
        )}
      </div>
    </aside>
  );
}