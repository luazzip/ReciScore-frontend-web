import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { to: '/', label: 'Panel', icon: 'dashboard', end: true },
  { to: '/reciclaje/nuevo', label: 'Registrar', icon: 'add_circle' },
  { to: '/mapa', label: 'Mapa', icon: 'map' },
  { to: '/ranking', label: 'Ranking', icon: 'leaderboard' },
  { to: '/reciclaje/historial', label: 'Historial', icon: 'history' },
];

export default function Sidebar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col p-4 z-40 bg-zinc-50 w-64 border-r-0 hidden md:flex">
      <div className="mb-8 px-4 py-6">
        <span className="text-2xl font-black text-green-800 font-headline">ReciScore</span>
      </div>

      {usuario && (
        <div className="flex items-center gap-4 px-4 mb-10">
          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-primary flex items-center justify-center text-on-primary font-bold text-lg">
            {usuario.profilePicture ? (
              <img src={usuario.profilePicture} alt={usuario.name} className="w-full h-full object-cover" />
            ) : (
              usuario.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-headline font-bold text-on-surface text-sm truncate">{usuario.name}</h3>
            <p className="font-headline uppercase tracking-widest text-[10px] text-primary truncate">Curador Nivel {usuario.nivel}</p>
          </div>
        </div>
      )}

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  isActive
                    ? 'bg-green-100 text-green-800 shadow-sm'
                    : 'text-zinc-600 hover:text-green-600 hover:translate-x-1 duration-200'
                }`
              }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-headline uppercase tracking-widest text-[10px]">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => { logout(); navigate('/login'); }}
        className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-zinc-500 hover:text-error hover:bg-error-container/20 w-full mt-2"
      >
        <span className="material-symbols-outlined">logout</span>
        <span className="font-headline uppercase tracking-widest text-[10px]">Cerrar Sesión</span>
      </button>
    </aside>
  );
}
