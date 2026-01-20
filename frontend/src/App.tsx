import { useState, useEffect, useCallback } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { 
  IndianRupee, 
  AlertTriangle, 
  Package, 
  TrendingDown,
  Activity
} from 'lucide-react';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { StatsCard } from './components/StatsCard';
import { HealthGauge } from './components/HealthGauge';
import { RiskDistributionChart } from './components/RiskDistributionChart';
import { StockoutChart } from './components/StockoutChart';
import { AlertsTable } from './components/AlertsTable';

import { 
  fetchDashboardSummary, 
  fetchExpiryRisks, 
  fetchStockoutRisks,
  fetchAlerts 
} from './services/api';

import type { RiskLevel } from './types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: 2,
    },
  },
});

function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [riskFilter, setRiskFilter] = useState<RiskLevel>('ALL');
  const [alertTab, setAlertTab] = useState<'expiry' | 'stockout'>('expiry');

  // Queries
  const { data: summary, isLoading: summaryLoading, refetch: refetchSummary } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: fetchDashboardSummary,
  });

  const { data: expiryRisks = [], refetch: refetchExpiry } = useQuery({
    queryKey: ['expiry-risks', riskFilter],
    queryFn: () => fetchExpiryRisks(riskFilter === 'ALL' ? undefined : riskFilter),
  });

  const { data: stockoutRisks = [], refetch: refetchStockout } = useQuery({
    queryKey: ['stockout-risks', riskFilter],
    queryFn: () => fetchStockoutRisks(riskFilter === 'ALL' ? undefined : riskFilter),
  });

  const { data: alertsData } = useQuery({
    queryKey: ['alerts'],
    queryFn: fetchAlerts,
  });

  const handleRefresh = useCallback(() => {
    refetchSummary();
    refetchExpiry();
    refetchStockout();
  }, [refetchSummary, refetchExpiry, refetchStockout]);

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${value.toLocaleString('en-IN')}`;
  };

  if (summaryLoading) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg">
      <Header 
        alertCount={alertsData?.critical_count || 0} 
        onRefresh={handleRefresh}
        isLoading={summaryLoading}
      />
      
      <div className="flex">
        <Sidebar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          riskFilter={riskFilter}
          onRiskFilterChange={setRiskFilter}
        />
        
        <main className="flex-1 p-8 max-w-[1400px]">
          {/* Page Title */}
          <div className="mb-8">
            <h2 className="text-2xl font-display font-bold text-white mb-2">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'expiry' && 'Expiry Risk Management'}
              {activeTab === 'stockout' && 'Stockout Prevention'}
              {activeTab === 'inventory' && 'Inventory Management'}
            </h2>
            <p className="text-slate-400">
              {new Date().toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Inventory Value"
              value={formatCurrency(summary?.total_inventory_value || 0)}
              subtitle={`${summary?.total_batches || 0} batches`}
              icon={IndianRupee}
              variant="default"
              delay={0}
            />
            <StatsCard
              title="At-Risk Value"
              value={formatCurrency(summary?.total_at_risk_value || 0)}
              subtitle="Potential loss from expiry"
              icon={AlertTriangle}
              trend={{
                value: summary ? -((summary.total_at_risk_value / summary.total_inventory_value) * 100) : 0,
                label: 'of inventory',
                isPositive: false
              }}
              variant="warning"
              delay={100}
            />
            <StatsCard
              title="Critical Alerts"
              value={(summary?.critical_expiry_count || 0) + (summary?.critical_stockout_count || 0)}
              subtitle="Needs immediate action"
              icon={Activity}
              variant="danger"
              delay={200}
            />
            <StatsCard
              title="Low Stock Items"
              value={(summary?.critical_stockout_count || 0) + (summary?.high_stockout_count || 0)}
              subtitle="Risk of stockout"
              icon={TrendingDown}
              variant="warning"
              delay={300}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <HealthGauge score={summary?.health_score || 0} />
            <RiskDistributionChart risks={expiryRisks} />
            <StockoutChart risks={stockoutRisks} />
          </div>

          {/* Alerts Table */}
          <AlertsTable
            expiryRisks={expiryRisks}
            stockoutRisks={stockoutRisks}
            activeTab={alertTab}
            onTabChange={setAlertTab}
          />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}

export default App;
