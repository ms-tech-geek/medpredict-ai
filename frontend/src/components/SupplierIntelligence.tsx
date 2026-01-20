import { useState } from 'react';
import {
  Truck,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Star,
  Package,
  Calendar,
  Zap,
  Target,
  BarChart3,
  CheckCircle,
  XCircle,
  ArrowRight,
  Building2,
  Phone,
  Mail,
  Timer,
  ShieldCheck,
  Activity,
  RefreshCw,
  Lightbulb,
  ArrowRightLeft,
  Pill,
  ChevronRight,
  Info,
  ThumbsUp,
  ThumbsDown,
  Scale,
  Sparkles,
  ExternalLink
} from 'lucide-react';

// Prediction factors with weights
interface PredictionFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  description: string;
  value: string;
}

// Alternative supplier with comparison
interface AlternativeSupplier {
  id: number;
  name: string;
  reliability_score: number;
  predicted_lead_time: number;
  price_difference: number; // percentage, negative means cheaper
  pros: string[];
  cons: string[];
  recommendation_strength: 'strong' | 'moderate' | 'weak';
  can_fulfill: boolean;
  stock_available: boolean;
}

// Alternative medicine
interface AlternativeMedicine {
  id: number;
  name: string;
  category: string;
  therapeutic_equivalent: boolean;
  price_per_unit: number;
  original_price: number;
  availability: 'in_stock' | 'low_stock' | 'orderable';
  supplier: string;
  lead_time: number;
  doctor_approval_required: boolean;
  notes: string;
}

// AI Recommendation
interface AIRecommendation {
  id: string;
  type: 'switch_supplier' | 'alternate_medicine' | 'split_order' | 'escalate' | 'wait';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  reasoning: string[];
  impact: {
    time_saved?: string;
    cost_impact?: string;
    risk_reduction?: string;
  };
  action_items: string[];
  confidence: number;
}

