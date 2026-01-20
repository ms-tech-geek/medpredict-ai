import { useQuery } from '@tanstack/react-query';
import { 
  Lightbulb, 
  AlertTriangle, 
  ShoppingCart, 
  Calendar, 
  ChevronRight,
  Clock,
  TrendingDown,
  Umbrella,
  Snowflake
} from 'lucide-react';
import { fetchRecommendations } from '../services/api';
import type { Recommendation } from '../types';

const priorityConfig = {
  CRITICAL: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: 'bg-red-500',
    text: 'text-red-400',
  },
  HIGH: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    icon: 'bg-orange-500',
    text: 'text-orange-400',
  },
  MEDIUM: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    icon: 'bg-yellow-500',
    text: 'text-yellow-400',
  },
  LOW: {
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/30',
    icon: 'bg-slate-500',
    text: 'text-slate-400',
  },
};

const categoryIcons = {
  EXPIRY: Calendar,
  STOCKOUT: ShoppingCart,
  SEASONAL: Umbrella,
};

export function RecommendationsPanel() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['recommendations'],
    queryFn: fetchRecommendations,
  });

  if (isLoading) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-primary-400" />
          <h3 className="text-lg font-semibold text-white">Recommendations</h3>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return null;
  }

  const { recommendations } = data;

  if (recommendations.length === 0) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-primary-400" />
          <h3 className="text-lg font-semibold text-white">Recommendations</h3>
        </div>
        <div className="text-center py-8 text-slate-400">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
            <Lightbulb className="w-6 h-6 text-emerald-400" />
          </div>
          <p>All clear! No urgent recommendations at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary-400" />
          <h3 className="text-lg font-semibold text-white">Recommendations</h3>
        </div>
        <span className="text-sm text-slate-400">{recommendations.length} actions needed</span>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <RecommendationCard key={index} recommendation={rec} />
        ))}
      </div>
    </div>
  );
}

function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const config = priorityConfig[recommendation.priority];
  const Icon = categoryIcons[recommendation.category] || Lightbulb;

  return (
    <div className={`rounded-lg border ${config.bg} ${config.border} overflow-hidden`}>
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg ${config.icon} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${config.bg} ${config.text} border ${config.border}`}>
                {recommendation.priority}
              </span>
              <span className="text-xs text-slate-500">{recommendation.category}</span>
            </div>
            <h4 className="text-white font-medium">{recommendation.title}</h4>
            <p className="text-sm text-slate-400 mt-1">{recommendation.description}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4">
        <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide">Suggested Actions</p>
        <ul className="space-y-1">
          {recommendation.actions.map((action, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
              <ChevronRight className="w-3 h-3 text-slate-500" />
              {action}
            </li>
          ))}
        </ul>
      </div>

      {/* Affected Items */}
      {recommendation.affected_items.length > 0 && (
        <div className="bg-slate-900/50 px-4 py-3 border-t border-slate-700/50">
          <p className="text-xs text-slate-500 mb-2">Affected Items</p>
          <div className="flex flex-wrap gap-2">
            {recommendation.affected_items.slice(0, 5).map((item, i) => (
              <span 
                key={i} 
                className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300"
              >
                {item.name}
                {item.days !== undefined && (
                  <span className="text-slate-500 ml-1">({item.days}d)</span>
                )}
                {item.loss !== undefined && (
                  <span className="text-red-400 ml-1">₹{item.loss.toLocaleString()}</span>
                )}
                {item.order_qty !== undefined && (
                  <span className="text-emerald-400 ml-1">+{item.order_qty}</span>
                )}
              </span>
            ))}
            {recommendation.affected_items.length > 5 && (
              <span className="text-xs text-slate-500">
                +{recommendation.affected_items.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

