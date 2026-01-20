import { useState, useEffect } from 'react';
import {
  Brain,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Clock,
  Zap,
  Target,
  BarChart3,
  Activity,
  Shield,
  LineChart,
  Cpu,
  Database,
  GitBranch,
  Layers,
  CheckCircle,
  ArrowRight,
  Star,
  Lightbulb,
  RefreshCw
} from 'lucide-react';

// AI Model information
const aiModels = [
  {
    name: 'Prophet ML',
    description: 'Time-series forecasting for demand prediction',
    accuracy: 94,
    type: 'Forecasting',
    icon: LineChart,
    color: 'from-blue-500 to-cyan-500',
    features: [
      'Daily/Weekly/Monthly predictions',
      'Confidence intervals',
      'Seasonal pattern detection',
      'Trend decomposition'
    ]
  },
  {
    name: 'Isolation Forest',
    description: 'Unsupervised anomaly detection in consumption',
    accuracy: 89,
    type: 'Anomaly Detection',
    icon: Zap,
    color: 'from-violet-500 to-purple-500',
    features: [
      'Real-time anomaly flagging',
      'Multi-severity classification',
      'Pattern deviation scoring',
      'Theft/Error detection'
    ]
  },
  {
    name: 'Risk Scoring Engine',
    description: 'Multi-factor risk assessment algorithm',
    accuracy: 92,
    type: 'Risk Analysis',
    icon: Shield,
    color: 'from-red-500 to-orange-500',
    features: [
      'Expiry risk calculation',
      'Stockout probability',
      'Financial loss prediction',
      'Priority recommendations'
    ]
  },
  {
    name: 'Supplier Predictor',
    description: 'Delivery delay prediction using historical patterns',
    accuracy: 91,
    type: 'Supply Chain',
    icon: Target,
    color: 'from-emerald-500 to-teal-500',
    features: [
      'Lead time prediction',
      'Delay probability scoring',
      'Seasonal supply patterns',
      'Supplier reliability index'
    ]
  }
];

// Key AI metrics
const aiMetrics = [
  { label: 'Predictions Made', value: '12,547', change: '+245 today', icon: Brain, trend: 'up' },
  { label: 'Avg. Accuracy', value: '91.5%', change: '+2.3% vs last month', icon: Target, trend: 'up' },
  { label: 'Anomalies Detected', value: '23', change: '5 critical', icon: Zap, trend: 'alert' },
  { label: 'Cost Savings', value: '₹4.2L', change: 'YTD from AI insights', icon: Star, trend: 'up' },
];

// Real-time AI activity simulation
const recentActivities = [
  { time: '2 min ago', action: 'Demand forecast updated', item: '45 medicines', type: 'forecast' },
  { time: '5 min ago', action: 'Anomaly detected', item: 'Paracetamol 500mg', type: 'anomaly' },
  { time: '12 min ago', action: 'Risk score recalculated', item: 'All inventory', type: 'risk' },
  { time: '18 min ago', action: 'Supplier delay predicted', item: 'PharmaCare India', type: 'supplier' },
  { time: '25 min ago', action: 'Reorder recommendation', item: 'Amoxicillin 250mg', type: 'recommendation' },
];

interface AIFeaturesShowcaseProps {
  compact?: boolean;
}

