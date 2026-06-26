import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';
import Spinner from '../components/common/Spinner';

const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const ReciclajePage = lazy(() => import('../pages/ReciclajePage'));
const HistorialPage = lazy(() => import('../pages/HistorialPage'));
const MapaPage = lazy(() => import('../pages/MapaPage'));
const DesafiosPage = lazy(() => import('../pages/DesafiosPage'));
const DesafioDetallePage = lazy(() => import('../pages/DesafioDetallePage'));
const RankingPage = lazy(() => import('../pages/RankingPage'));
const PerfilPage = lazy(() => import('../pages/PerfilPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner fullScreen label="Cargando..." />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/mapa" element={<MapaPage />} />
            <Route path="/ranking" element={<RankingPage />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/reciclaje/nuevo" element={<ReciclajePage />} />
              <Route path="/reciclaje/historial" element={<HistorialPage />} />
              <Route path="/reciclaje/historial/:reporteId" element={<HistorialPage />} />
              <Route path="/desafios" element={<DesafiosPage />} />
              <Route path="/desafios/:id" element={<DesafioDetallePage />} />
              <Route path="/perfil" element={<PerfilPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
