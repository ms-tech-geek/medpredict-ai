import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { StockoutRisk } from '../types';

interface StockoutChartProps {
  risks: StockoutRisk[];
}

const COLORS = {
  CRITICAL: '#dc2626',
  HIGH: '#f59e0b',
  MEDIUM: '#3b82f6',
  LOW: '#10b981',
};

export function StockoutChart({ risks }: StockoutChartProps) {
  const data = risks.slice(0, 8).map(r => ({
    name: r.medicine_name.length > 15 ? r.medicine_name.substring(0, 15) + '...' : r.medicine_name,
    fullName: r.medicine_name,
    days: r.days_until_stockout,
    risk_level: r.risk_level,
  })).reverse();

  return (
    <div className="card animate-fade-in" style={{ animationDelay: '200ms' }} data-tour="stockout-chart">
      <h3 className="text-sm font-semibold text-slate-400 mb-4">Days Until Stockout</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            layout="vertical"
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <XAxis 
              type="number" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              width={100}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
                      <p className="text-sm font-medium text-white">{data.fullName}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        <span className="font-semibold text-white">{data.days.toFixed(1)}</span> days remaining
                      </p>
                      <p className={`text-xs mt-1 font-medium`} style={{ color: COLORS[data.risk_level as keyof typeof COLORS] }}>
                        {data.risk_level} Risk
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="days" 
              radius={[0, 4, 4, 0]}
              barSize={20}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[entry.risk_level as keyof typeof COLORS]}
                  style={{
                    filter: `drop-shadow(0 0 4px ${COLORS[entry.risk_level as keyof typeof COLORS]}40)`,
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

