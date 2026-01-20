import { useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { 
  IndianRupee, 
  AlertTriangle, 
  TrendingDown,
  Activity,
  AlertCircle,
  Package
} from 'lucide-react';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { StatsCard } from './components/StatsCard';
import { HealthGauge } from './components/HealthGauge';
import { RiskDistributionChart } from './components/RiskDistributionChart';
import { StockoutChart } from './components/StockoutChart';
import { AlertsTable } from './components/AlertsTable';
import { RecommendationsPanel } from './components/RecommendationsPanel';
import { InventoryPage } from './components/InventoryPage';
import { MedicineDetailModal } from './components/MedicineDetailModal';
import { OnboardingTour, useTour } from './components/OnboardingTour';

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
  const [selectedMedicineId, setSelectedMedicineId] = useState<number | null>(null);
  
  // Tour
  const { showTour, startTour, endTour, completeTour } = useTour();

  // Queries
  const { data: summary, isLoading: summaryLoading, error: summaryError, refetch: refetchSummary } = useQuery({
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

  if (summaryError) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Connection Error</h2>
          <p className="text-slate-400 mb-4">
            Unable to connect to the API. Please ensure all services are running.
          </p>
          <p className="text-xs text-slate-500 mb-4 font-mono bg-slate-800 p-2 rounded">
            {summaryError instanceof Error ? summaryError.message : 'Unknown error'}
          </p>
          <button 
            onClick={() => refetchSummary()}
            className="btn-primary"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const renderPageContent = () => {
    switch (activeTab) {
      case 'inventory':
        return (
          <InventoryPage onMedicineClick={(id) => setSelectedMedicineId(id)} />
        );

      case 'expiry':
        return (
          <>
            {/* Stats for Expiry */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Critical Expiry"
                value={summary?.critical_expiry_count || 0}
                subtitle="Needs immediate action"
                icon={AlertTriangle}
                variant="danger"
                delay={0}
              />
              <StatsCard
                title="High Risk"
                value={summary?.high_expiry_count || 0}
                subtitle="Within 60 days"
                icon={AlertTriangle}
                variant="warning"
                delay={100}
              />
              <StatsCard
                title="At-Risk Value"
                value={formatCurrency(summary?.total_at_risk_value || 0)}
                subtitle="Potential loss"
                icon={IndianRupee}
                variant="warning"
                delay={200}
              />
              <StatsCard
                title="Total Batches"
                value={summary?.total_batches || 0}
                subtitle="In inventory"
                icon={Package}
                variant="default"
                delay={300}
              />
            </div>

            {/* Expiry Alerts Table */}
            <AlertsTable
              expiryRisks={expiryRisks}
              stockoutRisks={[]}
              activeTab="expiry"
              onTabChange={() => {}}
            />
          </>
        );

      case 'stockout':
        return (
          <>
            {/* Stats for Stockout */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Critical Stockout"
                value={summary?.critical_stockout_count || 0}
                subtitle="Will run out in 7 days"
                icon={TrendingDown}
                variant="danger"
                delay={0}
              />
              <StatsCard
                title="High Risk"
                value={summary?.high_stockout_count || 0}
                subtitle="Low stock warning"
                icon={TrendingDown}
                variant="warning"
                delay={100}
              />
              <StatsCard
                title="Total Medicines"
                value={summary?.total_medicines || 0}
                subtitle="In catalog"
                icon={Package}
                variant="default"
                delay={200}
              />
              <StatsCard
                title="Inventory Value"
                value={formatCurrency(summary?.total_inventory_value || 0)}
                subtitle="Total stock value"
                icon={IndianRupee}
                variant="default"
                delay={300}
              />
            </div>

            {/* Stockout Chart and Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <StockoutChart risks={stockoutRisks} />
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Stockout Timeline</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {stockoutRisks.slice(0, 10).map((risk) => (
                    <div 
                      key={risk.medicine_id} 
                      className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                    >
                      <div>
                        <p className="text-white font-medium">{risk.medicine_name}</p>
                        <p className="text-sm text-slate-400">
                          {risk.current_stock} units • {risk.avg_daily_consumption.toFixed(1)}/day
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${
                          risk.days_until_stockout <= 7 ? 'text-red-400' :
                          risk.days_until_stockout <= 14 ? 'text-orange-400' :
                          'text-white'
                        }`}>
                          {risk.days_until_stockout.toFixed(0)} days
                        </p>
                        <p className="text-xs text-slate-500">until stockout</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stockout Alerts Table */}
            <AlertsTable
              expiryRisks={[]}
              stockoutRisks={stockoutRisks}
              activeTab="stockout"
              onTabChange={() => {}}
            />
          </>
        );

      case 'dashboard':
      default:
        return (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-tour="stats-cards">
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

            {/* Recommendations Panel */}
            <div className="mb-8" data-tour="recommendations">
              <RecommendationsPanel />
            </div>

            {/* Alerts Table */}
            <div data-tour="alerts-table">
              <AlertsTable
                expiryRisks={expiryRisks}
                stockoutRisks={stockoutRisks}
                activeTab={alertTab}
                onTabChange={setAlertTab}
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen mesh-bg">
      <Header 
        alertCount={alertsData?.critical_count || 0} 
        onRefresh={handleRefresh}
        isLoading={summaryLoading}
        onStartTour={startTour}
      />
      
      <div className="flex">
        <Sidebar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          riskFilter={riskFilter}
          onRiskFilterChange={setRiskFilter}
        />
        
        <main className="flex-1 p-8 max-w-[1600px]">
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

          {renderPageContent()}
        </main>
      </div>

      {/* Medicine Detail Modal */}
      {selectedMedicineId && (
        <MedicineDetailModal
          medicineId={selectedMedicineId}
          onClose={() => setSelectedMedicineId(null)}
        />
      )}

      {/* Onboarding Tour */}
      <OnboardingTour 
        isOpen={showTour} 
        onClose={endTour} 
        onComplete={completeTour} 
      />
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