// Mock supplier intelligence data
const supplierData = [
  {
    id: 1,
    name: 'MedLife Distributors',
    contact: '9876543210',
    email: 'orders@medlife.com',
    avg_lead_time: 5,
    predicted_lead_time: 6,
    delay_probability: 0.15,
    rating: 4.5,
    on_time_rate: 0.85,
    total_orders: 156,
    pending_orders: 3,
    specialties: ['Antibiotics', 'Analgesics'],
    trend: 'stable',
    reliability_score: 87,
    last_delay_days: 2,
    price_competitiveness: 0.92,
    prediction_factors: [
      { factor: 'Historical On-Time Rate', impact: 'positive', weight: 85, description: '85% orders delivered on time in last 6 months', value: '85%' },
      { factor: 'Current Season', impact: 'negative', weight: 15, description: 'January has 10% higher delays historically', value: '+10% delay' },
      { factor: 'Pending Order Load', impact: 'neutral', weight: 60, description: '3 pending orders is within normal capacity', value: '3 orders' },
      { factor: 'Recent Performance', impact: 'positive', weight: 80, description: 'Last 5 orders delivered within expected time', value: '5/5 on-time' },
      { factor: 'Distance Factor', impact: 'neutral', weight: 50, description: 'Located 45km from facility', value: '45 km' },
    ] as PredictionFactor[],
    prediction_summary: 'Low delay risk. Strong historical performance with minor seasonal adjustment.',
    confidence_score: 0.89,
  },
  {
    id: 2,
    name: 'PharmaCare India',
    contact: '9876543211',
    email: 'supply@pharmacare.in',
    avg_lead_time: 7,
    predicted_lead_time: 9,
    delay_probability: 0.35,
    rating: 4.2,
    on_time_rate: 0.72,
    total_orders: 89,
    pending_orders: 5,
    specialties: ['Diabetes', 'Cardiac'],
    trend: 'declining',
    reliability_score: 72,
    last_delay_days: 5,
    price_competitiveness: 0.88,
    prediction_factors: [
      { factor: 'Historical On-Time Rate', impact: 'negative', weight: 72, description: 'Only 72% orders on time - below threshold', value: '72%' },
      { factor: 'Recent Delays', impact: 'negative', weight: 30, description: 'Last order delayed by 5 days', value: '5 days late' },
      { factor: 'High Order Backlog', impact: 'negative', weight: 25, description: '5 pending orders exceeds typical capacity of 3', value: '5 orders' },
      { factor: 'Warehouse Relocation', impact: 'negative', weight: 20, description: 'Currently relocating warehouse - temporary disruption', value: 'In progress' },
      { factor: 'Specialty Match', impact: 'positive', weight: 85, description: 'Strong expertise in cardiac medicines', value: 'Specialized' },
    ] as PredictionFactor[],
    prediction_summary: 'High delay risk due to recent performance issues and warehouse relocation. Consider backup supplier.',
    confidence_score: 0.82,
  },
  {
    id: 3,
    name: 'HealthFirst Supplies',
    contact: '9876543212',
    email: 'orders@healthfirst.com',
    avg_lead_time: 4,
    predicted_lead_time: 4,
    delay_probability: 0.08,
    rating: 4.7,
    on_time_rate: 0.94,
    total_orders: 203,
    pending_orders: 2,
    specialties: ['Vitamins', 'OTC'],
    trend: 'improving',
    reliability_score: 94,
    last_delay_days: 0,
    price_competitiveness: 0.85,
    prediction_factors: [
      { factor: 'Historical On-Time Rate', impact: 'positive', weight: 94, description: 'Excellent 94% on-time delivery rate', value: '94%' },
      { factor: 'Low Order Backlog', impact: 'positive', weight: 90, description: 'Only 2 pending orders - well within capacity', value: '2 orders' },
      { factor: 'Improving Trend', impact: 'positive', weight: 85, description: 'Performance improved 8% over last quarter', value: '+8%' },
      { factor: 'No Recent Delays', impact: 'positive', weight: 95, description: 'Zero delays in last 30 days', value: '0 delays' },
      { factor: 'Proximity', impact: 'positive', weight: 80, description: 'Located only 15km from facility', value: '15 km' },
    ] as PredictionFactor[],
    prediction_summary: 'Very low delay risk. Consistently excellent performance with improving trends.',
    confidence_score: 0.94,
  },
  {
    id: 4,
    name: 'Government Medical Store',
    contact: '9876543213',
    email: 'gms@gov.in',
    avg_lead_time: 14,
    predicted_lead_time: 18,
    delay_probability: 0.55,
    rating: 3.8,
    on_time_rate: 0.58,
    total_orders: 67,
    pending_orders: 8,
    specialties: ['Essential Medicines'],
    trend: 'declining',
    reliability_score: 58,
    last_delay_days: 12,
    price_competitiveness: 0.98,
    prediction_factors: [
      { factor: 'Historical On-Time Rate', impact: 'negative', weight: 58, description: 'Poor 58% on-time rate - systemic issues', value: '58%' },
      { factor: 'Bureaucratic Delays', impact: 'negative', weight: 20, description: 'Average 3-day approval process adds delays', value: '+3 days' },
      { factor: 'High Order Backlog', impact: 'negative', weight: 15, description: '8 pending orders - significantly overloaded', value: '8 orders' },
      { factor: 'Month-End Rush', impact: 'negative', weight: 25, description: 'January month-end typically sees 40% more delays', value: '+40%' },
      { factor: 'Recent Major Delay', impact: 'negative', weight: 10, description: 'Last order delayed by 12 days', value: '12 days late' },
      { factor: 'Best Pricing', impact: 'positive', weight: 98, description: 'Government rates are 20-30% lower', value: '-25% cost' },
    ] as PredictionFactor[],
    prediction_summary: 'Very high delay risk due to systemic issues, backlog, and recent poor performance. Use only for non-urgent orders.',
    confidence_score: 0.76,
  },
  {
    id: 5,
    name: 'Apollo Pharmacy Wholesale',
    contact: '9876543214',
    email: 'wholesale@apollo.com',
    avg_lead_time: 3,
    predicted_lead_time: 3,
    delay_probability: 0.05,
    rating: 4.8,
    on_time_rate: 0.96,
    total_orders: 312,
    pending_orders: 4,
    specialties: ['All Categories'],
    trend: 'improving',
    reliability_score: 96,
    last_delay_days: 0,
    price_competitiveness: 0.78,
    prediction_factors: [
      { factor: 'Historical On-Time Rate', impact: 'positive', weight: 96, description: 'Industry-leading 96% on-time delivery', value: '96%' },
      { factor: 'Large Capacity', impact: 'positive', weight: 90, description: 'Handles 300+ orders/month easily', value: '312 orders' },
      { factor: 'Advanced Logistics', impact: 'positive', weight: 95, description: 'GPS tracking, automated dispatch system', value: 'Automated' },
      { factor: 'No Recent Delays', impact: 'positive', weight: 100, description: 'Perfect record in last 60 days', value: '0 delays' },
      { factor: 'Multi-Warehouse', impact: 'positive', weight: 88, description: '3 warehouses ensure stock availability', value: '3 locations' },
    ] as PredictionFactor[],
    prediction_summary: 'Minimal delay risk. Best-in-class operations with advanced logistics. Ideal for urgent orders.',
    confidence_score: 0.96,
  },
];

