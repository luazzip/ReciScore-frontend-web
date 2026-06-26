import { useNavigate } from 'react-router-dom';
import ReciclajeForm from '../components/reciclaje/ReciclajeForm';

export default function ReciclajePage() {
  const navigate = useNavigate();
  return (
    <section>
      <h1>Registrar reciclaje</h1>
      <p>Toma una foto del material: será validada automáticamente por IA y por tu ubicación GPS.</p>
      <ReciclajeForm onSuccess={() => navigate('/reciclaje/historial')} />
    </section>
  );
}
