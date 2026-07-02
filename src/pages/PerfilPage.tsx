import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { useNotification } from '../hooks/useNotification';
import { formatFecha } from '../utils/formatters';
import type { ApiError } from '../types/api.types';

type Tab = 'perfil' | 'seguridad';

const profileSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100, 'El nombre es demasiado largo'),
  location: z.string().max(100, 'La ubicación es demasiado larga').optional().or(z.literal('')),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es obligatoria'),
  newPassword: z.string().min(8, 'Mínimo 8 caracteres').regex(/[A-Z]/, 'Debe contener al menos una mayúscula').regex(/[0-9]/, 'Debe contener al menos un número'),
  confirmNewPassword: z.string().min(1, 'Confirma la nueva contraseña'),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmNewPassword'],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function PerfilPage() {
  const { usuario, logout } = useAuth();
  const { notify } = useNotification();
  const [tab, setTab] = useState<Tab>('perfil');
  const [isDeleting, setIsDeleting] = useState(false);

  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors, isSubmitting: isSaving } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: usuario?.name ?? '', location: usuario?.location ?? '' },
  });

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors, isSubmitting: isUpdatingPassword }, reset: resetPassword } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
  });

  const onSaveProfile = useCallback(async (values: ProfileFormValues) => {
    if (!usuario) return;
    try {
      await userService.update(usuario.id, { name: values.name, location: values.location || undefined });
      notify('success', 'Perfil actualizado correctamente.');
    } catch (err) {
      const apiErr = err as ApiError;
      notify('error', apiErr.message || 'No se pudo actualizar el perfil.');
    }
  }, [usuario, notify]);

  const onUpdatePassword = useCallback(async (values: PasswordFormValues) => {
    if (!usuario) return;
    try {
      await authService.changePassword(values.currentPassword, values.newPassword);
      notify('success', 'Contraseña actualizada correctamente.');
      resetPassword();
    } catch (err) {
      const apiErr = err as ApiError;
      notify('error', apiErr.message || 'No se pudo actualizar la contraseña.');
    }
  }, [usuario, notify, resetPassword]);

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

  const ptsBaseNivel = usuario.nivel * (usuario.nivel - 1) * 50;
  const intervaloNivel = usuario.nivel * 100;
  const pctMeta = Math.min(Math.round(((usuario.points - ptsBaseNivel) / intervaloNivel) * 100), 100);

  return (
    <>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary-container floating-blob animate-pulse" />
        <div className="absolute top-1/3 -right-48 w-[500px] h-[500px] rounded-full bg-secondary-container floating-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 rounded-full bg-tertiary-container floating-blob" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        <section className="text-center lg:text-left">
          <span className="inline-block bg-primary-container text-on-primary-container px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            Perfil
          </span>
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-on-background leading-tight tracking-tight">
            Mi <span className="text-primary">Perfil.</span>
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl mt-4">
            Administra tu información personal y configuración de seguridad.
          </p>
        </section>

        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-green-800 to-green-600 p-8 text-white">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center text-3xl font-bold shrink-0">
              {usuario.profilePicture ? (
                <img src={usuario.profilePicture} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                usuario.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-1">
                NIVEL {usuario.nivel}
              </p>
              <h2 className="text-3xl font-headline font-extrabold mb-1">{usuario.name}</h2>
              <p className="text-white/80 text-sm">@{usuario.username} · {usuario.email}</p>
            </div>
            <div className="bg-white/15 border border-white/30 rounded-full px-5 py-3 text-center shrink-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Puntos</p>
              <p className="text-3xl font-headline font-extrabold">{usuario.points.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-sm text-white/80 mb-1">
              <span>Meta al siguiente nivel</span>
              <span>{pctMeta}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-green-300 rounded-full transition-all" style={{ width: `${pctMeta}%` }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: 'recycling', value: usuario.reciclajes, label: 'Reciclajes' },
            { icon: 'local_fire_department', value: `${usuario.rachaDias}d`, label: 'Racha actual' },
            { icon: 'exposure', value: `x${usuario.multiplier}`, label: 'Multiplicador' },
            { icon: 'calendar_month', value: formatFecha(usuario.fechaRegistro).split(' ')[0], label: 'Miembro desde' },
          ].map(s => (
            <div key={s.label} className="bg-surface-container-lowest p-5 rounded-lg shadow-sm border border-outline-variant/5 flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-2xl text-primary mb-2" style={{ fontVariationSettings: '"FILL" 1' }}>{s.icon}</span>
              <p className="text-2xl font-headline font-extrabold text-on-surface">{s.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-surface-container-low rounded-full p-1 w-fit">
          {(['perfil', 'seguridad'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                tab === t
                  ? 'bg-white text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {t === 'perfil' ? 'Información Personal' : 'Seguridad'}
            </button>
          ))}
        </div>

        {tab === 'perfil' && (
          <form className="bg-surface-container-lowest p-8 rounded-lg shadow-sm border border-outline-variant/5 space-y-6" onSubmit={handleProfileSubmit(onSaveProfile)} noValidate>
            <h3 className="font-headline text-xl font-bold mb-6">Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1 ml-1" htmlFor="p-name">
                  Nombre completo
                </label>
                <input
                  id="p-name"
                  type="text"
                  className="w-full px-4 py-3 bg-surface-container-low border-0 border-b-2 border-outline-variant/20 focus:border-secondary focus:ring-0 rounded-t-lg transition-colors font-bold"
                  {...registerProfile('name')}
                />
                {profileErrors.name && <span className="text-xs text-error ml-1 mt-1 block">{profileErrors.name.message}</span>}
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1 ml-1" htmlFor="p-email">
                  Correo electrónico
                </label>
                <input
                  id="p-email"
                  type="email"
                  value={usuario.email}
                  readOnly
                  className="w-full px-4 py-3 bg-surface-container-low border-0 border-b-2 border-outline-variant/20 rounded-t-lg transition-colors font-bold opacity-60 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1 ml-1" htmlFor="p-username">
                  Usuario
                </label>
                <input
                  id="p-username"
                  type="text"
                  value={usuario.username}
                  readOnly
                  className="w-full px-4 py-3 bg-surface-container-low border-0 border-b-2 border-outline-variant/20 rounded-t-lg transition-colors font-bold opacity-60 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1 ml-1" htmlFor="p-location">
                  Distrito
                </label>
                <input
                  id="p-location"
                  type="text"
                  placeholder="Ej. San Isidro"
                  className="w-full px-4 py-3 bg-surface-container-low border-0 border-b-2 border-outline-variant/20 focus:border-secondary focus:ring-0 rounded-t-lg transition-colors font-bold"
                  {...registerProfile('location')}
                />
                {profileErrors.location && <span className="text-xs text-error ml-1 mt-1 block">{profileErrors.location.message}</span>}
              </div>
            </div>
            <button
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded-lg font-bold text-sm hover:brightness-110 transition-all active:scale-95 disabled:opacity-60"
              disabled={isSaving}
            >
              {isSaving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        )}

        {tab === 'seguridad' && (
          <form className="bg-surface-container-lowest p-8 rounded-lg shadow-sm border border-outline-variant/5 space-y-6" onSubmit={handlePasswordSubmit(onUpdatePassword)} noValidate>
            <h3 className="font-headline text-xl font-bold mb-6">Seguridad</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1 ml-1" htmlFor="current-password">Contraseña actual</label>
                <input
                  id="current-password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-surface-container-low border-0 border-b-2 border-outline-variant/20 focus:border-secondary focus:ring-0 rounded-t-lg transition-colors font-bold"
                  {...registerPassword('currentPassword')}
                />
                {passwordErrors.currentPassword && <span className="text-xs text-error ml-1 mt-1 block">{passwordErrors.currentPassword.message}</span>}
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1 ml-1" htmlFor="new-password">Nueva contraseña</label>
                <input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-surface-container-low border-0 border-b-2 border-outline-variant/20 focus:border-secondary focus:ring-0 rounded-t-lg transition-colors font-bold"
                  {...registerPassword('newPassword')}
                />
                {passwordErrors.newPassword && <span className="text-xs text-error ml-1 mt-1 block">{passwordErrors.newPassword.message}</span>}
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1 ml-1" htmlFor="confirm-password">Confirmar nueva contraseña</label>
                <input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-surface-container-low border-0 border-b-2 border-outline-variant/20 focus:border-secondary focus:ring-0 rounded-t-lg transition-colors font-bold"
                  {...registerPassword('confirmNewPassword')}
                />
                {passwordErrors.confirmNewPassword && <span className="text-xs text-error ml-1 mt-1 block">{passwordErrors.confirmNewPassword.message}</span>}
              </div>
            </div>
            <button
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded-lg font-bold text-sm hover:brightness-110 transition-all active:scale-95 disabled:opacity-60"
              disabled={isUpdatingPassword}
            >
              {isUpdatingPassword ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>

            <hr className="border-outline-variant/20 my-6" />

            <div className="space-y-4">
              <p className="text-sm text-on-surface-variant">Una vez que elimines tu cuenta, no hay forma de recuperarla. Por favor, asegúrate antes de continuar.</p>
              <button
                className="bg-error text-white px-6 py-3 rounded-lg font-bold text-sm hover:brightness-110 transition-all active:scale-95 flex items-center gap-2"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
              >
                <span className="material-symbols-outlined text-base">delete_forever</span>
                {isDeleting ? 'Eliminando...' : 'Eliminar cuenta permanentemente'}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
