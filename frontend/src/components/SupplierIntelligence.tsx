import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Truck,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Star,
  Package,
  Calendar,
  Zap,
  Target,
  BarChart3,
  CheckCircle,
  XCircle,
  ArrowRight,
  Building2,
  Phone,
  Mail,
  Timer,
  ShieldCheck,
  Activity
} from 'lucide-react';

// Mock supplier intelligence data - in production, this would come from API
const supplierData = [
  {
    id: 1,
    name: 'MedLife Distributors',
    contact: '9876543210',
    email: 'orders@medlife.com',
    avg_lead_time: 5,
    predicted_lead_time: 6,
    delay_probability: 0.15,
    rating: 4.5,
    on_time_rate: 0.85,
    total_orders: 156,
    pending_orders: 3,
    specialties: ['Antibiotics', 'Analgesics'],
    trend: 'stable',
    reliability_score: 87,
    last_delay_days: 2,
    price_competitiveness: 0.92,
  },
  {
    id: 2,
    name: 'PharmaCare India',
    contact: '9876543211',
    email: 'supply@pharmacare.in',
    avg_lead_time: 7,
    predicted_lead_time: 9,
    delay_probability: 0.35,
    rating: 4.2,
    on_time_rate: 0.72,
    total_orders: 89,
    pending_orders: 5,
    specialties: ['Diabetes', 'Cardiac'],
    trend: 'declining',
    reliability_score: 72,
    last_delay_days: 5,
    price_competitiveness: 0.88,
  },
  {
    id: 3,
    name: 'HealthFirst Supplies',
    contact: '9876543212',
    email: 'orders@healthfirst.com',
    avg_lead_time: 4,
    predicted_lead_time: 4,
    delay_probability: 0.08,
    rating: 4.7,
    on_time_rate: 0.94,
    total_orders: 203,
    pending_orders: 2,
    specialties: ['Vitamins', 'OTC'],
    trend: 'improving',
    reliability_score: 94,
    last_delay_days: 0,
    price_competitiveness: 0.85,
  },
  {
    id: 4,
    name: 'Government Medical Store',
    contact: '9876543213',
    email: 'gms@gov.in',
    avg_lead_time: 14,
    predicted_lead_time: 18,
    delay_probability: 0.55,
    rating: 3.8,
    on_time_rate: 0.58,
    total_orders: 67,
    pending_orders: 8,
    specialties: ['Essential Medicines'],
    trend: 'declining',
    reliability_score: 58,
    last_delay_days: 12,
    price_competitiveness: 0.98,
  },
  {
    id: 5,
    name: 'Apollo Pharmacy Wholesale',
    contact: '9876543214',
    email: 'wholesale@apollo.com',
    avg_lead_time: 3,
    predicted_lead_time: 3,
    delay_probability: 0.05,
    rating: 4.8,
    on_time_rate: 0.96,
    total_orders: 312,
    pending_orders: 4,
    specialties: ['All Categories'],
    trend: 'improving',
    reliability_score: 96,
    last_delay_days: 0,
    price_competitiveness: 0.78,
  },
];

// AI-generated insights
const aiInsights = [
  {
    type: 'warning',
    title: 'Predicted Delay: PharmaCare India',
    message: 'AI predicts 35% chance of 2-day delay on pending cardiac medicines order. Consider backup supplier.',
    action: 'View alternatives',
    supplier: 'PharmaCare India',
  },
  {
    type: 'success',
    title: 'Optimal Order Window',
    message: 'Best time to order from Apollo Pharmacy is Monday-Wednesday for fastest delivery.',
    action: 'Schedule order',
    supplier: 'Apollo Pharmacy Wholesale',
  },
  {
    type: 'info',
    title: 'Price Drop Alert',
    message: 'MedLife Distributors offering 8% discount on bulk Paracetamol orders this week.',
    action: 'View offer',
    supplier: 'MedLife Distributors',
  },
  {
    type: 'warning',
    title: 'Government Store Backlog',
    message: 'GMS showing 55% delay probability. 8 orders pending with avg 12-day delay.',
    action: 'Escalate',
    supplier: 'Government Medical Store',
  },
];

