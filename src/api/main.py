"""
MedPredict AI - FastAPI Backend

REST API for:
- Expiry risk predictions
- Stockout alerts
- Dashboard data
- Inventory upload
"""

import os
import sys
from pathlib import Path
from datetime import datetime
from typing import List, Optional

import pandas as pd
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from src.ml.predictor import MedPredictEngine, ExpiryRisk, StockoutRisk

# Initialize FastAPI app
app = FastAPI(
    title="MedPredict AI",
    description="AI-powered medical supply prediction and expiry management",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data paths
DATA_DIR = Path(__file__).parent.parent.parent / "data"

# Global engine instance
engine: Optional[MedPredictEngine] = None


# Pydantic models for API responses
class ExpiryRiskResponse(BaseModel):
    medicine_id: int
    medicine_name: str
    batch_no: str
    current_quantity: int
    expiry_date: str
    days_to_expiry: int
    predicted_consumption: int
    quantity_at_risk: int
    risk_score: float
    risk_level: str
    recommendation: str
    potential_loss: float


class StockoutRiskResponse(BaseModel):
    medicine_id: int
    medicine_name: str
    current_stock: int
    avg_daily_consumption: float
    predicted_weekly_consumption: int
    days_until_stockout: float
    risk_level: str
    recommended_order: int
    recommendation: str


class DashboardSummary(BaseModel):
    total_medicines: int
    total_batches: int
    total_inventory_value: float
    health_score: int
    critical_expiry_count: int
    high_expiry_count: int
    total_at_risk_value: float
    critical_stockout_count: int
    high_stockout_count: int


class HealthResponse(BaseModel):
    status: str
    message: str
    data_loaded: bool


def load_data():
    """Load data and initialize prediction engine"""
    global engine
    
    try:
        consumption_df = pd.read_csv(DATA_DIR / "consumption_log.csv")
        inventory_df = pd.read_csv(DATA_DIR / "current_inventory.csv")
        medicines_df = pd.read_csv(DATA_DIR / "medicines_master.csv")
        
        engine = MedPredictEngine(consumption_df, inventory_df, medicines_df)
        return True
    except Exception as e:
        print(f"Error loading data: {e}")
        return False


@app.on_event("startup")
async def startup_event():
    """Load data on startup"""
    load_data()


@app.get("/", response_model=HealthResponse)
async def root():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        message="MedPredict AI is running",
        data_loaded=engine is not None
    )


@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """API health check"""
    return HealthResponse(
        status="healthy",
        message="MedPredict AI API is operational",
        data_loaded=engine is not None
    )


@app.get("/api/dashboard/summary", response_model=DashboardSummary)
async def get_dashboard_summary():
    """Get dashboard summary with key metrics"""
    if engine is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    summary = engine.get_dashboard_summary()
    
    return DashboardSummary(
        total_medicines=summary["total_medicines"],
        total_batches=summary["total_batches"],
        total_inventory_value=summary["total_inventory_value"],
        health_score=summary["health_score"],
        critical_expiry_count=summary["expiry_risk"]["critical_count"],
        high_expiry_count=summary["expiry_risk"]["high_count"],
        total_at_risk_value=summary["expiry_risk"]["total_at_risk_value"],
        critical_stockout_count=summary["stockout_risk"]["critical_count"],
        high_stockout_count=summary["stockout_risk"]["high_count"]
    )


@app.get("/api/expiry-risks", response_model=List[ExpiryRiskResponse])
async def get_expiry_risks(
    risk_level: Optional[str] = None,
    limit: int = 50
):
    """
    Get expiry risk assessments for all batches
    
    Args:
        risk_level: Filter by risk level (CRITICAL, HIGH, MEDIUM, LOW)
        limit: Maximum number of results
    """
    if engine is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    risks = engine.calculate_expiry_risks()
    
    # Filter by risk level if specified
    if risk_level:
        risks = [r for r in risks if r.risk_level == risk_level.upper()]
    
    # Limit results
    risks = risks[:limit]
    
    return [
        ExpiryRiskResponse(
            medicine_id=r.medicine_id,
            medicine_name=r.medicine_name,
            batch_no=r.batch_no,
            current_quantity=r.current_quantity,
            expiry_date=r.expiry_date.strftime("%Y-%m-%d"),
            days_to_expiry=r.days_to_expiry,
            predicted_consumption=r.predicted_consumption,
            quantity_at_risk=r.quantity_at_risk,
            risk_score=r.risk_score,
            risk_level=r.risk_level,
            recommendation=r.recommendation,
            potential_loss=r.potential_loss
        )
        for r in risks
    ]


