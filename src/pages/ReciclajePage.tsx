import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReciclajeForm from '../components/reciclaje/ReciclajeForm';

type Material = 'PLASTICO' | 'VIDRIO' | 'PAPEL' | 'METAL';

const MATERIALES: { tipo: Material; label: string; icon: string; color: string }[] = [
  { tipo: 'PLASTICO', label: 'Plástico', icon: '🧴', color: '#3b82f6' },
  { tipo: 'VIDRIO',   label: 'Vidrio',   icon: '🍶', color: '#f97316' },
  { tipo: 'PAPEL',    label: 'Papel',    icon: '📄', color: '#a78bfa' },
  { tipo: 'METAL',    label: 'Metal',    icon: '🔩', color: '#ef4444' },
];

export default function ReciclajePage() {
  const navigate = useNavigate();
  const [selectedMat, setSelectedMat] = useState<Material>('PLASTICO');
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [peso, setPeso] = useState(2.4);
  const [articulos, setArticulos] = useState(12);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div>
      {/* Header */}
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>
        Registrar Impacto.
      </h1>
      <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem' }}>
        Valida tu acción de reciclaje para acumular puntos.
      </p>

      <div className="reciclaje-register-layout">
        {/* LEFT — Foto + Material */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Foto upload */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                ♻️ Validación por Foto
              </div>
              <span style={{
                background: 'var(--green-100)', color: 'var(--green-700)',
                fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.75rem',
                borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.06em'
              }}>IA Habilitada</span>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? 'var(--green-500)' : 'var(--gray-200)'}`,
                borderRadius: 'var(--radius)',
                background: dragOver ? 'var(--green-50)' : 'var(--gray-50)',
                minHeight: 200,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s',
                overflow: 'hidden', position: 'relative'
              }}
            >
              {preview ? (
                <img src={preview} alt="preview" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 'var(--radius)' }} />
              ) : (
                <>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>☁️</div>
                  <div style={{ fontWeight: 600, color: 'var(--gray-700)', marginBottom: '0.25rem' }}>
                    Arrastra y suelta la foto de tu artículo
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--gray-400)', textAlign: 'center', maxWidth: 280 }}>
                    Captura etiquetas y claridad del material para una aprobación por IA más rápida
                  </div>
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />

            {/* Estado IA */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
              <div style={{
                padding: '0.75rem', background: 'var(--gray-50)',
                borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)'
              }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>ESTADO</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 600, fontSize: '0.875rem' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: preview ? 'var(--green-500)' : '#f59e0b', display: 'inline-block' }} />
                  {preview ? 'Procesando...' : 'Listo para escanear'}
                </div>
              </div>
              <div style={{
                padding: '0.75rem', background: 'var(--gray-50)',
                borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)'
              }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>CONFIANZA DE IA</div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>98.2% Precisión</div>
              </div>
            </div>
          </div>

          {/* Firma del material */}
          <div className="card">
            <div style={{ fontWeight: 700, marginBottom: '1rem' }}>Firma del Material</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
              {MATERIALES.map(m => (
                <button
                  key={m.tipo}
                  onClick={() => setSelectedMat(m.tipo)}
                  style={{
                    padding: '1rem 0.5rem', borderRadius: 'var(--radius)',
                    border: selectedMat === m.tipo ? `2px solid ${m.color}` : '2px solid var(--gray-200)',
                    background: selectedMat === m.tipo ? m.color + '12' : 'var(--white)',
                    cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.375rem' }}>{m.icon}</div>
                  <div style={{
                    fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
                    color: selectedMat === m.tipo ? m.color : 'var(--gray-500)'
                  }}>{m.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Cantidad + Punto + CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Cantidad y peso */}
          <div className="card">
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.25rem' }}>Cantidad y Peso</div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                PESO ESTIMADO (KG)
              </div>
              <input
                type="range" min={0} max={10} step={0.1}
                value={peso}
                onChange={e => setPeso(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--green-600)', marginBottom: '0.25rem' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--gray-400)' }}>
                <span>0kg</span>
                <span style={{ fontWeight: 700, color: 'var(--green-600)', fontSize: '1rem' }}>{peso.toFixed(1)} kg</span>
                <span>10kg</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>
                  CANTIDAD DE ARTÍCULOS
                </div>
                <input
                  type="number" min={1} value={articulos}
                  onChange={e => setArticulos(Number(e.target.value))}
                  className="form-field"
                  style={{
                    width: '100%', padding: '0.5rem 0.75rem',
                    border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)',
                    fontSize: '0.9375rem', background: 'var(--gray-50)'
                  }}
                />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>
                  NIVEL DE PUREZA
                </div>
                <select style={{
                  width: '100%', padding: '0.5rem 0.75rem',
                  border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)',
                  fontSize: '0.875rem', background: 'var(--gray-50)', cursor: 'pointer'
                }}>
                  <option>Limpio / Alta</option>
                  <option>Normal / Media</option>
                  <option>Sucio / Baja</option>
                </select>
              </div>
            </div>
          </div>

          {/* Punto de reciclaje */}
          <div className="card">
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.75rem' }}>Punto de reciclaje</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.75rem' }}>
              📍 Eco-Centro Central #402, Lima PE
            </div>
            {/* Map placeholder */}
            <div style={{
              height: 140, borderRadius: 'var(--radius)',
              background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ fontSize: '3rem' }}>📍</div>
              <span style={{
                position: 'absolute', bottom: 8, right: 8,
                background: 'white', borderRadius: 999,
                padding: '0.2rem 0.6rem', fontSize: '0.7rem',
                fontWeight: 700, color: 'var(--green-700)'
              }}>GPS VERIFICADO</span>
            </div>
          </div>

          {/* CTA */}
          <div>
            <button
              className="btn btn-primary"
              style={{ fontSize: '1rem', padding: '1rem', borderRadius: 'var(--radius)' }}
              onClick={() => navigate('/reciclaje/historial')}
            >
              Validar y Ganar Puntos →
            </button>
            <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.8125rem', color: 'var(--gray-400)' }}>
              ⚡ RECOMPENSA: +{Math.round(peso * articulos * 10)} PUNTOS
            </div>
          </div>

          {/* Hidden real form for actual submission */}
          <details style={{ marginTop: '0.5rem' }}>
            <summary style={{ fontSize: '0.8125rem', color: 'var(--gray-400)', cursor: 'pointer' }}>
              Formulario avanzado
            </summary>
            <div style={{ marginTop: '0.75rem' }}>
              <ReciclajeForm onSuccess={() => navigate('/reciclaje/historial')} />
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}