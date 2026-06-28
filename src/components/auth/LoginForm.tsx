import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import ErrorMessage from '../common/ErrorMessage';
import type { ApiError } from '../../types/api.types';
import { useState } from 'react';

const loginSchema = z.object({
  email: z.string().min(1, 'El email es obligatorio').email('Ingresa un email válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { notify } = useNotification();
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/';
  const [submitError, setSubmitError] = useState<ApiError | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    setSubmitError(null);
    try {
      await login(values);
      notify('success', 'Iniciaste sesión correctamente.');
      navigate(from, { replace: true });
    } catch (err) {
      setSubmitError(err as ApiError);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="space-y-1">
        <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block ml-1" htmlFor="email">Correo Electrónico</label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl">mail</span>
          <input
            id="email"
            type="email"
            placeholder="ejemplo@reciscore.com"
            className="w-full pl-11 pr-3.5 py-3.5 bg-surface-container-low rounded-lg border-none input-focus-effect transition-all placeholder:text-outline/50 text-sm"
            {...register('email')}
          />
        </div>
        {errors.email && <span className="text-xs text-error ml-1">{errors.email.message}</span>}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block ml-1" htmlFor="password">Contraseña</label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl">lock</span>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="w-full pl-11 pr-3.5 py-3.5 bg-surface-container-low rounded-lg border-none input-focus-effect transition-all placeholder:text-outline/50 text-sm"
            {...register('password')}
          />
        </div>
        {errors.password && <span className="text-xs text-error ml-1">{errors.password.message}</span>}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 cursor-pointer group">
          <div className="relative flex items-center">
            <input type="checkbox" className="peer hidden" />
            <div className="w-4 h-4 rounded border-2 border-outline group-hover:border-primary peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[12px] hidden peer-checked:block" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
            </div>
          </div>
          <span className="text-xs text-on-surface-variant group-hover:text-on-surface transition-colors">Recordar sesión</span>
        </label>
        <a className="text-xs font-semibold text-secondary hover:text-primary transition-colors hover:underline underline-offset-4" href="#">¿Olvidaste tu contraseña?</a>
      </div>

      <ErrorMessage error={submitError} />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 rounded-lg btn-gradient text-on-primary font-bold text-base shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:transform-none"
      >
        {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-outline-variant/30" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-surface-container-lowest text-on-surface-variant font-medium">O continúa con</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button type="button" className="flex items-center justify-center gap-2 py-2.5 px-3 border border-outline-variant/50 rounded-lg hover:bg-surface-container-low transition-all active:scale-95">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="text-xs font-semibold text-on-surface">Google</span>
        </button>
        <button type="button" className="flex items-center justify-center gap-2 py-2.5 px-3 border border-outline-variant/50 rounded-lg hover:bg-surface-container-low transition-all active:scale-95">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span className="text-xs font-semibold text-on-surface">Facebook</span>
        </button>
      </div>
    </form>
  );
}