// Pending orders with enhanced data
const pendingOrders = [
  {
    id: 'PO-2026-001',
    supplier: 'MedLife Distributors',
    supplier_id: 1,
    items: [
      { name: 'Paracetamol 500mg', qty: 500, unit_price: 2 },
      { name: 'Amoxicillin 250mg', qty: 200, unit_price: 8 },
    ],
    total_items: 12,
    value: 45000,
    ordered_date: '2026-01-15',
    expected_date: '2026-01-20',
    predicted_date: '2026-01-21',
    delay_risk: 'LOW',
    status: 'In Transit',
    delay_reasons: [
      { reason: 'Minor seasonal slowdown', impact: '+1 day', confidence: 85 },
    ],
    prediction_note: 'Slight delay expected due to January logistics volume. No action needed.',
    alternatives: null, // No alternatives needed for low risk
    recommendations: null,
  },
  {
    id: 'PO-2026-002',
    supplier: 'PharmaCare India',
    supplier_id: 2,
    items: [
      { name: 'Metformin 500mg', qty: 300, unit_price: 5 },
      { name: 'Atorvastatin 10mg', qty: 200, unit_price: 12 },
      { name: 'Amlodipine 5mg', qty: 250, unit_price: 6 },
    ],
    total_items: 8,
    value: 78000,
    ordered_date: '2026-01-12',
    expected_date: '2026-01-19',
    predicted_date: '2026-01-23',
    delay_risk: 'HIGH',
    status: 'Processing',
    delay_reasons: [
      { reason: 'Warehouse relocation in progress', impact: '+2 days', confidence: 78 },
      { reason: 'High order backlog (5 orders)', impact: '+1 day', confidence: 82 },
      { reason: 'Recent performance decline', impact: '+1 day', confidence: 75 },
    ],
    prediction_note: 'Multiple factors indicate significant delay. Consider contacting supplier for status update or switching to alternative.',
    alternatives: {
      suppliers: [
        {
          id: 5,
          name: 'Apollo Pharmacy Wholesale',
          reliability_score: 96,
          predicted_lead_time: 3,
          price_difference: +15,
          pros: ['96% on-time delivery', '3-day lead time vs 9 days', 'Full stock available', 'GPS tracking'],
          cons: ['15% higher cost (+₹11,700)', 'Need to place new order'],
          recommendation_strength: 'strong',
          can_fulfill: true,
          stock_available: true,
        },
        {
          id: 3,
          name: 'HealthFirst Supplies',
          reliability_score: 94,
          predicted_lead_time: 4,
          price_difference: +8,
          pros: ['94% on-time', '4-day lead time', 'Good cardiac inventory'],
          cons: ['8% higher cost (+₹6,240)', 'Partial stock (80% available)'],
          recommendation_strength: 'moderate',
          can_fulfill: true,
          stock_available: true,
        },
      ] as AlternativeSupplier[],
      medicines: [
        {
          id: 101,
          name: 'Glycomet 500mg',
          category: 'Diabetes',
          therapeutic_equivalent: true,
          price_per_unit: 4.5,
          original_price: 5,
          availability: 'in_stock',
          supplier: 'MedLife Distributors',
          lead_time: 5,
          doctor_approval_required: false,
          notes: 'Same active ingredient (Metformin). Bioequivalent. Can substitute directly.',
        },
        {
          id: 102,
          name: 'Lipitor 10mg',
          category: 'Cardiac',
          therapeutic_equivalent: true,
          price_per_unit: 15,
          original_price: 12,
          availability: 'in_stock',
          supplier: 'Apollo Pharmacy',
          lead_time: 3,
          doctor_approval_required: false,
          notes: 'Brand version of Atorvastatin. Same efficacy, slightly higher price.',
        },
      ] as AlternativeMedicine[],
    },
    recommendations: [
      {
        id: 'rec-001',
        type: 'switch_supplier',
        priority: 'high',
        title: 'Switch to Apollo Pharmacy for Urgent Items',
        description: 'Transfer critical cardiac medicines to Apollo for faster delivery',
        reasoning: [
          'PharmaCare showing 35% delay probability with 4-day predicted delay',
          'Apollo can deliver in 3 days with 96% reliability',
          'Cardiac patients cannot miss medication - health risk outweighs cost',
          'Apollo has confirmed stock availability for all items',
        ],
        impact: {
          time_saved: '6 days faster delivery',
          cost_impact: '+₹11,700 (15% premium)',
          risk_reduction: 'Delay risk drops from 35% to 5%',
        },
        action_items: [
          'Place new order with Apollo Pharmacy immediately',
          'Cancel or reduce PharmaCare order for overlapping items',
          'Track both orders until confirmed',
        ],
        confidence: 0.92,
      },
      {
        id: 'rec-002',
        type: 'split_order',
        priority: 'medium',
        title: 'Split Order Strategy',
        description: 'Order urgent items from Apollo, keep non-urgent with PharmaCare',
        reasoning: [
          'Metformin and Amlodipine are critical - daily usage medicines',
          'Some items can wait additional 4 days without patient impact',
          'Balances cost (partial premium) vs risk (partial mitigation)',
        ],
        impact: {
          time_saved: '4 days for critical items',
          cost_impact: '+₹6,500 (partial premium)',
          risk_reduction: 'Critical items risk drops to 5%',
        },
        action_items: [
          'Identify which items are critical (daily use) vs non-critical',
          'Order critical items from Apollo (50% of order)',
          'Keep non-critical items with PharmaCare',
        ],
        confidence: 0.85,
      },
      {
        id: 'rec-003',
        type: 'alternate_medicine',
        priority: 'medium',
        title: 'Use Therapeutic Equivalents',
        description: 'Substitute with bioequivalent medicines available from faster suppliers',
        reasoning: [
          'Glycomet (Metformin equivalent) available from MedLife with 5-day delivery',
          'Same active ingredient, same dosage, same efficacy',
          'No doctor approval required for bioequivalent substitution',
          'Actually 10% cheaper than original order',
        ],
        impact: {
          time_saved: '4 days faster than PharmaCare',
          cost_impact: '-₹450 (10% savings)',
          risk_reduction: 'Uses proven reliable supplier',
        },
        action_items: [
          'Confirm bioequivalent substitution policy at PHC',
          'Order Glycomet from MedLife instead of Metformin from PharmaCare',
          'Update patient records with equivalent medicine',
        ],
        confidence: 0.88,
      },
    ] as AIRecommendation[],
  },
  {
    id: 'PO-2026-003',
    supplier: 'Government Medical Store',
    supplier_id: 4,
    items: [
      { name: 'Insulin 40IU', qty: 100, unit_price: 250 },
      { name: 'ORS Packets', qty: 500, unit_price: 8 },
      { name: 'Iron + Folic Acid', qty: 1000, unit_price: 3 },
    ],
    total_items: 25,
    value: 120000,
    ordered_date: '2026-01-05',
    expected_date: '2026-01-19',
    predicted_date: '2026-01-28',
    delay_risk: 'CRITICAL',
    status: 'Delayed',
    delay_reasons: [
      { reason: 'Bureaucratic approval pending', impact: '+4 days', confidence: 88 },
      { reason: 'Month-end processing backlog', impact: '+3 days', confidence: 82 },
      { reason: '8 orders ahead in queue', impact: '+2 days', confidence: 90 },
      { reason: 'Previous order delayed 12 days', impact: 'Pattern', confidence: 85 },
    ],
    prediction_note: 'Critical delay expected. Recommend escalating to district health office or arranging backup from Apollo.',
    alternatives: {
      suppliers: [
        {
          id: 5,
          name: 'Apollo Pharmacy Wholesale',
          reliability_score: 96,
          predicted_lead_time: 3,
          price_difference: +22,
          pros: ['Can deliver in 3 days', '96% reliable', 'Insulin cold chain guaranteed', 'Express delivery available'],
          cons: ['22% cost increase (+₹26,400)', 'Need district approval for non-GMS purchase'],
          recommendation_strength: 'strong',
          can_fulfill: true,
          stock_available: true,
        },
        {
          id: 1,
          name: 'MedLife Distributors',
          reliability_score: 87,
          predicted_lead_time: 6,
          price_difference: +18,
          pros: ['Good reliability', 'Reasonable pricing', 'Has ORS and Iron tablets'],
          cons: ['No Insulin in stock', '18% higher than GMS'],
          recommendation_strength: 'moderate',
          can_fulfill: false,
          stock_available: false,
        },
      ] as AlternativeSupplier[],
      medicines: [
        {
          id: 201,
          name: 'Insulin Glargine 100IU',
          category: 'Diabetes',
          therapeutic_equivalent: false,
          price_per_unit: 450,
          original_price: 250,
          availability: 'in_stock',
          supplier: 'Apollo Pharmacy',
          lead_time: 2,
          doctor_approval_required: true,
          notes: 'Long-acting insulin. Requires doctor approval for substitution. Better glycemic control but higher cost.',
        },
        {
          id: 202,
          name: 'Electral Powder',
          category: 'ORS',
          therapeutic_equivalent: true,
          price_per_unit: 10,
          original_price: 8,
          availability: 'in_stock',
          supplier: 'HealthFirst Supplies',
          lead_time: 4,
          doctor_approval_required: false,
          notes: 'WHO-formula ORS. Exact equivalent, widely used brand.',
        },
      ] as AlternativeMedicine[],
    },
    recommendations: [
      {
        id: 'rec-101',
        type: 'escalate',
        priority: 'critical',
        title: 'Escalate to District Health Office',
        description: 'Request priority processing for critical medicines like Insulin',
        reasoning: [
          'Insulin is life-critical - diabetic patients cannot miss doses',
          'GMS delay of 9+ days puts patients at serious health risk',
          '55% delay probability is unacceptable for essential medicines',
          'District office can authorize emergency procurement or expedite GMS',
        ],
        impact: {
          time_saved: 'Could reduce delay by 5-7 days',
          cost_impact: 'No additional cost if GMS expedites',
          risk_reduction: 'Ensures insulin availability for patients',
        },
        action_items: [
          'Call District Health Officer today',
          'Send formal escalation letter citing patient risk',
          'Request either expedited GMS processing or emergency procurement authorization',
          'Document escalation for audit trail',
        ],
        confidence: 0.90,
      },
      {
        id: 'rec-102',
        type: 'switch_supplier',
        priority: 'critical',
        title: 'Emergency Insulin Procurement from Apollo',
        description: 'Do not wait for GMS - procure life-critical Insulin immediately',
        reasoning: [
          'Insulin stockout is a medical emergency',
          'Apollo can deliver in 3 days with cold chain intact',
          '9-day GMS delay is too risky for life-critical medicine',
          'Cost premium (22%) is justified for patient safety',
        ],
        impact: {
          time_saved: '9 days faster delivery',
          cost_impact: '+₹5,500 for Insulin portion only',
          risk_reduction: 'Eliminates stockout risk for diabetic patients',
        },
        action_items: [
          'Place emergency order with Apollo for Insulin only',
          'Keep ORS and Iron tablets with GMS order (non-critical)',
          'Apply for emergency fund reimbursement later',
          'Ensure cold chain logistics from Apollo',
        ],
        confidence: 0.95,
      },
      {
        id: 'rec-103',
        type: 'split_order',
        priority: 'high',
        title: 'Split: Critical Items Now, Rest from GMS',
        description: 'Hybrid approach - urgent items from private, routine from GMS',
        reasoning: [
          'Insulin = critical, needs immediate action',
          'ORS = important but 4-day buffer exists',
          'Iron tablets = routine, can wait for GMS',
          'Optimizes cost vs risk across all items',
        ],
        impact: {
          time_saved: 'Critical items: 9 days, Others: unchanged',
          cost_impact: '+₹7,200 (partial premium for critical items)',
          risk_reduction: 'Critical risk eliminated, routine items unchanged',
        },
        action_items: [
          'Order Insulin from Apollo (priority 1)',
          'Order ORS from HealthFirst if GMS delays further (priority 2)',
          'Keep Iron tablets with GMS (can wait)',
          'Monitor GMS order status daily',
        ],
        confidence: 0.91,
      },
    ] as AIRecommendation[],
  },
  {
    id: 'PO-2026-004',
    supplier: 'Apollo Pharmacy Wholesale',
    supplier_id: 5,
    items: [
      { name: 'Vitamin D3', qty: 200, unit_price: 25 },
      { name: 'Calcium + D3', qty: 300, unit_price: 18 },
    ],
    total_items: 15,
    value: 32000,
    ordered_date: '2026-01-18',
    expected_date: '2026-01-21',
    predicted_date: '2026-01-21',
    delay_risk: 'LOW',
    status: 'Shipped',
    delay_reasons: [],
    prediction_note: 'On track for on-time delivery. GPS tracking shows shipment in transit.',
    alternatives: null,
    recommendations: null,
  },
];

