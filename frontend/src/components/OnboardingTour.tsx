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
  Shield,
  Play,
  CheckCircle2,
  ArrowRight,
  Rocket,
  Gift,
  Star,
  TrendingUp,
  Activity,
  MousePointerClick
} from 'lucide-react';

interface TourStep {
  id: string;
  category: 'intro' | 'dashboard' | 'ai' | 'tools' | 'finish';
  target: string;
  title: string;
  subtitle?: string;
  content: string;
  highlights?: { icon: React.ElementType; text: string; color?: string }[];
  tip?: string;
  icon: React.ElementType;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  animation?: 'fade' | 'slide' | 'zoom' | 'bounce';
}

const categoryLabels = {
  intro: { label: 'Getting Started', icon: Rocket, color: 'from-violet-500 to-purple-500' },
  dashboard: { label: 'Dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-cyan-500' },
  ai: { label: 'AI Features', icon: Brain, color: 'from-emerald-500 to-teal-500' },
  tools: { label: 'Tools & Actions', icon: Zap, color: 'from-orange-500 to-amber-500' },
  finish: { label: 'Ready to Go', icon: Gift, color: 'from-pink-500 to-rose-500' },
};

const tourSteps: TourStep[] = [
  // ============ INTRO ============
  {
    id: 'welcome',
    category: 'intro',
    target: 'welcome',
    title: 'Welcome to MedPredict AI! 🎉',
    subtitle: 'Your intelligent inventory companion',
    content: 'Transform how you manage medical supplies with AI-powered predictions. This quick tour will show you how to prevent wastage and ensure medicines are always available.',
    highlights: [
      { icon: Brain, text: 'AI-Powered Predictions', color: 'text-violet-400' },
      { icon: IndianRupee, text: 'Save ₹ Lakhs Annually', color: 'text-emerald-400' },
      { icon: Shield, text: 'Never Run Out of Stock', color: 'text-blue-400' },
      { icon: Clock, text: 'Real-time Monitoring', color: 'text-amber-400' },
    ],
    tip: '⏱️ This tour takes about 3 minutes. You can skip anytime!',
    icon: Sparkles,
    position: 'center',
    animation: 'zoom',
  },
  {
    id: 'problem',
    category: 'intro',
    target: 'problem',
    title: 'The Challenge We Solve',
    subtitle: '₹300 Crore wasted annually across Indian PHCs',
    content: 'Primary Health Centres struggle with expired medicines and unexpected stockouts. MedPredict\'s AI analyzes patterns to predict and prevent these issues before they happen.',
    highlights: [
      { icon: AlertTriangle, text: '30% medicines expire unused', color: 'text-red-400' },
      { icon: TrendingDown, text: 'Critical stockouts disrupt care', color: 'text-orange-400' },
      { icon: CheckCircle2, text: 'AI predicts 30 days ahead', color: 'text-emerald-400' },
      { icon: Target, text: '87%+ prediction accuracy', color: 'text-blue-400' },
    ],
    icon: Target,
    position: 'center',
    animation: 'slide',
  },

  // ============ DASHBOARD ============
  {
    id: 'health-score',
    category: 'dashboard',
    target: '[data-tour="health-gauge"]',
    title: 'Your Inventory Health Score',
    subtitle: 'One number that tells the whole story',
    content: 'This AI-calculated score (0-100) combines all risk factors into a single metric. Green means healthy, yellow needs attention, red requires immediate action.',
    highlights: [
      { icon: Star, text: '90-100: Excellent', color: 'text-emerald-400' },
      { icon: Star, text: '70-89: Good', color: 'text-blue-400' },
      { icon: Star, text: '50-69: Needs Attention', color: 'text-yellow-400' },
      { icon: Star, text: 'Below 50: Critical', color: 'text-red-400' },
    ],
    tip: '💡 Aim to keep your score above 80 for optimal inventory health!',
    icon: Heart,
    position: 'right',
    animation: 'fade',
  },
  {
    id: 'stats-cards',
    category: 'dashboard',
    target: '[data-tour="stats-cards"]',
    title: 'Key Metrics Dashboard',
    subtitle: 'Essential numbers at a glance',
    content: 'These cards show your most critical metrics. They update in real-time and change color based on severity.',
    highlights: [
      { icon: IndianRupee, text: 'Total Inventory Value', color: 'text-slate-300' },
      { icon: AlertTriangle, text: 'At-Risk Value (expiring)', color: 'text-amber-400' },
      { icon: Zap, text: 'Critical Alerts Count', color: 'text-red-400' },
      { icon: Package, text: 'Low Stock Items', color: 'text-orange-400' },
    ],
    icon: BarChart3,
    position: 'bottom',
    animation: 'slide',
  },
  {
    id: 'navigation',
    category: 'dashboard',
    target: '[data-tour="sidebar"]',
    title: 'Navigation Sidebar',
    subtitle: 'Quick access to all sections',
    content: 'Switch between different views to focus on specific aspects of your inventory. Each view is optimized for its purpose.',
    highlights: [
      { icon: LayoutDashboard, text: 'Dashboard - Overview', color: 'text-blue-400' },
      { icon: Calendar, text: 'Expiry - Medicines expiring soon', color: 'text-red-400' },
      { icon: TrendingDown, text: 'Stockout - Running low', color: 'text-orange-400' },
      { icon: Package, text: 'Inventory - Full catalog', color: 'text-emerald-400' },
    ],
    icon: LayoutDashboard,
    position: 'right',
    animation: 'fade',
  },
  {
    id: 'risk-filter',
    category: 'dashboard',
    target: '[data-tour="risk-filter"]',
    title: 'Smart Risk Filters',
    subtitle: 'Focus on what matters most',
    content: 'Filter your view by risk level to prioritize actions. Critical items need attention today, high within the week.',
    highlights: [
      { icon: AlertTriangle, text: 'CRITICAL - Act in 24 hours', color: 'text-red-400' },
      { icon: AlertTriangle, text: 'HIGH - Act this week', color: 'text-orange-400' },
      { icon: AlertTriangle, text: 'MEDIUM - Plan ahead', color: 'text-yellow-400' },
      { icon: CheckCircle2, text: 'LOW - All good!', color: 'text-emerald-400' },
    ],
    tip: '🎯 Start your day by checking Critical items first!',
    icon: Filter,
    position: 'right',
    animation: 'slide',
  },

  // ============ AI FEATURES ============
  {
    id: 'ai-center',
    category: 'ai',
    target: '[data-tour="ai-insights"]',
    title: '🧠 AI Intelligence Center',
    subtitle: 'The brain of MedPredict',
    content: 'This is where the magic happens! Our ML models analyze your historical data 24/7 to provide intelligent insights that help you make better decisions.',
    highlights: [
      { icon: BarChart3, text: 'Demand Forecasting (Prophet ML)', color: 'text-blue-400' },
      { icon: Eye, text: 'Anomaly Detection (Isolation Forest)', color: 'text-purple-400' },
      { icon: TrendingUp, text: 'Trend Analysis', color: 'text-emerald-400' },
      { icon: Activity, text: 'Seasonal Patterns', color: 'text-amber-400' },
    ],
    tip: '🔬 Click each tab to explore different AI capabilities!',
    icon: Brain,
    position: 'top',
    animation: 'zoom',
  },
  {
    id: 'forecasting',
    category: 'ai',
    target: '[data-tour="ai-insights"]',
    title: 'AI: Demand Forecasting',
    subtitle: 'Know exactly what you\'ll need',
    content: 'Our Prophet ML model learns from 12 months of consumption history to predict demand for the next 30 days—with confidence intervals so you know the range.',
    highlights: [
      { icon: Calendar, text: '30-day demand predictions', color: 'text-blue-400' },
      { icon: Target, text: 'Confidence intervals (±range)', color: 'text-purple-400' },
      { icon: TrendingUp, text: 'Trend direction detection', color: 'text-emerald-400' },
      { icon: Activity, text: 'Seasonal adjustments', color: 'text-amber-400' },
    ],
    tip: '📈 Example: "Paracetamol: 450 ± 50 units in 30 days (87% confidence)"',
    icon: BarChart3,
    position: 'top',
    animation: 'fade',
  },
  {
    id: 'anomaly',
    category: 'ai',
    target: '[data-tour="ai-insights"]',
    title: 'AI: Anomaly Detection',
    subtitle: 'Catch problems before they grow',
    content: 'Isolation Forest algorithm monitors consumption patterns and alerts you when something unusual happens—like potential theft, errors, or disease outbreaks.',
    highlights: [
      { icon: AlertTriangle, text: 'Unusual consumption spikes', color: 'text-red-400' },
      { icon: TrendingDown, text: 'Unexpected usage drops', color: 'text-orange-400' },
      { icon: Activity, text: 'Disease outbreak signals', color: 'text-purple-400' },
      { icon: Eye, text: 'Data entry errors', color: 'text-blue-400' },
    ],
    tip: '🚨 Get alerted when consumption deviates >2.5x from normal!',
    icon: Eye,
    position: 'top',
    animation: 'slide',
  },
  {
    id: 'recommendations',
    category: 'ai',
    target: '[data-tour="recommendations"]',
    title: 'Smart Recommendations',
    subtitle: 'AI tells you exactly what to do',
    content: 'Based on all analyses, MedPredict generates prioritized action items. Each recommendation includes specific steps you can take to prevent losses.',
    highlights: [
      { icon: Zap, text: 'Prioritized by urgency', color: 'text-red-400' },
      { icon: CheckCircle2, text: 'Specific action steps', color: 'text-emerald-400' },
      { icon: Package, text: 'Affected medicines listed', color: 'text-blue-400' },
      { icon: IndianRupee, text: 'Potential savings shown', color: 'text-amber-400' },
    ],
    tip: '✅ Follow these recommendations daily to maximize savings!',
    icon: Lightbulb,
    position: 'top',
    animation: 'fade',
  },

  // ============ CHARTS ============
  {
    id: 'expiry-chart',
    category: 'dashboard',
    target: '[data-tour="expiry-chart"]',
    title: 'Expiry Risk Distribution',
    subtitle: 'Visual breakdown by risk level',
    content: 'See at a glance how your inventory is distributed across risk levels. The goal is to minimize red and orange segments!',
    highlights: [
      { icon: AlertTriangle, text: 'Red = Expiring in 30 days', color: 'text-red-400' },
      { icon: AlertTriangle, text: 'Orange = Expiring in 60 days', color: 'text-orange-400' },
      { icon: AlertTriangle, text: 'Yellow = Expiring in 90 days', color: 'text-yellow-400' },
      { icon: CheckCircle2, text: 'Green = Safe (>90 days)', color: 'text-emerald-400' },
    ],
    icon: Calendar,
    position: 'left',
    animation: 'fade',
  },
  {
    id: 'stockout-chart',
    category: 'dashboard',
    target: '[data-tour="stockout-chart"]',
    title: 'Stockout Timeline',
    subtitle: 'Days until you run out',
    content: 'This chart shows medicines running low and how many days until stockout. Shorter bars need more urgent attention!',
    highlights: [
      { icon: Clock, text: 'Days until stockout', color: 'text-slate-300' },
      { icon: TrendingDown, text: 'Based on consumption rate', color: 'text-blue-400' },
      { icon: ShoppingCart, text: 'Reorder quantity suggested', color: 'text-emerald-400' },
      { icon: Zap, text: 'Urgent items highlighted', color: 'text-red-400' },
    ],
    tip: '🛒 Click any bar to see the recommended order quantity!',
    icon: TrendingDown,
    position: 'left',
    animation: 'slide',
  },

  // ============ TOOLS ============
  {
    id: 'notifications',
    category: 'tools',
    target: '[data-tour="notifications"]',
    title: 'Notification Center',
    subtitle: 'Never miss a critical alert',
    content: 'Click the bell to see all urgent alerts in a dropdown. Critical issues are highlighted and you can click to navigate directly to them.',
    highlights: [
      { icon: Bell, text: 'Red badge = urgent count', color: 'text-red-400' },
      { icon: MousePointerClick, text: 'Click to see all alerts', color: 'text-blue-400' },
      { icon: ArrowRight, text: 'Click alert to navigate', color: 'text-emerald-400' },
      { icon: RefreshCw, text: 'Auto-refreshes', color: 'text-purple-400' },
    ],
    icon: Bell,
    position: 'bottom',
    animation: 'bounce',
  },
  {
    id: 'refresh',
    category: 'tools',
    target: '[data-tour="refresh-btn"]',
    title: 'Refresh Data',
    subtitle: 'Get the latest updates',
    content: 'Click to refresh all dashboard data. The AI recalculates predictions and risk scores with the latest information from your inventory.',
    icon: RefreshCw,
    position: 'bottom',
    animation: 'fade',
  },
  {
    id: 'alerts-table',
    category: 'tools',
    target: '[data-tour="alerts-table"]',
    title: 'Detailed Alerts Table',
    subtitle: 'Full information at your fingertips',
    content: 'This table shows all expiry and stockout alerts with complete details. Sort by any column and click rows for more information.',
    highlights: [
      { icon: Filter, text: 'Sortable columns', color: 'text-blue-400' },
      { icon: Eye, text: 'Click row for details', color: 'text-purple-400' },
      { icon: IndianRupee, text: 'Potential loss shown', color: 'text-amber-400' },
      { icon: Download, text: 'Export to CSV/JSON', color: 'text-emerald-400' },
    ],
    icon: AlertTriangle,
    position: 'top',
    animation: 'fade',
  },
  {
    id: 'inventory',
    category: 'tools',
    target: '[data-tour="sidebar"]',
    title: 'Inventory Management',
    subtitle: 'Browse your complete catalog',
    content: 'The Inventory page shows all medicines with powerful search, filters, and detailed analytics. Click any medicine to see forecasts and trends.',
    highlights: [
      { icon: Search, text: 'Lightning-fast search', color: 'text-blue-400' },
      { icon: Filter, text: 'Filter by category', color: 'text-purple-400' },
      { icon: BarChart3, text: 'Click for AI insights', color: 'text-emerald-400' },
      { icon: Download, text: 'Export reports', color: 'text-amber-400' },
    ],
    tip: '⚡ Search is debounced and cached for super-fast results!',
    icon: Package,
    position: 'right',
    animation: 'slide',
  },

  // ============ FINISH ============
  {
    id: 'ready',
    category: 'finish',
    target: 'complete',
    title: 'You\'re All Set! 🚀',
    subtitle: 'Start saving money today',
    content: 'You now know how to use MedPredict AI! Start by checking your Critical alerts and following the AI recommendations. This tour is always available from the Help button.',
    highlights: [
      { icon: CheckCircle2, text: '1. Check Critical alerts first', color: 'text-red-400' },
      { icon: Lightbulb, text: '2. Follow recommendations', color: 'text-amber-400' },
      { icon: Eye, text: '3. Review daily', color: 'text-blue-400' },
      { icon: Zap, text: '4. Watch your savings grow!', color: 'text-emerald-400' },
    ],
    tip: '❓ Need this tour again? Click the Help (?) button in the header!',
    icon: Rocket,
    position: 'center',
    animation: 'zoom',
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
  const [showOutline, setShowOutline] = useState(false);

  const step = tourSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;
  const isCenterStep = step.position === 'center' || 
    ['welcome', 'problem', 'complete'].includes(step.target);

  const categoryInfo = categoryLabels[step.category];

  // Group steps by category for outline
  const stepsByCategory = tourSteps.reduce((acc, s, idx) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push({ ...s, index: idx });
    return acc;
  }, {} as Record<string, (TourStep & { index: number })[]>);

  const updatePosition = useCallback(() => {
    if (isCenterStep) {
      setHighlightRect(null);
      setTooltipPosition({
        top: window.innerHeight / 2 - 220,
        left: window.innerWidth / 2 - 240,
      });
      return;
    }

    const targetElement = document.querySelector(step.target);
    if (!targetElement) {
      setHighlightRect(null);
      setTooltipPosition({
        top: window.innerHeight / 2 - 220,
        left: window.innerWidth / 2 - 240,
      });
      return;
    }

    const rect = targetElement.getBoundingClientRect();
    setHighlightRect(rect);

    if (rect.top < 100 || rect.bottom > window.innerHeight - 100) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const tooltipWidth = 480;
    const tooltipHeight = 380;
    const padding = 24;

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

    top = Math.max(padding, Math.min(top, window.innerHeight - tooltipHeight - padding));
    left = Math.max(padding, Math.min(left, window.innerWidth - tooltipWidth - padding));

    setTooltipPosition({ top, left });
  }, [currentStep, step.target, step.position, isCenterStep]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(updatePosition, 150);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isOpen, updatePosition]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep]);

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

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
    setShowOutline(false);
  };

  if (!isOpen) return null;

  const Icon = step.icon;
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm transition-all duration-500"
        onClick={() => setShowOutline(false)}
      >
        {highlightRect && !isCenterStep && (
          <>
            {/* Spotlight */}
            <div
              className="absolute transition-all duration-500 ease-out"
              style={{
                top: highlightRect.top - 12,
                left: highlightRect.left - 12,
                width: highlightRect.width + 24,
                height: highlightRect.height + 24,
                boxShadow: '0 0 0 9999px rgba(2, 6, 23, 0.9)',
                borderRadius: '20px',
              }}
            />
            {/* Animated border */}
            <div
              className="absolute transition-all duration-500 ease-out animate-pulse-border"
              style={{
                top: highlightRect.top - 12,
                left: highlightRect.left - 12,
                width: highlightRect.width + 24,
                height: highlightRect.height + 24,
                borderRadius: '20px',
                border: '3px solid transparent',
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4, #6366f1) border-box',
                WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
            />
          </>
        )}
      </div>

      {/* Tour Outline Sidebar */}
      {showOutline && (
        <div className="fixed left-0 top-0 bottom-0 w-80 bg-slate-900 border-r border-slate-700 z-[101] animate-slide-in-left overflow-y-auto">
          <div className="p-4 border-b border-slate-700 sticky top-0 bg-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">Tour Outline</h3>
              <button 
                onClick={() => setShowOutline(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-4 space-y-4">
            {Object.entries(stepsByCategory).map(([category, steps]) => {
              const catInfo = categoryLabels[category as keyof typeof categoryLabels];
              const CatIcon = catInfo.icon;
              return (
                <div key={category}>
                  <div className={`flex items-center gap-2 mb-2 px-2 py-1 rounded-lg bg-gradient-to-r ${catInfo.color} bg-opacity-20`}>
                    <CatIcon className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">{catInfo.label}</span>
                  </div>
                  <div className="space-y-1 ml-2">
                    {steps.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => handleStepClick(s.index)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          s.index === currentStep
                            ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                            : s.index < currentStep
                            ? 'text-slate-400 hover:bg-slate-800'
                            : 'text-slate-500 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {s.index < currentStep && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                          {s.index === currentStep && <Play className="w-3.5 h-3.5 text-primary-400 fill-primary-400" />}
                          {s.index > currentStep && <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />}
                          <span className="truncate">{s.title.replace(/[🎉🧠🚀]/g, '').trim()}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Tooltip */}
      <div
        className={`absolute w-[480px] bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl transition-all duration-500 overflow-hidden ${
          step.animation === 'zoom' ? 'animate-zoom-in' :
          step.animation === 'slide' ? 'animate-slide-up' :
          step.animation === 'bounce' ? 'animate-bounce-in' :
          'animate-fade-in'
        }`}
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        }}
      >
        {/* Category Badge + Progress */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950/50">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${categoryInfo.color}`}>
            <categoryInfo.icon className="w-3.5 h-3.5 text-white" />
            <span className="text-xs font-medium text-white">{categoryInfo.label}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowOutline(true)}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              {currentStep + 1} / {tourSteps.length}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-slate-800">
          <div 
            className={`h-full bg-gradient-to-r ${categoryInfo.color} transition-all duration-500 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header */}
        <div className="p-5 pb-0">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${categoryInfo.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-display font-bold text-white leading-tight">{step.title}</h3>
              {step.subtitle && (
                <p className="text-sm text-slate-400 mt-1">{step.subtitle}</p>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-slate-300 leading-relaxed">{step.content}</p>
          
          {/* Highlights Grid */}
          {step.highlights && step.highlights.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {step.highlights.map((highlight, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2.5 px-3 py-2.5 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-colors"
                >
                  <highlight.icon className={`w-4 h-4 ${highlight.color || 'text-slate-400'} flex-shrink-0`} />
                  <span className="text-sm text-slate-300">{highlight.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tip */}
          {step.tip && (
            <div className="mt-4 flex items-start gap-2 px-3 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-200/90">{step.tip}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-800 bg-slate-950/30">
          {/* Step Navigation */}
          <div className="flex items-center gap-1">
            {tourSteps.map((_, index) => {
              const stepCat = tourSteps[index].category;
              const color = categoryLabels[stepCat].color;
              return (
                <button
                  key={index}
                  onClick={() => handleStepClick(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentStep
                      ? `w-6 bg-gradient-to-r ${color}`
                      : index < currentStep
                      ? 'w-1.5 bg-slate-500'
                      : 'w-1.5 bg-slate-700 hover:bg-slate-600'
                  }`}
                  title={`Step ${index + 1}: ${tourSteps[index].title}`}
                />
              );
            })}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1.5 px-4 py-2 text-slate-300 hover:text-white transition-colors rounded-xl hover:bg-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
            <button
              onClick={handleNext}
              className={`flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${categoryInfo.color} hover:opacity-90 text-white rounded-xl font-semibold transition-all shadow-lg`}
            >
              <span>{isLastStep ? "Let's Go!" : 'Next'}</span>
              {isLastStep ? <Rocket className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4 bg-slate-900/80 backdrop-blur-sm border-t border-slate-800">
        <div className="flex items-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <kbd className="px-2 py-1 bg-slate-800 rounded text-slate-400 font-mono">→</kbd>
            <span>Next</span>
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="px-2 py-1 bg-slate-800 rounded text-slate-400 font-mono">←</kbd>
            <span>Back</span>
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="px-2 py-1 bg-slate-800 rounded text-slate-400 font-mono">Esc</kbd>
            <span>Skip</span>
          </span>
        </div>
        
        {!isLastStep && (
          <button
            onClick={onClose}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Skip Tour
          </button>
        )}
      </div>

      {/* Custom styles */}
      <style>{`
        @keyframes zoom-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.8); }
          50% { transform: scale(1.02); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse-border {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-zoom-in { animation: zoom-in 0.4s ease-out; }
        .animate-slide-up { animation: slide-up 0.4s ease-out; }
        .animate-bounce-in { animation: bounce-in 0.5s ease-out; }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-slide-in-left { animation: slide-in-left 0.3s ease-out; }
        .animate-pulse-border { animation: pulse-border 2s ease-in-out infinite; }
      `}</style>
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
    if (!hasSeenTour) {
      const timer = setTimeout(() => setShowTour(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [hasSeenTour]);

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
