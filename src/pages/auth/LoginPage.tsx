import { Link } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <section className="auth-page">
      <h1>Inicia sesión en ReciScore</h1>
      <LoginForm />
      <p>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
    </section>
  );
}
