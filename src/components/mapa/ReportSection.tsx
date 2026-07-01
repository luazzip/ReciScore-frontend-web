import type { PuntoMapa } from '../../types/puntoMapa.types';

interface ReportSectionProps {
  esPuntoReporte: boolean;
  puntoSeleccionado: PuntoMapa | null;
  reportDesc: string;
  isReporting?: boolean;
  onReportDescChange: (value: string) => void;
  onReportar: () => Promise<void>;
}

export default function ReportSection({ esPuntoReporte, puntoSeleccionado, reportDesc, isReporting, onReportDescChange, onReportar }: ReportSectionProps) {
  return (
    <div className="bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant/5 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-headline font-bold">Reportar punto sucio</h3>
        <span className="material-symbols-outlined text-error text-xl">warning</span>
      </div>
      <p className="text-sm text-on-surface-variant mb-4">
        Haz clic en el mapa para marcar la ubicación o selecciona un punto existente.
      </p>
      {esPuntoReporte && puntoSeleccionado ? (
        <div className="flex items-center gap-2 mb-4 p-3 bg-error/5 rounded-lg border border-error/20">
          <span className="material-symbols-outlined text-error text-base">location_on</span>
          <span className="text-sm font-bold text-on-surface">
            {puntoSeleccionado.latitude.toFixed(4)}, {puntoSeleccionado.longitude.toFixed(4)}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 mb-4 p-3 bg-surface-container rounded-lg">
          <span className="material-symbols-outlined text-on-surface-variant text-base">touch_app</span>
          <span className="text-sm text-on-surface-variant">Toca el mapa para elegir una ubicación</span>
        </div>
      )}
      <textarea
        value={reportDesc}
        onChange={e => onReportDescChange(e.target.value)}
        placeholder="Describe el problema (ej: acumulación de residuos en la vereda)..."
        className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/20 focus:border-error focus:ring-0 rounded-t-lg p-3 text-sm font-bold transition-colors resize-none"
        rows={3}
      />
      <button
        onClick={onReportar}
        disabled={isReporting}
        className="mt-4 w-full bg-error text-on-error font-bold py-3 rounded-lg text-xs uppercase tracking-wider hover:brightness-110 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isReporting ? 'Enviando...' : 'Enviar reporte'}
      </button>
    </div>
  );
}
