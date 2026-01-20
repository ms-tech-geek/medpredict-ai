import { Pill, RefreshCw, HelpCircle, LogOut } from 'lucide-react';
import { NotificationPanel } from './NotificationPanel';

interface HeaderProps {
  alertCount: number;
  onRefresh: () => void;
  isLoading: boolean;
  onStartTour?: () => void;
  onLogout?: () => void;
  onNavigateToAlerts?: (type: 'expiry' | 'stockout') => void;
}

export function Header({ onRefresh, isLoading, onStartTour, onLogout, onNavigateToAlerts }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-slate-800/50">
      <div className="max-w-[1600px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl blur opacity-30 -z-10" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold gradient-text">
                MedPredict AI
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                Intelligent Supply Management
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Help/Tour Button */}
            {onStartTour && (
              <button
                onClick={onStartTour}
                className="p-3 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-700 hover:border-primary-500/50 transition-colors group"
                title="Take a tour"
              >
                <HelpCircle className="w-5 h-5 text-slate-400 group-hover:text-primary-400 transition-colors" />
              </button>
            )}

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="btn-secondary flex items-center gap-2 !py-2 !px-4"
              data-tour="refresh-btn"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* Notifications - Now with dropdown panel */}
            <NotificationPanel onNavigateToAlerts={onNavigateToAlerts} />

            {/* Facility Badge */}
            <div className="hidden md:flex items-center gap-3 pl-4 border-l border-slate-700">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                PK
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">PHC Kodigehalli</p>
                <p className="text-xs text-slate-400">Karnataka, India</p>
              </div>
            </div>

            {/* Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
