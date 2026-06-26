import { useMemo } from 'react';

interface RankingFilterProps {
  value: string;
  onChange: (distrito: string) => void;
}

const DISTRITOS = ['Todos', 'Miraflores', 'San Isidro', 'Surco', 'San Borja', 'La Molina', 'Barranco', 'Jesus Maria', 'Pueblo Libre', 'San Miguel'];

export default function RankingFilterByDistrito({ value, onChange }: RankingFilterProps) {
  const options = useMemo(
    () => DISTRITOS.map((d) => (
      <option key={d} value={d}>{d}</option>
    )),
    []
  );

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {options}
    </select>
  );
}
