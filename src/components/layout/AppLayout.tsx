import { Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from './Sidebar';
import Toast from '../common/Toast';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

const pageTitles: Record<string, string> = {
  '/': 'Panel Principal',
  '/reciclaje/nuevo': 'Registrar Reciclaje',
  '/reciclaje/historial': 'Historial',
  '/mapa': 'Mapa de Puntos',
  '/ranking': 'Ranking',
  '/perfil': 'Perfil',
  '/desafios': 'Desafíos',
  '/desafios/': 'Desafío',
};

const bottomNav = [
  { to: '/', label: 'Panel', icon: 'dashboard' },
  { to: '/reciclaje/nuevo', label: 'Reg', icon: 'add_circle' },
  { to: '/mapa', label: 'Mapa', icon: 'map' },
  { to: '/ranking', label: 'Rank', icon: 'leaderboard' },
];

export default function AppLayout() {
  const { usuario } = useAuth();
  const location = useLocation();
  const isOnline = useOnlineStatus();

  const title = Object.entries(pageTitles).find(([path]) =>
    location.pathname === path || location.pathname.startsWith(path + '/')
  )?.[1] ?? 'ReciScore';

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface">
      <Sidebar />

      <header className="fixed top-0 left-0 right-0 flex justify-between items-center px-6 py-3 bg-white/70 backdrop-blur-md z-50 md:left-64">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-green-800 font-headline tracking-tight">{title}</span>
        </div>
        <div className="flex items-center gap-6">
          {usuario && (
            <div className="flex items-center gap-2 bg-primary-container px-4 py-1.5 rounded-full">
              <span className="material-symbols-outlined text-on-primary-container text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>token</span>
              <span className="font-bold text-on-primary-container text-sm">{usuario.points.toLocaleString()} pts</span>
            </div>
          )}
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-xs font-bold border-2 border-white">
            {usuario?.name?.charAt(0).toUpperCase() ?? '?'}
          </div>
        </div>
      </header>

      <main className="pt-20 pb-12 px-6 md:ml-64 min-h-screen space-y-10">
        {!isOnline && (
          <div className="bg-amber-100 text-amber-700 text-center py-2 px-4 rounded-lg text-sm font-medium">
            Sin conexión. Algunas funciones pueden estar limitadas.
          </div>
        )}
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 flex justify-around items-center px-6 py-3 bg-white/70 backdrop-blur-md z-50 md:hidden">
        {bottomNav.map((item) => {
          const isActive = item.to === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 ${
                isActive ? 'text-green-700 font-bold' : 'text-zinc-500'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-[10px] uppercase tracking-tighter">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <Link
        to="/reciclaje/nuevo"
        className="fixed right-6 bottom-20 md:bottom-8 bg-primary text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-40"
      >
        <span className="material-symbols-outlined text-3xl">qr_code_scanner</span>
      </Link>

      <Toast />
    </div>
  );
}
