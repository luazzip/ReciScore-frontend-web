import { useState } from 'react';
import { mapaService } from '../../services/mapaService';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useNotification } from '../../hooks/useNotification';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
import type { ApiError } from '../../types/api.types';

export default function ReportarZonaSuciaForm() {
  const { latitude, longitude } = useGeolocation();
  const { notify } = useNotification();
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!latitude || !longitude) return;
    if (description.trim().length < 10) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await mapaService.reportarZonaSucia({ latitude, longitude, descripcion: description.trim() });
      notify('success', 'Zona reportada. Será validada al alcanzar 20 votos.');
      setDescription('');
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="description">Descripción de la zona</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe la zona sucia..."
          required
          minLength={10}
        />
      </div>
      <ErrorMessage error={error} />
      <Button type="submit" isLoading={isSubmitting}>Reportar zona</Button>
    </form>
  );
}