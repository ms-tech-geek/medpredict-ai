export interface ExpiryRisk {
  medicine_id: number;
  medicine_name: string;
  batch_no: string;
  current_quantity: number;
  expiry_date: string;
  days_to_expiry: number;
  predicted_consumption: number;
  quantity_at_risk: number;
  risk_score: number;
  risk_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  recommendation: string;
  potential_loss: number;
}

export interface StockoutRisk {
  medicine_id: number;
  medicine_name: string;
  current_stock: number;
  avg_daily_consumption: number;
  predicted_weekly_consumption: number;
  days_until_stockout: number;
  risk_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  recommended_order: number;
  recommendation: string;
}

export interface DashboardSummary {
  total_medicines: number;
  total_batches: number;
  total_inventory_value: number;
  health_score: number;
  critical_expiry_count: number;
  high_expiry_count: number;
  total_at_risk_value: number;
  critical_stockout_count: number;
  high_stockout_count: number;
}

export interface Alert {
  type: 'EXPIRY' | 'STOCKOUT';
  severity: 'CRITICAL' | 'HIGH';
  medicine: string;
  batch: string | null;
  message: string;
  potential_loss: number | null;
  recommendation: string;
}

export interface AlertsResponse {
  total_alerts: number;
  critical_count: number;
  high_count: number;
  alerts: Alert[];
}

export interface Medicine {
  medicine_id: number;
  medicine_name: string;
  category: string;
  quantity: number;
  avg_daily: number;
  avg_weekly: number;
  unit_cost_inr?: number;
  days_of_stock?: number;
  stock_value?: number;
  risk_level?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'ALL';

// Medicine Detail
export interface Batch {
  medicine_id: number;
  medicine_name: string;
  category: string;
  batch_no: string;
  quantity: number;
  unit: string;
  expiry_date: string;
  received_date: string;
  unit_cost_inr: number;
  total_value_inr: number;
  days_to_expiry?: number;
  risk_level?: string;
}

export interface ConsumptionRecord {
  date: string;
  medicine_id: number;
  quantity_dispensed: number;
  patient_count: number;
}

export interface MedicineDetail {
  medicine: {
    medicine_id: number;
    name: string;
    category: string;
    unit: string;
    reorder_level: number;
    shelf_life_days: number;
    unit_cost_inr: number;
  };
  total_stock: number;
  total_value: number;
  batch_count: number;
  batches: Batch[];
  consumption_stats: {
    medicine_id: number;
    avg_daily: number;
    std_daily: number;
    total_90d: number;
    days_with_data: number;
    avg_weekly: number;
    seasonal_avg: number;
    seasonal_factor: number;
  };
  consumption_history: ConsumptionRecord[];
  expiry_risks: {
    batch_no: string;
    days_to_expiry: number;
    quantity_at_risk: number;
    risk_level: string;
    potential_loss: number;
  }[];
  stockout_risk: {
    days_until_stockout: number | null;
    risk_level: string;
    recommended_order: number;
  };
}

// Inventory
export interface InventoryResponse {
  total_batches: number;
  total_value: number;
  batches: Batch[];
}

// Consumption Trends
export interface DailyTrend {
  date: string;
  quantity_dispensed: number;
  patient_count: number;
}

export interface WeeklyTrend {
  week: string;
  quantity_dispensed: number;
  patient_count: number;
}

export interface ConsumptionTrends {
  daily: DailyTrend[];
  weekly: WeeklyTrend[];
  summary: {
    total_dispensed: number;
    total_patients: number;
    avg_daily_dispensed: number;
    avg_daily_patients: number;
  };
}

// Categories
export interface Category {
  category: string;
  medicine_count: number;
  total_stock: number;
  total_value: number;
}

// Recommendations
export interface Recommendation {
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'EXPIRY' | 'STOCKOUT' | 'SEASONAL';
  title: string;
  description: string;
  actions: string[];
  affected_items: {
    name: string;
    batch?: string;
    days?: number;
    loss?: number;
    order_qty?: number;
  }[];
}

export interface RecommendationsResponse {
  total_recommendations: number;
  recommendations: Recommendation[];
}

