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
  Download,
  Bell,
  RefreshCw,
  Lightbulb,
  Brain
} from 'lucide-react';

interface TourStep {
  target: string;
  title: string;
  content: string;
  icon: React.ElementType;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const tourSteps: TourStep[] = [
  {
    target: 'welcome',
    title: 'Welcome to MedPredict AI! 👋',
    content: 'Your AI-powered inventory management system for Primary Health Centres. Let me show you around!',
    icon: Sparkles,
    position: 'center',
  },
  {
    target: '[data-tour="health-gauge"]',
    title: 'Health Score',
    content: 'This gauge shows your overall inventory health (0-100). Higher is better! It accounts for expiry risks and stockout risks.',
    icon: LayoutDashboard,
    position: 'right',
  },
  {
    target: '[data-tour="stats-cards"]',
    title: 'Quick Stats',
    content: 'These cards show key metrics: total inventory value, at-risk value from expiry, critical alerts, and low stock items.',
    icon: LayoutDashboard,
    position: 'bottom',
  },
  {
    target: '[data-tour="sidebar"]',
    title: 'Navigation',
    content: 'Use the sidebar to navigate between Dashboard, Expiry Alerts, Stockout Alerts, and Inventory Management.',
    icon: LayoutDashboard,
    position: 'right',
  },
  {
    target: '[data-tour="risk-filter"]',
    title: 'Risk Filter',
    content: 'Filter data by risk level: Critical (immediate action), High (urgent), Medium (monitor), or Low (healthy).',
    icon: Filter,
    position: 'right',
  },
  {
    target: '[data-tour="ai-insights"]',
    title: 'AI Intelligence Center',
    content: 'The brain of MedPredict! Uses Prophet ML for demand forecasting and Isolation Forest for anomaly detection. See predictions, detect unusual patterns, and understand consumption trends.',
    icon: Brain,
    position: 'top',
  },
  {
    target: '[data-tour="recommendations"]',
    title: 'Smart Recommendations',
    content: 'AI-powered actionable recommendations based on your inventory risks. Follow these to prevent losses!',
    icon: Lightbulb,
    position: 'top',
  },
  {
    target: '[data-tour="expiry-chart"]',
    title: 'Expiry Risk Distribution',
    content: 'Visual breakdown of your inventory by expiry risk level. Red = Critical, Orange = High, Yellow = Medium, Green = Low.',
    icon: AlertTriangle,
    position: 'left',
  },
  {
    target: '[data-tour="stockout-chart"]',
    title: 'Stockout Timeline',
    content: 'Shows medicines running low and how many days until stockout. Shorter bars mean more urgent ordering needed.',
    icon: TrendingDown,
    position: 'left',
  },
  {
    target: '[data-tour="alerts-table"]',
    title: 'Alerts Table',
    content: 'Detailed list of expiry and stockout alerts. Click any row to see more details. Use Export to download reports.',
    icon: AlertTriangle,
    position: 'top',
  },
  {
    target: '[data-tour="refresh-btn"]',
    title: 'Refresh Data',
    content: 'Click here to refresh all dashboard data from the server.',
    icon: RefreshCw,
    position: 'bottom',
  },
  {
    target: '[data-tour="notifications"]',
    title: 'Notifications',
    content: 'Critical alerts appear here. The badge shows the count of urgent issues needing attention.',
    icon: Bell,
    position: 'bottom',
  },
  {
    target: 'complete',
    title: "You're All Set! 🎉",
    content: 'Start by checking your Critical alerts and following the recommendations. Need help? This tour is always available from the header.',
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
  const isCenterStep = step.position === 'center';

  const updatePosition = useCallback(() => {
    if (isCenterStep) {
      setHighlightRect(null);
      setTooltipPosition({
        top: window.innerHeight / 2 - 150,
        left: window.innerWidth / 2 - 200,
      });
      return;
    }

    const targetElement = document.querySelector(step.target);
    if (!targetElement) {
      // If element not found, center the tooltip
      setHighlightRect(null);
      setTooltipPosition({
        top: window.innerHeight / 2 - 150,
        left: window.innerWidth / 2 - 200,
      });
      return;
    }

    const rect = targetElement.getBoundingClientRect();
    setHighlightRect(rect);

    const tooltipWidth = 400;
    const tooltipHeight = 200;
    const padding = 16;

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

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
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

  if (!isOpen) return null;

  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop with spotlight */}
      <div className="absolute inset-0 bg-black/70 transition-all duration-300">
        {highlightRect && !isCenterStep && (
          <div
            className="absolute bg-transparent transition-all duration-300"
            style={{
              top: highlightRect.top - 8,
              left: highlightRect.left - 8,
              width: highlightRect.width + 16,
              height: highlightRect.height + 16,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
              borderRadius: '12px',
              border: '2px solid rgba(99, 102, 241, 0.8)',
            }}
          />
        )}
      </div>

      {/* Tooltip */}
      <div
        className="absolute w-[400px] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl transition-all duration-300 animate-fade-in"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-700 bg-gradient-to-r from-primary-500/20 to-transparent rounded-t-xl">
          <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-display font-bold text-white">{step.title}</h3>
          </div>
          <button
            onClick={handleSkip}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-slate-300 leading-relaxed">{step.content}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-700 bg-slate-800/50 rounded-b-xl">
          {/* Progress */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">
              {currentStep + 1} of {tourSteps.length}
            </span>
            <div className="flex gap-1">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-primary-500'
                      : index < currentStep
                      ? 'bg-primary-500/50'
                      : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 px-3 py-2 text-slate-300 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
            >
              {isLastStep ? "Let's Go!" : 'Next'}
              {!isLastStep && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Skip button */}
      {!isLastStep && (
        <button
          onClick={handleSkip}
          className="fixed bottom-6 right-6 px-4 py-2 text-slate-400 hover:text-white transition-colors"
        >
          Skip Tour
        </button>
      )}
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

