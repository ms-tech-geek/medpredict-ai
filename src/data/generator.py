"""
MedPredict AI - Comprehensive Data Generator

Generates realistic PHC (Primary Health Centre) data:
- 100+ medicines across multiple categories
- 24 months of consumption history with realistic patterns
- Seasonal variations, disease outbreaks, weekday/weekend patterns
- Complex inventory scenarios (near expiry, overstocked, critical)
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from pathlib import Path
import random

# Seed for reproducibility
np.random.seed(42)
random.seed(42)

# Data directory
DATA_DIR = Path(__file__).parent.parent.parent / "data"


# ============================================================================
# MEDICINE MASTER DATA
# ============================================================================

MEDICINES = [
    # Diabetes (ID: 1-10)
    {"id": 1, "name": "Metformin 500mg", "category": "Diabetes", "unit": "tablet", "reorder": 1000, "shelf_life": 730, "cost": 1.5, "daily_avg": 80, "seasonal": None},
    {"id": 2, "name": "Metformin 850mg", "category": "Diabetes", "unit": "tablet", "reorder": 500, "shelf_life": 730, "cost": 2.0, "daily_avg": 40, "seasonal": None},
    {"id": 3, "name": "Glimepiride 1mg", "category": "Diabetes", "unit": "tablet", "reorder": 400, "shelf_life": 730, "cost": 3.5, "daily_avg": 35, "seasonal": None},
    {"id": 4, "name": "Glimepiride 2mg", "category": "Diabetes", "unit": "tablet", "reorder": 300, "shelf_life": 730, "cost": 4.0, "daily_avg": 25, "seasonal": None},
    {"id": 5, "name": "Insulin Human 40IU", "category": "Diabetes", "unit": "vial", "reorder": 30, "shelf_life": 180, "cost": 85.0, "daily_avg": 2, "seasonal": None},
    {"id": 6, "name": "Insulin Glargine", "category": "Diabetes", "unit": "vial", "reorder": 20, "shelf_life": 180, "cost": 450.0, "daily_avg": 1, "seasonal": None},
    {"id": 7, "name": "Sitagliptin 100mg", "category": "Diabetes", "unit": "tablet", "reorder": 200, "shelf_life": 730, "cost": 25.0, "daily_avg": 15, "seasonal": None},
    {"id": 8, "name": "Pioglitazone 15mg", "category": "Diabetes", "unit": "tablet", "reorder": 250, "shelf_life": 730, "cost": 8.0, "daily_avg": 20, "seasonal": None},
    {"id": 9, "name": "Vildagliptin 50mg", "category": "Diabetes", "unit": "tablet", "reorder": 180, "shelf_life": 730, "cost": 18.0, "daily_avg": 12, "seasonal": None},
    {"id": 10, "name": "Gliclazide 80mg", "category": "Diabetes", "unit": "tablet", "reorder": 350, "shelf_life": 730, "cost": 5.0, "daily_avg": 28, "seasonal": None},
    
    # Hypertension (ID: 11-22)
    {"id": 11, "name": "Amlodipine 5mg", "category": "Hypertension", "unit": "tablet", "reorder": 700, "shelf_life": 730, "cost": 2.5, "daily_avg": 55, "seasonal": None},
    {"id": 12, "name": "Amlodipine 10mg", "category": "Hypertension", "unit": "tablet", "reorder": 400, "shelf_life": 730, "cost": 3.5, "daily_avg": 30, "seasonal": None},
    {"id": 13, "name": "Enalapril 5mg", "category": "Hypertension", "unit": "tablet", "reorder": 500, "shelf_life": 730, "cost": 4.0, "daily_avg": 35, "seasonal": None},
    {"id": 14, "name": "Losartan 50mg", "category": "Hypertension", "unit": "tablet", "reorder": 550, "shelf_life": 730, "cost": 5.0, "daily_avg": 42, "seasonal": None},
    {"id": 15, "name": "Telmisartan 40mg", "category": "Hypertension", "unit": "tablet", "reorder": 450, "shelf_life": 730, "cost": 6.0, "daily_avg": 38, "seasonal": None},
    {"id": 16, "name": "Atenolol 50mg", "category": "Hypertension", "unit": "tablet", "reorder": 600, "shelf_life": 730, "cost": 3.0, "daily_avg": 48, "seasonal": None},
    {"id": 17, "name": "Metoprolol 50mg", "category": "Hypertension", "unit": "tablet", "reorder": 400, "shelf_life": 730, "cost": 4.5, "daily_avg": 32, "seasonal": None},
    {"id": 18, "name": "Ramipril 5mg", "category": "Hypertension", "unit": "tablet", "reorder": 350, "shelf_life": 730, "cost": 7.0, "daily_avg": 28, "seasonal": None},
    {"id": 19, "name": "Hydrochlorothiazide 25mg", "category": "Hypertension", "unit": "tablet", "reorder": 500, "shelf_life": 730, "cost": 2.0, "daily_avg": 40, "seasonal": None},
    {"id": 20, "name": "Furosemide 40mg", "category": "Hypertension", "unit": "tablet", "reorder": 300, "shelf_life": 730, "cost": 3.5, "daily_avg": 25, "seasonal": None},
    {"id": 21, "name": "Spironolactone 25mg", "category": "Hypertension", "unit": "tablet", "reorder": 200, "shelf_life": 730, "cost": 8.0, "daily_avg": 15, "seasonal": None},
    {"id": 22, "name": "Cilnidipine 10mg", "category": "Hypertension", "unit": "tablet", "reorder": 300, "shelf_life": 730, "cost": 12.0, "daily_avg": 22, "seasonal": None},
    
    # Antibiotics (ID: 23-35)
    {"id": 23, "name": "Amoxicillin 500mg", "category": "Antibiotics", "unit": "capsule", "reorder": 800, "shelf_life": 730, "cost": 4.0, "daily_avg": 65, "seasonal": "monsoon"},
    {"id": 24, "name": "Azithromycin 500mg", "category": "Antibiotics", "unit": "tablet", "reorder": 500, "shelf_life": 730, "cost": 25.0, "daily_avg": 35, "seasonal": "monsoon"},
    {"id": 25, "name": "Ciprofloxacin 500mg", "category": "Antibiotics", "unit": "tablet", "reorder": 600, "shelf_life": 730, "cost": 8.0, "daily_avg": 45, "seasonal": "monsoon"},
    {"id": 26, "name": "Cefixime 200mg", "category": "Antibiotics", "unit": "tablet", "reorder": 400, "shelf_life": 730, "cost": 15.0, "daily_avg": 30, "seasonal": "monsoon"},
    {"id": 27, "name": "Doxycycline 100mg", "category": "Antibiotics", "unit": "capsule", "reorder": 500, "shelf_life": 730, "cost": 5.0, "daily_avg": 38, "seasonal": "monsoon"},
    {"id": 28, "name": "Metronidazole 400mg", "category": "Antibiotics", "unit": "tablet", "reorder": 600, "shelf_life": 730, "cost": 3.0, "daily_avg": 50, "seasonal": "monsoon"},
    {"id": 29, "name": "Levofloxacin 500mg", "category": "Antibiotics", "unit": "tablet", "reorder": 350, "shelf_life": 730, "cost": 18.0, "daily_avg": 28, "seasonal": "monsoon"},
    {"id": 30, "name": "Ofloxacin 200mg", "category": "Antibiotics", "unit": "tablet", "reorder": 400, "shelf_life": 730, "cost": 6.0, "daily_avg": 32, "seasonal": "monsoon"},
    {"id": 31, "name": "Cephalexin 500mg", "category": "Antibiotics", "unit": "capsule", "reorder": 350, "shelf_life": 730, "cost": 10.0, "daily_avg": 25, "seasonal": "monsoon"},
    {"id": 32, "name": "Norfloxacin 400mg", "category": "Antibiotics", "unit": "tablet", "reorder": 400, "shelf_life": 730, "cost": 5.0, "daily_avg": 30, "seasonal": "monsoon"},
    {"id": 33, "name": "Co-trimoxazole DS", "category": "Antibiotics", "unit": "tablet", "reorder": 500, "shelf_life": 730, "cost": 4.0, "daily_avg": 40, "seasonal": None},
    {"id": 34, "name": "Clindamycin 300mg", "category": "Antibiotics", "unit": "capsule", "reorder": 200, "shelf_life": 730, "cost": 22.0, "daily_avg": 15, "seasonal": None},
    {"id": 35, "name": "Nitrofurantoin 100mg", "category": "Antibiotics", "unit": "capsule", "reorder": 300, "shelf_life": 730, "cost": 8.0, "daily_avg": 22, "seasonal": None},
    
    # Pain & Fever (ID: 36-45)
    {"id": 36, "name": "Paracetamol 500mg", "category": "Pain & Fever", "unit": "tablet", "reorder": 1500, "shelf_life": 730, "cost": 0.5, "daily_avg": 150, "seasonal": "winter"},
    {"id": 37, "name": "Paracetamol 650mg", "category": "Pain & Fever", "unit": "tablet", "reorder": 1000, "shelf_life": 730, "cost": 0.8, "daily_avg": 100, "seasonal": "winter"},
    {"id": 38, "name": "Ibuprofen 400mg", "category": "Pain & Fever", "unit": "tablet", "reorder": 800, "shelf_life": 730, "cost": 2.0, "daily_avg": 60, "seasonal": None},
    {"id": 39, "name": "Diclofenac 50mg", "category": "Pain & Fever", "unit": "tablet", "reorder": 600, "shelf_life": 730, "cost": 2.5, "daily_avg": 45, "seasonal": None},
    {"id": 40, "name": "Aceclofenac 100mg", "category": "Pain & Fever", "unit": "tablet", "reorder": 400, "shelf_life": 730, "cost": 5.0, "daily_avg": 30, "seasonal": None},
    {"id": 41, "name": "Nimesulide 100mg", "category": "Pain & Fever", "unit": "tablet", "reorder": 500, "shelf_life": 730, "cost": 3.0, "daily_avg": 35, "seasonal": None},
    {"id": 42, "name": "Tramadol 50mg", "category": "Pain & Fever", "unit": "tablet", "reorder": 200, "shelf_life": 730, "cost": 8.0, "daily_avg": 15, "seasonal": None},
    {"id": 43, "name": "Aspirin 75mg", "category": "Pain & Fever", "unit": "tablet", "reorder": 700, "shelf_life": 730, "cost": 1.0, "daily_avg": 55, "seasonal": None},
    {"id": 44, "name": "Mefenamic Acid 500mg", "category": "Pain & Fever", "unit": "tablet", "reorder": 300, "shelf_life": 730, "cost": 4.0, "daily_avg": 22, "seasonal": None},
    {"id": 45, "name": "Etoricoxib 90mg", "category": "Pain & Fever", "unit": "tablet", "reorder": 250, "shelf_life": 730, "cost": 15.0, "daily_avg": 18, "seasonal": None},
    
    # Gastrointestinal (ID: 46-58)
    {"id": 46, "name": "Omeprazole 20mg", "category": "Gastrointestinal", "unit": "capsule", "reorder": 800, "shelf_life": 730, "cost": 3.0, "daily_avg": 70, "seasonal": None},
    {"id": 47, "name": "Pantoprazole 40mg", "category": "Gastrointestinal", "unit": "tablet", "reorder": 700, "shelf_life": 730, "cost": 5.0, "daily_avg": 60, "seasonal": None},
    {"id": 48, "name": "Ranitidine 150mg", "category": "Gastrointestinal", "unit": "tablet", "reorder": 600, "shelf_life": 730, "cost": 2.0, "daily_avg": 45, "seasonal": None},
    {"id": 49, "name": "Domperidone 10mg", "category": "Gastrointestinal", "unit": "tablet", "reorder": 500, "shelf_life": 730, "cost": 2.5, "daily_avg": 40, "seasonal": None},
    {"id": 50, "name": "Ondansetron 4mg", "category": "Gastrointestinal", "unit": "tablet", "reorder": 300, "shelf_life": 730, "cost": 8.0, "daily_avg": 25, "seasonal": None},
    {"id": 51, "name": "ORS Powder", "category": "Gastrointestinal", "unit": "sachet", "reorder": 1000, "shelf_life": 365, "cost": 5.0, "daily_avg": 80, "seasonal": "monsoon"},
    {"id": 52, "name": "Loperamide 2mg", "category": "Gastrointestinal", "unit": "tablet", "reorder": 400, "shelf_life": 730, "cost": 3.0, "daily_avg": 30, "seasonal": "monsoon"},
    {"id": 53, "name": "Dicyclomine 20mg", "category": "Gastrointestinal", "unit": "tablet", "reorder": 350, "shelf_life": 730, "cost": 4.0, "daily_avg": 28, "seasonal": None},
    {"id": 54, "name": "Sucralfate 1g", "category": "Gastrointestinal", "unit": "tablet", "reorder": 250, "shelf_life": 730, "cost": 6.0, "daily_avg": 20, "seasonal": None},
    {"id": 55, "name": "Rabeprazole 20mg", "category": "Gastrointestinal", "unit": "tablet", "reorder": 400, "shelf_life": 730, "cost": 7.0, "daily_avg": 32, "seasonal": None},
    {"id": 56, "name": "Esomeprazole 40mg", "category": "Gastrointestinal", "unit": "capsule", "reorder": 350, "shelf_life": 730, "cost": 10.0, "daily_avg": 28, "seasonal": None},
    {"id": 57, "name": "Lactulose Syrup", "category": "Gastrointestinal", "unit": "bottle", "reorder": 80, "shelf_life": 365, "cost": 85.0, "daily_avg": 5, "seasonal": None},
    {"id": 58, "name": "Zinc Dispersible 20mg", "category": "Gastrointestinal", "unit": "tablet", "reorder": 600, "shelf_life": 730, "cost": 2.0, "daily_avg": 50, "seasonal": "monsoon"},
    
    # Respiratory (ID: 59-70)
    {"id": 59, "name": "Salbutamol Inhaler", "category": "Respiratory", "unit": "inhaler", "reorder": 50, "shelf_life": 365, "cost": 120.0, "daily_avg": 3, "seasonal": "winter"},
    {"id": 60, "name": "Budesonide Inhaler", "category": "Respiratory", "unit": "inhaler", "reorder": 40, "shelf_life": 365, "cost": 250.0, "daily_avg": 2, "seasonal": "winter"},
    {"id": 61, "name": "Montelukast 10mg", "category": "Respiratory", "unit": "tablet", "reorder": 400, "shelf_life": 730, "cost": 8.0, "daily_avg": 30, "seasonal": "winter"},
    {"id": 62, "name": "Cetirizine 10mg", "category": "Respiratory", "unit": "tablet", "reorder": 600, "shelf_life": 730, "cost": 2.0, "daily_avg": 50, "seasonal": "winter"},
    {"id": 63, "name": "Levocetirizine 5mg", "category": "Respiratory", "unit": "tablet", "reorder": 500, "shelf_life": 730, "cost": 3.0, "daily_avg": 42, "seasonal": "winter"},
    {"id": 64, "name": "Chlorpheniramine 4mg", "category": "Respiratory", "unit": "tablet", "reorder": 500, "shelf_life": 730, "cost": 1.0, "daily_avg": 40, "seasonal": "winter"},
    {"id": 65, "name": "Dextromethorphan Syrup", "category": "Respiratory", "unit": "bottle", "reorder": 100, "shelf_life": 365, "cost": 45.0, "daily_avg": 8, "seasonal": "winter"},
    {"id": 66, "name": "Ambroxol Syrup", "category": "Respiratory", "unit": "bottle", "reorder": 120, "shelf_life": 365, "cost": 50.0, "daily_avg": 10, "seasonal": "winter"},
    {"id": 67, "name": "Theophylline 300mg", "category": "Respiratory", "unit": "tablet", "reorder": 300, "shelf_life": 730, "cost": 5.0, "daily_avg": 22, "seasonal": "winter"},
    {"id": 68, "name": "Ipratropium Inhaler", "category": "Respiratory", "unit": "inhaler", "reorder": 30, "shelf_life": 365, "cost": 180.0, "daily_avg": 2, "seasonal": "winter"},
    {"id": 69, "name": "Fluticasone Nasal Spray", "category": "Respiratory", "unit": "bottle", "reorder": 40, "shelf_life": 365, "cost": 150.0, "daily_avg": 3, "seasonal": "winter"},
    {"id": 70, "name": "Bromhexine 8mg", "category": "Respiratory", "unit": "tablet", "reorder": 400, "shelf_life": 730, "cost": 3.0, "daily_avg": 35, "seasonal": "winter"},
    
    # Vitamins & Supplements (ID: 71-80)
    {"id": 71, "name": "Vitamin B Complex", "category": "Vitamins", "unit": "tablet", "reorder": 800, "shelf_life": 730, "cost": 1.5, "daily_avg": 65, "seasonal": None},
    {"id": 72, "name": "Vitamin C 500mg", "category": "Vitamins", "unit": "tablet", "reorder": 600, "shelf_life": 730, "cost": 2.0, "daily_avg": 50, "seasonal": "winter"},
    {"id": 73, "name": "Vitamin D3 60000IU", "category": "Vitamins", "unit": "sachet", "reorder": 200, "shelf_life": 365, "cost": 30.0, "daily_avg": 15, "seasonal": None},
    {"id": 74, "name": "Calcium + D3", "category": "Vitamins", "unit": "tablet", "reorder": 700, "shelf_life": 730, "cost": 4.0, "daily_avg": 55, "seasonal": None},
    {"id": 75, "name": "Iron + Folic Acid", "category": "Vitamins", "unit": "tablet", "reorder": 900, "shelf_life": 730, "cost": 2.0, "daily_avg": 75, "seasonal": None},
    {"id": 76, "name": "Folic Acid 5mg", "category": "Vitamins", "unit": "tablet", "reorder": 600, "shelf_life": 730, "cost": 1.0, "daily_avg": 50, "seasonal": None},
    {"id": 77, "name": "Multivitamin", "category": "Vitamins", "unit": "tablet", "reorder": 500, "shelf_life": 730, "cost": 3.0, "daily_avg": 40, "seasonal": None},
    {"id": 78, "name": "Vitamin E 400IU", "category": "Vitamins", "unit": "capsule", "reorder": 300, "shelf_life": 730, "cost": 5.0, "daily_avg": 22, "seasonal": None},
    {"id": 79, "name": "Zinc Sulfate 20mg", "category": "Vitamins", "unit": "tablet", "reorder": 500, "shelf_life": 730, "cost": 2.0, "daily_avg": 38, "seasonal": "monsoon"},
    {"id": 80, "name": "B12 Methylcobalamin", "category": "Vitamins", "unit": "tablet", "reorder": 350, "shelf_life": 730, "cost": 8.0, "daily_avg": 28, "seasonal": None},
    
    # Dermatology (ID: 81-88)
    {"id": 81, "name": "Fluconazole 150mg", "category": "Dermatology", "unit": "tablet", "reorder": 200, "shelf_life": 730, "cost": 15.0, "daily_avg": 12, "seasonal": "monsoon"},
    {"id": 82, "name": "Clotrimazole Cream", "category": "Dermatology", "unit": "tube", "reorder": 150, "shelf_life": 365, "cost": 35.0, "daily_avg": 10, "seasonal": "monsoon"},
    {"id": 83, "name": "Betamethasone Cream", "category": "Dermatology", "unit": "tube", "reorder": 180, "shelf_life": 365, "cost": 40.0, "daily_avg": 12, "seasonal": None},
    {"id": 84, "name": "Permethrin Lotion", "category": "Dermatology", "unit": "bottle", "reorder": 100, "shelf_life": 365, "cost": 60.0, "daily_avg": 6, "seasonal": "monsoon"},
    {"id": 85, "name": "Mupirocin Ointment", "category": "Dermatology", "unit": "tube", "reorder": 120, "shelf_life": 365, "cost": 75.0, "daily_avg": 8, "seasonal": None},
    {"id": 86, "name": "Calamine Lotion", "category": "Dermatology", "unit": "bottle", "reorder": 150, "shelf_life": 365, "cost": 45.0, "daily_avg": 10, "seasonal": "summer"},
    {"id": 87, "name": "Silver Sulfadiazine", "category": "Dermatology", "unit": "tube", "reorder": 80, "shelf_life": 365, "cost": 55.0, "daily_avg": 5, "seasonal": None},
    {"id": 88, "name": "Ketoconazole Shampoo", "category": "Dermatology", "unit": "bottle", "reorder": 60, "shelf_life": 365, "cost": 120.0, "daily_avg": 4, "seasonal": None},
    
    # Eye & ENT (ID: 89-95)
    {"id": 89, "name": "Ciprofloxacin Eye Drops", "category": "Eye & ENT", "unit": "bottle", "reorder": 100, "shelf_life": 180, "cost": 25.0, "daily_avg": 8, "seasonal": None},
    {"id": 90, "name": "Tobramycin Eye Drops", "category": "Eye & ENT", "unit": "bottle", "reorder": 80, "shelf_life": 180, "cost": 45.0, "daily_avg": 5, "seasonal": None},
    {"id": 91, "name": "Artificial Tears", "category": "Eye & ENT", "unit": "bottle", "reorder": 120, "shelf_life": 180, "cost": 50.0, "daily_avg": 8, "seasonal": None},
    {"id": 92, "name": "Chloramphenicol Ear Drops", "category": "Eye & ENT", "unit": "bottle", "reorder": 80, "shelf_life": 180, "cost": 30.0, "daily_avg": 5, "seasonal": "monsoon"},
    {"id": 93, "name": "Ofloxacin Ear Drops", "category": "Eye & ENT", "unit": "bottle", "reorder": 80, "shelf_life": 180, "cost": 40.0, "daily_avg": 5, "seasonal": "monsoon"},
    {"id": 94, "name": "Timolol Eye Drops", "category": "Eye & ENT", "unit": "bottle", "reorder": 60, "shelf_life": 180, "cost": 55.0, "daily_avg": 4, "seasonal": None},
    {"id": 95, "name": "Prednisolone Eye Drops", "category": "Eye & ENT", "unit": "bottle", "reorder": 50, "shelf_life": 180, "cost": 65.0, "daily_avg": 3, "seasonal": None},
    
    # Mental Health (ID: 96-100)
    {"id": 96, "name": "Alprazolam 0.5mg", "category": "Mental Health", "unit": "tablet", "reorder": 200, "shelf_life": 730, "cost": 5.0, "daily_avg": 15, "seasonal": None},
    {"id": 97, "name": "Escitalopram 10mg", "category": "Mental Health", "unit": "tablet", "reorder": 250, "shelf_life": 730, "cost": 8.0, "daily_avg": 18, "seasonal": None},
    {"id": 98, "name": "Amitriptyline 25mg", "category": "Mental Health", "unit": "tablet", "reorder": 300, "shelf_life": 730, "cost": 3.0, "daily_avg": 22, "seasonal": None},
    {"id": 99, "name": "Clonazepam 0.5mg", "category": "Mental Health", "unit": "tablet", "reorder": 180, "shelf_life": 730, "cost": 6.0, "daily_avg": 12, "seasonal": None},
    {"id": 100, "name": "Sertraline 50mg", "category": "Mental Health", "unit": "tablet", "reorder": 220, "shelf_life": 730, "cost": 10.0, "daily_avg": 16, "seasonal": None},
]


def get_seasonal_factor(date: datetime, seasonal_type: str) -> float:
    """Get seasonal multiplier for a given date and seasonal pattern"""
    month = date.month
    
    if seasonal_type == "monsoon":
        # June-September peak
        monsoon_months = {6: 1.5, 7: 2.0, 8: 2.0, 9: 1.5}
        return monsoon_months.get(month, 1.0)
    
    elif seasonal_type == "winter":
        # November-February peak
        winter_months = {11: 1.3, 12: 1.8, 1: 2.0, 2: 1.5}
        return winter_months.get(month, 1.0)
    
    elif seasonal_type == "summer":
        # April-June peak
        summer_months = {4: 1.3, 5: 1.8, 6: 1.5}
        return summer_months.get(month, 1.0)
    
    return 1.0


def get_weekday_factor(date: datetime) -> float:
    """Weekend factor - PHCs have lower footfall on weekends"""
    if date.weekday() >= 5:  # Saturday or Sunday
        return 0.3
    return 1.0


def generate_medicines_master() -> pd.DataFrame:
    """Generate medicines master data"""
    data = []
    for med in MEDICINES:
        data.append({
            "medicine_id": med["id"],
            "name": med["name"],
            "category": med["category"],
            "unit": med["unit"],
            "reorder_level": med["reorder"],
            "shelf_life_days": med["shelf_life"],
            "unit_cost_inr": med["cost"]
        })
    
    df = pd.DataFrame(data)
    return df


def generate_consumption_log(start_date: datetime, end_date: datetime) -> pd.DataFrame:
    """Generate 24 months of consumption data with realistic patterns"""
    data = []
    current_date = start_date
    
    # Add some disease outbreak periods
    outbreak_periods = [
        # Dengue outbreak
        {"start": datetime(2025, 8, 1), "end": datetime(2025, 9, 15), 
         "affected_categories": ["Pain & Fever", "Gastrointestinal"], "multiplier": 1.8},
        # Flu outbreak
        {"start": datetime(2025, 12, 15), "end": datetime(2026, 1, 31), 
         "affected_categories": ["Respiratory", "Pain & Fever", "Antibiotics"], "multiplier": 1.6},
        # Gastro outbreak (monsoon)
        {"start": datetime(2025, 7, 10), "end": datetime(2025, 8, 20), 
         "affected_categories": ["Gastrointestinal", "Antibiotics"], "multiplier": 2.0},
    ]
    
    while current_date <= end_date:
        weekday_factor = get_weekday_factor(current_date)
        
        for med in MEDICINES:
            base_consumption = med["daily_avg"]
            
            # Apply seasonal factor
            seasonal_factor = get_seasonal_factor(current_date, med.get("seasonal"))
            
            # Apply weekday factor
            consumption = base_consumption * seasonal_factor * weekday_factor
            
            # Check for outbreak periods
            for outbreak in outbreak_periods:
                if outbreak["start"] <= current_date <= outbreak["end"]:
                    if med["category"] in outbreak["affected_categories"]:
                        consumption *= outbreak["multiplier"]
            
            # Add random variation (±30%)
            variation = np.random.uniform(0.7, 1.3)
            consumption = int(consumption * variation)
            
            # Ensure minimum 0
            consumption = max(0, consumption)
            
            if consumption > 0:
                # Patient count (roughly 1 patient per 2-3 units for tablets)
                if med["unit"] in ["tablet", "capsule"]:
                    patient_count = max(1, consumption // random.randint(2, 4))
                else:
                    patient_count = max(1, consumption)
                
                data.append({
                    "date": current_date.strftime("%Y-%m-%d"),
                    "medicine_id": med["id"],
                    "quantity_dispensed": consumption,
                    "patient_count": patient_count
                })
        
        current_date += timedelta(days=1)
    
    df = pd.DataFrame(data)
    return df


def generate_current_inventory(reference_date: datetime) -> pd.DataFrame:
    """Generate current inventory with various risk scenarios"""
    data = []
    batch_counter = 3000
    
    for med in MEDICINES:
        # Generate 1-4 batches per medicine
        num_batches = random.randint(1, 4)
        
        for batch_idx in range(num_batches):
            batch_counter += 1
            batch_no = f"B{batch_counter}"
            
            # Determine batch scenario
            scenario = random.choices(
                ["normal", "near_expiry", "critical_expiry", "overstocked", "low_stock", "critical_low"],
                weights=[0.4, 0.15, 0.1, 0.1, 0.15, 0.1]
            )[0]
            
            # Calculate expiry date based on scenario
            if scenario == "critical_expiry":
                days_to_expiry = random.randint(5, 20)
            elif scenario == "near_expiry":
                days_to_expiry = random.randint(30, 90)
            else:
                days_to_expiry = random.randint(180, med["shelf_life"])
            
            expiry_date = reference_date + timedelta(days=days_to_expiry)
            
            # Calculate received date (shelf_life days before expiry)
            received_date = expiry_date - timedelta(days=med["shelf_life"])
            
            # Calculate quantity based on scenario
            weekly_consumption = med["daily_avg"] * 7
            
            if scenario == "overstocked":
                quantity = int(weekly_consumption * random.uniform(10, 16))
            elif scenario == "low_stock":
                quantity = int(weekly_consumption * random.uniform(0.5, 1.5))
            elif scenario == "critical_low":
                quantity = int(weekly_consumption * random.uniform(0.1, 0.5))
            elif scenario in ["critical_expiry", "near_expiry"]:
                # For expiry scenarios, have moderate stock
                quantity = int(weekly_consumption * random.uniform(3, 8))
            else:
                quantity = int(weekly_consumption * random.uniform(2, 6))
            
            # Ensure minimum quantity
            quantity = max(10, quantity)
            
            data.append({
                "medicine_id": med["id"],
                "medicine_name": med["name"],
                "category": med["category"],
                "batch_no": batch_no,
                "quantity": quantity,
                "unit": med["unit"],
                "expiry_date": expiry_date.strftime("%Y-%m-%d"),
                "received_date": received_date.strftime("%Y-%m-%d"),
                "unit_cost_inr": med["cost"],
                "total_value_inr": round(quantity * med["cost"], 2)
            })
    
    df = pd.DataFrame(data)
    return df


def generate_patient_footfall(start_date: datetime, end_date: datetime) -> pd.DataFrame:
    """Generate daily patient footfall data"""
    data = []
    current_date = start_date
    
    base_footfall = 120  # Average daily patients
    
    while current_date <= end_date:
        weekday_factor = get_weekday_factor(current_date)
        
        # Seasonal factor for overall footfall
        month = current_date.month
        seasonal_multipliers = {
            1: 1.3, 2: 1.2, 3: 1.0, 4: 0.9, 5: 0.85, 6: 1.1,
            7: 1.4, 8: 1.5, 9: 1.3, 10: 1.0, 11: 1.1, 12: 1.4
        }
        seasonal_factor = seasonal_multipliers.get(month, 1.0)
        
        footfall = int(base_footfall * weekday_factor * seasonal_factor * np.random.uniform(0.8, 1.2))
        
        data.append({
            "date": current_date.strftime("%Y-%m-%d"),
            "total_patients": footfall,
            "opd_patients": int(footfall * 0.85),
            "emergency_patients": int(footfall * 0.15)
        })
        
        current_date += timedelta(days=1)
    
    df = pd.DataFrame(data)
    return df


def generate_purchase_history(start_date: datetime, end_date: datetime) -> pd.DataFrame:
    """Generate purchase order history"""
    data = []
    po_counter = 1000
    
    current_date = start_date
    
    while current_date <= end_date:
        # Generate 2-4 purchase orders per month
        if current_date.day in [1, 8, 15, 22]:
            po_counter += 1
            
            # Select 10-20 medicines for this PO
            selected_meds = random.sample(MEDICINES, random.randint(10, 20))
            
            for med in selected_meds:
                # Order 4-8 weeks supply
                order_qty = int(med["daily_avg"] * 7 * random.randint(4, 8))
                
                data.append({
                    "po_number": f"PO{po_counter}",
                    "date": current_date.strftime("%Y-%m-%d"),
                    "medicine_id": med["id"],
                    "medicine_name": med["name"],
                    "quantity_ordered": order_qty,
                    "unit_cost_inr": med["cost"],
                    "total_cost_inr": round(order_qty * med["cost"], 2),
                    "supplier_id": random.randint(1, 5),
                    "status": "DELIVERED"
                })
        
        current_date += timedelta(days=1)
    
    df = pd.DataFrame(data)
    return df


def generate_suppliers() -> pd.DataFrame:
    """Generate supplier master data"""
    suppliers = [
        {"id": 1, "name": "MedLife Distributors", "contact": "9876543210", "email": "orders@medlife.com", "lead_time_days": 5, "rating": 4.5},
        {"id": 2, "name": "PharmaCare India", "contact": "9876543211", "email": "supply@pharmacare.in", "lead_time_days": 7, "rating": 4.2},
        {"id": 3, "name": "HealthFirst Supplies", "contact": "9876543212", "email": "orders@healthfirst.com", "lead_time_days": 4, "rating": 4.7},
        {"id": 4, "name": "Government Medical Store", "contact": "9876543213", "email": "gms@gov.in", "lead_time_days": 14, "rating": 3.8},
        {"id": 5, "name": "Apollo Pharmacy Wholesale", "contact": "9876543214", "email": "wholesale@apollo.com", "lead_time_days": 3, "rating": 4.8},
    ]
    
    return pd.DataFrame(suppliers)


def generate_disease_surveillance(start_date: datetime, end_date: datetime) -> pd.DataFrame:
    """Generate disease surveillance data (IDSP-style)"""
    diseases = [
        "Acute Diarrheal Disease", "Acute Respiratory Infection", 
        "Malaria", "Dengue", "Typhoid", "Viral Fever",
        "Hypertension", "Diabetes", "Skin Infections"
    ]
    
    data = []
    current_date = start_date
    
    while current_date <= end_date:
        # Weekly data
        if current_date.weekday() == 0:  # Monday
            for disease in diseases:
                # Base cases
                if disease in ["Hypertension", "Diabetes"]:
                    base_cases = random.randint(30, 60)
                elif disease in ["Acute Diarrheal Disease", "Acute Respiratory Infection"]:
                    base_cases = random.randint(20, 50)
                else:
                    base_cases = random.randint(5, 25)
                
                # Seasonal adjustments
                month = current_date.month
                if disease == "Dengue" and month in [8, 9, 10]:
                    base_cases = int(base_cases * 3)
                elif disease == "Malaria" and month in [7, 8, 9]:
                    base_cases = int(base_cases * 2.5)
                elif disease == "Acute Respiratory Infection" and month in [11, 12, 1, 2]:
                    base_cases = int(base_cases * 2)
                elif disease == "Acute Diarrheal Disease" and month in [6, 7, 8]:
                    base_cases = int(base_cases * 2)
                
                data.append({
                    "week_start": current_date.strftime("%Y-%m-%d"),
                    "disease": disease,
                    "cases_reported": base_cases,
                    "deaths": 0 if random.random() > 0.05 else random.randint(0, 2)
                })
        
        current_date += timedelta(days=1)
    
    df = pd.DataFrame(data)
    return df


def generate_all_data():
    """Generate all data files"""
    print("🔄 Generating comprehensive PHC data...")
    
    # Time range: 24 months of historical data
    end_date = datetime(2026, 1, 20)  # Current date
    start_date = end_date - timedelta(days=730)  # 24 months ago
    
    # Generate all datasets
    print("  📋 Medicines master...")
    medicines_df = generate_medicines_master()
    
    print("  📊 Consumption log (24 months)...")
    consumption_df = generate_consumption_log(start_date, end_date)
    
    print("  📦 Current inventory...")
    inventory_df = generate_current_inventory(end_date)
    
    print("  👥 Patient footfall...")
    footfall_df = generate_patient_footfall(start_date, end_date)
    
    print("  🛒 Purchase history...")
    purchase_df = generate_purchase_history(start_date, end_date)
    
    print("  🏢 Suppliers...")
    suppliers_df = generate_suppliers()
    
    print("  🏥 Disease surveillance...")
    disease_df = generate_disease_surveillance(start_date, end_date)
    
    # Save to CSV
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    
    medicines_df.to_csv(DATA_DIR / "medicines_master.csv", index=False)
    consumption_df.to_csv(DATA_DIR / "consumption_log.csv", index=False)
    inventory_df.to_csv(DATA_DIR / "current_inventory.csv", index=False)
    footfall_df.to_csv(DATA_DIR / "patient_footfall.csv", index=False)
    purchase_df.to_csv(DATA_DIR / "purchase_history.csv", index=False)
    suppliers_df.to_csv(DATA_DIR / "suppliers.csv", index=False)
    disease_df.to_csv(DATA_DIR / "disease_surveillance.csv", index=False)
    
    print("\n✅ Data generation complete!")
    print(f"  • {len(medicines_df)} medicines")
    print(f"  • {len(consumption_df)} consumption records")
    print(f"  • {len(inventory_df)} inventory batches")
    print(f"  • {len(footfall_df)} footfall records")
    print(f"  • {len(purchase_df)} purchase records")
    print(f"  • {len(suppliers_df)} suppliers")
    print(f"  • {len(disease_df)} disease surveillance records")
    
    return {
        "medicines": medicines_df,
        "consumption": consumption_df,
        "inventory": inventory_df,
        "footfall": footfall_df,
        "purchase": purchase_df,
        "suppliers": suppliers_df,
        "disease": disease_df
    }


if __name__ == "__main__":
    generate_all_data()

