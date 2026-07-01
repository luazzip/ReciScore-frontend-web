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
