import { useEffect, useState } from 'react';

interface HealthGaugeProps {
  score: number;
}

export function HealthGauge({ score }: HealthGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const getStatus = () => {
    if (score >= 80) return { label: 'Excellent', color: '#10b981', bgColor: 'from-emerald-500/20 to-emerald-500/5' };
    if (score >= 60) return { label: 'Good', color: '#3b82f6', bgColor: 'from-blue-500/20 to-blue-500/5' };
    if (score >= 40) return { label: 'Needs Attention', color: '#f59e0b', bgColor: 'from-amber-500/20 to-amber-500/5' };
    return { label: 'Critical', color: '#dc2626', bgColor: 'from-red-500/20 to-red-500/5' };
  };

  const status = getStatus();
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className={`card bg-gradient-to-br ${status.bgColor} animate-fade-in`}>
      <h3 className="text-sm font-semibold text-slate-400 mb-4">Inventory Health</h3>
      
      <div className="flex items-center justify-center">
        <div className="relative">
          <svg width="180" height="180" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="90"
              cy="90"
              r="70"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              className="text-slate-800"
            />
            {/* Progress circle */}
            <circle
              cx="90"
              cy="90"
              r="70"
              fill="none"
              stroke={status.color}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
              style={{
                filter: `drop-shadow(0 0 8px ${status.color}50)`,
              }}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span 
              className="text-4xl font-display font-bold transition-all duration-500"
              style={{ color: status.color }}
            >
              {animatedScore}
            </span>
            <span className="text-sm text-slate-400 font-medium">/ 100</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <span 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
          style={{ 
            backgroundColor: `${status.color}20`,
            color: status.color,
          }}
        >
          <span 
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: status.color }}
          />
          {status.label}
        </span>
      </div>
    </div>
  );
}

