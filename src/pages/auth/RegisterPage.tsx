import { Link } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="auth-split auth-split-register">
      <div className="auth-register-left">
        <span className="auth-register-tag">Únete a la revolución</span>
        <h1>
          Cultiva un futuro{' '}
          <span>sostenible</span>{' '}
          con ReciScore.
        </h1>
        <p>
          Gana recompensas por cada acción ecológica. Tu camino hacia el impacto ambiental real comienza aquí.
        </p>
        <div className="auth-register-img">🌱</div>
      </div>

      <div className="auth-register-right">
        <h2>Crear cuenta</h2>
        <p>Completa los datos para empezar a puntuar.</p>
        <RegisterForm />
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}