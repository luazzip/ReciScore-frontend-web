import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div role="alert" className="error-boundary">
            <h2>Algo salió mal</h2>
            <p>Ocurrió un error inesperado. Intenta recargar la página.</p>
            <button onClick={() => window.location.reload()}>Recargar</button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
