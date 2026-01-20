"""
MedPredict AI - Synthetic Data Generator
Generates realistic medical supply chain data for hackathon demo

Data includes:
- Medicine master list (150 items typical for PHC)
- 18 months of historical purchase data
- Daily consumption logs
- Patient footfall data
- Disease surveillance data (weekly)
- Current inventory snapshot
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import os

# Set random seed for reproducibility
np.random.seed(42)
random.seed(42)

# Configuration
START_DATE = datetime(2024, 7, 1)  # 18 months of data
END_DATE = datetime(2026, 1, 19)
OUTPUT_DIR = "data"

# ============================================================================
# MEDICINE MASTER DATA
# ============================================================================

MEDICINES = [
    # Diabetes medicines (high growth trend)
    {"id": 1, "name": "Metformin 500mg", "category": "Diabetes", "unit": "tablet", "base_daily": 60, "growth_rate": 0.12, "shelf_life": 730, "cost": 1.5},
    {"id": 2, "name": "Metformin 850mg", "category": "Diabetes", "unit": "tablet", "base_daily": 30, "growth_rate": 0.12, "shelf_life": 730, "cost": 2.0},
    {"id": 3, "name": "Glimepiride 1mg", "category": "Diabetes", "unit": "tablet", "base_daily": 25, "growth_rate": 0.10, "shelf_life": 730, "cost": 3.5},
    {"id": 4, "name": "Glimepiride 2mg", "category": "Diabetes", "unit": "tablet", "base_daily": 20, "growth_rate": 0.10, "shelf_life": 730, "cost": 4.0},
    {"id": 5, "name": "Insulin Human 40IU", "category": "Diabetes", "unit": "vial", "base_daily": 2, "growth_rate": 0.15, "shelf_life": 180, "cost": 85.0},
    
    # Hypertension medicines
    {"id": 6, "name": "Amlodipine 5mg", "category": "Hypertension", "unit": "tablet", "base_daily": 45, "growth_rate": 0.08, "shelf_life": 730, "cost": 2.5},
    {"id": 7, "name": "Amlodipine 10mg", "category": "Hypertension", "unit": "tablet", "base_daily": 25, "growth_rate": 0.08, "shelf_life": 730, "cost": 3.5},
    {"id": 8, "name": "Enalapril 5mg", "category": "Hypertension", "unit": "tablet", "base_daily": 30, "growth_rate": 0.06, "shelf_life": 730, "cost": 4.0},
    {"id": 9, "name": "Losartan 50mg", "category": "Hypertension", "unit": "tablet", "base_daily": 35, "growth_rate": 0.07, "shelf_life": 730, "cost": 5.0},
    {"id": 10, "name": "Atenolol 50mg", "category": "Hypertension", "unit": "tablet", "base_daily": 40, "growth_rate": 0.05, "shelf_life": 730, "cost": 2.0},
    
    # Antibiotics
    {"id": 11, "name": "Amoxicillin 500mg", "category": "Antibiotic", "unit": "capsule", "base_daily": 50, "growth_rate": 0.02, "shelf_life": 730, "cost": 3.0},
    {"id": 12, "name": "Azithromycin 500mg", "category": "Antibiotic", "unit": "tablet", "base_daily": 25, "growth_rate": 0.02, "shelf_life": 730, "cost": 15.0},
    {"id": 13, "name": "Ciprofloxacin 500mg", "category": "Antibiotic", "unit": "tablet", "base_daily": 30, "growth_rate": 0.02, "shelf_life": 730, "cost": 8.0},
    {"id": 14, "name": "Metronidazole 400mg", "category": "Antibiotic", "unit": "tablet", "base_daily": 40, "growth_rate": 0.02, "shelf_life": 730, "cost": 2.5},
    {"id": 15, "name": "Doxycycline 100mg", "category": "Antibiotic", "unit": "capsule", "base_daily": 20, "growth_rate": 0.02, "shelf_life": 730, "cost": 5.0},
    
    # Pain/Fever (high volume, seasonal winter spike)
    {"id": 16, "name": "Paracetamol 500mg", "category": "Analgesic", "unit": "tablet", "base_daily": 150, "growth_rate": 0.01, "shelf_life": 1095, "cost": 0.5},
    {"id": 17, "name": "Paracetamol 650mg", "category": "Analgesic", "unit": "tablet", "base_daily": 80, "growth_rate": 0.01, "shelf_life": 1095, "cost": 0.8},
    {"id": 18, "name": "Ibuprofen 400mg", "category": "Analgesic", "unit": "tablet", "base_daily": 40, "growth_rate": 0.01, "shelf_life": 730, "cost": 1.5},
    {"id": 19, "name": "Diclofenac 50mg", "category": "Analgesic", "unit": "tablet", "base_daily": 35, "growth_rate": 0.01, "shelf_life": 730, "cost": 2.0},
    
    # Respiratory (winter spike)
    {"id": 20, "name": "Cetirizine 10mg", "category": "Antihistamine", "unit": "tablet", "base_daily": 30, "growth_rate": 0.02, "shelf_life": 730, "cost": 2.0},
    {"id": 21, "name": "Salbutamol Inhaler", "category": "Respiratory", "unit": "inhaler", "base_daily": 3, "growth_rate": 0.03, "shelf_life": 365, "cost": 120.0},
    {"id": 22, "name": "Cough Syrup (Dextromethorphan)", "category": "Respiratory", "unit": "bottle", "base_daily": 8, "growth_rate": 0.01, "shelf_life": 730, "cost": 45.0},
    {"id": 23, "name": "Montelukast 10mg", "category": "Respiratory", "unit": "tablet", "base_daily": 15, "growth_rate": 0.04, "shelf_life": 730, "cost": 8.0},
    
    # Gastrointestinal (monsoon spike for ORS)
    {"id": 24, "name": "ORS Sachets", "category": "GI", "unit": "sachet", "base_daily": 25, "growth_rate": 0.01, "shelf_life": 1095, "cost": 5.0},
    {"id": 25, "name": "Omeprazole 20mg", "category": "GI", "unit": "capsule", "base_daily": 50, "growth_rate": 0.03, "shelf_life": 730, "cost": 3.0},
    {"id": 26, "name": "Pantoprazole 40mg", "category": "GI", "unit": "tablet", "base_daily": 40, "growth_rate": 0.03, "shelf_life": 730, "cost": 4.0},
    {"id": 27, "name": "Ranitidine 150mg", "category": "GI", "unit": "tablet", "base_daily": 30, "growth_rate": 0.01, "shelf_life": 730, "cost": 2.0},
    {"id": 28, "name": "Ondansetron 4mg", "category": "GI", "unit": "tablet", "base_daily": 15, "growth_rate": 0.02, "shelf_life": 730, "cost": 5.0},
    
    # Anti-malarials (monsoon spike)
    {"id": 29, "name": "Chloroquine 250mg", "category": "Antimalarial", "unit": "tablet", "base_daily": 5, "growth_rate": 0.01, "shelf_life": 1095, "cost": 3.0},
    {"id": 30, "name": "Artemether-Lumefantrine", "category": "Antimalarial", "unit": "tablet", "base_daily": 8, "growth_rate": 0.02, "shelf_life": 730, "cost": 25.0},
    {"id": 31, "name": "Primaquine 15mg", "category": "Antimalarial", "unit": "tablet", "base_daily": 5, "growth_rate": 0.01, "shelf_life": 730, "cost": 4.0},
    
    # Vaccines (cold chain, expiry critical)
    {"id": 32, "name": "BCG Vaccine", "category": "Vaccine", "unit": "vial", "base_daily": 2, "growth_rate": 0.02, "shelf_life": 180, "cost": 50.0},
    {"id": 33, "name": "OPV Vaccine", "category": "Vaccine", "unit": "vial", "base_daily": 3, "growth_rate": 0.02, "shelf_life": 180, "cost": 25.0},
    {"id": 34, "name": "Pentavalent Vaccine", "category": "Vaccine", "unit": "vial", "base_daily": 4, "growth_rate": 0.03, "shelf_life": 180, "cost": 150.0},
    {"id": 35, "name": "Measles Vaccine", "category": "Vaccine", "unit": "vial", "base_daily": 2, "growth_rate": 0.02, "shelf_life": 180, "cost": 35.0},
    {"id": 36, "name": "TT Vaccine", "category": "Vaccine", "unit": "vial", "base_daily": 3, "growth_rate": 0.01, "shelf_life": 365, "cost": 20.0},
    
    # IV Fluids
    {"id": 37, "name": "Normal Saline 500ml", "category": "IV Fluid", "unit": "bottle", "base_daily": 10, "growth_rate": 0.02, "shelf_life": 730, "cost": 35.0},
    {"id": 38, "name": "Ringer Lactate 500ml", "category": "IV Fluid", "unit": "bottle", "base_daily": 8, "growth_rate": 0.02, "shelf_life": 730, "cost": 40.0},
    {"id": 39, "name": "Dextrose 5% 500ml", "category": "IV Fluid", "unit": "bottle", "base_daily": 6, "growth_rate": 0.02, "shelf_life": 730, "cost": 38.0},
    
    # Vitamins & Supplements
    {"id": 40, "name": "Iron + Folic Acid", "category": "Supplement", "unit": "tablet", "base_daily": 60, "growth_rate": 0.03, "shelf_life": 730, "cost": 1.0},
    {"id": 41, "name": "Calcium + Vitamin D3", "category": "Supplement", "unit": "tablet", "base_daily": 40, "growth_rate": 0.04, "shelf_life": 730, "cost": 2.5},
    {"id": 42, "name": "Multivitamin Syrup", "category": "Supplement", "unit": "bottle", "base_daily": 5, "growth_rate": 0.02, "shelf_life": 365, "cost": 55.0},
    {"id": 43, "name": "Vitamin B Complex", "category": "Supplement", "unit": "tablet", "base_daily": 30, "growth_rate": 0.02, "shelf_life": 730, "cost": 1.5},
    
    # Dermatology
    {"id": 44, "name": "Betamethasone Cream", "category": "Dermatology", "unit": "tube", "base_daily": 4, "growth_rate": 0.01, "shelf_life": 730, "cost": 25.0},
    {"id": 45, "name": "Clotrimazole Cream", "category": "Dermatology", "unit": "tube", "base_daily": 5, "growth_rate": 0.01, "shelf_life": 730, "cost": 30.0},
    {"id": 46, "name": "Permethrin Lotion", "category": "Dermatology", "unit": "bottle", "base_daily": 3, "growth_rate": 0.01, "shelf_life": 730, "cost": 40.0},
    
    # Emergency
    {"id": 47, "name": "Adrenaline 1mg/ml", "category": "Emergency", "unit": "ampoule", "base_daily": 1, "growth_rate": 0.01, "shelf_life": 365, "cost": 15.0},
    {"id": 48, "name": "Hydrocortisone 100mg", "category": "Emergency", "unit": "vial", "base_daily": 2, "growth_rate": 0.01, "shelf_life": 365, "cost": 45.0},
    {"id": 49, "name": "Atropine 0.6mg/ml", "category": "Emergency", "unit": "ampoule", "base_daily": 1, "growth_rate": 0.01, "shelf_life": 365, "cost": 12.0},
    {"id": 50, "name": "Diazepam 5mg/ml", "category": "Emergency", "unit": "ampoule", "base_daily": 2, "growth_rate": 0.01, "shelf_life": 365, "cost": 20.0},
]

# Suppliers
SUPPLIERS = [
    {"id": 1, "name": "MedPlus Wholesale", "lead_time_days": 3, "reliability": 0.95},
    {"id": 2, "name": "Apollo Pharmacy Dist.", "lead_time_days": 2, "reliability": 0.98},
    {"id": 3, "name": "Generic Pharma India", "lead_time_days": 5, "reliability": 0.90},
    {"id": 4, "name": "State Medical Store", "lead_time_days": 7, "reliability": 0.85},
    {"id": 5, "name": "Zydus Healthcare", "lead_time_days": 4, "reliability": 0.92},
]

# Disease surveillance data
DISEASES = [
    {"name": "Dengue", "peak_months": [7, 8, 9, 10], "base_cases": 5},
    {"name": "Malaria", "peak_months": [6, 7, 8, 9], "base_cases": 8},
    {"name": "Diarrhea", "peak_months": [6, 7, 8, 9], "base_cases": 20},
    {"name": "Typhoid", "peak_months": [6, 7, 8, 9, 10], "base_cases": 3},
    {"name": "Influenza", "peak_months": [11, 12, 1, 2], "base_cases": 15},
    {"name": "Respiratory Infections", "peak_months": [11, 12, 1, 2], "base_cases": 25},
    {"name": "Viral Fever", "peak_months": [3, 4, 5, 6, 7, 8], "base_cases": 30},
    {"name": "Conjunctivitis", "peak_months": [7, 8, 9], "base_cases": 10},
]


def get_seasonal_multiplier(date, medicine):
    """Calculate seasonal demand multiplier based on medicine category and date"""
    month = date.month
    category = medicine["category"]
    
    # Monsoon season (June-September) - spike for GI, antimalarials
    if category in ["GI", "Antimalarial"] and month in [6, 7, 8, 9]:
        return np.random.uniform(2.0, 3.5)
    
    # Monsoon - also spike for antibiotics (waterborne diseases)
    if category == "Antibiotic" and month in [6, 7, 8, 9]:
        return np.random.uniform(1.3, 1.8)
    
    # Winter (November-February) - spike for respiratory, analgesics
    if category in ["Respiratory", "Antihistamine"] and month in [11, 12, 1, 2]:
        return np.random.uniform(1.8, 2.5)
    
    if category == "Analgesic" and month in [11, 12, 1, 2]:
        return np.random.uniform(1.5, 2.0)
    
    # Summer (March-May) - slight spike for IV fluids (dehydration)
    if category == "IV Fluid" and month in [3, 4, 5]:
        return np.random.uniform(1.2, 1.5)
    
    return np.random.uniform(0.85, 1.15)


def get_growth_factor(date, medicine):
    """Calculate growth factor based on time elapsed and growth rate"""
    days_elapsed = (date - START_DATE).days
    years_elapsed = days_elapsed / 365
    growth_rate = medicine["growth_rate"]
    return 1 + (growth_rate * years_elapsed)


def generate_medicines_master():
    """Generate medicine master data"""
    records = []
    for med in MEDICINES:
        records.append({
            "medicine_id": med["id"],
            "name": med["name"],
            "category": med["category"],
            "unit": med["unit"],
            "reorder_level": int(med["base_daily"] * 14),  # 2 weeks buffer
            "shelf_life_days": med["shelf_life"],
            "unit_cost_inr": med["cost"],
        })
    return pd.DataFrame(records)


def generate_consumption_log():
    """Generate daily consumption data with realistic patterns"""
    records = []
    current_date = START_DATE
    
    while current_date <= END_DATE:
        # Skip some days randomly (holidays, Sundays)
        if current_date.weekday() == 6:  # Sunday - reduced
            day_factor = 0.3
        elif random.random() < 0.02:  # Random holidays
            day_factor = 0.1
        else:
            day_factor = 1.0
        
        for med in MEDICINES:
            base_consumption = med["base_daily"]
            
            # Apply seasonal multiplier
            seasonal_mult = get_seasonal_multiplier(current_date, med)
            
            # Apply growth factor
            growth_factor = get_growth_factor(current_date, med)
            
            # Calculate daily consumption with randomness
            daily_consumption = int(
                base_consumption * 
                seasonal_mult * 
                growth_factor * 
                day_factor * 
                np.random.uniform(0.7, 1.3)
            )
            
            # Simulate occasional stockouts (consumption = 0)
            if random.random() < 0.02:  # 2% stockout days
                daily_consumption = 0
            
            if daily_consumption > 0:
                # Patient count roughly correlates with consumption
                patient_count = max(1, int(daily_consumption * np.random.uniform(0.3, 0.6)))
                
                records.append({
                    "date": current_date.strftime("%Y-%m-%d"),
                    "medicine_id": med["id"],
                    "quantity_dispensed": daily_consumption,
                    "patient_count": patient_count,
                })
        
        current_date += timedelta(days=1)
    
    return pd.DataFrame(records)


def generate_purchase_history():
    """Generate purchase order history"""
    records = []
    batch_counter = 1000
    
    for med in MEDICINES:
        current_date = START_DATE
        
        while current_date <= END_DATE:
            # Order frequency varies by consumption rate
            if med["base_daily"] > 50:
                order_interval = random.randint(14, 21)  # High volume - order every 2-3 weeks
            elif med["base_daily"] > 20:
                order_interval = random.randint(21, 35)  # Medium volume - every 3-5 weeks
            else:
                order_interval = random.randint(30, 60)  # Low volume - every 1-2 months
            
            # Calculate order quantity (roughly 1.5x expected consumption)
            expected_consumption = med["base_daily"] * order_interval
            order_quantity = int(expected_consumption * np.random.uniform(1.3, 1.8))
            
            # Select supplier
            supplier = random.choice(SUPPLIERS)
            
            # Calculate expiry date based on shelf life
            expiry_date = current_date + timedelta(days=med["shelf_life"])
            
            batch_counter += 1
            
            records.append({
                "purchase_date": current_date.strftime("%Y-%m-%d"),
                "medicine_id": med["id"],
                "batch_no": f"B{batch_counter}",
                "quantity": order_quantity,
                "unit_cost_inr": med["cost"] * np.random.uniform(0.95, 1.05),
                "total_cost_inr": order_quantity * med["cost"] * np.random.uniform(0.95, 1.05),
                "supplier_id": supplier["id"],
                "supplier_name": supplier["name"],
                "expiry_date": expiry_date.strftime("%Y-%m-%d"),
                "received_date": (current_date + timedelta(days=supplier["lead_time_days"])).strftime("%Y-%m-%d"),
            })
            
            current_date += timedelta(days=order_interval)
    
    df = pd.DataFrame(records)
    return df.sort_values("purchase_date").reset_index(drop=True)


def generate_current_inventory():
    """Generate current inventory snapshot"""
    records = []
    
    for med in MEDICINES:
        # Generate 1-3 batches per medicine
        num_batches = random.randint(1, 3)
        
        for i in range(num_batches):
            # Random received date in last 3 months
            days_ago = random.randint(7, 90)
            received_date = END_DATE - timedelta(days=days_ago)
            expiry_date = received_date + timedelta(days=med["shelf_life"])
            
            # Quantity varies - some items low stock, some overstocked
            stock_factor = np.random.choice([0.3, 0.5, 1.0, 1.5, 2.0], p=[0.15, 0.2, 0.35, 0.2, 0.1])
            quantity = int(med["base_daily"] * 14 * stock_factor)  # Base is 2 weeks supply
            
            batch_no = f"B{random.randint(2000, 3000)}"
            
            records.append({
                "medicine_id": med["id"],
                "medicine_name": med["name"],
                "category": med["category"],
                "batch_no": batch_no,
                "quantity": quantity,
                "unit": med["unit"],
                "expiry_date": expiry_date.strftime("%Y-%m-%d"),
                "received_date": received_date.strftime("%Y-%m-%d"),
                "unit_cost_inr": med["cost"],
                "total_value_inr": quantity * med["cost"],
                "days_to_expiry": (expiry_date - END_DATE).days,
            })
    
    return pd.DataFrame(records)


def generate_patient_footfall():
    """Generate daily patient footfall data"""
    records = []
    current_date = START_DATE
    
    base_opd = 200  # Base OPD patients per day
    base_ipd = 40   # Base IPD admissions
    base_emergency = 10
    
    while current_date <= END_DATE:
        month = current_date.month
        day_of_week = current_date.weekday()
        
        # Sunday reduced
        if day_of_week == 6:
            day_factor = 0.4
        elif day_of_week == 5:  # Saturday slightly reduced
            day_factor = 0.8
        else:
            day_factor = 1.0
        
        # Seasonal variations
        if month in [6, 7, 8, 9]:  # Monsoon - higher cases
            seasonal_factor = 1.3
        elif month in [11, 12, 1, 2]:  # Winter - respiratory issues
            seasonal_factor = 1.2
        else:
            seasonal_factor = 1.0
        
        # Growth trend
        days_elapsed = (current_date - START_DATE).days
        growth_factor = 1 + (0.05 * days_elapsed / 365)  # 5% annual growth
        
        opd_count = int(base_opd * day_factor * seasonal_factor * growth_factor * np.random.uniform(0.85, 1.15))
        ipd_count = int(base_ipd * day_factor * seasonal_factor * growth_factor * np.random.uniform(0.7, 1.3))
        emergency_count = int(base_emergency * seasonal_factor * np.random.uniform(0.5, 2.0))
        
        records.append({
            "date": current_date.strftime("%Y-%m-%d"),
            "opd_count": opd_count,
            "ipd_count": ipd_count,
            "emergency_count": emergency_count,
            "total_patients": opd_count + ipd_count + emergency_count,
        })
        
        current_date += timedelta(days=1)
    
    return pd.DataFrame(records)


def generate_disease_surveillance():
    """Generate weekly disease surveillance data"""
    records = []
    current_date = START_DATE
    
    while current_date <= END_DATE:
        week_num = current_date.isocalendar()[1]
        year = current_date.year
        month = current_date.month
        
        for disease in DISEASES:
            base_cases = disease["base_cases"]
            
            # Peak season multiplier
            if month in disease["peak_months"]:
                seasonal_mult = np.random.uniform(2.5, 4.0)
            else:
                seasonal_mult = np.random.uniform(0.3, 0.8)
            
            # Random outbreaks
            if random.random() < 0.05:  # 5% chance of outbreak
                outbreak_mult = np.random.uniform(2.0, 5.0)
            else:
                outbreak_mult = 1.0
            
            case_count = int(base_cases * seasonal_mult * outbreak_mult * np.random.uniform(0.7, 1.3))
            
            records.append({
                "week_start_date": current_date.strftime("%Y-%m-%d"),
                "year": year,
                "week_number": week_num,
                "disease": disease["name"],
                "case_count": case_count,
                "district": "Rangareddy",
                "state": "Telangana",
            })
        
        current_date += timedelta(days=7)
    
    return pd.DataFrame(records)


def generate_suppliers():
    """Generate supplier master data"""
    records = []
    for supplier in SUPPLIERS:
        records.append({
            "supplier_id": supplier["id"],
            "supplier_name": supplier["name"],
            "lead_time_days": supplier["lead_time_days"],
            "reliability_score": supplier["reliability"],
            "contact_phone": f"+91 98{random.randint(10000000, 99999999)}",
            "email": f"{supplier['name'].lower().replace(' ', '').replace('.', '')}@email.com",
            "address": f"Hyderabad, Telangana",
        })
    return pd.DataFrame(records)


def main():
    """Generate all datasets and save to CSV files"""
    print("=" * 60)
    print("MedPredict AI - Synthetic Data Generator")
    print("=" * 60)
    
    # Create output directory
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Generate and save each dataset
    print("\n📦 Generating Medicine Master Data...")
    medicines_df = generate_medicines_master()
    medicines_df.to_csv(f"{OUTPUT_DIR}/medicines_master.csv", index=False)
    print(f"   ✅ {len(medicines_df)} medicines saved")
    
    print("\n📊 Generating Consumption Log (18 months)...")
    consumption_df = generate_consumption_log()
    consumption_df.to_csv(f"{OUTPUT_DIR}/consumption_log.csv", index=False)
    print(f"   ✅ {len(consumption_df)} consumption records saved")
    
    print("\n🛒 Generating Purchase History...")
    purchase_df = generate_purchase_history()
    purchase_df.to_csv(f"{OUTPUT_DIR}/purchase_history.csv", index=False)
    print(f"   ✅ {len(purchase_df)} purchase records saved")
    
    print("\n📦 Generating Current Inventory Snapshot...")
    inventory_df = generate_current_inventory()
    inventory_df.to_csv(f"{OUTPUT_DIR}/current_inventory.csv", index=False)
    print(f"   ✅ {len(inventory_df)} inventory records saved")
    
    print("\n👥 Generating Patient Footfall Data...")
    footfall_df = generate_patient_footfall()
    footfall_df.to_csv(f"{OUTPUT_DIR}/patient_footfall.csv", index=False)
    print(f"   ✅ {len(footfall_df)} daily records saved")
    
    print("\n🦠 Generating Disease Surveillance Data...")
    disease_df = generate_disease_surveillance()
    disease_df.to_csv(f"{OUTPUT_DIR}/disease_surveillance.csv", index=False)
    print(f"   ✅ {len(disease_df)} weekly records saved")
    
    print("\n🏭 Generating Supplier Data...")
    suppliers_df = generate_suppliers()
    suppliers_df.to_csv(f"{OUTPUT_DIR}/suppliers.csv", index=False)
    print(f"   ✅ {len(suppliers_df)} suppliers saved")
    
    # Generate summary statistics
    print("\n" + "=" * 60)
    print("📈 DATA SUMMARY")
    print("=" * 60)
    print(f"\nDate Range: {START_DATE.strftime('%Y-%m-%d')} to {END_DATE.strftime('%Y-%m-%d')}")
    print(f"Total Days: {(END_DATE - START_DATE).days}")
    print(f"\nDatasets Generated:")
    print(f"  • medicines_master.csv    : {len(medicines_df)} items")
    print(f"  • consumption_log.csv     : {len(consumption_df)} records")
    print(f"  • purchase_history.csv    : {len(purchase_df)} orders")
    print(f"  • current_inventory.csv   : {len(inventory_df)} batches")
    print(f"  • patient_footfall.csv    : {len(footfall_df)} daily records")
    print(f"  • disease_surveillance.csv: {len(disease_df)} weekly reports")
    print(f"  • suppliers.csv           : {len(suppliers_df)} suppliers")
    
    # Key statistics
    print(f"\n📊 Key Statistics:")
    total_consumption = consumption_df["quantity_dispensed"].sum()
    total_purchase_value = purchase_df["total_cost_inr"].sum()
    avg_daily_patients = footfall_df["total_patients"].mean()
    
    print(f"  • Total units dispensed   : {total_consumption:,}")
    print(f"  • Total purchase value    : ₹{total_purchase_value:,.2f}")
    print(f"  • Avg daily patients      : {avg_daily_patients:.0f}")
    
    # Expiry risk items
    expiring_soon = inventory_df[inventory_df["days_to_expiry"] < 60]
    print(f"  • Items expiring <60 days : {len(expiring_soon)} batches")
    
    # Low stock items
    low_stock = inventory_df.groupby("medicine_id")["quantity"].sum().reset_index()
    medicines_info = medicines_df[["medicine_id", "reorder_level", "name"]]
    low_stock = low_stock.merge(medicines_info, on="medicine_id")
    low_stock = low_stock[low_stock["quantity"] < low_stock["reorder_level"]]
    print(f"  • Items below reorder level: {len(low_stock)} medicines")
    
    print("\n" + "=" * 60)
    print("✅ All data files saved to ./data/ directory")
    print("=" * 60)


if __name__ == "__main__":
    main()

