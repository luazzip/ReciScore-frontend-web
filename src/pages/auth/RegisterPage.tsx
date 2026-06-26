import { Link } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <section className="auth-page">
      <h1>Crea tu cuenta</h1>
      <RegisterForm />
      <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
    </section>
  );
}
