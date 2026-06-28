export default function ReciclajePage() {
  return (
    <div className="space-y-8 relative">
      <div className="fixed -bottom-20 -right-20 w-80 h-80 bg-primary-fixed/20 blur-[100px] rounded-full -z-10" />

      <section className="relative overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm p-12">
        <div className="max-w-3xl space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">smartphone</span>
            Función Exclusiva Mobile
          </div>
          <h2 className="text-5xl font-black font-headline text-green-900 tracking-tight leading-[1.1]">
            Valida tu reciclaje y <span className="text-primary italic">suma puntos</span> al instante.
          </h2>
          <p className="text-on-surface-variant text-lg leading-relaxed max-w-xl">
            El registro de materiales requiere el uso de la cámara de tu dispositivo móvil. Descarga la app para empezar.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://play.google.com/store/apps/details?id=TU_APP_ID"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.18 23.5c.32.18.68.2 1.02.06L16.5 12 13.06 8.56 3.18 23.5Z" fill="#EA4335"/>
                <path d="M20.82 10.3 17.7 8.56 14 12l3.7 3.7 3.12-1.74A1.8 1.8 0 0 0 20.82 10.3Z" fill="#FBBC04"/>
                <path d="M4.2.44A1.8 1.8 0 0 0 3.18.5L13.06 12 16.5 8.56 4.2.44Z" fill="#4285F4"/>
                <path d="M3.18.5A1.8 1.8 0 0 0 2 2.18v19.64a1.8 1.8 0 0 0 1.18 1.68L14.94 12 3.18.5Z" fill="#34A853"/>
              </svg>
              <div>
                <p className="text-[10px] text-gray-400 leading-none">GET IT ON</p>
                <p className="text-base font-semibold text-gray-800 leading-tight">Google Play</p>
              </div>
            </a>
            <a
              href="https://apps.apple.com/app/TU_APP_ID"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
            >
              <svg width="24" height="24" viewBox="0 0 814 1000" xmlns="http://www.w3.org/2000/svg">
                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-155.5-127.4C46 790.8 0 663.8 0 541.8c0-195.5 127.4-298.9 252.8-298.9 65.6 0 120 43.4 161.3 43.4 39.5 0 101.3-46 176.5-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" fill="#111"/>
              </svg>
              <div>
                <p className="text-[10px] text-gray-400 leading-none">Download on the</p>
                <p className="text-base font-semibold text-gray-800 leading-tight">App Store</p>
              </div>
            </a>
          </div>
        </div>


      </section>

      <section className="grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-4 bg-surface-container-low p-8 rounded-xl flex flex-col gap-6 hover:bg-white hover:shadow-lg transition-all group">
          <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-black text-xl font-headline">1</div>
          <div className="space-y-2">
            <h3 className="font-headline font-bold text-xl text-green-900">Descarga la App</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">Instala ReciScore en tu teléfono para acceder a la billetera ecológica y validación por IA.</p>
          </div>
          <div className="mt-auto">
            <span className="material-symbols-outlined text-4xl text-primary/20 group-hover:text-primary transition-colors">install_mobile</span>
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 bg-surface-container-low p-8 rounded-xl flex flex-col gap-6 hover:bg-white hover:shadow-lg transition-all group">
          <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-black text-xl font-headline">2</div>
          <div className="space-y-2">
            <h3 className="font-headline font-bold text-xl text-green-900">Captura y Valida</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">Abre el escáner, toma una foto de tus residuos y nuestro sistema reconocerá el material automáticamente.</p>
          </div>
          <div className="mt-auto">
            <span className="material-symbols-outlined text-4xl text-primary/20 group-hover:text-primary transition-colors">photo_camera</span>
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 bg-surface-container-low p-8 rounded-xl flex flex-col gap-6 hover:bg-white hover:shadow-lg transition-all group">
          <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-black text-xl font-headline">3</div>
          <div className="space-y-2">
            <h3 className="font-headline font-bold text-xl text-green-900">Acumula EcoPoints</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">Al confirmar el depósito en un punto verde, recibirás tus puntos de inmediato para canjear premios.</p>
          </div>
          <div className="mt-auto">
            <span className="material-symbols-outlined text-4xl text-primary/20 group-hover:text-primary transition-colors">redeem</span>
          </div>
        </div>

        <div className="col-span-12 md:col-span-8 relative rounded-xl overflow-hidden min-h-[400px]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAhtLctIIDyb0SFIiI01h9lZTmwOEIMPTZoEKxGYua5tqxjAsh3rSncKis34E4ByhmfzeuPYTnbtBXknNeuzpuveLTp6x4wzmutC4TZ1MAig_hoZUWPTHYb3NlCqqtOpaniYEcnC0UrmhlEmZBavaz5KSlTr3u-oegB9Z9v3EtTWRkhLLsyLkQpuMHa4hdim6Kgo_f8XG7mZIYC893lA7-kkzK9J46NqXrYC3bZc86ADkhsEQPrAJjWB2dHN740knKPfMDcyuL6ejiZ')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 via-green-900/40 to-transparent p-12 flex flex-col justify-end">
            <h4 className="text-3xl font-black text-white font-headline mb-4 leading-tight">Tu impacto es real,<br />haz que cuente.</h4>
            <p className="text-white/80 max-w-md mb-8">Únete a miles de héroes locales que están transformando su ciudad, un envase a la vez.</p>
            <button className="w-fit px-8 py-4 bg-white text-green-900 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
              Ver impacto global
            </button>
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 bg-secondary text-white p-12 rounded-xl flex flex-col justify-center gap-6">
          <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: '"FILL" 1' }}>eco</span>
          <h4 className="text-2xl font-black font-headline">Registros de hoy</h4>
          <div className="flex items-end gap-2">
            <span className="text-6xl font-black font-headline">+12.4k</span>
            <span className="text-sm opacity-60 mb-2 uppercase tracking-widest">Kg reciclados</span>
          </div>
          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mt-4">
            <div className="bg-primary-container h-full w-[78%]" />
          </div>
          <p className="text-xs text-white/60">Estamos al 78% de nuestra meta semanal comunitaria.</p>
        </div>
      </section>
    </div>
  );
}
