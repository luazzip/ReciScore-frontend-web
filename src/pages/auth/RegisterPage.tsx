import { Link } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary-container floating-blob animate-pulse" />
        <div className="absolute top-1/2 -right-48 w-[500px] h-[500px] rounded-full bg-secondary-container floating-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 rounded-full bg-tertiary-container floating-blob" />
      </div>

      <header className="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-xl">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <span className="font-display font-bold text-2xl tracking-tighter text-primary">ReciScore</span>
          <div className="hidden md:flex gap-8 items-center">
            <span className="text-on-surface-variant font-medium text-sm">¿Ya tienes cuenta?</span>
            <Link to="/login" className="bg-surface-container-lowest px-6 py-2 rounded-lg font-bold text-primary text-sm shadow-sm hover:bg-white transition-all active:scale-95">Iniciar Sesión</Link>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-4 relative z-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="hidden lg:block space-y-8 pr-12">
            <div className="space-y-4">
              <span className="inline-block bg-primary-container text-on-primary-container px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Únete a la Revolución</span>
              <h1 className="text-6xl font-extrabold tracking-tighter leading-none text-on-surface">
                Cultiva un futuro <span className="text-primary">sostenible</span> con ReciScore.
              </h1>
              <p className="text-on-surface-variant text-lg max-w-md">
                Gana recompensas por cada acción ecológica. Tu camino hacia el impacto ambiental real comienza aquí.
              </p>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary-container/20 rounded-xl blur-2xl group-hover:bg-primary-container/30 transition-all duration-500" />
              <div className="relative h-80 w-full rounded-xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent z-10" />
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCG4uLUGasH1lYRtiy1LrjvABx0lRyNyLXD_IT2W0mf5XEPJ1w8P8WuhFgUR0pEMpbh2Zkw9FG6yKM4gzu11T2Q5q5kiQCp9Cxkm1CXl_TmCDvFcS4wlepGEZgjZH1MuGS9TSVJb9aFB8N-2jPENWC4dZvmRRD22kuIT7_SGsAxWBGkAj9i7ALhRdENCXfMdr99FmPF9Nv1JHVv-9k-gKDIwLGYzKgBo_OzqreaqlyFvnB02UHWxLlzydPwe8D3Egru4IvSYiAe6l0"
                  alt=""
                />
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-8 md:p-12 shadow-xl shadow-on-surface/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16" />
            <div className="relative z-10">
              <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight mb-2">Crear cuenta</h2>
                <p className="text-on-surface-variant">Completa los datos para empezar a puntuar.</p>
              </div>
              <RegisterForm />
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant/30" /></div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest"><span className="bg-surface-container-lowest px-4 text-outline">o regístrate con</span></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button type="button" className="flex items-center justify-center gap-2 py-3 bg-surface-container-low hover:bg-surface-container-high rounded-lg transition-colors text-sm font-semibold">
                  <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button type="button" className="flex items-center justify-center gap-2 py-3 bg-surface-container-low hover:bg-surface-container-high rounded-lg transition-colors text-sm font-semibold">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#555" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  Apple
                </button>
              </div>
              <p className="mt-6 text-center text-xs text-on-surface-variant">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4">Inicia sesión</Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-12 bg-surface">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-8 w-full max-w-7xl mx-auto">
          <span className="font-display font-extrabold text-on-surface">ReciScore</span>
          <div className="flex gap-8 text-xs uppercase tracking-wider text-on-surface-variant">
            <a className="hover:text-secondary transition-colors underline-offset-4 hover:underline" href="#">Privacy Policy</a>
            <a className="hover:text-secondary transition-colors underline-offset-4 hover:underline" href="#">Terms of Service</a>
            <a className="hover:text-secondary transition-colors underline-offset-4 hover:underline" href="#">Help Center</a>
          </div>
          <p className="text-xs uppercase tracking-wider text-outline">© 2024 ReciScore. Built for the Digital Greenhouse.</p>
        </div>
      </footer>
    </div>
  );
}
