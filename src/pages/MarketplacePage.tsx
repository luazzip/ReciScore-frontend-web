import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

type Categoria = 'TODO' | 'HOGAR' | 'CUIDADO' | 'MODA';

const CATEGORIAS: { key: Categoria; label: string }[] = [
  { key: 'TODO',    label: 'Todo' },
  { key: 'HOGAR',  label: 'Hogar' },
  { key: 'CUIDADO', label: 'Cuidado Personal' },
  { key: 'MODA',   label: 'Moda Sostenible' },
];

const PRODUCTOS = [
  { id: 1, nombre: 'Libretas Compostables', pts: 350,  cat: 'HOGAR',   emoji: '📒', vendedor: '@usuario_verde',  fav: true  },
  { id: 2, nombre: 'Jabón Orgánico',        pts: 180,  cat: 'CUIDADO', emoji: '🧼', vendedor: '@natura_eco',     fav: false },
  { id: 3, nombre: 'Botella de Acero',      pts: 600,  cat: 'HOGAR',   emoji: '🍶', vendedor: '@hydro_zero',     fav: false },
  { id: 4, nombre: 'Bolsa de Algodón',      pts: 120,  cat: 'MODA',    emoji: '👜', vendedor: '@bolsas_re',      fav: false },
  { id: 5, nombre: 'Vela de Soja',          pts: 220,  cat: 'HOGAR',   emoji: '🕯', vendedor: '@eco_luz',        fav: false },
  { id: 6, nombre: 'Cepillo Bambú',         pts: 90,   cat: 'CUIDADO', emoji: '🪥', vendedor: '@bamboo_care',    fav: true  },
  { id: 7, nombre: 'Mochila Reciclada',     pts: 850,  cat: 'MODA',    emoji: '🎒', vendedor: '@repurpose_pe',   fav: false },
  { id: 8, nombre: 'Kit Compostaje',        pts: 400,  cat: 'HOGAR',   emoji: '🌱', vendedor: '@tierra_viva',    fav: false },
];

