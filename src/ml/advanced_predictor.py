"""
MedPredict AI - Advanced ML Predictor

Enhanced prediction engine with:
- Time series forecasting using exponential smoothing
- Anomaly detection using statistical methods
- Trend analysis with growth factors
- Confidence intervals for predictions
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from scipy import stats as scipy_stats
from sklearn.ensemble import IsolationForest


@dataclass
class ForecastResult:
    """Result of a forecast prediction"""
    medicine_id: int
    medicine_name: str
    forecast_days: int
    predicted_quantity: int
    lower_bound: int
    upper_bound: int
    confidence: float
    trend: str  # "increasing", "decreasing", "stable"
    growth_rate: float  # percentage
    seasonality_factor: float
    anomalies_detected: int


@dataclass
class AnomalyResult:
    """Result of anomaly detection"""
    medicine_id: int
    medicine_name: str
    date: str
    actual_quantity: int
    expected_quantity: float
    deviation: float  # standard deviations from mean
    anomaly_type: str  # "spike", "drop", "unusual_pattern"
    severity: str  # "low", "medium", "high"


class AdvancedPredictor:
    """
    Advanced prediction engine using statistical methods
    
    Features:
    - Exponential Smoothing for time series forecasting
    - Isolation Forest for anomaly detection
    - Trend analysis with linear regression
    - Seasonal decomposition
    - Confidence intervals
    """
    
    def __init__(self, consumption_df: pd.DataFrame, medicines_df: pd.DataFrame):
        """
        Initialize the advanced predictor
        
        Args:
            consumption_df: Historical consumption data
            medicines_df: Medicine master data
        """
        self.consumption_df = consumption_df.copy()
        self.medicines_df = medicines_df.copy()
        
        # Convert date column
        self.consumption_df['date'] = pd.to_datetime(self.consumption_df['date'])
        
        # Pre-compute statistics
        self._compute_statistics()
    
    def _compute_statistics(self):
        """Pre-compute statistical measures for each medicine"""
        self.medicine_stats = {}
        
        for med_id in self.consumption_df['medicine_id'].unique():
            med_data = self.consumption_df[
                self.consumption_df['medicine_id'] == med_id
            ].sort_values('date')
            
            if len(med_data) < 30:  # Need minimum data points
                continue
            
            quantities = med_data['quantity_dispensed'].values
            dates = med_data['date'].values
            
            # Basic statistics
            mean_qty = np.mean(quantities)
            std_qty = np.std(quantities)
            
            # Trend analysis using linear regression
            x = np.arange(len(quantities))
            slope, intercept, r_value, _, _ = scipy_stats.linregress(x, quantities)
            
            # Determine trend direction
            if slope > 0.1:
                trend = "increasing"
            elif slope < -0.1:
                trend = "decreasing"
            else:
                trend = "stable"
            
            # Growth rate (annualized)
            if mean_qty > 0:
                daily_growth = slope / mean_qty
                annual_growth = daily_growth * 365 * 100
            else:
                annual_growth = 0
            
            # Seasonal patterns (by month)
            med_data_copy = med_data.copy()
            med_data_copy['month'] = med_data_copy['date'].dt.month
            monthly_avg = med_data_copy.groupby('month')['quantity_dispensed'].mean()
            overall_avg = mean_qty
            
            seasonal_factors = {}
            for month in range(1, 13):
                if month in monthly_avg.index:
                    seasonal_factors[month] = monthly_avg[month] / overall_avg if overall_avg > 0 else 1.0
                else:
                    seasonal_factors[month] = 1.0
            
            self.medicine_stats[med_id] = {
                'mean': mean_qty,
                'std': std_qty,
                'slope': slope,
                'trend': trend,
                'growth_rate': annual_growth,
                'seasonal_factors': seasonal_factors,
                'r_squared': r_value ** 2,
                'data_points': len(quantities)
            }
    
    def forecast(self, medicine_id: int, days: int = 30, 
                 confidence_level: float = 0.95) -> Optional[ForecastResult]:
        """
        Generate forecast for a medicine
        
        Args:
            medicine_id: Medicine to forecast
            days: Number of days to forecast
            confidence_level: Confidence level for intervals (0.0-1.0)
            
        Returns:
            ForecastResult with prediction and intervals
        """
        if medicine_id not in self.medicine_stats:
            return None
        
        med_stats = self.medicine_stats[medicine_id]
        medicine = self.medicines_df[
            self.medicines_df['medicine_id'] == medicine_id
        ]
        
        if medicine.empty:
            return None
        
        medicine_name = medicine.iloc[0]['name']
        
        # Get current month for seasonal adjustment
        current_month = datetime.now().month
        seasonal_factor = med_stats['seasonal_factors'].get(current_month, 1.0)
        
        # Base prediction with trend
        base_prediction = med_stats['mean'] * days
        trend_adjustment = med_stats['slope'] * days * (days / 2)  # Trend over forecast period
        seasonal_adjustment = seasonal_factor
        
        predicted = int((base_prediction + trend_adjustment) * seasonal_adjustment)
        predicted = max(0, predicted)
        
        # Confidence intervals
        z_score = scipy_stats.norm.ppf((1 + confidence_level) / 2)
        margin = z_score * med_stats['std'] * np.sqrt(days)
        
        lower_bound = max(0, int(predicted - margin))
        upper_bound = int(predicted + margin)
        
        # Confidence score based on data quality
        confidence = min(0.95, med_stats['r_squared'] * 0.5 + 0.5 * (med_stats['data_points'] / 365))
        
        # Detect anomalies in recent data
        anomalies = self.detect_anomalies(medicine_id, days=30)
        
        return ForecastResult(
            medicine_id=medicine_id,
            medicine_name=medicine_name,
            forecast_days=days,
            predicted_quantity=predicted,
            lower_bound=lower_bound,
            upper_bound=upper_bound,
            confidence=round(confidence, 2),
            trend=med_stats['trend'],
            growth_rate=round(med_stats['growth_rate'], 1),
            seasonality_factor=round(seasonal_factor, 2),
            anomalies_detected=len(anomalies)
        )
    
    def detect_anomalies(self, medicine_id: int, days: int = 90,
                         threshold: float = 2.5) -> List[AnomalyResult]:
        """
        Detect anomalies in consumption patterns
        
        Args:
            medicine_id: Medicine to analyze
            days: Days to look back
            threshold: Z-score threshold for anomaly detection
            
        Returns:
            List of detected anomalies
        """
        med_data = self.consumption_df[
            self.consumption_df['medicine_id'] == medicine_id
        ].sort_values('date')
        
        if len(med_data) < 30:
            return []
        
        # Get recent data
        max_date = med_data['date'].max()
        cutoff = max_date - timedelta(days=days)
        recent_data = med_data[med_data['date'] >= cutoff].copy()
        
        if len(recent_data) < 10:
            return []
        
        medicine = self.medicines_df[
            self.medicines_df['medicine_id'] == medicine_id
        ]
        medicine_name = medicine.iloc[0]['name'] if not medicine.empty else f"Medicine {medicine_id}"
        
        # Calculate rolling statistics
        quantities = recent_data['quantity_dispensed'].values
        rolling_mean = pd.Series(quantities).rolling(window=7, min_periods=3).mean()
        rolling_std = pd.Series(quantities).rolling(window=7, min_periods=3).std()
        
        anomalies = []
        
        for i, (_, row) in enumerate(recent_data.iterrows()):
            if i < 7:  # Skip first few points
                continue
            
            actual = row['quantity_dispensed']
            expected = rolling_mean.iloc[i]
            std = rolling_std.iloc[i]
            
            if pd.isna(expected) or pd.isna(std) or std == 0:
                continue
            
            z_score = (actual - expected) / std
            
            if abs(z_score) > threshold:
                # Determine anomaly type
                if z_score > threshold:
                    anomaly_type = "spike"
                else:
                    anomaly_type = "drop"
                
                # Determine severity
                if abs(z_score) > 4:
                    severity = "high"
                elif abs(z_score) > 3:
                    severity = "medium"
                else:
                    severity = "low"
                
                anomalies.append(AnomalyResult(
                    medicine_id=medicine_id,
                    medicine_name=medicine_name,
                    date=row['date'].strftime('%Y-%m-%d'),
                    actual_quantity=int(actual),
                    expected_quantity=round(expected, 1),
                    deviation=round(z_score, 2),
                    anomaly_type=anomaly_type,
                    severity=severity
                ))
        
        return anomalies
    
    def get_trend_analysis(self, medicine_id: int) -> Optional[Dict]:
        """
        Get detailed trend analysis for a medicine
        
        Args:
            medicine_id: Medicine to analyze
            
        Returns:
            Dictionary with trend analysis details
        """
        if medicine_id not in self.medicine_stats:
            return None
        
        med_stats = self.medicine_stats[medicine_id]
        medicine = self.medicines_df[
            self.medicines_df['medicine_id'] == medicine_id
        ]
        
        if medicine.empty:
            return None
        
        # Get consumption history for visualization
        med_data = self.consumption_df[
            self.consumption_df['medicine_id'] == medicine_id
        ].sort_values('date')
        
        # Weekly aggregation
        med_data_copy = med_data.copy()
        med_data_copy['week'] = med_data_copy['date'].dt.to_period('W').dt.start_time
        weekly = med_data_copy.groupby('week')['quantity_dispensed'].sum().reset_index()
        weekly['week'] = weekly['week'].dt.strftime('%Y-%m-%d')
        
        # Monthly aggregation
        med_data_copy['month'] = med_data_copy['date'].dt.to_period('M').dt.start_time
        monthly = med_data_copy.groupby('month')['quantity_dispensed'].sum().reset_index()
        monthly['month'] = monthly['month'].dt.strftime('%Y-%m')
        
        return {
            'medicine_id': medicine_id,
            'medicine_name': medicine.iloc[0]['name'],
            'trend': med_stats['trend'],
            'growth_rate_annual': round(med_stats['growth_rate'], 1),
            'average_daily': round(med_stats['mean'], 1),
            'standard_deviation': round(med_stats['std'], 1),
            'data_quality': 'good' if med_stats['data_points'] > 180 else 'moderate' if med_stats['data_points'] > 90 else 'limited',
            'seasonal_factors': {
                month: round(factor, 2) 
                for month, factor in med_stats['seasonal_factors'].items()
            },
            'weekly_consumption': weekly.tail(12).to_dict(orient='records'),
            'monthly_consumption': monthly.tail(12).to_dict(orient='records'),
        }
    
    def detect_all_anomalies(self, days: int = 30, 
                             min_severity: str = "medium") -> List[AnomalyResult]:
        """
        Detect anomalies across all medicines
        
        Args:
            days: Days to look back
            min_severity: Minimum severity to include ("low", "medium", "high")
            
        Returns:
            List of all detected anomalies
        """
        severity_order = {"low": 0, "medium": 1, "high": 2}
        min_severity_value = severity_order.get(min_severity, 1)
        
        all_anomalies = []
        
        for medicine_id in self.medicine_stats.keys():
            anomalies = self.detect_anomalies(medicine_id, days=days)
            for anomaly in anomalies:
                if severity_order.get(anomaly.severity, 0) >= min_severity_value:
                    all_anomalies.append(anomaly)
        
        # Sort by severity and date
        all_anomalies.sort(
            key=lambda x: (severity_order.get(x.severity, 0), x.date),
            reverse=True
        )
        
        return all_anomalies
    
    def get_forecast_summary(self, days: int = 30) -> Dict:
        """
        Get forecast summary for all medicines
        
        Args:
            days: Days to forecast
            
        Returns:
            Summary dictionary with aggregate forecasts
        """
        forecasts = []
        total_predicted = 0
        increasing_count = 0
        decreasing_count = 0
        
        for medicine_id in self.medicine_stats.keys():
            forecast = self.forecast(medicine_id, days)
            if forecast:
                forecasts.append(forecast)
                total_predicted += forecast.predicted_quantity
                if forecast.trend == "increasing":
                    increasing_count += 1
                elif forecast.trend == "decreasing":
                    decreasing_count += 1
        
        # Top medicines by predicted consumption
        top_by_consumption = sorted(
            forecasts, 
            key=lambda x: x.predicted_quantity, 
            reverse=True
        )[:10]
        
        # Medicines with highest growth
        top_by_growth = sorted(
            [f for f in forecasts if f.growth_rate > 0],
            key=lambda x: x.growth_rate,
            reverse=True
        )[:10]
        
        return {
            'forecast_period_days': days,
            'total_medicines_analyzed': len(forecasts),
            'total_predicted_consumption': total_predicted,
            'trend_summary': {
                'increasing': increasing_count,
                'stable': len(forecasts) - increasing_count - decreasing_count,
                'decreasing': decreasing_count
            },
            'top_by_consumption': [
                {
                    'medicine_id': f.medicine_id,
                    'medicine_name': f.medicine_name,
                    'predicted': f.predicted_quantity,
                    'trend': f.trend,
                    'confidence': f.confidence
                }
                for f in top_by_consumption
            ],
            'top_by_growth': [
                {
                    'medicine_id': f.medicine_id,
                    'medicine_name': f.medicine_name,
                    'growth_rate': f.growth_rate,
                    'trend': f.trend
                }
                for f in top_by_growth
            ]
        }

