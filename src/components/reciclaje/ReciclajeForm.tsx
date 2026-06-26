import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { reciclajeService } from '../../services/reciclajeService';
import { materialService } from '../../services/materialService';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useNotification } from '../../hooks/useNotification';
import { fileToBase64 } from '../../utils/formatters';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
import Spinner from '../common/Spinner';
import type { ApiError } from '../../types/api.types';
import type { Material } from '../../types/material.types';
import type { TamanoObjeto } from '../../types/reciclaje.types';

const schema = z.object({
  materialId: z.coerce.number({ message: 'Selecciona un material' }).positive(),
  tamanoObjeto: z.enum(['PEQUENO', 'MEDIANO', 'GRANDE'] as [TamanoObjeto, ...TamanoObjeto[]]),
  numeroArticulos: z.coerce.number().min(1, 'Debe ser al menos 1 artículo'),
  foto: z
    .instanceof(FileList)
    .refine((files) => files.length === 1, 'Debes subir una foto del material'),
});

type FormValues = z.infer<typeof schema>;

interface ReciclajeFormProps {
  onSuccess?: () => void;
}

export default function ReciclajeForm({ onSuccess }: ReciclajeFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const { latitude, longitude, isLoading: isLoadingGps, error: gpsError } = useGeolocation();
  const { notify } = useNotification();
  const [submitError, setSubmitError] = useState<ApiError | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(true);
  const [materialsError, setMaterialsError] = useState<ApiError | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    materialService.getAll(controller.signal)
      .then((data) => {
        setMaterials(data);
        setMaterialsError(null);
      })
      .catch((err: ApiError) => {
        if (!controller.signal.aborted) {
          setMaterialsError(err);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoadingMaterials(false);
        }
      });
    return () => controller.abort();
  }, []);

  async function onSubmit(values: FormValues) {
    if (!latitude || !longitude) {
      setSubmitError({ status: 0, message: 'No se pudo validar tu ubicación GPS.' });
      return;
    }
    setSubmitError(null);

    const fotoBase64 = await fileToBase64(values.foto[0]);

    try {
      await reciclajeService.registrar({
        materialId: values.materialId,
        tamanoObjeto: values.tamanoObjeto,
        numeroArticulos: values.numeroArticulos,
        fotoUrl: fotoBase64,
        latitud: latitude,
        longitud: longitude,
      });
      notify('success', '¡Reciclaje registrado! Estamos validando tu foto con IA.');
      onSuccess?.();
    } catch (err) {
      setSubmitError(err as ApiError);
    }
  }

  if (isLoadingMaterials) {
    return <Spinner label="Cargando materiales..." />;
  }

  if (materialsError) {
    return <ErrorMessage error={materialsError} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-field">
        <label htmlFor="materialId">Material</label>
        <select id="materialId" {...register('materialId')}>
          <option value="">Selecciona...</option>
          {materials.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.category}) - {m.pointsPerKg} pts/kg
            </option>
          ))}
        </select>
        {errors.materialId && <span className="field-error">{errors.materialId.message}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="tamanoObjeto">Tamaño</label>
        <select id="tamanoObjeto" {...register('tamanoObjeto')}>
          <option value="PEQUENO">Pequeño</option>
          <option value="MEDIANO">Mediano</option>
          <option value="GRANDE">Grande</option>
        </select>
        {errors.tamanoObjeto && <span className="field-error">{errors.tamanoObjeto.message}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="numeroArticulos">Número de artículos</label>
        <input id="numeroArticulos" type="number" min={1} {...register('numeroArticulos')} />
        {errors.numeroArticulos && <span className="field-error">{errors.numeroArticulos.message}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="foto">Foto del material</label>
        <Controller
          control={control}
          name="foto"
          render={({ field: { onChange, ref, name, onBlur } }) => (
            <input
              id="foto"
              type="file"
              accept="image/*"
              ref={ref}
              name={name}
              onBlur={onBlur}
              onChange={(e) => onChange(e.target.files)}
            />
          )}
        />
        {errors.foto && <span className="field-error">{errors.foto.message}</span>}
      </div>

      {isLoadingGps && <p>Obteniendo tu ubicación...</p>}
      {gpsError && <span className="field-error">{gpsError}</span>}

      <ErrorMessage error={submitError} />

      <Button type="submit" isLoading={isSubmitting}>
        Registrar reciclaje
      </Button>
    </form>
  );
}