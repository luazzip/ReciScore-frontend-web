import { useMemo } from 'react';

interface RankingFilterProps {
  value: string;
  onChange: (distrito: string) => void;
  distritos: string[];
}

export default function RankingFilterByDistrito({ value, onChange, distritos }: RankingFilterProps) {
  const options = useMemo(
    () => distritos.map((d) => <option key={d} value={d}>{d}</option>),
    [distritos]
  );

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2 rounded-full border border-outline-variant bg-surface-container-low text-on-surface text-sm cursor-pointer outline-none focus:ring-2 focus:ring-primary"
    >
      <option value="">Filtrar por distrito</option>
      {options}
    </select>
  );
}