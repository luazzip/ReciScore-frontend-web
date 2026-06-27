import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { mapaService } from '../services/mapaService';
import type { PuntoMapa } from '../types/puntoMapa.types';
import Skeleton from '../components/common/Skeleton';

type Categoria = 'PAPEL' | 'PLASTICO' | 'VIDRIO' | 'METAL';

const SERVICIOS: { cat: Categoria; icon: string; label: string }[] = [
  { cat: 'PAPEL',    icon: '📄', label: 'Papel' },
  { cat: 'PLASTICO', icon: '🔥', label: 'Plástico' },
  { cat: 'VIDRIO',   icon: '🍶', label: 'Vidrio' },
  { cat: 'METAL',    icon: '🔩', label: 'Metal' },
];

// Puntos demo para cuando la API no retorna data
const DEMO_PUNTOS: PuntoMapa[] = [
  { id: 1, nombre: 'Reciclaje Sunset Valley', latitude: -12.097, longitude: -77.05,  tipo: 'ACOPIO_OFICIAL' },
  { id: 2, nombre: 'Eco-Centro San Isidro',   latitude: -12.103, longitude: -77.035, tipo: 'ACOPIO_OFICIAL' },
  { id: 3, nombre: 'Punto Verde Miraflores',  latitude: -12.121, longitude: -77.029, tipo: 'ACOPIO_OFICIAL' },
];

const SERVICIOS_PUNTO: Record<number, Partial<Record<Categoria, boolean>>> = {
  1: { PAPEL: true,  PLASTICO: true,  VIDRIO: false, METAL: true  },
  2: { PAPEL: true,  PLASTICO: false, VIDRIO: true,  METAL: true  },
  3: { PAPEL: false, PLASTICO: true,  VIDRIO: true,  METAL: false },
};

