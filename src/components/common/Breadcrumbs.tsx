import { Link, useLocation } from 'react-router-dom';
import { useMemo } from 'react';

const routeLabels: Record<string, string> = {
  '/': 'Inicio',
  '/login': 'Iniciar sesión',
  '/register': 'Registrarse',
  '/reciclaje/nuevo': 'Registrar reciclaje',
  '/reciclaje/historial': 'Historial',
  '/desafios': 'Desafíos',
  '/perfil': 'Perfil',
  '/mapa': 'Mapa',
  '/ranking': 'Ranking',
};

export default function Breadcrumbs() {
  const { pathname } = useLocation();

  const crumbs = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    const paths: { label: string; path: string }[] = [{ label: 'Inicio', path: '/' }];

    let accumulated = '';
    for (const segment of segments) {
      accumulated += `/${segment}`;
      const label = routeLabels[accumulated] || segment.charAt(0).toUpperCase() + segment.slice(1);
      paths.push({ label, path: accumulated });
    }

    return paths;
  }, [pathname]);

  if (crumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.path}>
              {isLast ? (
                <span aria-current="page">{crumb.label}</span>
              ) : (
                <Link to={crumb.path}>{crumb.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
