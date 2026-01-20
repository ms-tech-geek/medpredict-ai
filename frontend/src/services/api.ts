import axios from 'axios';
import type { 
  DashboardSummary, 
  ExpiryRisk, 
  StockoutRisk, 
  AlertsResponse, 
  Medicine,
  MedicineDetail,
  InventoryResponse,
  ConsumptionTrends,
  Category,
  RecommendationsResponse
} from '../types';

// API Gateway URL (Node.js)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dashboard
export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await apiClient.get('/dashboard/summary');
  return response.data;
};

// Expiry Risks
export const fetchExpiryRisks = async (
  riskLevel?: string,
  limit: number = 50
): Promise<ExpiryRisk[]> => {
  const params = new URLSearchParams();
  if (riskLevel && riskLevel !== 'ALL') {
    params.append('risk_level', riskLevel);
  }
  params.append('limit', limit.toString());
  
  const response = await apiClient.get(`/expiry-risks?${params}`);
  return response.data;
};

// Stockout Risks
export const fetchStockoutRisks = async (
  riskLevel?: string,
  limit: number = 50
): Promise<StockoutRisk[]> => {
  const params = new URLSearchParams();
  if (riskLevel && riskLevel !== 'ALL') {
    params.append('risk_level', riskLevel);
  }
  params.append('limit', limit.toString());
  
  const response = await apiClient.get(`/stockout-risks?${params}`);
  return response.data;
};

// Alerts
export const fetchAlerts = async (): Promise<AlertsResponse> => {
  const response = await apiClient.get('/alerts');
  return response.data;
};

// Medicines - List with search & filter
export interface MedicineSearchParams {
  search?: string;
  category?: string;
  sortBy?: 'name' | 'stock' | 'consumption' | 'risk';
  limit?: number;
}

export const fetchMedicines = async (params?: MedicineSearchParams): Promise<Medicine[]> => {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.append('search', params.search);
  if (params?.category) searchParams.append('category', params.category);
  if (params?.sortBy) searchParams.append('sort_by', params.sortBy);
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  
  const response = await apiClient.get(`/medicines?${searchParams}`);
  return response.data;
};

// Medicine Detail
export const fetchMedicineDetail = async (medicineId: number): Promise<MedicineDetail> => {
  const response = await apiClient.get(`/medicines/${medicineId}`);
  return response.data;
};

// Inventory
export interface InventoryParams {
  category?: string;
  riskLevel?: string;
  expiringWithinDays?: number;
}

export const fetchInventory = async (params?: InventoryParams): Promise<InventoryResponse> => {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.append('category', params.category);
  if (params?.riskLevel) searchParams.append('risk_level', params.riskLevel);
  if (params?.expiringWithinDays) searchParams.append('expiring_within_days', params.expiringWithinDays.toString());
  
  const response = await apiClient.get(`/inventory?${searchParams}`);
  return response.data;
};

// Consumption Trends
export interface TrendsParams {
  medicineId?: number;
  category?: string;
  days?: number;
}

export const fetchConsumptionTrends = async (params?: TrendsParams): Promise<ConsumptionTrends> => {
  const searchParams = new URLSearchParams();
  if (params?.medicineId) searchParams.append('medicine_id', params.medicineId.toString());
  if (params?.category) searchParams.append('category', params.category);
  if (params?.days) searchParams.append('days', params.days.toString());
  
  const response = await apiClient.get(`/consumption/trends?${searchParams}`);
  return response.data;
};

// Categories
export const fetchCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get('/categories');
  return response.data;
};

// Recommendations
export const fetchRecommendations = async (): Promise<RecommendationsResponse> => {
  const response = await apiClient.get('/recommendations');
  return response.data;
};

// Health Check
export const checkHealth = async (): Promise<{ status: string; message: string; data_loaded: boolean }> => {
  const response = await apiClient.get('/health');
  return response.data;
};

// Reload Data
export const reloadData = async (): Promise<{ status: string; message: string }> => {
  const response = await apiClient.post('/reload-data');
  return response.data;
};

