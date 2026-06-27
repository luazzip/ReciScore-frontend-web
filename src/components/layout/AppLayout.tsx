import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Toast from '../common/Toast';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export default function AppLayout() {
  const isOnline = useOnlineStatus();

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        {!isOnline && (
          <div className="offline-banner" role="alert">
            Sin conexión. Algunas funciones pueden estar limitadas.
          </div>
        )}
        <Outlet />
      </div>
      <Toast />
    </div>
  );
}