export function AIFeaturesShowcase({ compact = false }: AIFeaturesShowcaseProps) {
  const [selectedModel, setSelectedModel] = useState<number | null>(null);
  const [activityIndex, setActivityIndex] = useState(0);

  // Simulate real-time activity cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityIndex((prev) => (prev + 1) % recentActivities.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (compact) {
    return (
      <div className="card p-4 bg-gradient-to-br from-slate-900 via-primary-900/20 to-slate-900">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Engine Status</h3>
            <p className="text-xs text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              All systems operational
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {aiMetrics.slice(0, 4).map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div key={idx} className="bg-slate-800/50 rounded-lg p-2">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-3 h-3 text-primary-400" />
                  <span className="text-xs text-slate-400">{metric.label}</span>
                </div>
                <p className="text-sm font-semibold text-white">{metric.value}</p>
              </div>
            );
          })}
        </div>

        {/* Live Activity */}
        <div className="mt-3 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs">
            <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="text-slate-400">Latest:</span>
            <span className="text-white">{recentActivities[activityIndex].action}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6 bg-gradient-to-r from-primary-500/10 via-accent-500/10 to-primary-500/10 border-primary-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                AI Intelligence Engine
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </h2>
              <p className="text-slate-400">Powered by Machine Learning & Predictive Analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-sm font-medium">All Models Active</span>
            </div>
            <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors">
              <RefreshCw className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {aiMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="card p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl ${
                  metric.trend === 'alert' ? 'bg-amber-500/20' : 'bg-primary-500/20'
                } flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${
                    metric.trend === 'alert' ? 'text-amber-400' : 'text-primary-400'
                  }`} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{metric.label}</p>
                  <p className="text-xl font-bold text-white">{metric.value}</p>
                </div>
              </div>
              <div className={`text-xs ${
                metric.trend === 'up' ? 'text-emerald-400' : 
                metric.trend === 'alert' ? 'text-amber-400' : 'text-slate-400'
              }`}>
                {metric.trend === 'up' && <TrendingUp className="w-3 h-3 inline mr-1" />}
                {metric.trend === 'alert' && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                {metric.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Models */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-primary-400" />
          Active ML Models
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiModels.map((model, idx) => {
            const Icon = model.icon;
            const isSelected = selectedModel === idx;
            return (
              <div
                key={idx}
                className={`card p-4 cursor-pointer transition-all ${
                  isSelected ? 'ring-2 ring-primary-500' : 'hover:border-primary-500/50'
                }`}
                onClick={() => setSelectedModel(isSelected ? null : idx)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${model.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-white">{model.name}</h4>
                      <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">
                        {model.type}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">{model.description}</p>
                    
                    {/* Accuracy Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-400">Model Accuracy</span>
                        <span className="text-white font-medium">{model.accuracy.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${model.color} rounded-full`}
                          style={{ width: `${model.accuracy}%` }}
                        />
                      </div>
                    </div>

                    {/* Features (expanded) */}
                    {isSelected && (
                      <div className="pt-3 border-t border-slate-800 mt-3 space-y-2">
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Capabilities</p>
                        {model.features.map((feature, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2 text-sm text-slate-300">
                            <CheckCircle className="w-3 h-3 text-emerald-400" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="card p-5">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary-400" />
          Real-time AI Activity
          <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </h3>
        <div className="space-y-3">
          {recentActivities.map((activity, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                idx === activityIndex ? 'bg-primary-500/10 border border-primary-500/30' : 'bg-slate-800/50'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                activity.type === 'forecast' ? 'bg-blue-500/20' :
                activity.type === 'anomaly' ? 'bg-red-500/20' :
                activity.type === 'risk' ? 'bg-amber-500/20' :
                activity.type === 'supplier' ? 'bg-violet-500/20' :
                'bg-emerald-500/20'
              }`}>
                {activity.type === 'forecast' && <LineChart className="w-5 h-5 text-blue-400" />}
                {activity.type === 'anomaly' && <Zap className="w-5 h-5 text-red-400" />}
                {activity.type === 'risk' && <Shield className="w-5 h-5 text-amber-400" />}
                {activity.type === 'supplier' && <Target className="w-5 h-5 text-violet-400" />}
                {activity.type === 'recommendation' && <Lightbulb className="w-5 h-5 text-emerald-400" />}
              </div>
              <div className="flex-1">
                <p className="text-sm text-white font-medium">{activity.action}</p>
                <p className="text-xs text-slate-400">{activity.item}</p>
              </div>
              <span className="text-xs text-slate-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* How AI Helps */}
      <div className="card p-5 bg-gradient-to-br from-primary-500/5 to-accent-500/5 border-primary-500/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          How AI Powers MedPredict
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Predict Before Problems',
              desc: 'AI forecasts demand 30 days ahead, preventing stockouts and expiry waste.',
              icon: TrendingUp,
              stat: '94% accuracy'
            },
            {
              title: 'Detect Hidden Issues',
              desc: 'Anomaly detection spots unusual patterns that humans might miss.',
              icon: Zap,
              stat: '23 issues found'
            },
            {
              title: 'Optimize Decisions',
              desc: 'Smart recommendations prioritize actions for maximum impact.',
              icon: Target,
              stat: '₹4.2L saved'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-4 bg-slate-800/50 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-primary-400" />
                </div>
                <h4 className="font-medium text-white mb-1">{item.title}</h4>
                <p className="text-sm text-slate-400 mb-2">{item.desc}</p>
                <span className="text-xs text-primary-400 font-medium">{item.stat}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

