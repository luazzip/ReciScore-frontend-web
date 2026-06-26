import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { isAuthenticated, usuario, logout } = useAuth();

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">ReciScore</Link>
      <div className="navbar-links">
        <Link to="/mapa">Mapa</Link>
        <Link to="/ranking">Ranking</Link>
        {isAuthenticated ? (
          <>
            <Link to="/desafios">Desafíos</Link>
            <Link to="/perfil">{usuario?.username}</Link>
            <button onClick={handleLogout}>Cerrar sesión</button>
          </>
        ) : (
          <Link to="/login">Iniciar sesión</Link>
        )}
      </div>
    </nav>
  );
}
