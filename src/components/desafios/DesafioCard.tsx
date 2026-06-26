import { useMemo } from 'react';
import type { UsuarioDesafio } from '../../types/desafio.types';

interface DesafioCardProps {
  usuarioDesafio: UsuarioDesafio;
}

export default function DesafioCard({ usuarioDesafio }: DesafioCardProps) {
  const { desafio, progresoActual, completado } = usuarioDesafio;
  const porcentaje = useMemo(
    () => Math.min(100, Math.round((progresoActual / desafio.meta_valor) * 100)),
    [progresoActual, desafio.meta_valor]
  );

  return (
    <article className="desafio-card">
      <h4>{desafio.titulo}</h4>
      {desafio.descripcion && <p>{desafio.descripcion}</p>}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${porcentaje}%` }} />
      </div>
      <span>{progresoActual} / {desafio.meta_valor}</span>
      {completado && <span className="badge-ok">¡Completado! +{desafio.puntos} pts</span>}
    </article>
  );
}