// Pending orders with predictions
const pendingOrders = [
  {
    id: 'PO-2026-001',
    supplier: 'MedLife Distributors',
    items: 12,
    value: 45000,
    ordered_date: '2026-01-15',
    expected_date: '2026-01-20',
    predicted_date: '2026-01-21',
    delay_risk: 'LOW',
    status: 'In Transit',
  },
  {
    id: 'PO-2026-002',
    supplier: 'PharmaCare India',
    items: 8,
    value: 78000,
    ordered_date: '2026-01-12',
    expected_date: '2026-01-19',
    predicted_date: '2026-01-23',
    delay_risk: 'HIGH',
    status: 'Processing',
  },
  {
    id: 'PO-2026-003',
    supplier: 'Government Medical Store',
    items: 25,
    value: 120000,
    ordered_date: '2026-01-05',
    expected_date: '2026-01-19',
    predicted_date: '2026-01-28',
    delay_risk: 'CRITICAL',
    status: 'Delayed',
  },
  {
    id: 'PO-2026-004',
    supplier: 'Apollo Pharmacy Wholesale',
    items: 15,
    value: 32000,
    ordered_date: '2026-01-18',
    expected_date: '2026-01-21',
    predicted_date: '2026-01-21',
    delay_risk: 'LOW',
    status: 'Shipped',
  },
];

