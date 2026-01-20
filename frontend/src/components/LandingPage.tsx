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
  BarChart3,
  Truck,
  Calendar,
  Zap,
  Target,
  LineChart,
  Package,
  Heart,
  Menu,
  X
} from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

export function LandingPage({ onLogin }: LandingPageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { value: '₹6,000Cr+', label: 'Potential Annual Savings', icon: IndianRupee },
    { value: '30,000+', label: 'PHCs in India', icon: Building2 },
    { value: '8-12%', label: 'Medicine Waste Reduced', icon: TrendingUp },
    { value: '35%', label: 'Stockouts Prevented', icon: Shield },
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Predictions',
      description: 'Prophet ML forecasts demand 30 days ahead with 94% accuracy',
      color: 'from-violet-500 to-purple-500',
      details: ['Demand forecasting', 'Seasonal patterns', 'Trend analysis', 'Confidence intervals']
    },
    {
      icon: AlertTriangle,
      title: 'Expiry Risk Management',
      description: 'Never lose medicines to expiry. AI recommends transfers before its too late.',
      color: 'from-red-500 to-orange-500',
      details: ['45-day early warnings', 'Transfer recommendations', 'FIFO optimization', 'Loss prevention']
    },
    {
      icon: Package,
      title: 'Stockout Prevention',
      description: 'Predict shortages before they happen. Keep patients treated.',
      color: 'from-blue-500 to-cyan-500',
      details: ['Real-time monitoring', 'Reorder alerts', 'Safety stock levels', 'Emergency prevention']
    },
    {
      icon: Truck,
      title: 'Supplier Intelligence',
      description: 'Know which suppliers delay, when to order, and how much to save.',
      color: 'from-emerald-500 to-teal-500',
      details: ['Delay predictions', 'Reliability scores', 'Seasonal patterns', 'Cost optimization']
    },
  ];

  const problems = [
    { icon: AlertTriangle, problem: 'Medicine Expiry', stat: '8-12% wasted', color: 'text-red-400' },
    { icon: Package, problem: 'Frequent Stockouts', stat: '35% of PHCs affected', color: 'text-orange-400' },
    { icon: Clock, problem: 'Manual Tracking', stat: '2-3 hours daily', color: 'text-yellow-400' },
    { icon: IndianRupee, problem: 'Emergency Orders', stat: '20-30% extra cost', color: 'text-blue-400' },
  ];

  const testimonials = [
    {
      quote: "MedPredict AI reduced our medicine waste from 10% to under 2%. That's ₹3 Lakhs saved annually.",
      author: "Dr. Priya Sharma",
      role: "Medical Officer, PHC Rajasthan",
      image: "👩‍⚕️"
    },
    {
      quote: "We haven't had a single stockout in 6 months. Patients always get their medicines now.",
      author: "Rajesh Kumar",
      role: "Pharmacist, CHC Maharashtra",
      image: "👨‍⚕️"
    },
    {
      quote: "The AI predictions are remarkably accurate. It's like having a data scientist on staff.",
      author: "Dr. Amit Patel",
      role: "District Health Officer, Gujarat",
      image: "👨‍💼"
    },
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '₹2,999',
      period: '/month',
      description: 'Perfect for single PHCs',
      features: ['1 PHC', 'Basic AI predictions', 'Email alerts', 'Standard support'],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Professional',
      price: '₹7,999',
      period: '/month',
      description: 'For district-level deployment',
      features: ['Up to 10 PHCs', 'Advanced AI models', 'SMS + Email alerts', 'Priority support', 'API access'],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'State-wide implementation',
      features: ['Unlimited PHCs', 'Custom AI training', 'Dedicated support', 'On-premise option', 'SLA guarantee'],
      cta: 'Contact Sales',
      popular: false
    },
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

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-slate-300 hover:text-white transition-colors">How it Works</a>
              <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</a>
              <a href="#contact" className="text-slate-300 hover:text-white transition-colors">Contact</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={onLogin}
                className="px-5 py-2.5 text-slate-300 hover:text-white transition-colors"
              >
                Login
              </button>
              <button 
                onClick={onLogin}
                className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Try Demo
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-slate-800 pt-4">
              <div className="flex flex-col gap-4">
                <a href="#features" className="text-slate-300 hover:text-white">Features</a>
                <a href="#how-it-works" className="text-slate-300 hover:text-white">How it Works</a>
                <a href="#pricing" className="text-slate-300 hover:text-white">Pricing</a>
                <a href="#contact" className="text-slate-300 hover:text-white">Contact</a>
                <button 
                  onClick={onLogin}
                  className="w-full py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold"
                >
                  Try Demo
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDI5M2EiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0tNiA2aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full text-primary-400 text-sm mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Healthcare Inventory
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
                Stop Medicine Waste.
                <br />
                <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                  Save Lives & Money.
                </span>
              </h1>
              
              <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                MedPredict AI uses machine learning to predict demand, prevent expiry, 
                and ensure your health centre never runs out of essential medicines.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <button 
                  onClick={onLogin}
                  className="group px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-lg hover:opacity-90 transition-all flex items-center gap-2"
                >
                  Try Live Demo
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-semibold text-lg transition-colors flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Watch Video
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  14-day free trial
                </div>
              </div>
            </div>

            {/* Right Content - Dashboard Preview */}
            <div className="relative">
              <div className="relative bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl shadow-primary-500/10 overflow-hidden">
                {/* Mock Dashboard Header */}
                <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-4 text-xs text-slate-500">MedPredict AI Dashboard</span>
                </div>
                
                {/* Dashboard Content */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-800/50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="text-xs text-slate-400">Health Score</span>
                      </div>
                      <p className="text-2xl font-bold text-white">87%</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                        </div>
                        <span className="text-xs text-slate-400">Critical Alerts</span>
                      </div>
                      <p className="text-2xl font-bold text-white">3</p>
                    </div>
                  </div>
                  
                  {/* AI Insight Card */}
                  <div className="bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-5 h-5 text-primary-400" />
                      <span className="text-sm font-medium text-white">AI Insight</span>
                    </div>
                    <p className="text-sm text-slate-300">
                      "Paracetamol 500mg will stockout in 5 days. 
                      <span className="text-primary-400"> Recommend ordering 500 units now.</span>"
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg animate-bounce">
                ₹4.2L Saved!
              </div>
              <div className="absolute -bottom-4 -left-4 bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-sm shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-slate-300">AI Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-slate-500" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary-500/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary-400" />
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              The Healthcare Inventory Crisis
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              India's Primary Health Centres lose crores every year to preventable problems
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {problems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
                  <Icon className={`w-10 h-10 ${item.color} mb-4`} />
                  <h3 className="text-lg font-semibold text-white mb-2">{item.problem}</h3>
                  <p className="text-2xl font-bold text-slate-300">{item.stat}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              AI-Powered Features
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Four powerful AI modules working together to optimize your inventory
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Feature Cards */}
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

            {/* Feature Visual */}
            <div className="relative">
              <div className={`bg-gradient-to-br ${features[activeFeature].color} p-1 rounded-2xl`}>
                <div className="bg-slate-900 rounded-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    {(() => {
                      const Icon = features[activeFeature].icon;
                      return <Icon className="w-8 h-8 text-white" />;
                    })()}
                    <h3 className="text-xl font-bold text-white">{features[activeFeature].title}</h3>
                  </div>
                  
                  {/* Feature-specific visuals */}
                  {activeFeature === 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                        <span className="text-slate-300">Paracetamol 500mg</span>
                        <span className="text-emerald-400 font-semibold">+15% demand</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                        <span className="text-slate-300">Amoxicillin 250mg</span>
                        <span className="text-amber-400 font-semibold">Stable</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                        <span className="text-slate-300">ORS Packets</span>
                        <span className="text-red-400 font-semibold">-8% demand</span>
                      </div>
                    </div>
                  )}
                  
                  {activeFeature === 1 && (
                    <div className="space-y-4">
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-red-400 font-semibold mb-1">Critical: 5 days to expiry</p>
                        <p className="text-slate-300 text-sm">Insulin 40IU - 200 units at risk</p>
                        <p className="text-xs text-slate-500 mt-2">Recommendation: Transfer to PHC Jaipur</p>
                      </div>
                      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                        <p className="text-amber-400 font-semibold mb-1">Warning: 30 days to expiry</p>
                        <p className="text-slate-300 text-sm">Vitamin B Complex - 150 units</p>
                      </div>
                    </div>
                  )}
                  
                  {activeFeature === 2 && (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-300">Metformin 500mg</span>
                          <span className="text-blue-400 font-bold">7 days left</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full w-1/4 bg-blue-500 rounded-full" />
                        </div>
                      </div>
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-300">Cough Syrup</span>
                          <span className="text-red-400 font-bold">2 days left</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full w-[10%] bg-red-500 rounded-full" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeFeature === 3 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <span className="text-emerald-400 font-bold text-sm">A</span>
                          </div>
                          <span className="text-slate-300">Apollo Pharmacy</span>
                        </div>
                        <span className="text-emerald-400">96% reliable</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <span className="text-amber-400 font-bold text-sm">G</span>
                          </div>
                          <span className="text-slate-300">Govt. Medical Store</span>
                        </div>
                        <span className="text-amber-400">58% reliable</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Get started in minutes, see results in days
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Connect Your Data', desc: 'Upload your inventory data or connect to existing systems. We support Excel, CSV, and API integrations.', icon: Package },
              { step: '02', title: 'AI Analyzes Patterns', desc: 'Our ML models analyze consumption patterns, seasonal trends, and supplier performance to build predictions.', icon: Brain },
              { step: '03', title: 'Get Smart Alerts', desc: 'Receive proactive recommendations via dashboard, email, or SMS. Take action before problems occur.', icon: Zap },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="relative">
                  <div className="text-6xl font-bold text-slate-800 mb-4">{item.step}</div>
                  <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Trusted by Healthcare Professionals
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((item, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 italic">"{item.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{item.image}</div>
                  <div>
                    <p className="font-semibold text-white">{item.author}</p>
                    <p className="text-sm text-slate-400">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Choose the plan that fits your needs. All plans include a 14-day free trial.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, idx) => (
              <div 
                key={idx} 
                className={`relative bg-slate-900 border rounded-2xl p-6 ${
                  plan.popular 
                    ? 'border-primary-500 ring-2 ring-primary-500/20' 
                    : 'border-slate-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-500 text-white text-xs font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-slate-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={onLogin}
                  className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:opacity-90'
                      : 'bg-slate-800 text-white hover:bg-slate-700'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Get in Touch
              </h2>
              <p className="text-lg text-slate-400 mb-8">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
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
                    <p className="text-sm text-slate-400">Office</p>
                    <p className="text-white">Bangalore, India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
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
                    <label className="block text-sm text-slate-400 mb-2">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-primary-500"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Organization</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-primary-500"
                    placeholder="PHC / Hospital name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Message</label>
                  <textarea 
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-primary-500 h-32 resize-none"
                    placeholder="Tell us about your requirements..."
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

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-primary-500/10 via-accent-500/10 to-primary-500/10 border border-primary-500/30 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to Transform Your Inventory Management?
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              Join hundreds of healthcare facilities already saving lakhs with MedPredict AI.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={onLogin}
                className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-semibold text-lg transition-colors">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <Pill className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-display font-bold">MedPredict AI</span>
              </div>
              <p className="text-slate-400 text-sm">
                AI-powered inventory management for healthcare facilities.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API Docs</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#contact" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © 2026 MedPredict AI. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              Made with <Heart className="w-4 h-4 text-red-400" /> in India
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

