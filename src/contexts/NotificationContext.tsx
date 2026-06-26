import { createContext, useCallback, useState, type ReactNode } from 'react';

export type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  id: number;
  type: NotificationType;
  message: string;
}

interface NotificationContextValue {
  notify: (type: NotificationType, message: string) => void;
  notifications: Notification[];
  dismiss: (id: number) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

let nextId = 1;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const dismiss = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notify = useCallback(
    (type: NotificationType, message: string) => {
      const id = nextId++;
      setNotifications((prev) => [...prev, { id, type, message }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  return (
    <NotificationContext.Provider value={{ notify, notifications, dismiss }}>
      {children}
    </NotificationContext.Provider>
  );
}
