import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UsuarioDesafio } from '../../types/desafio.types';

interface DesafioCardProps {
  usuarioDesafio: UsuarioDesafio;
  inscrito?: boolean;
  onInscribirse?: (desafioId: number) => Promise<void>;
  onDesistir?: (desafioId: number) => Promise<void>;
}

export default function DesafioCard({ usuarioDesafio, inscrito = false, onInscribirse, onDesistir }: DesafioCardProps) {
  const { desafio, progresoActual, completado } = usuarioDesafio;
  const navigate = useNavigate();

  const porcentaje = useMemo(
    () => Math.min(100, Math.round((progresoActual / desafio.meta_valor) * 100)),
    [progresoActual, desafio.meta_valor]
  );

  return (
    <article className="desafio-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/desafios/${desafio.id}`)}>
      <div className="desafio-card-header">
        <h4>{desafio.titulo}</h4>
        {inscrito && <span className="badge-ok">Inscrito</span>}
      </div>
      {desafio.descripcion && <p>{desafio.descripcion}</p>}
      <span className="desafio-meta">Meta: {desafio.meta_valor} {desafio.categoria === 'RACHA' ? 'días' : 'kg'}</span>
      {progresoActual > 0 && (
        <>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${porcentaje}%` }} />
          </div>
          <span className="desafio-progreso">{progresoActual} / {desafio.meta_valor}</span>
        </>
      )}
      <footer className="desafio-card-footer">
        <span className="desafio-puntos">+{desafio.puntos} pts</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>Ver detalle →</span>
      </footer>
      {!inscrito && onInscribirse && (
        <button className="btn btn-primary btn-sm" style={{ marginTop: '0.5rem', width: '100%' }} onClick={(e) => { e.stopPropagation(); onInscribirse(desafio.id); }}>
          Inscribirse
        </button>
      )}
      {inscrito && onDesistir && (
        <button className="btn btn-secondary btn-sm" style={{ marginTop: '0.5rem', width: '100%' }} onClick={(e) => { e.stopPropagation(); onDesistir(desafio.id); }}>
          Desistir
        </button>
      )}
    </article>
  );
}
