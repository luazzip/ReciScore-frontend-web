import { Link } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="auth-split">
      <div className="auth-panel">
        <div className="auth-panel-logo">
          <div className="auth-panel-logo-icon">♻</div>
          <span className="auth-panel-logo-text">ReciScore</span>
        </div>
        <h1>Bienvenido de nuevo</h1>
        <p className="auth-panel-subtitle">
          Tu impacto ambiental positivo comienza aquí. Ingresa tus credenciales para continuar.
        </p>
        <LoginForm />
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
          ¿No tienes una cuenta?{' '}
          <Link to="/register" style={{ fontWeight: 600 }}>Regístrate gratis</Link>
        </p>
      </div>

      <div className="auth-visual">
        <div className="auth-visual-card">
          <div className="auth-visual-img">🌿</div>
          <div className="auth-visual-badge">
            <div className="auth-visual-badge-icon">🏆</div>
            <div className="auth-visual-badge-text">
              <span>Comunidad Global</span>
              <strong>+150K Eco-Líderes</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}