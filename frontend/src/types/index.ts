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
}

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'ALL';

