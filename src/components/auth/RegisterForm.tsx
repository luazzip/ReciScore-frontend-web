import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import ErrorMessage from '../common/ErrorMessage';
import type { ApiError } from '../../types/api.types';
import { useState } from 'react';

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().min(1, 'El email es obligatorio').email('Ingresa un email válido'),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  terms: z.literal(true, { errorMap: () => ({ message: 'Debes aceptar los términos' }) }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const { notify } = useNotification();
  const [submitError, setSubmitError] = useState<ApiError | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterFormValues) {
    setSubmitError(null);
    try {
      const { email, password, name } = values;
      await registerUser({ email, password, name, username: email.split('@')[0] });
      notify('success', '¡Bienvenido a ReciScore!');
      navigate('/', { replace: true });
    } catch (err) {
      setSubmitError(err as ApiError);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-outline px-1" htmlFor="name">Nombre Completo</label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">person</span>
          <input
            id="name"
            type="text"
            placeholder="Ej. Juan Pérez"
            className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-lg input-focus-effect transition-all text-on-surface"
            {...register('name')}
          />
        </div>
        {errors.name && <span className="text-xs text-error ml-1">{errors.name.message}</span>}
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-outline px-1" htmlFor="email">Correo Electrónico</label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">mail</span>
          <input
            id="email"
            type="email"
            placeholder="nombre@ejemplo.com"
            className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-lg input-focus-effect transition-all text-on-surface"
            {...register('email')}
          />
        </div>
        {errors.email && <span className="text-xs text-error ml-1">{errors.email.message}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-outline px-1" htmlFor="password">Contraseña</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">lock</span>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-lg input-focus-effect transition-all text-on-surface"
              {...register('password')}
            />
          </div>
          {errors.password && <span className="text-xs text-error ml-1">{errors.password.message}</span>}
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-outline px-1" htmlFor="confirmPassword">Confirmar</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">key</span>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-lg input-focus-effect transition-all text-on-surface"
              {...register('confirmPassword')}
            />
          </div>
          {errors.confirmPassword && <span className="text-xs text-error ml-1">{errors.confirmPassword.message}</span>}
        </div>
      </div>

      <div className="flex items-center gap-3 px-1">
        <input
          id="terms"
          type="checkbox"
          className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary transition-all"
          {...register('terms')}
        />
        <label className="text-sm text-on-surface-variant" htmlFor="terms">
          Acepto los <a className="text-primary font-bold underline underline-offset-2" href="#">términos y condiciones</a> y la política de privacidad.
        </label>
      </div>
      {errors.terms && <span className="text-xs text-error ml-1">{errors.terms.message}</span>}

      <ErrorMessage error={submitError} />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-5 bg-gradient-to-br from-primary to-primary-dim text-on-primary font-bold uppercase tracking-widest rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
        {isSubmitting ? 'Procesando...' : 'Registrarme ahora'}
      </button>
    </form>
  );
}
