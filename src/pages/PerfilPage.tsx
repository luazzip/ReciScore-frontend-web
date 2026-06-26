import { useCallback, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import { useNotification } from '../hooks/useNotification';
import { formatFecha } from '../utils/formatters';
import Button from '../components/common/Button';

export default function PerfilPage() {
  const { usuario, logout } = useAuth();
  const { notify } = useNotification();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = useCallback(async () => {
    if (!usuario) return;
    if (!window.confirm('¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer.')) return;
    setIsDeleting(true);
    try {
      await userService.delete(usuario.id);
      notify('info', 'Tu cuenta ha sido eliminada.');
      logout();
    } catch {
      notify('error', 'No se pudo eliminar la cuenta. Intenta de nuevo.');
    } finally {
      setIsDeleting(false);
    }
  }, [usuario, logout, notify]);

  if (!usuario) return null;

  return (
    <section>
      <h1>Mi perfil</h1>
      <p>Usuario: {usuario.username}</p>
      <p>Nombre: {usuario.name}</p>
      <p>Email: {usuario.email}</p>
      <p>Puntos: {usuario.points}</p>
      <p>Multiplicador: x{usuario.multiplier}</p>
      <p>Nivel: {usuario.nivel}</p>
      <p>Racha: {usuario.rachaDias} días</p>
      <p>Miembro desde: {formatFecha(usuario.fechaRegistro)}</p>
      {usuario.location && <p>Distrito: {usuario.location}</p>}
      <hr />
      <Button variant="danger" isLoading={isDeleting} onClick={handleDeleteAccount}>
        Eliminar cuenta
      </Button>
    </section>
  );
}
