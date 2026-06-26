interface SpinnerProps {
  label?: string;
  fullScreen?: boolean;
}

export default function Spinner({ label = 'Cargando...', fullScreen = false }: SpinnerProps) {
  return (
    <div className={fullScreen ? 'spinner-fullscreen' : 'spinner-inline'} role="status" aria-live="polite">
      <div className="spinner" />
      <span>{label}</span>
    </div>
  );
}
