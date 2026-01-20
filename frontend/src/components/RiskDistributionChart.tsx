import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { ExpiryRisk } from '../types';

interface RiskDistributionChartProps {
  risks: ExpiryRisk[];
}

const COLORS = {
  CRITICAL: '#dc2626',
  HIGH: '#f59e0b',
  MEDIUM: '#3b82f6',
  LOW: '#10b981',
};

export function RiskDistributionChart({ risks }: RiskDistributionChartProps) {
  const data = [
    { name: 'Critical', value: risks.filter(r => r.risk_level === 'CRITICAL').length, color: COLORS.CRITICAL },
    { name: 'High', value: risks.filter(r => r.risk_level === 'HIGH').length, color: COLORS.HIGH },
    { name: 'Medium', value: risks.filter(r => r.risk_level === 'MEDIUM').length, color: COLORS.MEDIUM },
    { name: 'Low', value: risks.filter(r => r.risk_level === 'LOW').length, color: COLORS.LOW },
  ].filter(d => d.value > 0);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  // Don't render chart if no data
  if (total === 0) {
    return (
      <div className="card animate-fade-in" style={{ animationDelay: '100ms' }} data-tour="expiry-chart">
        <h3 className="text-sm font-semibold text-slate-400 mb-4">Risk Distribution</h3>
        <div className="flex items-center justify-center h-40 text-slate-500 text-sm">
          No risk data available
        </div>
      </div>
    );
  }

  return (
    <div className="card animate-fade-in" style={{ animationDelay: '100ms' }} data-tour="expiry-chart">
      <h3 className="text-sm font-semibold text-slate-400 mb-4">Risk Distribution</h3>
      
      <div className="flex items-center gap-6">
        <div style={{ width: '160px', height: '160px', flexShrink: 0 }}>
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    style={{
                      filter: `drop-shadow(0 0 6px ${entry.color}50)`,
                    }}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
                        <p className="text-sm font-medium text-white">{data.name}</p>
                        <p className="text-xs text-slate-400">
                          {data.value} batches ({((data.value / total) * 100).toFixed(1)}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex-1 space-y-3">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-slate-300">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-white">{item.value}</span>
                <span className="text-xs text-slate-500 w-12 text-right">
                  {((item.value / total) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

