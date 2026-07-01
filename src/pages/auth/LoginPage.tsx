import { Link } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-gradient-animated">

      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-surface-container-lowest rounded-xl overflow-hidden shadow-2xl shadow-on-surface/5 border border-outline-variant/10">
        <div className="lg:col-span-5 px-8 md:px-10 lg:px-12 xl:px-14 py-8 md:py-10 lg:py-12 flex flex-col justify-center">
          <div className="mb-8 flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
            </div>
            <span className="font-display font-bold text-xl tracking-tighter text-primary">ReciScore</span>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-on-surface leading-tight mb-2">Bienvenido de nuevo</h1>
            <p className="text-[0.95rem] text-on-surface-variant leading-relaxed">Tu impacto ambiental positivo comienza aquí. Ingresa tus credenciales para continuar.</p>
          </div>

          <LoginForm />

          <p className="mt-8 text-center text-sm text-on-surface-variant">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline underline-offset-4">Regístrate gratis</Link>
          </p>
        </div>

        <div className="hidden lg:flex lg:col-span-7 relative bg-surface-container flex-col p-10 overflow-hidden">
          <div className="relative z-10 h-full flex flex-col justify-center">
            <div className="aspect-[4/5] w-full max-h-[500px] rounded-lg overflow-hidden relative shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent z-10" />
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB5rEm8W39iYgRDkZe6vrPqDcx8E-G9n_uM9jnK3ZD0La9c0O6zc7mz9I9OCPvHY-McknLlticiOnqLQzr6cOBUal0AnGms78VXSE3rd87-vBkhhmXn5eDXnPuDVtymLltlDdoc3aV0EHdN6wJoLHE9SiRgfpKpPmS2Gw3b0efknoE_ZC4v5JRmXqsCqwF6ayZWkzlp8K0NZ-Wr6ODEllb89ixR8Meft9KRHoVb-AT2o-7w9_8HzsmlH_1JVWitWs3oqWwSGtkjjfo')"
                }}
              />
              <div className="absolute bottom-4 left-4 right-4 p-4 glass-panel rounded-lg z-20 flex items-center justify-between border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-tertiary-container rounded-full flex items-center justify-center shadow-inner">
                    <span className="material-symbols-outlined text-on-tertiary-fixed font-bold text-lg">workspace_premium</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">únete</p>
                    <p className="text-base font-display font-bold text-on-surface">Conviértete en Eco-Líder</p>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
                  <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
