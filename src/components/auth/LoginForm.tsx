import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import Button from '../common/Button';
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
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-field">
        <label className="form-label-upper" htmlFor="email">Correo Electrónico</label>
        <div className="form-input-icon">
          <input
            id="email"
            type="email"
            placeholder="ejemplo@reciscore.com"
            {...register('email')}
          />
        </div>
        {errors.email && <span className="field-error">{errors.email.message}</span>}
      </div>

      <div className="form-field">
        <label className="form-label-upper" htmlFor="password">Contraseña</label>
        <div className="form-input-icon">
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
          />
        </div>
        {errors.password && <span className="field-error">{errors.password.message}</span>}
      </div>

      <ErrorMessage error={submitError} />

      <Button type="submit" isLoading={isSubmitting}>
        Iniciar Sesión
      </Button>

      <div className="social-divider">O continúa con</div>

      <div className="social-buttons">
        <button type="button" className="social-btn">
          <span>G</span> Google
        </button>
        <button type="button" className="social-btn">
          <span>f</span> Facebook
        </button>
      </div>
    </form>
  );
}