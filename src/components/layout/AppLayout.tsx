import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Toast from '../common/Toast';
import Breadcrumbs from '../common/Breadcrumbs';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export default function AppLayout() {
  const isOnline = useOnlineStatus();

  return (
    <div className="app-layout">
      <Navbar />
      {!isOnline && (
        <div className="offline-banner" role="alert">
          No hay conexión a internet. Algunas funciones pueden estar limitadas.
        </div>
      )}
      <main className="app-content">
        <Breadcrumbs />
        <Outlet />
      </main>
      <Toast />
    </div>
  );
}