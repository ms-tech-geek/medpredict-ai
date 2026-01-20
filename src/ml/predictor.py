"""
MedPredict AI - Consumption Predictor & Expiry Risk Scorer

This module provides:
1. Consumption rate prediction based on historical data
2. Expiry risk scoring for inventory batches
3. Stockout prediction
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass


@dataclass
class ExpiryRisk:
    """Expiry risk assessment for a batch"""
    medicine_id: int
    medicine_name: str
    batch_no: str
    current_quantity: int
    expiry_date: datetime
    days_to_expiry: int
    predicted_consumption: int
    quantity_at_risk: int
    risk_score: float  # 0-100
    risk_level: str  # "LOW", "MEDIUM", "HIGH", "CRITICAL"
    recommendation: str
    potential_loss: float


@dataclass
class StockoutRisk:
    """Stockout risk assessment for a medicine"""
    medicine_id: int
    medicine_name: str
    current_stock: int
    avg_daily_consumption: float
    predicted_weekly_consumption: int
    days_until_stockout: float
    risk_level: str
    recommended_order: int
    recommendation: str


class MedPredictEngine:
    """
    Core prediction engine for MedPredict AI
    
    Features:
    - Calculates historical consumption rates
    - Predicts future consumption with seasonal adjustments
    - Scores expiry risk for each batch
    - Identifies stockout risks
    """
    
    def __init__(self, consumption_df: pd.DataFrame, inventory_df: pd.DataFrame, 
                 medicines_df: pd.DataFrame):
        """
        Initialize the prediction engine
        
        Args:
            consumption_df: Historical consumption log
            inventory_df: Current inventory snapshot
            medicines_df: Medicine master data
        """
        self.consumption_df = consumption_df.copy()
        self.inventory_df = inventory_df.copy()
        self.medicines_df = medicines_df.copy()
        
        # Convert date columns
        self.consumption_df['date'] = pd.to_datetime(self.consumption_df['date'])
        self.inventory_df['expiry_date'] = pd.to_datetime(self.inventory_df['expiry_date'])
        
        # Calculate consumption statistics
        self._calculate_consumption_stats()
    
    def _calculate_consumption_stats(self):
        """Calculate consumption statistics for each medicine"""
        # Get last 90 days of data for recent trends
        max_date = self.consumption_df['date'].max()
        recent_cutoff = max_date - timedelta(days=90)
        recent_data = self.consumption_df[self.consumption_df['date'] >= recent_cutoff]
        
        # Calculate daily averages
        self.daily_consumption = recent_data.groupby('medicine_id').agg({
            'quantity_dispensed': ['mean', 'std', 'sum', 'count']
        }).round(2)
        self.daily_consumption.columns = ['avg_daily', 'std_daily', 'total_90d', 'days_with_data']
        self.daily_consumption = self.daily_consumption.reset_index()
        
        # Calculate weekly consumption
        self.daily_consumption['avg_weekly'] = (self.daily_consumption['avg_daily'] * 7).round(0)
        
        # Get seasonal patterns (current month)
        current_month = max_date.month
        monthly_data = self.consumption_df[
            self.consumption_df['date'].dt.month == current_month
        ].groupby('medicine_id')['quantity_dispensed'].mean()
        
        self.daily_consumption = self.daily_consumption.merge(
            monthly_data.reset_index().rename(columns={'quantity_dispensed': 'seasonal_avg'}),
            on='medicine_id',
            how='left'
        )
        
        # Calculate seasonal adjustment factor
        self.daily_consumption['seasonal_factor'] = (
            self.daily_consumption['seasonal_avg'] / self.daily_consumption['avg_daily']
        ).fillna(1.0).clip(0.5, 2.0)
    
    def predict_consumption(self, medicine_id: int, days: int = 30) -> Tuple[int, float]:
        """
        Predict consumption for a medicine over specified days
        
        Args:
            medicine_id: Medicine ID
            days: Number of days to predict
            
        Returns:
            Tuple of (predicted_quantity, confidence_score)
        """
        stats = self.daily_consumption[
            self.daily_consumption['medicine_id'] == medicine_id
        ]
        
        if stats.empty:
            return 0, 0.0
        
        stats = stats.iloc[0]
        avg_daily = stats['avg_daily']
        std_daily = stats['std_daily'] if not pd.isna(stats['std_daily']) else avg_daily * 0.3
        seasonal_factor = stats['seasonal_factor']
        
        # Adjusted prediction with seasonality
        predicted = int(avg_daily * seasonal_factor * days)
        
        # Confidence based on data consistency (lower std = higher confidence)
        cv = std_daily / avg_daily if avg_daily > 0 else 1.0
        confidence = max(0.3, min(0.95, 1.0 - cv))
        
        return predicted, confidence
    
    def calculate_expiry_risks(self, 
                               reference_date: Optional[datetime] = None) -> List[ExpiryRisk]:
        """
        Calculate expiry risk for all inventory batches
        
        Args:
            reference_date: Date to calculate from (defaults to today)
            
        Returns:
            List of ExpiryRisk objects sorted by risk score
        """
        if reference_date is None:
            reference_date = datetime.now()
        
        risks = []
        
        for _, batch in self.inventory_df.iterrows():
            medicine_id = batch['medicine_id']
            medicine_name = batch['medicine_name']
            batch_no = batch['batch_no']
            quantity = batch['quantity']
            expiry_date = batch['expiry_date']
            unit_cost = batch['unit_cost_inr']
            
            # Days until expiry
            days_to_expiry = (expiry_date - reference_date).days
            
            if days_to_expiry <= 0:
                # Already expired
                risk_score = 100.0
                quantity_at_risk = quantity
                risk_level = "CRITICAL"
                recommendation = f"EXPIRED! Remove from inventory. Loss: ₹{quantity * unit_cost:,.0f}"
            else:
                # Predict consumption until expiry
                predicted_consumption, confidence = self.predict_consumption(
                    medicine_id, days_to_expiry
                )
                
                # Calculate quantity at risk
                quantity_at_risk = max(0, quantity - predicted_consumption)
                
                # Calculate risk score (0-100)
                if quantity_at_risk == 0:
                    risk_score = 0.0
                else:
                    risk_ratio = quantity_at_risk / quantity
                    time_pressure = max(0, (90 - days_to_expiry) / 90)  # Higher if closer to expiry
                    risk_score = min(100, (risk_ratio * 50 + time_pressure * 50))
                
                # Determine risk level
                if risk_score >= 70:
                    risk_level = "CRITICAL"
                elif risk_score >= 50:
                    risk_level = "HIGH"
                elif risk_score >= 25:
                    risk_level = "MEDIUM"
                else:
                    risk_level = "LOW"
                
                # Generate recommendation
                recommendation = self._generate_expiry_recommendation(
                    quantity, quantity_at_risk, days_to_expiry, risk_level
                )
            
            potential_loss = quantity_at_risk * unit_cost
            
            risks.append(ExpiryRisk(
                medicine_id=medicine_id,
                medicine_name=medicine_name,
                batch_no=batch_no,
                current_quantity=quantity,
                expiry_date=expiry_date,
                days_to_expiry=days_to_expiry,
                predicted_consumption=predicted_consumption if days_to_expiry > 0 else 0,
                quantity_at_risk=quantity_at_risk,
                risk_score=round(risk_score, 1),
                risk_level=risk_level,
                recommendation=recommendation,
                potential_loss=potential_loss
            ))
        
        # Sort by risk score descending
        risks.sort(key=lambda x: x.risk_score, reverse=True)
        return risks
    
    def _generate_expiry_recommendation(self, quantity: int, at_risk: int, 
                                        days: int, risk_level: str) -> str:
        """Generate actionable recommendation based on risk"""
        if risk_level == "CRITICAL":
            if days <= 30:
                return f"URGENT: {at_risk} units will expire in {days} days. Consider 20% discount or transfer to high-volume facility."
            else:
                return f"Push this batch first (FIFO). {at_risk} units unlikely to sell before expiry."
        elif risk_level == "HIGH":
            return f"Prioritize dispensing. Consider 10% discount to accelerate sales."
        elif risk_level == "MEDIUM":
            return f"Monitor closely. Ensure FIFO compliance for this batch."
        else:
            return "Stock level healthy. Continue normal dispensing."
    
    def calculate_stockout_risks(self, 
                                 reference_date: Optional[datetime] = None) -> List[StockoutRisk]:
        """
        Calculate stockout risk for all medicines
        
        Args:
            reference_date: Date to calculate from
            
        Returns:
            List of StockoutRisk objects sorted by days until stockout
        """
        if reference_date is None:
            reference_date = datetime.now()
        
        risks = []
        
        # Aggregate current stock by medicine
        current_stock = self.inventory_df.groupby('medicine_id').agg({
            'quantity': 'sum',
            'medicine_name': 'first'
        }).reset_index()
        
        for _, row in current_stock.iterrows():
            medicine_id = row['medicine_id']
            medicine_name = row['medicine_name']
            stock = row['quantity']
            
            # Get consumption stats
            stats = self.daily_consumption[
                self.daily_consumption['medicine_id'] == medicine_id
            ]
            
            if stats.empty:
                continue
            
            stats = stats.iloc[0]
            avg_daily = stats['avg_daily']
            avg_weekly = stats['avg_weekly']
            
            if avg_daily <= 0:
                continue
            
            # Days until stockout
            days_until_stockout = stock / avg_daily
            
            # Determine risk level
            if days_until_stockout <= 7:
                risk_level = "CRITICAL"
                recommendation = f"URGENT: Order immediately! Stock will last only {days_until_stockout:.0f} days."
            elif days_until_stockout <= 14:
                risk_level = "HIGH"
                recommendation = f"Order within 3 days. Current stock covers {days_until_stockout:.0f} days."
            elif days_until_stockout <= 21:
                risk_level = "MEDIUM"
                recommendation = f"Plan to order soon. Stock covers {days_until_stockout:.0f} days."
            else:
                risk_level = "LOW"
                recommendation = f"Stock adequate for {days_until_stockout:.0f} days."
            
            # Recommended order (4 weeks supply - current stock)
            four_week_need = int(avg_weekly * 4)
            recommended_order = max(0, four_week_need - stock)
            
            risks.append(StockoutRisk(
                medicine_id=medicine_id,
                medicine_name=medicine_name,
                current_stock=stock,
                avg_daily_consumption=round(avg_daily, 1),
                predicted_weekly_consumption=int(avg_weekly),
                days_until_stockout=round(days_until_stockout, 1),
                risk_level=risk_level,
                recommended_order=recommended_order,
                recommendation=recommendation
            ))
        
        # Sort by days until stockout
        risks.sort(key=lambda x: x.days_until_stockout)
        return risks
    
    def get_dashboard_summary(self, reference_date: Optional[datetime] = None) -> Dict:
        """
        Get summary statistics for dashboard
        
        Returns:
            Dictionary with key metrics
        """
        if reference_date is None:
            reference_date = datetime.now()
        
        expiry_risks = self.calculate_expiry_risks(reference_date)
        stockout_risks = self.calculate_stockout_risks(reference_date)
        
        # Expiry summary
        total_at_risk_value = sum(r.potential_loss for r in expiry_risks)
        critical_expiry = len([r for r in expiry_risks if r.risk_level == "CRITICAL"])
        high_expiry = len([r for r in expiry_risks if r.risk_level == "HIGH"])
        
        # Stockout summary
        critical_stockout = len([r for r in stockout_risks if r.risk_level == "CRITICAL"])
        high_stockout = len([r for r in stockout_risks if r.risk_level == "HIGH"])
        
        # Inventory value
        total_inventory_value = (
            self.inventory_df['quantity'] * self.inventory_df['unit_cost_inr']
        ).sum()
        
        return {
            "total_medicines": len(self.medicines_df),
            "total_batches": len(self.inventory_df),
            "total_inventory_value": round(total_inventory_value, 2),
            "expiry_risk": {
                "critical_count": critical_expiry,
                "high_count": high_expiry,
                "total_at_risk_value": round(total_at_risk_value, 2),
                "top_risks": expiry_risks[:5]
            },
            "stockout_risk": {
                "critical_count": critical_stockout,
                "high_count": high_stockout,
                "top_risks": stockout_risks[:5]
            },
            "health_score": self._calculate_health_score(expiry_risks, stockout_risks)
        }
    
    def _calculate_health_score(self, expiry_risks: List[ExpiryRisk], 
                                stockout_risks: List[StockoutRisk]) -> int:
        """Calculate overall inventory health score (0-100)"""
        # Deduct points for risks
        score = 100
        
        # Expiry deductions
        for risk in expiry_risks:
            if risk.risk_level == "CRITICAL":
                score -= 5
            elif risk.risk_level == "HIGH":
                score -= 2
            elif risk.risk_level == "MEDIUM":
                score -= 0.5
        
        # Stockout deductions
        for risk in stockout_risks:
            if risk.risk_level == "CRITICAL":
                score -= 8
            elif risk.risk_level == "HIGH":
                score -= 3
            elif risk.risk_level == "MEDIUM":
                score -= 1
        
        return max(0, min(100, int(score)))

