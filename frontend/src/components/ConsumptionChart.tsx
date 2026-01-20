import { useMemo } from 'react';
import type { ConsumptionRecord } from '../types';

interface ConsumptionChartProps {
  data: ConsumptionRecord[];
}

export function ConsumptionChart({ data }: ConsumptionChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Sort by date and get last 30 days
    const sorted = [...data].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ).slice(-30);

    const max = Math.max(...sorted.map(d => d.quantity_dispensed), 1);
    
    return sorted.map(d => ({
      date: d.date,
      value: d.quantity_dispensed,
      height: (d.quantity_dispensed / max) * 100,
      label: new Date(d.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
    }));
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-slate-400">
        No consumption data available
      </div>
    );
  }

  const avg = chartData.reduce((sum, d) => sum + d.value, 0) / chartData.length;

  return (
    <div className="relative">
      {/* Average line */}
      <div 
        className="absolute left-0 right-0 border-t border-dashed border-primary-500/50 z-10"
        style={{ bottom: `${(avg / Math.max(...chartData.map(d => d.value), 1)) * 100}%` }}
      >
        <span className="absolute -top-3 right-0 text-xs text-primary-400 bg-slate-900 px-1">
          avg: {avg.toFixed(0)}
        </span>
      </div>

      {/* Bars */}
      <div className="flex items-end gap-1 h-48">
        {chartData.map((d, i) => (
          <div key={d.date} className="flex-1 flex flex-col items-center group relative">
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white whitespace-nowrap z-20 pointer-events-none">
              <div className="font-medium">{d.label}</div>
              <div className="text-slate-400">{d.value} units</div>
            </div>
            
            {/* Bar */}
            <div 
              className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t transition-all group-hover:from-primary-500 group-hover:to-primary-300"
              style={{ 
                height: `${d.height}%`,
                minHeight: d.value > 0 ? '4px' : '0'
              }}
            />
          </div>
        ))}
      </div>

      {/* X-axis labels */}
      <div className="flex gap-1 mt-2">
        {chartData.filter((_, i) => i % 5 === 0).map((d) => (
          <div 
            key={d.date} 
            className="text-xs text-slate-500"
            style={{ width: `${100 / (chartData.length / 5)}%` }}
          >
            {d.label}
          </div>
        ))}
      </div>
    </div>
  );
}