export function SupplierIntelligence() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<'overview' | 'orders' | 'analytics'>('orders');
  const [expandedRecommendation, setExpandedRecommendation] = useState<string | null>(null);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'CRITICAL': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'HIGH': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'LOW': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'switch_supplier': return <ArrowRightLeft className="w-4 h-4" />;
      case 'alternate_medicine': return <Pill className="w-4 h-4" />;
      case 'split_order': return <Scale className="w-4 h-4" />;
      case 'escalate': return <AlertTriangle className="w-4 h-4" />;
      case 'wait': return <Clock className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'critical': return { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400', icon: 'bg-red-500' };
      case 'high': return { bg: 'bg-orange-500/20', border: 'border-orange-500/30', text: 'text-orange-400', icon: 'bg-orange-500' };
      case 'medium': return { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400', icon: 'bg-yellow-500' };
      case 'low': return { bg: 'bg-slate-500/20', border: 'border-slate-500/30', text: 'text-slate-400', icon: 'bg-slate-500' };
      default: return { bg: 'bg-slate-500/20', border: 'border-slate-500/30', text: 'text-slate-400', icon: 'bg-slate-500' };
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  const selectedOrderData = pendingOrders.find(o => o.id === selectedOrder);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            Supply Chain Intelligence
          </h2>
          <p className="text-slate-400 mt-1">AI-powered delay predictions, alternatives & recommendations</p>
        </div>
        <div className="flex gap-2">
          {['orders', 'overview', 'analytics'].map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view as typeof activeView)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeView === view
                  ? 'bg-violet-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {view === 'orders' ? 'Orders & Delays' : view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {pendingOrders.some(o => o.delay_risk === 'CRITICAL') && (
        <div className="card p-4 bg-gradient-to-r from-red-500/20 via-red-500/10 to-red-500/20 border-red-500/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">Critical Delay Alert</h3>
              <p className="text-sm text-red-300">
                {pendingOrders.filter(o => o.delay_risk === 'CRITICAL').length} order(s) have critical delays affecting patient care. Immediate action required.
              </p>
            </div>
            <button 
              onClick={() => {
                const criticalOrder = pendingOrders.find(o => o.delay_risk === 'CRITICAL');
                if (criticalOrder) setSelectedOrder(criticalOrder.id);
              }}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
            >
              View & Resolve
            </button>
          </div>
        </div>
      )}

      {activeView === 'orders' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders List */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-violet-400" />
              Pending Orders
            </h3>
            {pendingOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                className={`card p-4 cursor-pointer transition-all ${
                  selectedOrder === order.id 
                    ? 'border-violet-500 ring-1 ring-violet-500/30' 
                    : 'hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-mono text-sm text-white">{order.id}</span>
                    <p className="text-sm text-slate-400 mt-0.5">{order.supplier}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(order.delay_risk)}`}>
                    {order.delay_risk}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-slate-500">Expected</p>
                    <p className="text-slate-300">{order.expected_date}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                  <div className="text-right">
                    <p className="text-slate-500">AI Predicted</p>
                    <p className={order.predicted_date !== order.expected_date ? 'text-amber-400 font-medium' : 'text-emerald-400'}>
                      {order.predicted_date}
                    </p>
                  </div>
                </div>

                {order.recommendations && order.recommendations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <div className="flex items-center gap-2 text-xs text-violet-400">
                      <Sparkles className="w-3 h-3" />
                      {order.recommendations.length} AI recommendation{order.recommendations.length > 1 ? 's' : ''} available
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Order Details & Recommendations */}
          <div className="lg:col-span-2">
            {selectedOrderData ? (
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{selectedOrderData.id}</h3>
                      <p className="text-slate-400">{selectedOrderData.supplier}</p>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getRiskColor(selectedOrderData.delay_risk)}`}>
                      {selectedOrderData.delay_risk} DELAY RISK
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4">
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Order Items</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedOrderData.items.map((item, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-slate-800 rounded-lg text-sm text-slate-300">
                          {item.name} × {item.qty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Delay Factors */}
                  {selectedOrderData.delay_reasons.length > 0 && (
                    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-4 h-4 text-violet-400" />
                        <h4 className="text-sm font-semibold text-white">Why AI Predicts Delay</h4>
                      </div>
                      <div className="space-y-2">
                        {selectedOrderData.delay_reasons.map((reason, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-slate-900/50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-amber-400" />
                              <span className="text-sm text-slate-300">{reason.reason}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium text-amber-400">{reason.impact}</span>
                              <div className="flex items-center gap-1">
                                <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                  <div className="h-full bg-violet-500 rounded-full" style={{ width: `${reason.confidence}%` }} />
                                </div>
                                <span className="text-xs text-slate-500">{reason.confidence}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Recommendations */}
                {selectedOrderData.recommendations && selectedOrderData.recommendations.length > 0 && (
                  <div className="card p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                        <Lightbulb className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">AI Recommendations</h3>
                        <p className="text-xs text-slate-400">Click to expand and see detailed reasoning</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {selectedOrderData.recommendations.map((rec) => {
                        const config = getPriorityConfig(rec.priority);
                        const isExpanded = expandedRecommendation === rec.id;
                        
                        return (
                          <div 
                            key={rec.id}
                            className={`rounded-xl border ${config.border} ${config.bg} overflow-hidden`}
                          >
                            <div 
                              className="p-4 cursor-pointer"
                              onClick={() => setExpandedRecommendation(isExpanded ? null : rec.id)}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-lg ${config.icon} flex items-center justify-center flex-shrink-0`}>
                                  {getRecommendationIcon(rec.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${config.bg} ${config.text} border ${config.border}`}>
                                      {rec.priority.toUpperCase()}
                                    </span>
                                    <span className="text-xs text-slate-500">{rec.type.replace('_', ' ')}</span>
                                    <span className="text-xs text-slate-500">• {Math.round(rec.confidence * 100)}% confident</span>
                                  </div>
                                  <h4 className="text-white font-medium">{rec.title}</h4>
                                  <p className="text-sm text-slate-400 mt-1">{rec.description}</p>
                                </div>
                                <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                              </div>

                              {/* Impact Summary */}
                              <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-slate-700/50">
                                {rec.impact.time_saved && (
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-emerald-400" />
                                    <span className="text-sm text-emerald-400">{rec.impact.time_saved}</span>
                                  </div>
                                )}
                                {rec.impact.cost_impact && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-300">{rec.impact.cost_impact}</span>
                                  </div>
                                )}
                                {rec.impact.risk_reduction && (
                                  <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                                    <span className="text-sm text-blue-400">{rec.impact.risk_reduction}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Expanded Details */}
                            {isExpanded && (
                              <div className="px-4 pb-4 space-y-4">
                                {/* Reasoning */}
                                <div className="p-4 bg-slate-900/50 rounded-lg">
                                  <h5 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                    <Info className="w-4 h-4 text-violet-400" />
                                    AI Reasoning
                                  </h5>
                                  <ul className="space-y-2">
                                    {rec.reasoning.map((reason, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                                        <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                                        {reason}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Action Items */}
                                <div className="p-4 bg-violet-500/10 border border-violet-500/30 rounded-lg">
                                  <h5 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                    <Target className="w-4 h-4 text-violet-400" />
                                    Recommended Actions
                                  </h5>
                                  <ol className="space-y-2">
                                    {rec.action_items.map((action, idx) => (
                                      <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                                        <span className="w-5 h-5 rounded-full bg-violet-500 text-white text-xs flex items-center justify-center flex-shrink-0">
                                          {idx + 1}
                                        </span>
                                        {action}
                                      </li>
                                    ))}
                                  </ol>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                  <button className="flex-1 py-2.5 bg-violet-500 hover:bg-violet-600 text-white text-sm rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                                    <ThumbsUp className="w-4 h-4" />
                                    Apply This Recommendation
                                  </button>
                                  <button className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors">
                                    <ThumbsDown className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Alternative Suppliers */}
                {selectedOrderData.alternatives?.suppliers && (
                  <div className="card p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <ArrowRightLeft className="w-5 h-5 text-violet-400" />
                      <h3 className="text-lg font-semibold text-white">Alternative Suppliers</h3>
                    </div>

                    <div className="space-y-3">
                      {selectedOrderData.alternatives.suppliers.map((supplier) => (
                        <div 
                          key={supplier.id}
                          className={`p-4 rounded-xl border ${
                            supplier.recommendation_strength === 'strong' 
                              ? 'bg-emerald-500/10 border-emerald-500/30' 
                              : 'bg-slate-800/50 border-slate-700'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-slate-300" />
                              </div>
                              <div>
                                <h4 className="font-medium text-white">{supplier.name}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className={`text-xs ${supplier.reliability_score >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {supplier.reliability_score}% reliable
                                  </span>
                                  <span className="text-slate-500">•</span>
                                  <span className="text-xs text-slate-400">{supplier.predicted_lead_time} day delivery</span>
                                </div>
                              </div>
                            </div>
                            {supplier.recommendation_strength === 'strong' && (
                              <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                                <Star className="w-3 h-3" /> RECOMMENDED
                              </span>
                            )}
                          </div>

                          <div className="grid md:grid-cols-2 gap-3 mb-3">
                            <div>
                              <p className="text-xs text-emerald-400 mb-1">✓ Advantages</p>
                              <ul className="space-y-1">
                                {supplier.pros.map((pro, idx) => (
                                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-1">
                                    <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                                    {pro}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-xs text-red-400 mb-1">✗ Considerations</p>
                              <ul className="space-y-1">
                                {supplier.cons.map((con, idx) => (
                                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-1">
                                    <XCircle className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5" />
                                    {con}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                            <div className="flex items-center gap-4 text-sm">
                              <span className={supplier.price_difference > 0 ? 'text-red-400' : 'text-emerald-400'}>
                                {supplier.price_difference > 0 ? '+' : ''}{supplier.price_difference}% cost
                              </span>
                              {supplier.stock_available ? (
                                <span className="text-emerald-400 flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" /> Stock available
                                </span>
                              ) : (
                                <span className="text-amber-400 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" /> Limited stock
                                </span>
                              )}
                            </div>
                            <button className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm rounded-lg font-medium transition-colors">
                              Switch to This Supplier
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Alternative Medicines */}
                {selectedOrderData.alternatives?.medicines && (
                  <div className="card p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Pill className="w-5 h-5 text-violet-400" />
                      <h3 className="text-lg font-semibold text-white">Alternative Medicines</h3>
                      <span className="text-xs text-slate-400 ml-2">(Therapeutic equivalents)</span>
                    </div>

                    <div className="space-y-3">
                      {selectedOrderData.alternatives.medicines.map((medicine) => (
                        <div 
                          key={medicine.id}
                          className="p-4 bg-slate-800/50 rounded-xl border border-slate-700"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-white">{medicine.name}</h4>
                                {medicine.therapeutic_equivalent && (
                                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                                    Bioequivalent
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-slate-400 mt-0.5">{medicine.category}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-white">₹{medicine.price_per_unit}/unit</p>
                              {medicine.price_per_unit !== medicine.original_price && (
                                <p className={`text-xs ${medicine.price_per_unit < medicine.original_price ? 'text-emerald-400' : 'text-amber-400'}`}>
                                  {medicine.price_per_unit < medicine.original_price ? 'Save' : 'Extra'} ₹{Math.abs(medicine.price_per_unit - medicine.original_price)}/unit
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="p-3 bg-slate-900/50 rounded-lg mb-3">
                            <p className="text-sm text-slate-300">{medicine.notes}</p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-slate-400">From: {medicine.supplier}</span>
                              <span className="text-slate-400">{medicine.lead_time} day delivery</span>
                              {medicine.doctor_approval_required && (
                                <span className="text-amber-400 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" /> Doctor approval required
                                </span>
                              )}
                            </div>
                            <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors">
                              Use Alternative
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No recommendations for low-risk orders */}
                {!selectedOrderData.recommendations && selectedOrderData.delay_risk === 'LOW' && (
                  <div className="card p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">On Track</h3>
                    <p className="text-slate-400">
                      This order has low delay risk. No alternatives or actions needed at this time.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="card p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Select an Order</h3>
                <p className="text-slate-400">
                  Click on any order from the left panel to see delay analysis, alternatives, and AI recommendations.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeView === 'overview' && (
        <>
          {/* Supplier Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {supplierData.map((supplier) => (
              <div
                key={supplier.id}
                className={`card p-4 cursor-pointer transition-all hover:border-violet-500/50 ${
                  selectedSupplier === supplier.id ? 'border-violet-500 ring-1 ring-violet-500/30' : ''
                }`}
                onClick={() => setSelectedSupplier(selectedSupplier === supplier.id ? null : supplier.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-slate-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{supplier.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs text-slate-400">{supplier.rating}</span>
                        </div>
                        {getTrendIcon(supplier.trend)}
                      </div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    supplier.reliability_score >= 90 ? 'bg-emerald-500/20 text-emerald-400' :
                    supplier.reliability_score >= 70 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {supplier.reliability_score}% reliable
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-800/50 rounded-lg p-2">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                      <Clock className="w-3 h-3" />
                      Avg Lead Time
                    </div>
                    <p className="text-lg font-semibold text-white">{supplier.avg_lead_time} days</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-2">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                      <Timer className="w-3 h-3" />
                      AI Predicted
                    </div>
                    <p className={`text-lg font-semibold ${
                      supplier.predicted_lead_time > supplier.avg_lead_time ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {supplier.predicted_lead_time} days
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Delay Probability</span>
                    <span className={supplier.delay_probability > 0.3 ? 'text-red-400' : 'text-emerald-400'}>
                      {(supplier.delay_probability * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        supplier.delay_probability > 0.3 ? 'bg-red-500' :
                        supplier.delay_probability > 0.15 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${supplier.delay_probability * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800">
                  <span>{supplier.on_time_rate * 100}% on-time</span>
                  <span>{supplier.pending_orders} pending</span>
                  <span>{supplier.total_orders} total</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeView === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Supplier Performance Comparison */}
          <div className="card p-5">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-violet-400" />
              Supplier Reliability Ranking
            </h3>
            <div className="space-y-4">
              {supplierData.sort((a, b) => b.reliability_score - a.reliability_score).map((supplier, idx) => (
                <div key={supplier.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        idx === 0 ? 'bg-yellow-500 text-black' :
                        idx === 1 ? 'bg-slate-300 text-black' :
                        idx === 2 ? 'bg-amber-700 text-white' :
                        'bg-slate-700 text-slate-300'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="text-sm text-slate-300">{supplier.name}</span>
                    </div>
                    <span className="text-sm font-medium text-white">{supplier.reliability_score}%</span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        supplier.reliability_score >= 90 ? 'bg-emerald-500' :
                        supplier.reliability_score >= 70 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${supplier.reliability_score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Prediction Accuracy */}
          <div className="card p-5">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-violet-400" />
              AI Prediction Accuracy
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-1">94%</div>
                <div className="text-xs text-slate-400">Delivery Date Accuracy</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">89%</div>
                <div className="text-xs text-slate-400">Delay Risk Accuracy</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-amber-400 mb-1">3.2</div>
                <div className="text-xs text-slate-400">Avg Days Saved</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-violet-400 mb-1">₹2.4L</div>
                <div className="text-xs text-slate-400">Cost Savings (YTD)</div>
              </div>
            </div>
          </div>

          {/* Seasonal Patterns */}
          <div className="card p-5">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-violet-400" />
              Seasonal Delivery Patterns
            </h3>
            <div className="space-y-3">
              {[
                { month: 'Monsoon (Jul-Sep)', delay: '+40%', risk: 'HIGH', tip: 'Order 2 weeks early' },
                { month: 'Festival (Oct-Nov)', delay: '+25%', risk: 'MEDIUM', tip: 'Order 1 week early' },
                { month: 'Winter (Dec-Feb)', delay: '+10%', risk: 'LOW', tip: 'Normal lead times' },
                { month: 'Summer (Mar-Jun)', delay: '+5%', risk: 'LOW', tip: 'Best delivery period' },
              ].map((season, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">{season.month}</p>
                    <p className="text-xs text-slate-400">{season.tip}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      season.risk === 'HIGH' ? 'text-red-400' :
                      season.risk === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {season.delay} delay
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Best For Scenarios */}
          <div className="card p-5">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-violet-400" />
              Best Supplier For Each Scenario
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-white">Urgent Orders (Need it FAST)</p>
                    <p className="text-xs text-slate-400">Apollo Pharmacy (3-day delivery, 96% reliable)</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <Scale className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-white">Best Balance (Speed + Cost)</p>
                    <p className="text-xs text-slate-400">HealthFirst Supplies (4 days, 94% reliable, fair price)</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-white">Lowest Cost (Can Wait)</p>
                    <p className="text-xs text-slate-400">Govt Medical Store (14+ days, 25% cheaper)</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-violet-500/10 border border-violet-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <Pill className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-white">Specialty Medicines</p>
                    <p className="text-xs text-slate-400">PharmaCare (Diabetes/Cardiac specialist)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
