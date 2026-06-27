import { useMemo } from 'react';

interface RankingFilterProps {
  value: string;
  onChange: (distrito: string) => void;
}

const DISTRITOS = ['Todos', 'Miraflores', 'San Isidro', 'Surco', 'San Borja', 'La Molina', 'Barranco', 'Jesús María', 'Pueblo Libre', 'San Miguel'];

export default function RankingFilterByDistrito({ value, onChange }: RankingFilterProps) {
  const options = useMemo(
    () => DISTRITOS.map((d) => <option key={d} value={d}>{d}</option>),
    []
  );

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: '0.5rem 1rem', borderRadius: 999,
        border: '1px solid var(--gray-200)', background: 'var(--gray-50)',
        fontSize: '0.875rem', color: 'var(--gray-700)', cursor: 'pointer',
        outline: 'none'
      }}
    >
      {options}
    </select>
  );
}