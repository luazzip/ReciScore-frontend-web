import { useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import { useNotification } from '../hooks/useNotification';
import { formatFecha } from '../utils/formatters';

const INSIGNIAS = [
  { icon: '🌿', nombre: 'Guerrero del Plástico', desbloqueada: true },
  { icon: '👥', nombre: 'Núcleo Comunitario',    desbloqueada: true },
  { icon: '📅', nombre: 'Racha de 7 Días',       desbloqueada: true },
  { icon: '📋', nombre: 'Club 100 Registros',    desbloqueada: false },
  { icon: '🏅', nombre: 'Élite del Distrito',    desbloqueada: false },
  { icon: '🌲', nombre: 'Guardián del Bosque',   desbloqueada: false },
];

type Tab = 'perfil' | 'seguridad';

export default function PerfilPage() {
  const { usuario, logout } = useAuth();
  const { notify } = useNotification();
  const [tab, setTab] = useState<Tab>('perfil');
  const [isDeleting, setIsDeleting] = useState(false);
  const [editName, setEditName] = useState(usuario?.name ?? '');
  const [editLocation, setEditLocation] = useState(usuario?.location ?? '');

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

  const pctMeta = Math.min(Math.round((usuario.points / 5000) * 100), 100);

  return (
    <div>
      {/* Header card */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, var(--green-800), var(--green-600))',
        color: 'white', marginBottom: '1.5rem', padding: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Avatar */}
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            border: '3px solid rgba(255,255,255,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 700, flexShrink: 0
          }}>
            {usuario.profilePicture
              ? <img src={usuario.profilePicture} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              : usuario.name.charAt(0).toUpperCase()
            }
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
              CURADOR NIVEL {usuario.nivel}
            </div>
            <h1 style={{ color: 'white', marginBottom: '0.25rem', fontSize: '1.75rem' }}>{usuario.name}</h1>
            <div style={{ opacity: 0.75, fontSize: '0.875rem' }}>@{usuario.username} · {usuario.email}</div>
          </div>

          {/* Points pill */}
          <div style={{
            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 999, padding: '0.5rem 1.25rem', textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.7rem', opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Puntos</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              {usuario.points.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Progress to next level */}
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', opacity: 0.8, marginBottom: '0.375rem' }}>
            <span>Meta al siguiente nivel</span>
            <span>{pctMeta}%</span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 999 }}>
            <div style={{ height: '100%', width: `${pctMeta}%`, background: '#86efac', borderRadius: 999, transition: 'width 0.5s' }} />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="dashboard-stats-row" style={{ marginBottom: '1.5rem' }}>
        {[
          { emoji: '♻️', value: usuario.reciclajes, label: 'Reciclajes' },
          { emoji: '🔥', value: `${usuario.rachaDias}d`, label: 'Racha actual' },
          { emoji: '✖', value: `x${usuario.multiplier}`, label: 'Multiplicador' },
          { emoji: '📅', value: formatFecha(usuario.fechaRegistro).split(' ')[0], label: 'Miembro desde' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <span className="stat-emoji">{s.emoji}</span>
            <span className="stat-value" style={{ fontSize: '1.25rem' }}>{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="ranking-layout">
        {/* LEFT — tabs */}
        <div>
          {/* Tab switcher */}
          <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--gray-100)', borderRadius: 999, padding: '0.25rem', marginBottom: '1rem', width: 'fit-content' }}>
            {(['perfil', 'seguridad'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: '0.375rem 1.25rem', borderRadius: 999, border: 'none',
                  background: tab === t ? 'white' : 'transparent',
                  color: tab === t ? 'var(--gray-800)' : 'var(--gray-500)',
                  fontWeight: tab === t ? 600 : 400,
                  cursor: 'pointer', fontSize: '0.875rem',
                  boxShadow: tab === t ? 'var(--shadow-sm)' : 'none',
                  textTransform: 'capitalize', transition: 'all 0.2s'
                }}
              >{t}</button>
            ))}
          </div>

          {tab === 'perfil' && (
            <div className="card">
              <div className="card-title">Información Personal</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-field" style={{ marginBottom: 0 }}>
                  <label className="form-label-upper" htmlFor="p-name">Nombre completo</label>
                  <input id="p-name" type="text" value={editName} onChange={e => setEditName(e.target.value)} />
                </div>
                <div className="form-field" style={{ marginBottom: 0 }}>
                  <label className="form-label-upper" htmlFor="p-email">Correo electrónico</label>
                  <input id="p-email" type="email" value={usuario.email} readOnly style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                </div>
                <div className="form-field" style={{ marginBottom: 0 }}>
                  <label className="form-label-upper" htmlFor="p-username">Usuario</label>
                  <input id="p-username" type="text" value={usuario.username} readOnly style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                </div>
                <div className="form-field" style={{ marginBottom: 0 }}>
                  <label className="form-label-upper" htmlFor="p-location">Distrito</label>
                  <input id="p-location" type="text" value={editLocation} onChange={e => setEditLocation(e.target.value)} placeholder="Ej. San Isidro" />
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => notify('success', 'Perfil actualizado.')}
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          )}

          {tab === 'seguridad' && (
            <div className="card">
              <div className="card-title">Seguridad</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-field" style={{ marginBottom: 0 }}>
                  <label className="form-label-upper">Contraseña actual</label>
                  <input type="password" placeholder="••••••••" />
                </div>
                <div className="form-field" style={{ marginBottom: 0 }}>
                  <label className="form-label-upper">Nueva contraseña</label>
                  <input type="password" placeholder="••••••••" />
                </div>
                <div className="form-field" style={{ marginBottom: 0 }}>
                  <label className="form-label-upper">Confirmar nueva contraseña</label>
                  <input type="password" placeholder="••••••••" />
                </div>
                <button className="btn btn-primary" onClick={() => notify('success', 'Contraseña actualizada.')}>
                  Actualizar contraseña
                </button>

                <hr style={{ border: 'none', borderTop: '1px solid var(--gray-200)', margin: '0.5rem 0' }} />

                <button
                  className="btn"
                  style={{ background: 'var(--red-100)', color: 'var(--red-600)', fontWeight: 700 }}
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Eliminando...' : '🗑 Eliminar cuenta permanentemente'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — Insignias */}
        <div>
          <div className="card">
            <div className="card-title">Mis Insignias</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {INSIGNIAS.map(ins => (
                <div key={ins.nombre} style={{
                  display: 'flex', alignItems: 'center', gap: '0.875rem',
                  padding: '0.75rem', borderRadius: 'var(--radius)',
                  background: ins.desbloqueada ? 'var(--green-50)' : 'var(--gray-50)',
                  border: `1px solid ${ins.desbloqueada ? 'var(--green-200)' : 'var(--gray-200)'}`,
                  opacity: ins.desbloqueada ? 1 : 0.55
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                    background: ins.desbloqueada ? 'var(--green-100)' : 'var(--gray-200)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem'
                  }}>{ins.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{ins.nombre}</div>
                  </div>
                  <span className={ins.desbloqueada ? 'badge-ok' : 'badge-warning'} style={{ fontSize: '0.65rem' }}>
                    {ins.desbloqueada ? '✓' : '🔒'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}