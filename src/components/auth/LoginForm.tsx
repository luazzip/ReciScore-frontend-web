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
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register('email')} />
        {errors.email && <span className="field-error">{errors.email.message}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="password">Contraseña</label>
        <input id="password" type="password" {...register('password')} />
        {errors.password && <span className="field-error">{errors.password.message}</span>}
      </div>
      <ErrorMessage error={submitError} />
      <Button type="submit" isLoading={isSubmitting}>Iniciar sesión</Button>
    </form>
  );
}
