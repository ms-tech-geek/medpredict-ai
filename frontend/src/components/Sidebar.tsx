import { 
  LayoutDashboard, 
  AlertTriangle, 
  Package, 
  TrendingDown,
  Settings,
  HelpCircle,
  Calendar
} from 'lucide-react';
import type { RiskLevel } from '../types';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  riskFilter: RiskLevel;
  onRiskFilterChange: (level: RiskLevel) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'expiry', label: 'Expiry Alerts', icon: Calendar },
  { id: 'stockout', label: 'Stockout Alerts', icon: TrendingDown },
  { id: 'inventory', label: 'Inventory', icon: Package },
];

const riskLevels: { value: RiskLevel; label: string; color: string }[] = [
  { value: 'ALL', label: 'All Levels', color: 'bg-slate-500' },
  { value: 'CRITICAL', label: 'Critical', color: 'bg-red-500' },
  { value: 'HIGH', label: 'High', color: 'bg-amber-500' },
  { value: 'MEDIUM', label: 'Medium', color: 'bg-blue-500' },
  { value: 'LOW', label: 'Low', color: 'bg-emerald-500' },
];

export function Sidebar({ activeTab, onTabChange, riskFilter, onRiskFilterChange }: SidebarProps) {
  return (
    <aside className="w-72 min-h-[calc(100vh-73px)] bg-slate-900/30 border-r border-slate-800/50 p-6 flex flex-col" data-tour="sidebar">
      {/* Navigation */}
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 text-white border border-primary-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary-400' : ''}`} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 rounded-full bg-primary-400 animate-pulse-soft" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Risk Filter */}
      <div className="mt-8" data-tour="risk-filter">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-4">
          Risk Filter
        </h3>
        <div className="space-y-1">
          {riskLevels.map((level) => (
            <button
              key={level.value}
              onClick={() => onRiskFilterChange(level.value)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                riskFilter === level.value
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded-full ${level.color}`} />
              <span className="text-sm">{level.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-semibold text-slate-300">Quick Tips</span>
        </div>
        <ul className="space-y-2 text-xs text-slate-400">
          <li className="flex items-start gap-2">
            <span className="text-primary-400">•</span>
            <span>Check critical alerts daily</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-400">•</span>
            <span>FIFO for near-expiry items</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-400">•</span>
            <span>Reorder when stock &lt; 7 days</span>
          </li>
        </ul>
      </div>

      {/* Bottom Links */}
      <div className="mt-auto pt-6 border-t border-slate-800/50 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 transition-colors">
          <Settings className="w-4 h-4" />
          <span className="text-sm">Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 transition-colors">
          <HelpCircle className="w-4 h-4" />
          <span className="text-sm">Help & Support</span>
        </button>
      </div>
    </aside>
  );
}