export function SupplierIntelligence() {
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<'overview' | 'orders' | 'analytics'>('overview');

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'CRITICAL': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'HIGH': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'LOW': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            Supplier Intelligence
          </h2>
          <p className="text-slate-400 mt-1">AI-powered supplier analysis & delivery predictions</p>
        </div>
        <div className="flex gap-2">
          {['overview', 'orders', 'analytics'].map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view as typeof activeView)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeView === view
                  ? 'bg-violet-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* AI Insights Banner */}
      <div className="card p-4 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-violet-500/10 border-violet-500/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-violet-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">AI Supply Chain Insights</h3>
            <p className="text-sm text-violet-300">Real-time predictions from ML analysis</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {aiInsights.map((insight, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border ${
                insight.type === 'warning' ? 'bg-amber-500/10 border-amber-500/30' :
                insight.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30' :
                'bg-blue-500/10 border-blue-500/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  insight.type === 'warning' ? 'bg-amber-500/20' :
                  insight.type === 'success' ? 'bg-emerald-500/20' :
                  'bg-blue-500/20'
                }`}>
                  {insight.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-amber-400" /> :
                   insight.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> :
                   <Target className="w-4 h-4 text-blue-400" />}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-white">{insight.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{insight.message}</p>
                  <button className="text-xs text-violet-400 hover:text-violet-300 mt-2 flex items-center gap-1">
                    {insight.action} <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeView === 'overview' && (
        <>
          {/* Supplier Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {supplierData.map((supplier) => (
              <div
                key={supplier.id}
                className={`card p-4 cursor-pointer transition-all hover:border-violet-500/50 ${
                  selectedSupplier === supplier.id ? 'border-violet-500 ring-1 ring-violet-500/30' : ''
                }`}
                onClick={() => setSelectedSupplier(selectedSupplier === supplier.id ? null : supplier.id)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-slate-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{supplier.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs text-slate-400">{supplier.rating}</span>
                        </div>
                        {getTrendIcon(supplier.trend)}
                      </div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    supplier.reliability_score >= 90 ? 'bg-emerald-500/20 text-emerald-400' :
                    supplier.reliability_score >= 70 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {supplier.reliability_score}% reliable
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-800/50 rounded-lg p-2">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                      <Clock className="w-3 h-3" />
                      Avg Lead Time
                    </div>
                    <p className="text-lg font-semibold text-white">{supplier.avg_lead_time} days</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-2">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                      <Timer className="w-3 h-3" />
                      AI Predicted
                    </div>
                    <p className={`text-lg font-semibold ${
                      supplier.predicted_lead_time > supplier.avg_lead_time ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {supplier.predicted_lead_time} days
                    </p>
                  </div>
                </div>

                {/* Delay Probability */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Delay Probability</span>
                    <span className={supplier.delay_probability > 0.3 ? 'text-red-400' : 'text-emerald-400'}>
                      {(supplier.delay_probability * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        supplier.delay_probability > 0.3 ? 'bg-red-500' :
                        supplier.delay_probability > 0.15 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${supplier.delay_probability * 100}%` }}
                    />
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800">
                  <span>{supplier.on_time_rate * 100}% on-time</span>
                  <span>{supplier.pending_orders} pending orders</span>
                  <span>{supplier.total_orders} total</span>
                </div>

                {/* Expanded Details */}
                {selectedSupplier === supplier.id && (
                  <div className="mt-4 pt-4 border-t border-slate-700 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">{supplier.contact}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">{supplier.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">Specialties: {supplier.specialties.join(', ')}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm rounded-lg transition-colors">
                        Place Order
                      </button>
                      <button className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors">
                        View History
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {activeView === 'orders' && (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <h3 className="text-lg font-semibold text-white">Pending Orders with AI Predictions</h3>
            <p className="text-sm text-slate-400">Delivery date predictions based on supplier patterns</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Supplier</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Items</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Value</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Expected</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">AI Predicted</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Risk</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {pendingOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-4">
                      <span className="font-mono text-sm text-white">{order.id}</span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-300">{order.supplier}</td>
                    <td className="px-4 py-4 text-sm text-slate-300">{order.items}</td>
                    <td className="px-4 py-4 text-sm text-white font-medium">₹{order.value.toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm text-slate-300">{order.expected_date}</td>
                    <td className="px-4 py-4">
                      <span className={`text-sm font-medium ${
                        order.predicted_date !== order.expected_date ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {order.predicted_date}
                        {order.predicted_date !== order.expected_date && (
                          <span className="text-xs text-slate-500 ml-1">
                            (+{Math.ceil((new Date(order.predicted_date).getTime() - new Date(order.expected_date).getTime()) / (1000 * 60 * 60 * 24))}d)
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(order.delay_risk)}`}>
                        {order.delay_risk}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Delayed' ? 'bg-red-500/20 text-red-400' :
                        order.status === 'Shipped' ? 'bg-emerald-500/20 text-emerald-400' :
                        order.status === 'In Transit' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeView === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Supplier Performance Comparison */}
          <div className="card p-5">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-violet-400" />
              Supplier Performance Comparison
            </h3>
            <div className="space-y-4">
              {supplierData.sort((a, b) => b.reliability_score - a.reliability_score).map((supplier) => (
                <div key={supplier.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-300">{supplier.name}</span>
                    <span className="text-sm font-medium text-white">{supplier.reliability_score}%</span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        supplier.reliability_score >= 90 ? 'bg-emerald-500' :
                        supplier.reliability_score >= 70 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${supplier.reliability_score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Predictions Summary */}
          <div className="card p-5">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-violet-400" />
              AI Prediction Accuracy
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-1">94%</div>
                <div className="text-xs text-slate-400">Delivery Date Accuracy</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">89%</div>
                <div className="text-xs text-slate-400">Delay Risk Accuracy</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-amber-400 mb-1">3.2</div>
                <div className="text-xs text-slate-400">Avg Days Saved</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-violet-400 mb-1">₹2.4L</div>
                <div className="text-xs text-slate-400">Cost Savings (YTD)</div>
              </div>
            </div>
          </div>

          {/* Seasonal Patterns */}
          <div className="card p-5">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-violet-400" />
              Seasonal Delivery Patterns
            </h3>
            <div className="space-y-3">
              {[
                { month: 'Monsoon (Jul-Sep)', delay: '+40%', risk: 'HIGH', tip: 'Order 2 weeks early' },
                { month: 'Festival (Oct-Nov)', delay: '+25%', risk: 'MEDIUM', tip: 'Order 1 week early' },
                { month: 'Winter (Dec-Feb)', delay: '+10%', risk: 'LOW', tip: 'Normal lead times' },
                { month: 'Summer (Mar-Jun)', delay: '+5%', risk: 'LOW', tip: 'Best delivery period' },
              ].map((season, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">{season.month}</p>
                    <p className="text-xs text-slate-400">{season.tip}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      season.risk === 'HIGH' ? 'text-red-400' :
                      season.risk === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {season.delay} delay
                    </p>
                    <p className={`text-xs ${
                      season.risk === 'HIGH' ? 'text-red-400' :
                      season.risk === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {season.risk} risk
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Recommendations */}
          <div className="card p-5">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-violet-400" />
              Smart Supplier Recommendations
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-white">Best for Urgent Orders</p>
                    <p className="text-xs text-slate-400">Apollo Pharmacy (3-day delivery, 96% reliable)</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-white">Best Value for Money</p>
                    <p className="text-xs text-slate-400">Government Medical Store (98% price competitive)</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-violet-500/10 border border-violet-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-white">Best Overall Balance</p>
                    <p className="text-xs text-slate-400">HealthFirst Supplies (4.7★, 94% reliable, fair pricing)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

