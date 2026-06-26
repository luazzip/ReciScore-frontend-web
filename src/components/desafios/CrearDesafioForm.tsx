import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { desafioService } from '../../services/desafioService';
import { useNotification } from '../../hooks/useNotification';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
import type { ApiError } from '../../types/api.types';

const CATEGORIAS = [
  'RECICLAJE',
  'RACHA',
  'COMUNIDAD',
  'IMPACTO',
  'EVENTO',
] as const;

const schema = z.object({
  titulo: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  descripcion: z.string().optional(),
  categoria: z.enum(CATEGORIAS),
  meta_valor: z.coerce.number().positive('Debe ser mayor a 0'),
  puntos: z.coerce.number().positive('Debe ser mayor a 0'),
  fecha_inicio: z.string().min(1, 'Selecciona una fecha de inicio'),
  fecha_fin: z.string().min(1, 'Selecciona una fecha de fin'),
});

type FormValues = z.infer<typeof schema>;

interface CrearDesafioFormProps {
  onSuccess?: () => void;
}

export default function CrearDesafioForm({ onSuccess }: CrearDesafioFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fecha_inicio: new Date().toISOString().split('T')[0],
    },
  });

  const { notify } = useNotification();
  const [submitError, setSubmitError] = useState<ApiError | null>(null);

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    try {
      await desafioService.create({
        titulo: values.titulo,
        descripcion: values.descripcion || undefined,
        categoria: values.categoria,
        meta_valor: values.meta_valor,
        puntos: values.puntos,
        fecha_inicio: new Date(values.fecha_inicio).toISOString(),
        fecha_fin: new Date(values.fecha_fin).toISOString(),
      });
      notify('success', '¡Desafío creado exitosamente!');
      onSuccess?.();
    } catch (err) {
      setSubmitError(err as ApiError);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="crear-desafio-form">
      <h3>Crear nuevo desafío</h3>

      <div className="form-field">
        <label htmlFor="titulo">Título</label>
        <input id="titulo" type="text" {...register('titulo')} />
        {errors.titulo && <span className="field-error">{errors.titulo.message}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="descripcion">Descripción</label>
        <textarea id="descripcion" rows={3} {...register('descripcion')} />
        {errors.descripcion && <span className="field-error">{errors.descripcion.message}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="categoria">Categoría</label>
        <select id="categoria" {...register('categoria')}>
          <option value="">Selecciona...</option>
          {CATEGORIAS.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.categoria && <span className="field-error">{errors.categoria.message}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="meta_valor">Meta (kg o unidades)</label>
        <input id="meta_valor" type="number" min={1} {...register('meta_valor')} />
        {errors.meta_valor && <span className="field-error">{errors.meta_valor.message}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="puntos">Puntos de recompensa</label>
        <input id="puntos" type="number" min={1} {...register('puntos')} />
        {errors.puntos && <span className="field-error">{errors.puntos.message}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="fecha_inicio">Fecha de inicio</label>
        <input id="fecha_inicio" type="date" {...register('fecha_inicio')} />
        {errors.fecha_inicio && <span className="field-error">{errors.fecha_inicio.message}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="fecha_fin">Fecha de fin</label>
        <input id="fecha_fin" type="date" {...register('fecha_fin')} />
        {errors.fecha_fin && <span className="field-error">{errors.fecha_fin.message}</span>}
      </div>

      <ErrorMessage error={submitError} />

      <Button type="submit" isLoading={isSubmitting}>
        Crear desafío
      </Button>
    </form>
  );
}
