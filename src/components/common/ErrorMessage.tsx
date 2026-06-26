import type { ApiError } from '../../types/api.types';

interface ErrorMessageProps {
  error: ApiError | null;
  onRetry?: () => void;
}

export default function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  if (!error) return null;
  return (
    <div role="alert" className="error-message">
      <p>{error.message}</p>
      {onRetry && <button onClick={onRetry}>Reintentar</button>}
    </div>
  );
}
