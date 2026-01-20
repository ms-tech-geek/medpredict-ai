import { AlertTriangle, Calendar, Package, ChevronRight } from 'lucide-react';
import type { ExpiryRisk, StockoutRisk } from '../types';
import { ExportButton } from './ExportButton';

interface AlertsTableProps {
  expiryRisks: ExpiryRisk[];
  stockoutRisks: StockoutRisk[];
  activeTab: 'expiry' | 'stockout';
  onTabChange: (tab: 'expiry' | 'stockout') => void;
}

const riskBadgeClass = {
  CRITICAL: 'risk-badge-critical',
  HIGH: 'risk-badge-high',
  MEDIUM: 'risk-badge-medium',
  LOW: 'risk-badge-low',
};

export function AlertsTable({ expiryRisks, stockoutRisks, activeTab, onTabChange }: AlertsTableProps) {
  // Prepare data for export
  const exportData = activeTab === 'expiry' 
    ? expiryRisks.map(r => ({
        medicine: r.medicine_name,
        batch: r.batch_no,
        quantity: r.current_quantity,
        days_to_expiry: r.days_to_expiry,
        quantity_at_risk: r.quantity_at_risk,
        risk_level: r.risk_level,
        potential_loss: r.potential_loss,
        recommendation: r.recommendation
      }))
    : stockoutRisks.map(r => ({
        medicine: r.medicine_name,
        current_stock: r.current_stock,
        daily_consumption: r.avg_daily_consumption,
        days_until_stockout: r.days_until_stockout,
        risk_level: r.risk_level,
        recommended_order: r.recommended_order,
        recommendation: r.recommendation
      }));

  return (
    <div className="card animate-fade-in" style={{ animationDelay: '300ms' }}>
      {/* Header with Tabs and Export */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
        <button
          onClick={() => onTabChange('expiry')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'expiry'
              ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span className="font-medium">Expiry Alerts</span>
          <span className="ml-1 px-2 py-0.5 bg-slate-700 rounded-full text-xs">
            {expiryRisks.filter(r => ['CRITICAL', 'HIGH'].includes(r.risk_level)).length}
          </span>
        </button>
        <button
          onClick={() => onTabChange('stockout')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'stockout'
              ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <Package className="w-4 h-4" />
          <span className="font-medium">Stockout Alerts</span>
          <span className="ml-1 px-2 py-0.5 bg-slate-700 rounded-full text-xs">
            {stockoutRisks.filter(r => ['CRITICAL', 'HIGH'].includes(r.risk_level)).length}
          </span>
        </button>
        </div>
        
        <ExportButton 
          data={exportData}
          filename={activeTab === 'expiry' ? 'expiry_alerts' : 'stockout_alerts'}
          title="Export"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {activeTab === 'expiry' ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Medicine</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Batch</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Days Left</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">At Risk</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Risk</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Potential Loss</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {expiryRisks.slice(0, 10).map((risk, index) => (
                <tr 
                  key={`${risk.batch_no}-${index}`} 
                  className="table-row"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                        <AlertTriangle className={`w-4 h-4 ${
                          risk.risk_level === 'CRITICAL' ? 'text-red-400' :
                          risk.risk_level === 'HIGH' ? 'text-amber-400' :
                          risk.risk_level === 'MEDIUM' ? 'text-blue-400' : 'text-emerald-400'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-200 text-sm">{risk.medicine_name}</p>
                        <p className="text-xs text-slate-500">Qty: {risk.current_quantity}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-slate-400 font-mono">{risk.batch_no}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`text-lg font-bold ${
                      risk.days_to_expiry <= 30 ? 'text-red-400' :
                      risk.days_to_expiry <= 60 ? 'text-amber-400' : 'text-slate-300'
                    }`}>
                      {risk.days_to_expiry}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm text-slate-300">{risk.quantity_at_risk} units</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`risk-badge ${riskBadgeClass[risk.risk_level]}`}>
                      {risk.risk_level}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm font-semibold text-slate-200">
                      ₹{risk.potential_loss.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors">
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Medicine</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Stock</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Daily Usage</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Days Left</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Risk</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order Qty</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {stockoutRisks.slice(0, 10).map((risk, index) => (
                <tr 
                  key={`${risk.medicine_id}-${index}`} 
                  className="table-row"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                        <Package className={`w-4 h-4 ${
                          risk.risk_level === 'CRITICAL' ? 'text-red-400' :
                          risk.risk_level === 'HIGH' ? 'text-amber-400' :
                          risk.risk_level === 'MEDIUM' ? 'text-blue-400' : 'text-emerald-400'
                        }`} />
                      </div>
                      <p className="font-medium text-slate-200 text-sm">{risk.medicine_name}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm text-slate-300">{risk.current_stock}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm text-slate-400">{risk.avg_daily_consumption}/day</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`text-lg font-bold ${
                      risk.days_until_stockout <= 7 ? 'text-red-400' :
                      risk.days_until_stockout <= 14 ? 'text-amber-400' : 'text-slate-300'
                    }`}>
                      {risk.days_until_stockout.toFixed(0)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`risk-badge ${riskBadgeClass[risk.risk_level]}`}>
                      {risk.risk_level}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm font-semibold text-primary-400">
                      +{risk.recommended_order}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors">
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Empty State */}
      {((activeTab === 'expiry' && expiryRisks.length === 0) || 
        (activeTab === 'stockout' && stockoutRisks.length === 0)) && (
        <div className="py-12 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-slate-400">No alerts matching your filters</p>
        </div>
      )}
    </div>
  );
}

