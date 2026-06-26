import { useNotification } from '../../hooks/useNotification';

export default function Toast() {
  const { notifications, dismiss } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {notifications.map((n) => (
        <div key={n.id} className={`toast toast-${n.type}`} onClick={() => dismiss(n.id)}>
          {n.message}
        </div>
      ))}
    </div>
  );
}