@app.get("/api/stockout-risks", response_model=List[StockoutRiskResponse])
async def get_stockout_risks(
    risk_level: Optional[str] = None,
    limit: int = 50
):
    """
    Get stockout risk assessments for all medicines
    
    Args:
        risk_level: Filter by risk level (CRITICAL, HIGH, MEDIUM, LOW)
        limit: Maximum number of results
    """
    if engine is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    risks = engine.calculate_stockout_risks()
    
    # Filter by risk level if specified
    if risk_level:
        risks = [r for r in risks if r.risk_level == risk_level.upper()]
    
    # Limit results
    risks = risks[:limit]
    
    return [
        StockoutRiskResponse(
            medicine_id=r.medicine_id,
            medicine_name=r.medicine_name,
            current_stock=r.current_stock,
            avg_daily_consumption=r.avg_daily_consumption,
            predicted_weekly_consumption=r.predicted_weekly_consumption,
            days_until_stockout=r.days_until_stockout,
            risk_level=r.risk_level,
            recommended_order=r.recommended_order,
            recommendation=r.recommendation
        )
        for r in risks
    ]


@app.get("/api/alerts")
async def get_alerts():
    """Get all active alerts (critical and high risk items)"""
    if engine is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    expiry_risks = engine.calculate_expiry_risks()
    stockout_risks = engine.calculate_stockout_risks()
    
    alerts = []
    
    # Expiry alerts
    for r in expiry_risks:
        if r.risk_level in ["CRITICAL", "HIGH"]:
            alerts.append({
                "type": "EXPIRY",
                "severity": r.risk_level,
                "medicine": r.medicine_name,
                "batch": r.batch_no,
                "message": f"{r.quantity_at_risk} units will expire in {r.days_to_expiry} days",
                "potential_loss": r.potential_loss,
                "recommendation": r.recommendation
            })
    
    # Stockout alerts
    for r in stockout_risks:
        if r.risk_level in ["CRITICAL", "HIGH"]:
            alerts.append({
                "type": "STOCKOUT",
                "severity": r.risk_level,
                "medicine": r.medicine_name,
                "batch": None,
                "message": f"Stock will last only {r.days_until_stockout:.0f} days",
                "potential_loss": None,
                "recommendation": r.recommendation
            })
    
    # Sort by severity
    severity_order = {"CRITICAL": 0, "HIGH": 1}
    alerts.sort(key=lambda x: severity_order.get(x["severity"], 2))
    
    return {
        "total_alerts": len(alerts),
        "critical_count": len([a for a in alerts if a["severity"] == "CRITICAL"]),
        "high_count": len([a for a in alerts if a["severity"] == "HIGH"]),
        "alerts": alerts
    }


@app.get("/api/medicines")
async def get_medicines():
    """Get list of all medicines with current stock levels"""
    if engine is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    # Aggregate stock by medicine
    stock_by_medicine = engine.inventory_df.groupby('medicine_id').agg({
        'quantity': 'sum',
        'medicine_name': 'first',
        'category': 'first'
    }).reset_index()
    
    # Get consumption stats
    result = stock_by_medicine.merge(
        engine.daily_consumption[['medicine_id', 'avg_daily', 'avg_weekly']],
        on='medicine_id',
        how='left'
    )
    
    return result.to_dict(orient='records')


@app.post("/api/reload-data")
async def reload_data():
    """Reload data from CSV files"""
    success = load_data()
    if success:
        return {"status": "success", "message": "Data reloaded successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to reload data")


# Run with: uvicorn src.api.main:app --reload --port 8000
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

