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
from src.ml.advanced_predictor import AdvancedPredictor

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

# Global engine instances
engine: Optional[MedPredictEngine] = None
advanced_engine: Optional[AdvancedPredictor] = None


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
    """Load data and initialize prediction engines"""
    global engine, advanced_engine
    
    try:
        consumption_df = pd.read_csv(DATA_DIR / "consumption_log.csv")
        inventory_df = pd.read_csv(DATA_DIR / "current_inventory.csv")
        medicines_df = pd.read_csv(DATA_DIR / "medicines_master.csv")
        
        engine = MedPredictEngine(consumption_df, inventory_df, medicines_df)
        advanced_engine = AdvancedPredictor(consumption_df, medicines_df)
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
async def get_medicines(
    search: Optional[str] = None,
    category: Optional[str] = None,
    sort_by: Optional[str] = "name",
    limit: int = 100
):
    """
    Get list of all medicines with current stock levels
    
    Args:
        search: Search term for medicine name
        category: Filter by category
        sort_by: Sort field (name, stock, consumption)
        limit: Maximum results
    """
    if engine is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    # Aggregate stock by medicine
    stock_by_medicine = engine.inventory_df.groupby('medicine_id').agg({
        'quantity': 'sum',
        'medicine_name': 'first',
        'category': 'first',
        'unit_cost_inr': 'first'
    }).reset_index()
    
    # Get consumption stats
    result = stock_by_medicine.merge(
        engine.daily_consumption[['medicine_id', 'avg_daily', 'avg_weekly']],
        on='medicine_id',
        how='left'
    )
    
    # Calculate days of stock
    result['days_of_stock'] = (result['quantity'] / result['avg_daily']).replace([float('inf'), -float('inf')], 999).fillna(999).round(0)
    result['stock_value'] = result['quantity'] * result['unit_cost_inr']
    
    # Get stockout risk levels
    stockout_risks = {r.medicine_id: r.risk_level for r in engine.calculate_stockout_risks()}
    result['risk_level'] = result['medicine_id'].map(stockout_risks).fillna('LOW')
    
    # Apply filters
    if search:
        result = result[result['medicine_name'].str.contains(search, case=False, na=False)]
    
    if category:
        result = result[result['category'] == category]
    
    # Apply sorting
    if sort_by == "stock":
        result = result.sort_values('quantity', ascending=True)
    elif sort_by == "consumption":
        result = result.sort_values('avg_daily', ascending=False)
    elif sort_by == "risk":
        risk_order = {'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3}
        result['risk_order'] = result['risk_level'].map(risk_order)
        result = result.sort_values('risk_order')
    else:
        result = result.sort_values('medicine_name')
    
    return result.head(limit).to_dict(orient='records')


@app.get("/api/medicines/{medicine_id}")
async def get_medicine_detail(medicine_id: int):
    """Get detailed information for a single medicine"""
    if engine is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    # Get medicine info
    medicine_info = engine.medicines_df[engine.medicines_df['medicine_id'] == medicine_id]
    if medicine_info.empty:
        raise HTTPException(status_code=404, detail="Medicine not found")
    
    medicine = medicine_info.iloc[0].to_dict()
    
    # Get all batches for this medicine
    batches = engine.inventory_df[engine.inventory_df['medicine_id'] == medicine_id]
    batches_list = batches.to_dict(orient='records')
    
    # Get consumption stats
    stats = engine.daily_consumption[engine.daily_consumption['medicine_id'] == medicine_id]
    consumption_stats = stats.iloc[0].to_dict() if not stats.empty else {}
    
    # Get consumption history (last 90 days)
    consumption_history = engine.consumption_df[
        engine.consumption_df['medicine_id'] == medicine_id
    ].sort_values('date', ascending=False).head(90)
    
    # Calculate totals
    total_stock = batches['quantity'].sum()
    total_value = (batches['quantity'] * batches['unit_cost_inr']).sum()
    
    # Get risk info
    expiry_risks = [r for r in engine.calculate_expiry_risks() if r.medicine_id == medicine_id]
    stockout_risks = [r for r in engine.calculate_stockout_risks() if r.medicine_id == medicine_id]
    
    return {
        "medicine": medicine,
        "total_stock": int(total_stock),
        "total_value": round(total_value, 2),
        "batch_count": len(batches_list),
        "batches": batches_list,
        "consumption_stats": consumption_stats,
        "consumption_history": consumption_history.to_dict(orient='records'),
        "expiry_risks": [
            {
                "batch_no": r.batch_no,
                "days_to_expiry": r.days_to_expiry,
                "quantity_at_risk": r.quantity_at_risk,
                "risk_level": r.risk_level,
                "potential_loss": r.potential_loss
            }
            for r in expiry_risks
        ],
        "stockout_risk": {
            "days_until_stockout": stockout_risks[0].days_until_stockout if stockout_risks else None,
            "risk_level": stockout_risks[0].risk_level if stockout_risks else "LOW",
            "recommended_order": stockout_risks[0].recommended_order if stockout_risks else 0
        }
    }


@app.get("/api/inventory")
async def get_inventory(
    category: Optional[str] = None,
    risk_level: Optional[str] = None,
    expiring_within_days: Optional[int] = None
):
    """Get full inventory with batch details"""
    if engine is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    inventory = engine.inventory_df.copy()
    inventory['expiry_date'] = pd.to_datetime(inventory['expiry_date'])
    inventory['days_to_expiry'] = (inventory['expiry_date'] - datetime.now()).dt.days
    
    # Apply filters
    if category:
        inventory = inventory[inventory['category'] == category]
    
    if expiring_within_days:
        inventory = inventory[inventory['days_to_expiry'] <= expiring_within_days]
    
    # Add risk levels from expiry risks
    expiry_risks = {(r.medicine_id, r.batch_no): r.risk_level for r in engine.calculate_expiry_risks()}
    inventory['risk_level'] = inventory.apply(
        lambda row: expiry_risks.get((row['medicine_id'], row['batch_no']), 'LOW'),
        axis=1
    )
    
    if risk_level:
        inventory = inventory[inventory['risk_level'] == risk_level.upper()]
    
    # Sort by days to expiry
    inventory = inventory.sort_values('days_to_expiry')
    
    # Format dates for JSON
    inventory['expiry_date'] = inventory['expiry_date'].dt.strftime('%Y-%m-%d')
    
    return {
        "total_batches": len(inventory),
        "total_value": round(inventory['total_value_inr'].sum(), 2),
        "batches": inventory.to_dict(orient='records')
    }


@app.get("/api/consumption/trends")
async def get_consumption_trends(
    medicine_id: Optional[int] = None,
    category: Optional[str] = None,
    days: int = 90
):
    """Get consumption trends over time"""
    if engine is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    consumption = engine.consumption_df.copy()
    consumption['date'] = pd.to_datetime(consumption['date'])
    
    # Filter by date range
    end_date = consumption['date'].max()
    start_date = end_date - pd.Timedelta(days=days)
    consumption = consumption[consumption['date'] >= start_date]
    
    # Apply filters
    if medicine_id:
        consumption = consumption[consumption['medicine_id'] == medicine_id]
    
    if category:
        # Get medicine IDs for this category
        category_meds = engine.medicines_df[engine.medicines_df['category'] == category]['medicine_id'].tolist()
        consumption = consumption[consumption['medicine_id'].isin(category_meds)]
    
    # Aggregate by date
    daily_totals = consumption.groupby('date').agg({
        'quantity_dispensed': 'sum',
        'patient_count': 'sum'
    }).reset_index()
    
    daily_totals['date'] = daily_totals['date'].dt.strftime('%Y-%m-%d')
    
    # Weekly aggregation
    consumption['week'] = consumption['date'].dt.to_period('W').dt.start_time
    weekly_totals = consumption.groupby('week').agg({
        'quantity_dispensed': 'sum',
        'patient_count': 'sum'
    }).reset_index()
    weekly_totals['week'] = weekly_totals['week'].dt.strftime('%Y-%m-%d')
    
    return {
        "daily": daily_totals.to_dict(orient='records'),
        "weekly": weekly_totals.to_dict(orient='records'),
        "summary": {
            "total_dispensed": int(consumption['quantity_dispensed'].sum()),
            "total_patients": int(consumption['patient_count'].sum()),
            "avg_daily_dispensed": round(consumption.groupby('date')['quantity_dispensed'].sum().mean(), 1),
            "avg_daily_patients": round(consumption.groupby('date')['patient_count'].sum().mean(), 1)
        }
    }


@app.get("/api/categories")
async def get_categories():
    """Get list of all medicine categories with stats"""
    if engine is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    categories = engine.inventory_df.groupby('category').agg({
        'medicine_id': 'nunique',
        'quantity': 'sum',
        'total_value_inr': 'sum'
    }).reset_index()
    
    categories.columns = ['category', 'medicine_count', 'total_stock', 'total_value']
    
    return categories.to_dict(orient='records')


@app.get("/api/recommendations")
async def get_recommendations():
    """Get actionable recommendations based on current risks"""
    if engine is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    expiry_risks = engine.calculate_expiry_risks()
    stockout_risks = engine.calculate_stockout_risks()
    
    recommendations = []
    
    # Expiry recommendations
    critical_expiry = [r for r in expiry_risks if r.risk_level == "CRITICAL"]
    high_expiry = [r for r in expiry_risks if r.risk_level == "HIGH"]
    
    if critical_expiry:
        total_loss = sum(r.potential_loss for r in critical_expiry)
        recommendations.append({
            "priority": "CRITICAL",
            "category": "EXPIRY",
            "title": f"{len(critical_expiry)} batches need immediate attention",
            "description": f"Potential loss of ₹{total_loss:,.0f} from expiring medicines",
            "actions": [
                "Apply 20-30% discount to accelerate sales",
                "Transfer to high-volume facility",
                "Contact nearby PHCs for redistribution"
            ],
            "affected_items": [
                {"name": r.medicine_name, "batch": r.batch_no, "days": r.days_to_expiry, "loss": r.potential_loss}
                for r in critical_expiry[:5]
            ]
        })
    
    if high_expiry:
        recommendations.append({
            "priority": "HIGH",
            "category": "EXPIRY",
            "title": f"{len(high_expiry)} batches expiring within 60 days",
            "description": "Prioritize FIFO dispensing for these batches",
            "actions": [
                "Ensure FIFO compliance",
                "Consider 10% promotional discount",
                "Monitor weekly consumption"
            ],
            "affected_items": [
                {"name": r.medicine_name, "batch": r.batch_no, "days": r.days_to_expiry}
                for r in high_expiry[:5]
            ]
        })
    
    # Stockout recommendations
    critical_stockout = [r for r in stockout_risks if r.risk_level == "CRITICAL"]
    high_stockout = [r for r in stockout_risks if r.risk_level == "HIGH"]
    
    if critical_stockout:
        total_order = sum(r.recommended_order for r in critical_stockout)
        recommendations.append({
            "priority": "CRITICAL",
            "category": "STOCKOUT",
            "title": f"{len(critical_stockout)} medicines will run out within 7 days",
            "description": f"Recommended order quantity: {total_order:,} units",
            "actions": [
                "Place emergency order immediately",
                "Check with nearby facilities for transfers",
                "Inform patients about temporary alternatives"
            ],
            "affected_items": [
                {"name": r.medicine_name, "days": r.days_until_stockout, "order_qty": r.recommended_order}
                for r in critical_stockout[:5]
            ]
        })
    
    if high_stockout:
        recommendations.append({
            "priority": "HIGH",
            "category": "STOCKOUT",
            "title": f"{len(high_stockout)} medicines running low",
            "description": "Order within next 3 days to avoid stockout",
            "actions": [
                "Prepare purchase order",
                "Contact regular suppliers",
                "Review consumption patterns"
            ],
            "affected_items": [
                {"name": r.medicine_name, "days": r.days_until_stockout, "order_qty": r.recommended_order}
                for r in high_stockout[:5]
            ]
        })
    
    # Seasonal recommendations
    current_month = datetime.now().month
    if current_month in [6, 7, 8, 9]:  # Monsoon
        recommendations.append({
            "priority": "MEDIUM",
            "category": "SEASONAL",
            "title": "Monsoon Season Alert",
            "description": "Increase stock of ORS, antibiotics, and antidiarrheals",
            "actions": [
                "Order 50% extra ORS packets",
                "Stock up on Metronidazole and Ciprofloxacin",
                "Prepare for dengue/malaria surge"
            ],
            "affected_items": []
        })
    elif current_month in [11, 12, 1, 2]:  # Winter
        recommendations.append({
            "priority": "MEDIUM",
            "category": "SEASONAL",
            "title": "Winter Season Alert",
            "description": "Expect increased respiratory illness cases",
            "actions": [
                "Order extra cough syrups and antihistamines",
                "Stock up on Paracetamol",
                "Ensure adequate inhaler supply"
            ],
            "affected_items": []
        })
    
    return {
        "total_recommendations": len(recommendations),
        "recommendations": recommendations
    }


@app.post("/api/reload-data")
async def reload_data():
    """Reload data from CSV files"""
    success = load_data()
    if success:
        return {"status": "success", "message": "Data reloaded successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to reload data")


# ============================================================================
# ADVANCED ML ENDPOINTS
# ============================================================================

@app.get("/api/forecast/{medicine_id}")
async def get_forecast(medicine_id: int, days: int = 30):
    """
    Get demand forecast for a specific medicine
    
    Args:
        medicine_id: Medicine to forecast
        days: Number of days to forecast (default: 30)
    """
    if advanced_engine is None:
        raise HTTPException(status_code=500, detail="Advanced engine not loaded")
    
    forecast = advanced_engine.forecast(medicine_id, days)
    
    if forecast is None:
        raise HTTPException(status_code=404, detail="Medicine not found or insufficient data")
    
    return {
        "medicine_id": forecast.medicine_id,
        "medicine_name": forecast.medicine_name,
        "forecast_days": forecast.forecast_days,
        "predicted_quantity": forecast.predicted_quantity,
        "lower_bound": forecast.lower_bound,
        "upper_bound": forecast.upper_bound,
        "confidence": forecast.confidence,
        "trend": forecast.trend,
        "growth_rate_percent": forecast.growth_rate,
        "seasonality_factor": forecast.seasonality_factor,
        "anomalies_detected": forecast.anomalies_detected
    }


@app.get("/api/forecast/summary")
async def get_forecast_summary(days: int = 30):
    """Get forecast summary for all medicines"""
    if advanced_engine is None:
        raise HTTPException(status_code=500, detail="Advanced engine not loaded")
    
    return advanced_engine.get_forecast_summary(days)


@app.get("/api/anomalies")
async def get_anomalies(
    days: int = 30,
    min_severity: str = "medium",
    medicine_id: Optional[int] = None
):
    """
    Detect anomalies in consumption patterns
    
    Args:
        days: Days to look back (default: 30)
        min_severity: Minimum severity to include (low, medium, high)
        medicine_id: Optional - filter by specific medicine
    """
    if advanced_engine is None:
        raise HTTPException(status_code=500, detail="Advanced engine not loaded")
    
    if medicine_id:
        anomalies = advanced_engine.detect_anomalies(medicine_id, days)
    else:
        anomalies = advanced_engine.detect_all_anomalies(days, min_severity)
    
    return {
        "total_anomalies": len(anomalies),
        "anomalies": [
            {
                "medicine_id": a.medicine_id,
                "medicine_name": a.medicine_name,
                "date": a.date,
                "actual_quantity": a.actual_quantity,
                "expected_quantity": a.expected_quantity,
                "deviation": a.deviation,
                "anomaly_type": a.anomaly_type,
                "severity": a.severity
            }
            for a in anomalies
        ]
    }


@app.get("/api/trends/{medicine_id}")
async def get_trends(medicine_id: int):
    """
    Get detailed trend analysis for a medicine
    
    Args:
        medicine_id: Medicine to analyze
    """
    if advanced_engine is None:
        raise HTTPException(status_code=500, detail="Advanced engine not loaded")
    
    trend_data = advanced_engine.get_trend_analysis(medicine_id)
    
    if trend_data is None:
        raise HTTPException(status_code=404, detail="Medicine not found or insufficient data")
    
    return trend_data


# Run with: uvicorn src.api.main:app --reload --port 8000
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

