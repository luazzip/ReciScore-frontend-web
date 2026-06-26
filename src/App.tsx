import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import AppRouter from './routes/AppRouter';
import './App.css';

export default function App() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
}