export default function MapaPage() {
  const [selected, setSelected] = useState<PuntoMapa | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [showReport, setShowReport] = useState(false);

  const { data, isLoading } = useFetch(
    (signal) => mapaService.getPuntos(signal),
    []
  );

  const puntos = (data && data.length > 0 ? data : DEMO_PUNTOS).filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const puntoSeleccionado = selected ?? DEMO_PUNTOS[0];
  const serviciosPunto = SERVICIOS_PUNTO[puntoSeleccionado.id] ?? {};

  return (
    <div style={{ position: 'relative', height: 'calc(100vh - 4rem)', margin: '-2rem', overflow: 'hidden' }}>

      {/* MAP BACKGROUND */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 40%, #e0f2f1 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {/* Fake road grid */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.3 }}>
          {[...Array(12)].map((_, i) => (
            <line key={`h${i}`} x1="0" y1={`${(i + 1) * 8}%`} x2="100%" y2={`${(i + 1) * 8}%`}
              stroke="#b2dfdb" strokeWidth="1.5" />
          ))}
          {[...Array(16)].map((_, i) => (
            <line key={`v${i}`} x1={`${(i + 1) * 6.25}%`} y1="0" x2={`${(i + 1) * 6.25}%`} y2="100%"
              stroke="#b2dfdb" strokeWidth="1.5" />
          ))}
          {/* Avenidas principales */}
          <line x1="0" y1="35%" x2="100%" y2="42%" stroke="#a5d6a7" strokeWidth="4" />
          <line x1="25%" y1="0" x2="30%" y2="100%" stroke="#a5d6a7" strokeWidth="4" />
          <line x1="60%" y1="0" x2="55%" y2="100%" stroke="#a5d6a7" strokeWidth="3" />
        </svg>

        {/* Map pins */}
        {puntos.map((p, i) => {
          const topPct  = 20 + (i * 25) % 55;
          const leftPct = 20 + (i * 37) % 60;
          const isActive = puntoSeleccionado.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              style={{
                position: 'absolute',
                top: `${topPct}%`, left: `${leftPct}%`,
                width: isActive ? 48 : 40, height: isActive ? 48 : 40,
                borderRadius: '50%',
                background: isActive ? 'var(--green-600)' : 'var(--green-500)',
                border: `3px solid ${isActive ? 'white' : 'var(--green-700)'}`,
                boxShadow: isActive ? '0 4px 16px rgba(22,163,74,0.5)' : 'var(--shadow)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: isActive ? '1.25rem' : '1rem',
                cursor: 'pointer', transition: 'all 0.2s', zIndex: isActive ? 10 : 5,
                transform: isActive ? 'scale(1.1)' : 'scale(1)'
              }}
            >
              ♻️
            </button>
          );
        })}
      </div>

      {/* SEARCH BAR */}
      <div style={{
        position: 'absolute', top: '1rem', left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480, padding: '0 1rem', zIndex: 20
      }}>
        <div style={{
          background: 'white', borderRadius: 999,
          boxShadow: 'var(--shadow-lg)',
          display: 'flex', alignItems: 'center', padding: '0.625rem 1.25rem', gap: '0.5rem'
        }}>
          <span style={{ color: 'var(--gray-400)', fontSize: '1rem' }}>🔍</span>
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar puntos de reciclaje"
            style={{
              border: 'none', outline: 'none', flex: 1,
              fontSize: '0.9375rem', background: 'transparent', color: 'var(--gray-800)'
            }}
          />
          <span style={{ color: 'var(--gray-300)', fontSize: '1.1rem' }}>⊞</span>
        </div>
      </div>

      {/* PUNTO CARD */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20,
        padding: '0 1.5rem 1.5rem'
      }}>
        {isLoading ? (
          <div className="card"><Skeleton rows={3} /></div>
        ) : (
          <div className="card" style={{ boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <span style={{
                  background: 'var(--green-50)', color: 'var(--green-700)',
                  fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.625rem',
                  borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.06em',
                  display: 'inline-block', marginBottom: '0.375rem'
                }}>Punto Seleccionado</span>
                <h2 style={{ marginBottom: '0.25rem', fontSize: '1.25rem' }}>{puntoSeleccionado.nombre}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                  📍 425 Geary St, Lima PE
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--green-600)', fontWeight: 700, fontSize: '0.875rem' }}>Abierto ahora</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--gray-400)' }}>Cierra a las 8:00 PM</div>
              </div>
            </div>

            {/* Servicios */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
              {SERVICIOS.map(({ cat, icon, label }) => {
                const acepta = serviciosPunto[cat] !== false;
                return (
                  <div key={cat} style={{
                    padding: '0.75rem 0.5rem', textAlign: 'center',
                    background: acepta ? 'var(--green-50)' : 'var(--gray-50)',
                    borderRadius: 'var(--radius)',
                    border: `1px solid ${acepta ? 'var(--green-200)' : 'var(--gray-200)'}`,
                    opacity: acepta ? 1 : 0.55
                  }}>
                    <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{icon}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.125rem' }}>{label}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: acepta ? 'var(--green-700)' : 'var(--gray-400)' }}>
                      {acepta ? 'Aceptado' : 'Sin Servicio'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button className="btn btn-primary" style={{ flex: 1, background: 'var(--green-800)', padding: '0.75rem' }}>
                📍 Cómo llegar
              </button>
              <button style={{
                width: 44, height: 44, borderRadius: '50%', border: '1px solid var(--gray-200)',
                background: 'white', fontSize: '1.1rem', cursor: 'pointer', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>🔗</button>
            </div>
          </div>
        )}
      </div>

      {/* REPORTAR PUNTO SUCIO */}
      <button
        onClick={() => setShowReport(!showReport)}
        style={{
          position: 'absolute', bottom: showReport ? 'auto' : '1.5rem', right: '1.5rem',
          top: showReport ? '1rem' : 'auto',
          background: 'var(--green-800)', color: 'white',
          border: 'none', borderRadius: 999, padding: '0.625rem 1.25rem',
          fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer',
          boxShadow: 'var(--shadow-md)', zIndex: 30
        }}
      >
        {showReport ? '✕ Cerrar' : 'Reportar Punto Sucio'}
      </button>
    </div>
  );
}