import { useQuery } from '@tanstack/react-query';
import { X, Package, TrendingUp, AlertTriangle, Calendar, IndianRupee, ShoppingCart, Activity } from 'lucide-react';
import { fetchMedicineDetail } from '../services/api';
import { ConsumptionChart } from './ConsumptionChart';

interface MedicineDetailModalProps {
  medicineId: number;
  onClose: () => void;
}

const riskColors = {
  CRITICAL: 'bg-red-500/20 text-red-400 border-red-500/30',
  HIGH: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  MEDIUM: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  LOW: 'bg-green-500/20 text-green-400 border-green-500/30',
};

export function MedicineDetailModal({ medicineId, onClose }: MedicineDetailModalProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['medicine-detail', medicineId],
    queryFn: () => fetchMedicineDetail(medicineId),
  });

  const formatCurrency = (value: number) => {
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value.toFixed(0)}`;
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-slate-900 rounded-xl p-8">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-slate-900 rounded-xl p-8 text-red-400">
          <p>Error loading medicine details</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-slate-800 rounded-lg">Close</button>
        </div>
      </div>
    );
  }

  const { medicine, total_stock, total_value, batches, consumption_stats, consumption_history, expiry_risks, stockout_risk } = data;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-slate-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800/50">
          <div>
            <h2 className="text-2xl font-display font-bold text-white">{medicine.name}</h2>
            <p className="text-slate-400">{medicine.category} • {medicine.unit}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="card p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Package className="w-4 h-4" />
                <span className="text-sm">Total Stock</span>
              </div>
              <p className="text-2xl font-bold text-white">{total_stock.toLocaleString()}</p>
              <p className="text-xs text-slate-500">{batches.length} batches</p>
            </div>

            <div className="card p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <IndianRupee className="w-4 h-4" />
                <span className="text-sm">Stock Value</span>
              </div>
              <p className="text-2xl font-bold text-white">{formatCurrency(total_value)}</p>
              <p className="text-xs text-slate-500">@ ₹{medicine.unit_cost_inr}/{medicine.unit}</p>
            </div>

            <div className="card p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Daily Usage</span>
              </div>
              <p className="text-2xl font-bold text-white">{consumption_stats?.avg_daily?.toFixed(1) || '-'}</p>
              <p className="text-xs text-slate-500">{consumption_stats?.avg_weekly?.toFixed(0) || '-'}/week</p>
            </div>

            <div className="card p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Activity className="w-4 h-4" />
                <span className="text-sm">Days Until Stockout</span>
              </div>
              <p className={`text-2xl font-bold ${
                (stockout_risk.days_until_stockout || 999) <= 7 ? 'text-red-400' :
                (stockout_risk.days_until_stockout || 999) <= 14 ? 'text-orange-400' :
                'text-white'
              }`}>
                {stockout_risk.days_until_stockout?.toFixed(0) || '∞'}
              </p>
              <p className="text-xs text-slate-500">
                <span className={`px-1.5 py-0.5 rounded text-xs ${
                  riskColors[stockout_risk.risk_level as keyof typeof riskColors] || riskColors.LOW
                }`}>
                  {stockout_risk.risk_level}
                </span>
              </p>
            </div>
          </div>

          {/* Consumption Chart */}
          <div className="card p-4 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Consumption History (Last 90 Days)</h3>
            <ConsumptionChart data={consumption_history} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Batches */}
            <div className="card p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary-400" />
                Inventory Batches
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {batches.map((batch) => {
                  const expiryRisk = expiry_risks.find(r => r.batch_no === batch.batch_no);
                  return (
                    <div key={batch.batch_no} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-sm font-medium text-white">{batch.batch_no}</span>
                          {expiryRisk && (
                            <span className={`ml-2 px-1.5 py-0.5 text-xs rounded ${
                              riskColors[expiryRisk.risk_level as keyof typeof riskColors] || riskColors.LOW
                            }`}>
                              {expiryRisk.risk_level}
                            </span>
                          )}
                        </div>
                        <span className="text-white font-medium">{batch.quantity.toLocaleString()} {batch.unit}s</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Expires: {new Date(batch.expiry_date).toLocaleDateString()}
                        </span>
                        <span>{formatCurrency(batch.total_value_inr)}</span>
                      </div>
                      {expiryRisk && expiryRisk.quantity_at_risk > 0 && (
                        <div className="mt-2 text-xs text-orange-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {expiryRisk.quantity_at_risk} units at risk (₹{expiryRisk.potential_loss.toFixed(0)})
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommendations */}
            <div className="card p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-400" />
                Recommendations
              </h3>
              <div className="space-y-4">
                {stockout_risk.recommended_order > 0 && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                    <p className="text-emerald-400 font-medium mb-1">Order Recommendation</p>
                    <p className="text-white text-2xl font-bold">{stockout_risk.recommended_order.toLocaleString()} {medicine.unit}s</p>
                    <p className="text-sm text-slate-400 mt-1">
                      4-week supply based on current consumption
                    </p>
                    <p className="text-sm text-slate-400">
                      Est. cost: {formatCurrency(stockout_risk.recommended_order * medicine.unit_cost_inr)}
                    </p>
                  </div>
                )}

                {expiry_risks.filter(r => r.risk_level === 'CRITICAL' || r.risk_level === 'HIGH').length > 0 && (
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                    <p className="text-orange-400 font-medium mb-2">Expiry Risk Actions</p>
                    <ul className="text-sm text-slate-300 space-y-1">
                      <li>• Use FIFO - dispense oldest batches first</li>
                      <li>• Consider 10-20% discount to accelerate usage</li>
                      <li>• Check nearby facilities for transfer options</li>
                    </ul>
                  </div>
                )}

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-300 font-medium mb-2">Quick Stats</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-slate-400">Reorder Level:</div>
                    <div className="text-white">{medicine.reorder_level.toLocaleString()}</div>
                    <div className="text-slate-400">Shelf Life:</div>
                    <div className="text-white">{medicine.shelf_life_days} days</div>
                    <div className="text-slate-400">90-Day Consumption:</div>
                    <div className="text-white">{consumption_stats?.total_90d?.toLocaleString() || '-'}</div>
                    <div className="text-slate-400">Seasonal Factor:</div>
                    <div className="text-white">{consumption_stats?.seasonal_factor?.toFixed(2) || '1.00'}x</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

