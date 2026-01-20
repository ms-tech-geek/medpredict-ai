import axios from 'axios';
import type { 
  DashboardSummary, 
  ExpiryRisk, 
  StockoutRisk, 
  AlertsResponse, 
  Medicine 
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

// Medicines
export const fetchMedicines = async (): Promise<Medicine[]> => {
  const response = await apiClient.get('/medicines');
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

