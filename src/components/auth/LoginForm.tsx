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



      <ErrorMessage error={submitError} />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 rounded-lg btn-gradient text-on-primary font-bold text-base shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:transform-none"
      >
        {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>


    </form>
  );
}
