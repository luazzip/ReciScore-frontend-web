import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
import type { ApiError } from '../../types/api.types';
import { useState } from 'react';

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres').max(20, 'El usuario no puede exceder 20 caracteres'),
  email: z.string().min(1, 'El email es obligatorio').email('Ingresa un email válido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
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
      await registerUser(values);
      notify('success', 'Cuenta creada exitosamente. ¡Bienvenido!');
      navigate('/', { replace: true });
    } catch (err) {
      setSubmitError(err as ApiError);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-field">
        <label htmlFor="name">Nombre</label>
        <input id="name" {...register('name')} />
        {errors.name && <span className="field-error">{errors.name.message}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="username">Usuario</label>
        <input id="username" {...register('username')} />
        {errors.username && <span className="field-error">{errors.username.message}</span>}
      </div>
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
      <Button type="submit" isLoading={isSubmitting}>Crear cuenta</Button>
    </form>
  );
}