export default function MarketplacePage() {
  const { usuario } = useAuth();
  const [cat, setCat] = useState<Categoria>('TODO');
  const [busqueda, setBusqueda] = useState('');
  const [favs, setFavs] = useState<Set<number>>(
    new Set(PRODUCTOS.filter(p => p.fav).map(p => p.id))
  );
  const [showPublish, setShowPublish] = useState(false);

  const filtrados = PRODUCTOS.filter(p => {
    const matchCat = cat === 'TODO' || p.cat === cat;
    const matchQ   = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return matchCat && matchQ;
  });

  function toggleFav(id: number) {
    setFavs(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const userPts = usuario?.points ?? 4250;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h1 style={{ marginBottom: 0 }}>Marketplace Global</h1>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.375rem',
          background: 'var(--green-50)', border: '1px solid var(--green-200)',
          borderRadius: 999, padding: '0.375rem 1rem',
          fontWeight: 700, color: 'var(--green-700)', fontSize: '0.9375rem'
        }}>
          ♻️ {userPts.toLocaleString()} pts
        </div>
      </div>

      {/* Search */}
      <div style={{
        background: 'white', borderRadius: 999, border: '1px solid var(--gray-200)',
        display: 'flex', alignItems: 'center', padding: '0.625rem 1.25rem',
        gap: '0.5rem', marginBottom: '1rem', boxShadow: 'var(--shadow-sm)'
      }}>
        <span style={{ color: 'var(--gray-400)' }}>🔍</span>
        <input
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          placeholder="¿Qué estás buscando hoy?"
          style={{
            border: 'none', outline: 'none', flex: 1,
            fontSize: '0.9375rem', background: 'transparent', color: 'var(--gray-800)'
          }}
        />
      </div>

      {/* Categorías */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {CATEGORIAS.map(c => (
          <button
            key={c.key}
            onClick={() => setCat(c.key)}
            style={{
              padding: '0.375rem 1.25rem', borderRadius: 999,
              border: 'none', cursor: 'pointer', fontSize: '0.875rem',
              fontWeight: cat === c.key ? 700 : 400,
              background: cat === c.key ? 'var(--green-700)' : 'var(--gray-100)',
              color: cat === c.key ? 'white' : 'var(--gray-600)',
              transition: 'all 0.2s'
            }}
          >{c.label}</button>
        ))}
      </div>

      {/* Grid productos */}
      {filtrados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🔍</div>
          <div style={{ fontWeight: 600 }}>Sin resultados</div>
          <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Prueba con otro término o categoría</div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1rem', marginBottom: '2rem'
        }}>
          {filtrados.map(p => {
            const puedeComprar = userPts >= p.pts;
            const esFav = favs.has(p.id);
            return (
              <div key={p.id} className="card" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
                {/* Imagen placeholder */}
                <div style={{
                  height: 160,
                  background: `linear-gradient(135deg, hsl(${p.id * 47 % 360},60%,88%), hsl(${p.id * 47 % 360},40%,78%))`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '3.5rem', position: 'relative'
                }}>
                  {p.emoji}
                  {/* Fav button */}
                  <button
                    onClick={() => toggleFav(p.id)}
                    style={{
                      position: 'absolute', top: 8, right: 8,
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'white', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: 'var(--shadow)', fontSize: '0.9rem',
                      transition: 'transform 0.2s'
                    }}
                  >{esFav ? '❤️' : '🤍'}</button>
                </div>

                <div style={{ padding: '0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--gray-800)' }}>{p.nombre}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--green-600)', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0, marginLeft: '0.5rem' }}>
                      ♻️ {p.pts}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--green-600)', fontWeight: 500, marginBottom: '0.75rem' }}>
                    Vendido por {p.vendedor}
                  </div>
                  <button
                    style={{
                      width: '100%', padding: '0.5rem', borderRadius: 999,
                      border: puedeComprar ? 'none' : '1px solid var(--gray-200)',
                      background: puedeComprar ? 'var(--green-600)' : 'var(--gray-100)',
                      color: puedeComprar ? 'white' : 'var(--gray-400)',
                      fontWeight: 600, fontSize: '0.8125rem', cursor: puedeComprar ? 'pointer' : 'not-allowed',
                      textTransform: 'uppercase', letterSpacing: '0.04em'
                    }}
                  >
                    {puedeComprar ? 'Ver más' : `Faltan ${p.pts - userPts} pts`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Publicar artículo CTA */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, var(--green-800), var(--green-700))',
        color: 'white', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap'
      }}>
        <div>
          <h2 style={{ color: 'white', marginBottom: '0.25rem' }}>¿Tienes algo que ofrecer?</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', margin: 0, fontSize: '0.9375rem' }}>
            Únete a nuestra comunidad de vendedores eco-conscientes y convierte tus artículos sostenibles en puntos ReciScore.
          </p>
        </div>
        <button
          onClick={() => setShowPublish(true)}
          style={{
            background: 'white', color: 'var(--green-700)',
            border: 'none', borderRadius: 999,
            padding: '0.75rem 1.5rem', fontWeight: 700,
            fontSize: '0.9375rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            flexShrink: 0, whiteSpace: 'nowrap'
          }}
        >
          + Publicar Artículo
        </button>
      </div>

      {/* Modal publicar */}
      {showPublish && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }} onClick={() => setShowPublish(false)}>
          <div className="card" style={{ maxWidth: 480, width: '100%' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ marginBottom: 0 }}>Publicar Artículo</h2>
              <button onClick={() => setShowPublish(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: 'var(--gray-400)' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div className="form-field" style={{ marginBottom: 0 }}>
                <label className="form-label-upper">Nombre del artículo</label>
                <input type="text" placeholder="Ej. Bolsa reutilizable de tela" />
              </div>
              <div className="form-field" style={{ marginBottom: 0 }}>
                <label className="form-label-upper">Categoría</label>
                <select>
                  <option>Hogar</option>
                  <option>Cuidado Personal</option>
                  <option>Moda Sostenible</option>
                </select>
              </div>
              <div className="form-field" style={{ marginBottom: 0 }}>
                <label className="form-label-upper">Precio en puntos</label>
                <input type="number" placeholder="Ej. 200" min={1} />
              </div>
              <div className="form-field" style={{ marginBottom: 0 }}>
                <label className="form-label-upper">Descripción</label>
                <textarea placeholder="Describe tu artículo..." style={{ borderRadius: 'var(--radius)' }} />
              </div>
              <button className="btn btn-primary" onClick={() => setShowPublish(false)}>
                Publicar ahora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}