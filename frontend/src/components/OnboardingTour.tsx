import { useState, useEffect, useCallback } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles,
  LayoutDashboard,
  AlertTriangle,
  TrendingDown,
  Package,
  Filter,
  Bell,
  RefreshCw,
  Lightbulb,
  Brain,
  Heart,
  IndianRupee,
  BarChart3,
  ShoppingCart,
  Calendar,
  Target,
  Zap,
  Search,
  Download,
  Eye,
  Clock,
  Shield
} from 'lucide-react';

interface TourStep {
  target: string;
  title: string;
  content: string;
  highlights?: string[];
  icon: React.ElementType;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const tourSteps: TourStep[] = [
  // WELCOME
  {
    target: 'welcome',
    title: 'Welcome to MedPredict AI! 🏥',
    content: 'Your AI-powered inventory management system designed specifically for Primary Health Centres. This app helps you prevent medicine wastage and ensure essential drugs are always in stock.',
    highlights: [
      '🤖 AI-powered predictions',
      '💰 Prevent ₹ Lakhs in wastage',
      '📊 Real-time analytics',
      '🔔 Smart alerts'
    ],
    icon: Sparkles,
    position: 'center',
  },

  // THE PROBLEM WE SOLVE
  {
    target: 'problem',
    title: 'The Problem We Solve 💡',
    content: 'Indian PHCs face ₹300 Crore annual loss due to expired medicines and stockouts. MedPredict uses machine learning to predict these issues BEFORE they happen, giving you time to act.',
    highlights: [
      '📉 30% of PHC medicines expire unused',
      '🚫 Critical stockouts affect patient care',
      '⏰ Manual tracking is error-prone',
      '✅ AI solves all these problems'
    ],
    icon: Target,
    position: 'center',
  },

  // HEALTH SCORE
  {
    target: '[data-tour="health-gauge"]',
    title: 'Inventory Health Score 💚',
    content: 'This AI-calculated score (0-100) shows your overall inventory health at a glance. It combines expiry risks, stockout risks, and consumption patterns into one easy number.',
    highlights: [
      '90-100: Excellent - All good!',
      '70-89: Good - Minor attention needed',
      '50-69: Fair - Take action soon',
      'Below 50: Critical - Act immediately!'
    ],
    icon: Heart,
    position: 'right',
  },

  // STATS CARDS
  {
    target: '[data-tour="stats-cards"]',
    title: 'Key Metrics at a Glance 📊',
    content: 'These cards show the most important numbers you need to monitor daily. Each card updates in real-time as your inventory changes.',
    highlights: [
      '💰 Inventory Value - Total stock worth',
      '⚠️ At-Risk Value - Potential loss from expiry',
      '🚨 Critical Alerts - Need immediate action',
      '📦 Low Stock Items - Order soon'
    ],
    icon: IndianRupee,
    position: 'bottom',
  },

  // SIDEBAR NAVIGATION
  {
    target: '[data-tour="sidebar"]',
    title: 'Navigation Menu 🧭',
    content: 'Use the sidebar to navigate between different views. Each section focuses on a specific aspect of inventory management.',
    highlights: [
      '📊 Dashboard - Overview of everything',
      '⏰ Expiry Alerts - Medicines expiring soon',
      '📉 Stockout Alerts - Running low on stock',
      '📦 Inventory - Complete medicine list'
    ],
    icon: LayoutDashboard,
    position: 'right',
  },

  // RISK FILTER
  {
    target: '[data-tour="risk-filter"]',
    title: 'Filter by Risk Level 🎯',
    content: 'Quickly focus on what matters most. Filter your view by risk severity to prioritize your actions effectively.',
    highlights: [
      '🔴 CRITICAL - Act within 24 hours',
      '🟠 HIGH - Act within 1 week',
      '🟡 MEDIUM - Monitor closely',
      '🟢 LOW - All good, keep tracking'
    ],
    icon: Filter,
    position: 'right',
  },

  // AI INTELLIGENCE CENTER
  {
    target: '[data-tour="ai-insights"]',
    title: '🧠 AI Intelligence Center',
    content: 'This is the brain of MedPredict! Our machine learning models analyze your data 24/7 to provide intelligent insights. Click the tabs to explore different AI capabilities.',
    highlights: [
      '📈 Demand Predictions - Know future needs',
      '🔍 Anomaly Detection - Spot unusual patterns',
      '📊 Trend Analysis - Understand consumption',
      '🎯 87%+ Prediction Accuracy'
    ],
    icon: Brain,
    position: 'top',
  },

  // DEMAND FORECASTING
  {
    target: '[data-tour="ai-insights"]',
    title: 'AI Feature: Demand Forecasting 📈',
    content: 'Our Prophet ML model analyzes 12 months of historical consumption to predict exactly how much of each medicine you\'ll need in the next 30 days. No more guessing!',
    highlights: [
      '✓ 30-day demand predictions',
      '✓ Confidence intervals (range)',
      '✓ Seasonal adjustments',
      '✓ Growth rate tracking'
    ],
    icon: BarChart3,
    position: 'top',
  },

  // ANOMALY DETECTION
  {
    target: '[data-tour="ai-insights"]',
    title: 'AI Feature: Anomaly Detection 🔍',
    content: 'Isolation Forest algorithm monitors consumption patterns and flags anything unusual. This helps catch theft, data entry errors, or sudden disease outbreaks early.',
    highlights: [
      '🚨 Unusual consumption spikes',
      '📉 Unexpected drops in usage',
      '🦠 Disease outbreak signals',
      '❌ Data entry errors'
    ],
    icon: AlertTriangle,
    position: 'top',
  },

  // RECOMMENDATIONS PANEL
  {
    target: '[data-tour="recommendations"]',
    title: 'Smart Recommendations 💡',
    content: 'Based on all AI analysis, MedPredict generates prioritized action items. Just follow these recommendations to prevent losses and maintain optimal stock levels.',
    highlights: [
      '🔴 Critical - Do today',
      '🟠 High - Do this week',
      '🟡 Medium - Plan for it',
      '📋 Each has specific actions'
    ],
    icon: Lightbulb,
    position: 'top',
  },

  // EXPIRY RISK CHART
  {
    target: '[data-tour="expiry-chart"]',
    title: 'Expiry Risk Distribution 📊',
    content: 'Visual breakdown of your inventory by expiry risk. The AI predicts which medicines will expire BEFORE being consumed, so you can take action early.',
    highlights: [
      '🔴 Red = Expiring in 30 days',
      '🟠 Orange = Expiring in 60 days',
      '🟡 Yellow = Expiring in 90 days',
      '🟢 Green = Safe (>90 days)'
    ],
    icon: Calendar,
    position: 'left',
  },

  // STOCKOUT CHART
  {
    target: '[data-tour="stockout-chart"]',
    title: 'Stockout Timeline ⏰',
    content: 'Shows medicines running low and exactly how many days until you run out. Shorter bars = more urgent! The AI factors in consumption patterns, not just current stock.',
    highlights: [
      '📊 Days until stockout',
      '📈 Based on consumption rate',
      '⚡ Auto-calculated reorder qty',
      '🛒 One-click order suggestion'
    ],
    icon: TrendingDown,
    position: 'left',
  },

  // ALERTS TABLE
  {
    target: '[data-tour="alerts-table"]',
    title: 'Detailed Alerts Table 📋',
    content: 'Complete list of all expiry and stockout alerts with full details. Click any row to see more information about that specific medicine or batch.',
    highlights: [
      '📊 Sortable columns',
      '🔍 Click for details',
      '💰 Shows potential loss',
      '✅ AI recommendations'
    ],
    icon: AlertTriangle,
    position: 'top',
  },

  // NOTIFICATIONS
  {
    target: '[data-tour="notifications"]',
    title: 'Notification Center 🔔',
    content: 'Click the bell to see all critical alerts in one place. The red badge shows how many urgent issues need your attention right now.',
    highlights: [
      '🔴 Badge = urgent count',
      '📋 Click to see all alerts',
      '🔗 Click alert to navigate',
      '🔄 Auto-refreshes'
    ],
    icon: Bell,
    position: 'bottom',
  },

  // REFRESH
  {
    target: '[data-tour="refresh-btn"]',
    title: 'Refresh Data 🔄',
    content: 'Click here to refresh all dashboard data. The AI recalculates predictions and risk scores with the latest information.',
    icon: RefreshCw,
    position: 'bottom',
  },

  // INVENTORY PAGE
  {
    target: '[data-tour="sidebar"]',
    title: 'Inventory Management 📦',
    content: 'The Inventory page lets you browse all medicines, search, filter, and see detailed analytics for each item including forecasts and trend analysis.',
    highlights: [
      '🔍 Fast search (debounced)',
      '📊 Click for detail modal',
      '📈 See consumption trends',
      '📥 Export to CSV/JSON'
    ],
    icon: Package,
    position: 'right',
  },

  // SEARCH
  {
    target: '[data-tour="sidebar"]',
    title: 'Lightning Fast Search ⚡',
    content: 'When in Inventory, use the search bar to find any medicine instantly. Our optimized search uses debouncing and caching for super-fast results.',
    highlights: [
      '⚡ 300ms debounce',
      '💾 Results cached',
      '🔍 Search by name',
      '📁 Filter by category'
    ],
    icon: Search,
    position: 'right',
  },

  // EXPORT
  {
    target: '[data-tour="sidebar"]',
    title: 'Export Reports 📥',
    content: 'Download reports in CSV or JSON format for record-keeping, audits, or sharing with supervisors. Available throughout the app.',
    highlights: [
      '📊 CSV for Excel',
      '💻 JSON for analysis',
      '📋 Full data included',
      '📁 Date-stamped files'
    ],
    icon: Download,
    position: 'right',
  },

  // MEDICINE DETAIL
  {
    target: '[data-tour="sidebar"]',
    title: 'Medicine Deep Dive 🔬',
    content: 'Click any medicine in Inventory or Alerts to open a detailed modal showing consumption history, AI forecasts, trend analysis, and batch-level information.',
    highlights: [
      '📈 Consumption chart',
      '🔮 AI forecast',
      '📊 Trend direction',
      '📦 Batch details'
    ],
    icon: Eye,
    position: 'right',
  },

  // REAL-TIME
  {
    target: 'realtime',
    title: 'Always Up-to-Date ⚡',
    content: 'MedPredict caches data smartly for speed while keeping everything fresh. Background syncing ensures you always see accurate information.',
    highlights: [
      '⚡ 30-second cache',
      '🔄 Auto-refresh',
      '💾 Offline capable',
      '🚀 Instant response'
    ],
    icon: Clock,
    position: 'center',
  },

  // DATA SECURITY
  {
    target: 'security',
    title: 'Your Data is Safe 🔒',
    content: 'All data stays within your facility. Our AI models run locally on aggregated data. No patient information is ever collected or transmitted.',
    highlights: [
      '🔒 Local data storage',
      '🚫 No patient data',
      '🏥 Facility-level only',
      '✅ Audit compliant'
    ],
    icon: Shield,
    position: 'center',
  },

  // COMPLETE
  {
    target: 'complete',
    title: "You're Ready to Go! 🚀",
    content: 'Start by checking your Critical alerts and following the AI recommendations. With MedPredict, you\'ll prevent wastage, avoid stockouts, and save money!',
    highlights: [
      '✅ Check Critical alerts first',
      '💡 Follow AI recommendations',
      '📊 Review daily',
      '❓ Help button for this tour'
    ],
    icon: Sparkles,
    position: 'center',
  },
];

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function OnboardingTour({ isOpen, onClose, onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

  const step = tourSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;
  const isCenterStep = step.position === 'center' || 
    step.target === 'welcome' || 
    step.target === 'problem' || 
    step.target === 'realtime' || 
    step.target === 'security' ||
    step.target === 'complete';

  const updatePosition = useCallback(() => {
    if (isCenterStep) {
      setHighlightRect(null);
      setTooltipPosition({
        top: window.innerHeight / 2 - 200,
        left: window.innerWidth / 2 - 220,
      });
      return;
    }

    const targetElement = document.querySelector(step.target);
    if (!targetElement) {
      // If element not found, center the tooltip
      setHighlightRect(null);
      setTooltipPosition({
        top: window.innerHeight / 2 - 200,
        left: window.innerWidth / 2 - 220,
      });
      return;
    }

    const rect = targetElement.getBoundingClientRect();
    setHighlightRect(rect);

    // Scroll element into view if needed
    if (rect.top < 100 || rect.bottom > window.innerHeight - 100) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const tooltipWidth = 440;
    const tooltipHeight = 300;
    const padding = 20;

    let top = 0;
    let left = 0;

    switch (step.position) {
      case 'top':
        top = rect.top - tooltipHeight - padding;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'bottom':
        top = rect.bottom + padding;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.left - tooltipWidth - padding;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.right + padding;
        break;
    }

    // Keep tooltip in viewport
    top = Math.max(padding, Math.min(top, window.innerHeight - tooltipHeight - padding));
    left = Math.max(padding, Math.min(left, window.innerWidth - tooltipWidth - padding));

    setTooltipPosition({ top, left });
  }, [currentStep, step.target, step.position, isCenterStep]);

  useEffect(() => {
    if (!isOpen) return;

    // Small delay to let elements render
    const timer = setTimeout(updatePosition, 100);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isOpen, updatePosition]);

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
  };

  if (!isOpen) return null;

  const Icon = step.icon;
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop with spotlight */}
      <div className="absolute inset-0 bg-black/80 transition-all duration-300">
        {highlightRect && !isCenterStep && (
          <div
            className="absolute bg-transparent transition-all duration-300"
            style={{
              top: highlightRect.top - 8,
              left: highlightRect.left - 8,
              width: highlightRect.width + 16,
              height: highlightRect.height + 16,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.8)',
              borderRadius: '16px',
              border: '3px solid rgba(99, 102, 241, 0.9)',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
        )}
      </div>

      {/* Tooltip */}
      <div
        className="absolute w-[440px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl transition-all duration-300 animate-fade-in overflow-hidden"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        }}
      >
        {/* Progress bar */}
        <div className="h-1 bg-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-slate-700 bg-gradient-to-r from-primary-500/20 via-accent-500/10 to-transparent">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-display font-bold text-white">{step.title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">Step {currentStep + 1} of {tourSteps.length}</p>
          </div>
          <button
            onClick={handleSkip}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-slate-300 leading-relaxed text-[15px]">{step.content}</p>
          
          {/* Highlights */}
          {step.highlights && step.highlights.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {step.highlights.map((highlight, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-800/70 rounded-lg border border-slate-700/50"
                >
                  <span className="text-sm text-slate-300">{highlight}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-700 bg-slate-800/50">
          {/* Step dots - clickable */}
          <div className="flex items-center gap-1">
            {tourSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => handleStepClick(index)}
                className={`w-2 h-2 rounded-full transition-all hover:scale-125 ${
                  index === currentStep
                    ? 'bg-primary-500 w-4'
                    : index < currentStep
                    ? 'bg-primary-500/50'
                    : 'bg-slate-600 hover:bg-slate-500'
                }`}
                title={`Step ${index + 1}`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            {!isFirstStep && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 px-4 py-2 text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-slate-700"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-400 hover:to-accent-400 text-white rounded-lg font-semibold transition-all shadow-lg shadow-primary-500/25"
            >
              {isLastStep ? "Let's Go!" : 'Next'}
              {!isLastStep && <ChevronRight className="w-4 h-4" />}
              {isLastStep && <Zap className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Skip button */}
      {!isLastStep && (
        <button
          onClick={handleSkip}
          className="fixed bottom-6 right-6 px-4 py-2 text-slate-400 hover:text-white transition-colors bg-slate-900/80 rounded-lg border border-slate-700"
        >
          Skip Tour
        </button>
      )}

      {/* Keyboard hint */}
      <div className="fixed bottom-6 left-6 flex items-center gap-4 text-xs text-slate-500">
        <span>Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">→</kbd> for next</span>
        <span>Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">←</kbd> for back</span>
        <span>Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">Esc</kbd> to skip</span>
      </div>
    </div>
  );
}

// Hook to manage tour state
export function useTour() {
  const [showTour, setShowTour] = useState(false);
  const [hasSeenTour, setHasSeenTour] = useState(() => {
    return localStorage.getItem('medpredict-tour-completed') === 'true';
  });

  useEffect(() => {
    // Show tour on first visit
    if (!hasSeenTour) {
      const timer = setTimeout(() => setShowTour(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [hasSeenTour]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showTour) return;
      
      if (e.key === 'Escape') {
        setShowTour(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showTour]);

  const startTour = () => setShowTour(true);
  
  const endTour = () => {
    setShowTour(false);
  };
  
  const completeTour = () => {
    setShowTour(false);
    setHasSeenTour(true);
    localStorage.setItem('medpredict-tour-completed', 'true');
  };

  const resetTour = () => {
    localStorage.removeItem('medpredict-tour-completed');
    setHasSeenTour(false);
  };

  return { showTour, startTour, endTour, completeTour, resetTour };
}
