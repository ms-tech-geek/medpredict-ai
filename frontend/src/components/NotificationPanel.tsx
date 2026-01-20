import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Bell, 
  X, 
  AlertTriangle, 
  Package, 
  Clock, 
  ChevronRight,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { fetchAlerts } from '../services/api';

interface NotificationPanelProps {
  onNavigateToAlerts?: (type: 'expiry' | 'stockout') => void;
}

export function NotificationPanel({ onNavigateToAlerts }: NotificationPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const { data: alertsData, isLoading, refetch } = useQuery({
    queryKey: ['alerts'],
    queryFn: fetchAlerts,
    staleTime: 30000,
  });

  const criticalCount = alertsData?.critical_count || 0;
  const highCount = alertsData?.high_count || 0;
  const totalAlerts = alertsData?.total_alerts || 0;

  // Close panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTimeAgo = () => {
    return 'Just now';
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-3 rounded-xl border transition-all ${
          isOpen 
            ? 'bg-slate-700 border-primary-500/50' 
            : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700'
        }`}
        data-tour="notifications"
      >
        <Bell className={`w-5 h-5 ${isOpen ? 'text-primary-400' : 'text-slate-300'}`} />
        {criticalCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse-soft">
            {criticalCount > 9 ? '9+' : criticalCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary-400" />
              <h3 className="font-semibold text-white">Notifications</h3>
              {totalAlerts > 0 && (
                <span className="px-2 py-0.5 bg-primary-500/20 text-primary-400 text-xs font-medium rounded-full">
                  {totalAlerts}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => refetch()}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Summary */}
          {totalAlerts > 0 && (
            <div className="flex gap-2 p-3 border-b border-slate-800 bg-slate-800/30">
              {criticalCount > 0 && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-red-400">{criticalCount} Critical</span>
                </div>
              )}
              {highCount > 0 && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-500/20 border border-orange-500/30 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                  <span className="text-xs font-medium text-orange-400">{highCount} High</span>
                </div>
              )}
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : totalAlerts === 0 ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="text-slate-400 font-medium">All Clear!</p>
                <p className="text-sm text-slate-500 mt-1">No urgent alerts at this time</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {alertsData?.alerts.slice(0, 8).map((alert, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    onClick={() => {
                      setIsOpen(false);
                      onNavigateToAlerts?.(alert.type === 'EXPIRY' ? 'expiry' : 'stockout');
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        alert.severity === 'CRITICAL' 
                          ? 'bg-red-500/20' 
                          : 'bg-orange-500/20'
                      }`}>
                        {alert.type === 'EXPIRY' ? (
                          <AlertTriangle className={`w-4 h-4 ${
                            alert.severity === 'CRITICAL' ? 'text-red-400' : 'text-orange-400'
                          }`} />
                        ) : (
                          <Package className={`w-4 h-4 ${
                            alert.severity === 'CRITICAL' ? 'text-red-400' : 'text-orange-400'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                            alert.severity === 'CRITICAL' 
                              ? 'bg-red-500/20 text-red-400' 
                              : 'bg-orange-500/20 text-orange-400'
                          }`}>
                            {alert.severity}
                          </span>
                          <span className="text-xs text-slate-500">{alert.type}</span>
                        </div>
                        <p className="text-sm font-medium text-white truncate">{alert.medicine}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{alert.message}</p>
                        {alert.potential_loss && (
                          <p className="text-xs text-red-400 mt-1">
                            Potential loss: ₹{alert.potential_loss.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {totalAlerts > 0 && (
            <div className="p-3 border-t border-slate-800 bg-slate-800/30">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onNavigateToAlerts?.('expiry');
                }}
                className="w-full py-2 text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors"
              >
                View All Alerts →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

