import { useState, useEffect } from 'react';
import {
  Pill,
  Brain,
  TrendingUp,
  Shield,
  Clock,
  IndianRupee,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Users,
  Building2,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  Sparkles,
  Truck,
  Zap,
  Package,
  Heart,
  Menu,
  X,
  Stethoscope,
  ClipboardList,
  UserCheck,
  Activity,
  Target,
  TrendingDown,
  Calendar,
  ShoppingCart,
  FileText,
  BarChart3,
  Lightbulb
} from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

export function LandingPage({ onLogin }: LandingPageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [activePersona, setActivePersona] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // User personas - WHO uses this product
  const personas = [
    {
      id: 'pharmacist',
      title: 'PHC Pharmacist',
      subtitle: 'Day-to-day inventory manager',
      icon: Pill,
      color: 'from-blue-500 to-cyan-500',
      image: '👨‍⚕️',
      description: 'Manages 100-500 medicines daily at Primary Health Centres',
      painPoints: [
        'Spends 2-3 hours daily on manual stock counting',
        'Medicines expire before being used',
        'Patients leave without treatment due to stockouts',
        'No way to predict what will run out'
      ],
      howWeHelp: [
        'Automated inventory tracking saves 2+ hours daily',
        'Get alerts 45 days before expiry',
        'AI predicts stockouts 7-30 days in advance',
        'One dashboard shows everything at a glance'
      ],
      quote: '"I used to spend my mornings counting pills. Now I spend it helping patients."',
      impact: '2+ hours saved daily'
    },
    {
      id: 'medical-officer',
      title: 'Medical Officer',
      subtitle: 'PHC/CHC facility head',
      icon: Stethoscope,
      color: 'from-emerald-500 to-teal-500',
      image: '👩‍⚕️',
      description: 'Oversees healthcare delivery and ensures medicine availability',
      painPoints: [
        'Patients complain about medicine unavailability',
        'No visibility into what\'s expiring or running low',
        'Reactive instead of proactive management',
        'Budget wasted on expired medicines'
      ],
      howWeHelp: [
        'Real-time health score for inventory status',
        'Smart recommendations prioritize urgent actions',
        'Proactive alerts before problems occur',
        'Reduce medicine waste by up to 80%'
      ],
      quote: '"Now I know exactly what needs attention before patients even arrive."',
      impact: '80% less medicine waste'
    },
    {
      id: 'district-officer',
      title: 'District Health Officer',
      subtitle: 'Manages multiple facilities',
      icon: Building2,
      color: 'from-violet-500 to-purple-500',
      image: '👨‍💼',
      description: 'Oversees 50-100 PHCs across a district',
      painPoints: [
        'No centralized view of all facility inventories',
        'Problems discovered only during inspections',
        'Can\'t compare performance across PHCs',
        'Procurement planning is guesswork'
      ],
      howWeHelp: [
        'District-wide dashboard with all PHCs',
        'Automated alerts for any facility issues',
        'Performance benchmarking across facilities',
        'Data-driven procurement planning'
      ],
      quote: '"I can now see which PHC needs help before they even call me."',
      impact: 'Manage 100 PHCs from one screen'
    },
    {
      id: 'store-manager',
      title: 'Drug Store Manager',
      subtitle: 'District/State warehouse',
      icon: Package,
      color: 'from-amber-500 to-orange-500',
      image: '📦',
      description: 'Manages central drug store supplying multiple facilities',
      painPoints: [
        'Difficult to forecast demand from all facilities',
        'Medicines expire in warehouse before distribution',
        'Emergency requests disrupt planning',
        'Supplier delays cause cascading stockouts'
      ],
      howWeHelp: [
        'Aggregate demand forecasts from all facilities',
        'Optimize distribution to prevent expiry',
        'Predict and prevent emergency situations',
        'Supplier delay predictions for better planning'
      ],
      quote: '"AI tells me exactly what each facility will need next month."',
      impact: '₹5-10 Lakhs saved annually'
    }
  ];

  const problems = [
    { 
      icon: AlertTriangle, 
      problem: 'Medicine Expiry Waste', 
      stat: '₹500+ Crores/year', 
      description: '8-12% of medicines expire unused in Indian PHCs annually',
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30'
    },
    { 
      icon: TrendingDown, 
      problem: 'Frequent Stockouts', 
      stat: '35% PHCs affected', 
      description: 'Patients go home without treatment because medicines ran out',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30'
    },
    { 
      icon: Clock, 
      problem: 'Manual Tracking', 
      stat: '2-3 hours/day wasted', 
      description: 'Staff spend hours on paper registers instead of patient care',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30'
    },
    { 
      icon: ShoppingCart, 
      problem: 'Emergency Orders', 
      stat: '20-30% extra cost', 
      description: 'Last-minute purchases cost more and take longer',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI Demand Forecasting',
      description: 'Prophet ML predicts medicine demand 30 days ahead with 94% accuracy',
      color: 'from-violet-500 to-purple-500',
      details: ['30-day predictions', 'Seasonal patterns', 'Trend detection', '94% accuracy']
    },
    {
      icon: AlertTriangle,
      title: 'Expiry Prevention',
      description: 'Get alerts 45 days before expiry. AI recommends transfers to prevent waste.',
      color: 'from-red-500 to-orange-500',
      details: ['45-day early warnings', 'Transfer recommendations', 'FIFO optimization', '80% waste reduction']
    },
    {
      icon: Package,
      title: 'Stockout Prevention',
      description: 'Never run out of essential medicines. AI predicts shortages before they happen.',
      color: 'from-blue-500 to-cyan-500',
      details: ['7-day advance warning', 'Reorder recommendations', 'Safety stock alerts', 'Zero stockouts']
    },
    {
      icon: Truck,
      title: 'Supplier Intelligence',
      description: 'Know which suppliers delay, predict delivery dates, plan orders smartly.',
      color: 'from-emerald-500 to-teal-500',
      details: ['Delay predictions', 'Reliability scores', 'Optimal timing', 'Cost savings']
    },
  ];

  const dayInLife = [
    { time: '8:00 AM', without: 'Start counting inventory manually', with: 'Dashboard shows everything at a glance' },
    { time: '9:00 AM', without: 'Discover insulin expired yesterday', with: 'Got alert 45 days ago, transferred in time' },
    { time: '11:00 AM', without: 'Patient needs ORS but it\'s out of stock', with: 'AI predicted stockout, ordered last week' },
    { time: '2:00 PM', without: 'Panic order to supplier at premium price', with: 'Regular order placed based on AI forecast' },
    { time: '4:00 PM', without: 'Update paper registers for an hour', with: 'All data automatically tracked' },
    { time: '5:00 PM', without: 'Worry about what might expire tomorrow', with: 'Sleep well - AI is monitoring 24/7' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-900/95 backdrop-blur-xl border-b border-slate-800' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Pill className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold">MedPredict AI</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#who-its-for" className="text-slate-300 hover:text-white transition-colors">Who It's For</a>
              <a href="#problem" className="text-slate-300 hover:text-white transition-colors">The Problem</a>
              <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
              <a href="#contact" className="text-slate-300 hover:text-white transition-colors">Contact</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={onLogin}
                className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Try Live Demo
              </button>
            </div>

            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-slate-800 pt-4">
              <div className="flex flex-col gap-4">
                <a href="#who-its-for" className="text-slate-300 hover:text-white">Who It's For</a>
                <a href="#problem" className="text-slate-300 hover:text-white">The Problem</a>
                <a href="#features" className="text-slate-300 hover:text-white">Features</a>
                <a href="#contact" className="text-slate-300 hover:text-white">Contact</a>
                <button 
                  onClick={onLogin}
                  className="w-full py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold"
                >
                  Try Live Demo
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full text-primary-400 text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              Built for India's 30,000+ Primary Health Centres
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
              AI-Powered Medicine
              <br />
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                Inventory Management
              </span>
            </h1>
            
            <p className="text-xl text-slate-400 mb-8 leading-relaxed max-w-2xl mx-auto">
              Helping <strong className="text-white">PHC pharmacists</strong>, <strong className="text-white">medical officers</strong>, and <strong className="text-white">district health teams</strong> prevent medicine waste, avoid stockouts, and save hours of manual work every day.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button 
                onClick={onLogin}
                className="group px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-lg hover:opacity-90 transition-all flex items-center gap-2"
              >
                See It In Action
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a 
                href="#who-its-for"
                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-semibold text-lg transition-colors flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                Who Is This For?
              </a>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { icon: Clock, value: '2+ hrs', label: 'Saved daily' },
                { icon: TrendingDown, value: '80%', label: 'Less waste' },
                { icon: Shield, value: '0', label: 'Stockouts' },
                { icon: Brain, value: '94%', label: 'AI accuracy' },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
                    <Icon className="w-5 h-5 text-primary-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-slate-400">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-slate-500" />
        </div>
      </section>

      {/* WHO IS THIS FOR - Primary Section */}
      <section id="who-its-for" className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Who Is MedPredict AI For?
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              We built this for the healthcare workers who keep India healthy
            </p>
          </div>

          {/* Persona Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {personas.map((persona, idx) => {
              const Icon = persona.icon;
              return (
                <button
                  key={persona.id}
                  onClick={() => setActivePersona(idx)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                    activePersona === idx
                      ? `bg-gradient-to-r ${persona.color} text-white shadow-lg`
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {persona.title}
                </button>
              );
            })}
          </div>

          {/* Active Persona Detail */}
          {personas.map((persona, idx) => {
            if (idx !== activePersona) return null;
            const Icon = persona.icon;
            return (
              <div key={persona.id} className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Left - Persona Info */}
                <div className={`bg-gradient-to-br ${persona.color} p-1 rounded-2xl`}>
                  <div className="bg-slate-900 rounded-xl p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-5xl">{persona.image}</div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{persona.title}</h3>
                        <p className="text-slate-400">{persona.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-slate-300 mb-6">{persona.description}</p>
                    
                    <blockquote className="border-l-4 border-primary-500 pl-4 py-2 bg-slate-800/50 rounded-r-lg mb-6">
                      <p className="text-slate-300 italic">{persona.quote}</p>
                    </blockquote>

                    <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                      <div>
                        <p className="text-sm text-emerald-400">Key Impact</p>
                        <p className="text-xl font-bold text-white">{persona.impact}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right - Pain Points vs Solution */}
                <div className="space-y-6">
                  {/* Pain Points */}
                  <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Current Challenges
                    </h4>
                    <ul className="space-y-3">
                      {persona.painPoints.map((point, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-3">
                          <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-300">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Solution */}
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      How MedPredict AI Helps
                    </h4>
                    <ul className="space-y-3">
                      {persona.howWeHelp.map((point, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-300">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* USER JOURNEY Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Your Journey With MedPredict AI
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              From chaos to control in just 4 steps
            </p>
          </div>

          {/* Journey Steps */}
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-24 left-[12.5%] right-[12.5%] h-1 bg-gradient-to-r from-red-500 via-amber-500 via-blue-500 to-emerald-500 rounded-full" />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Step 1: Current State */}
              <div className="relative">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-red-500/50 transition-colors h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-red-400 font-bold text-lg relative z-10">
                      1
                    </div>
                    <div>
                      <p className="text-xs text-red-400 uppercase tracking-wider">Starting Point</p>
                      <h3 className="text-lg font-semibold text-white">The Struggle</h3>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span>Manual paper registers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-red-400" />
                      <span>Hours wasted counting stock</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-red-400" />
                      <span>Medicines expiring unused</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-red-400" />
                      <span>Patients without medicine</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-red-500/10 rounded-lg">
                    <p className="text-xs text-red-300 italic">"We never know what's running out until it's too late"</p>
                  </div>
                </div>
              </div>

              {/* Step 2: Discovery */}
              <div className="relative">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/50 transition-colors h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-400 font-bold text-lg relative z-10">
                      2
                    </div>
                    <div>
                      <p className="text-xs text-amber-400 uppercase tracking-wider">Day 1</p>
                      <h3 className="text-lg font-semibold text-white">Quick Setup</h3>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span>Upload existing data (Excel/CSV)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>AI analyzes patterns instantly</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-amber-400" />
                      <span>See your first dashboard</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-400" />
                      <span>Get immediate insights</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-amber-500/10 rounded-lg">
                    <p className="text-xs text-amber-300">⏱️ Setup time: <strong>Under 30 minutes</strong></p>
                  </div>
                </div>
              </div>

              {/* Step 3: Using */}
              <div className="relative">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-colors h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center text-blue-400 font-bold text-lg relative z-10">
                      3
                    </div>
                    <div>
                      <p className="text-xs text-blue-400 uppercase tracking-wider">Week 1-4</p>
                      <h3 className="text-lg font-semibold text-white">Daily Use</h3>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-blue-400" />
                      <span>Check dashboard each morning</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-blue-400" />
                      <span>Act on AI recommendations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-blue-400" />
                      <span>Reorder before stockouts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span>Transfer expiring items</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-500/10 rounded-lg">
                    <p className="text-xs text-blue-300">📊 Daily check: <strong>5 minutes</strong></p>
                  </div>
                </div>
              </div>

              {/* Step 4: Results */}
              <div className="relative">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/50 transition-colors h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 font-bold text-lg relative z-10">
                      4
                    </div>
                    <div>
                      <p className="text-xs text-emerald-400 uppercase tracking-wider">Month 1+</p>
                      <h3 className="text-lg font-semibold text-white">The Results</h3>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <span><strong className="text-emerald-400">2+ hours</strong> saved daily</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-emerald-400" />
                      <span><strong className="text-emerald-400">80%</strong> less medicine waste</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      <span><strong className="text-emerald-400">Zero</strong> stockouts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-emerald-400" />
                      <span><strong className="text-emerald-400">Happy</strong> patients</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-emerald-500/10 rounded-lg">
                    <p className="text-xs text-emerald-300 italic">"I finally go home without worrying about tomorrow"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Journey Visual Summary */}
          <div className="mt-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              {/* Before */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Before</h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>😰 Stressful mornings</li>
                  <li>📋 Paper chaos</li>
                  <li>💸 Wasted medicines</li>
                  <li>😔 Unhappy patients</li>
                </ul>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex flex-col items-center">
                <div className="flex items-center gap-4">
                  <div className="h-px w-12 bg-gradient-to-r from-red-500 to-amber-500" />
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  <div className="h-px w-12 bg-gradient-to-r from-amber-500 to-emerald-500" />
                </div>
                <p className="text-sm text-slate-400 mt-3">MedPredict AI</p>
              </div>

              {/* After */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">After</h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>😊 Confident mornings</li>
                  <li>📱 One dashboard</li>
                  <li>💰 Money saved</li>
                  <li>🎉 Treated patients</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM Section */}
      <section id="problem" className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              The Healthcare Inventory Crisis
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              India's PHCs face preventable problems that hurt patients and waste resources
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {problems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className={`${item.bgColor} border ${item.borderColor} rounded-2xl p-6 hover:scale-105 transition-transform`}>
                  <Icon className={`w-10 h-10 ${item.color} mb-4`} />
                  <h3 className="text-lg font-semibold text-white mb-2">{item.problem}</h3>
                  <p className="text-2xl font-bold text-white mb-2">{item.stat}</p>
                  <p className="text-sm text-slate-400">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* A Day In The Life Comparison */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              A Day in the Life of a PHC Pharmacist
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              See the difference MedPredict AI makes
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Without AI */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl overflow-hidden">
              <div className="bg-red-500/10 px-6 py-4 border-b border-red-500/20">
                <h3 className="text-lg font-semibold text-red-400 flex items-center gap-2">
                  <X className="w-5 h-5" />
                  Without MedPredict AI
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {dayInLife.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="text-sm font-mono text-slate-500 w-20 flex-shrink-0">{item.time}</div>
                    <div className="flex-1 text-slate-300">{item.without}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* With AI */}
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl overflow-hidden">
              <div className="bg-emerald-500/10 px-6 py-4 border-b border-emerald-500/20">
                <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  With MedPredict AI
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {dayInLife.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="text-sm font-mono text-slate-500 w-20 flex-shrink-0">{item.time}</div>
                    <div className="flex-1 text-emerald-300">{item.with}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              How Our AI Helps You
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Four powerful AI modules working together
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                const isActive = activeFeature === idx;
                return (
                  <div
                    key={idx}
                    className={`p-6 rounded-2xl cursor-pointer transition-all ${
                      isActive 
                        ? 'bg-slate-800 border border-slate-700' 
                        : 'hover:bg-slate-800/50'
                    }`}
                    onClick={() => setActiveFeature(idx)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
                        <p className="text-slate-400 text-sm">{feature.description}</p>
                        
                        {isActive && (
                          <div className="mt-4 grid grid-cols-2 gap-2">
                            {feature.details.map((detail, dIdx) => (
                              <div key={dIdx} className="flex items-center gap-2 text-sm text-slate-300">
                                <CheckCircle className="w-3 h-3 text-emerald-400" />
                                {detail}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="relative">
              <div className={`bg-gradient-to-br ${features[activeFeature].color} p-1 rounded-2xl`}>
                <div className="bg-slate-900 rounded-xl p-8 min-h-[400px] flex flex-col justify-center">
                  {activeFeature === 0 && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white mb-4">Demand Forecast Example</h4>
                      {['Paracetamol 500mg', 'Amoxicillin 250mg', 'ORS Packets'].map((med, i) => (
                        <div key={i} className="p-4 bg-slate-800/50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white">{med}</span>
                            <span className={i === 0 ? 'text-emerald-400' : i === 1 ? 'text-slate-400' : 'text-red-400'}>
                              {i === 0 ? '+15% demand ↑' : i === 1 ? 'Stable →' : '-8% demand ↓'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            Predicted need: {i === 0 ? '450' : i === 1 ? '200' : '120'} units next 30 days
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  {activeFeature === 1 && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white mb-4">Expiry Alerts</h4>
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <div className="flex items-center gap-2 text-red-400 font-semibold mb-2">
                          <AlertTriangle className="w-4 h-4" />
                          CRITICAL - 5 days to expiry
                        </div>
                        <p className="text-white">Insulin 40IU - 200 units</p>
                        <p className="text-sm text-slate-400 mt-2">
                          💡 Recommendation: Transfer to PHC Jaipur (higher consumption)
                        </p>
                      </div>
                      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                        <div className="flex items-center gap-2 text-amber-400 font-semibold mb-2">
                          <Clock className="w-4 h-4" />
                          WARNING - 30 days to expiry
                        </div>
                        <p className="text-white">Vitamin B Complex - 150 units</p>
                        <p className="text-sm text-slate-400 mt-2">
                          💡 Recommendation: Prioritize dispensing (FIFO)
                        </p>
                      </div>
                    </div>
                  )}
                  {activeFeature === 2 && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white mb-4">Stockout Prevention</h4>
                      {['Metformin 500mg', 'Cough Syrup', 'Bandages'].map((med, i) => (
                        <div key={i} className={`p-4 rounded-lg ${
                          i === 0 ? 'bg-amber-500/10 border border-amber-500/30' :
                          i === 1 ? 'bg-red-500/10 border border-red-500/30' :
                          'bg-emerald-500/10 border border-emerald-500/30'
                        }`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white">{med}</span>
                            <span className={
                              i === 0 ? 'text-amber-400' : i === 1 ? 'text-red-400' : 'text-emerald-400'
                            }>
                              {i === 0 ? '7 days left' : i === 1 ? '2 days left!' : '30+ days'}
                            </span>
                          </div>
                          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${
                              i === 0 ? 'bg-amber-500 w-1/4' : i === 1 ? 'bg-red-500 w-[10%]' : 'bg-emerald-500 w-3/4'
                            }`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {activeFeature === 3 && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white mb-4">Supplier Intelligence</h4>
                      {[
                        { name: 'Apollo Pharmacy', score: 96, status: 'Excellent' },
                        { name: 'MedLife Distributors', score: 85, status: 'Good' },
                        { name: 'Govt. Medical Store', score: 58, status: 'Risky' },
                      ].map((supplier, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                          <div>
                            <p className="text-white font-medium">{supplier.name}</p>
                            <p className="text-xs text-slate-400">
                              {i === 2 ? 'Avg delay: 4 days' : 'Usually on time'}
                            </p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            i === 0 ? 'bg-emerald-500/20 text-emerald-400' :
                            i === 1 ? 'bg-amber-500/20 text-amber-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {supplier.score}% reliable
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-primary-500/10 via-accent-500/10 to-primary-500/10 border border-primary-500/30 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to See It In Action?
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              Explore our live demo with real data and AI predictions
            </p>
            <button 
              onClick={onLogin}
              className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
            >
              Try Live Demo
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-sm text-slate-500 mt-4">No login required • Interactive dashboard</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Interested in MedPredict AI?
              </h2>
              <p className="text-lg text-slate-400 mb-8">
                Whether you're a PHC pharmacist, district health officer, or healthcare administrator, we'd love to show you how MedPredict AI can help.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Email</p>
                    <p className="text-white">hello@medpredict.ai</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Phone</p>
                    <p className="text-white">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Location</p>
                    <p className="text-white">Bangalore, India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Send us a message</h3>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-primary-500"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Role</label>
                    <select className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-primary-500">
                      <option>PHC Pharmacist</option>
                      <option>Medical Officer</option>
                      <option>District Health Officer</option>
                      <option>Drug Store Manager</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-primary-500"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Message</label>
                  <textarea 
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-primary-500 h-32 resize-none"
                    placeholder="Tell us about your facility and challenges..."
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Pill className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold">MedPredict AI</span>
            </div>
            <p className="text-slate-500 text-sm">
              © 2026 MedPredict AI. Built with <Heart className="w-4 h-4 text-red-400 inline" /> for India's healthcare workers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
