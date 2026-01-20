# MedPredict AI: Intelligent Medical Supply Forecasting

## 🎯 The Human Story

> *"When metformin runs out at our PHC, diabetic patients travel 40km to the district hospital—many just skip their medication for weeks. Last monsoon, we had zero ORS sachets during a diarrhea outbreak. Three children were referred out who could have been treated here."*
> — Medical Officer, Rural PHC, Telangana

---

## 📊 The Problem

### Scale of Impact
- **$25.7 billion** wasted annually on healthcare supply chain inefficiencies globally
- **66% medicine availability** in Indian Primary Health Centers (vs. ideal 100%)
- **1-7 month stockouts** for critical diabetes and hypertension drugs in rural facilities

### Root Causes

| Problem | Current Reality | Impact |
|---------|-----------------|--------|
| **Gut-feel forecasting** | Staff estimate based on last year's total consumption | Doesn't account for disease prevalence trends, seasonal spikes |
| **No expiry tracking** | 8% of supplies expire unused | ₹8 lakhs/year loss for a clinic spending ₹1 crore |
| **Zero real-time visibility** | Manual registers, Excel sheets, or nothing | Staff discover stockouts when patient is at counter |
| **Seasonal blindness** | Monsoon medicines stocked in January | Capital locked in useless inventory |

### Specific Evidence
- **35%** of rural sub-centers reported metformin stockouts
- **45%** lacked amlodipine (basic BP medication)
- **15%** of vaccines expire due to poor cold chain monitoring
- **6.25%** of supply budget locked in carrying costs for excess inventory

---

## 💡 Our Solution: MedPredict AI

### What It Is
An AI-powered demand forecasting system that predicts medicine and supply needs **2-4 weeks ahead**, generates smart alerts, and reduces both stockouts and waste.

### What Makes Us Different

| Existing Solutions | MedPredict AI Advantage |
|--------------------|-------------------------|
| **mSupply, DHIS2, OpenLMIS**: Inventory management systems—track what you have, not what you'll need | **Predictive AI**: We forecast future demand using ML models |
| Generic global tools | **India-specific**: Trained on Indian disease patterns, IDSP data, monsoon seasonality |
| Complex enterprise software | **PHC-first design**: Works offline, minimal training, WhatsApp-based alerts |
| Require clean structured data | **Messy data tolerant**: Handles incomplete records common in rural settings |

---

## 🔧 Technical Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        MedPredict AI Architecture                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐  │
│  │ DATA INPUTS  │    │  AI ENGINE   │    │      OUTPUTS         │  │
│  ├──────────────┤    ├──────────────┤    ├──────────────────────┤  │
│  │              │    │              │    │                      │  │
│  │ • Inventory  │───▶│ Prophet/ARIMA│───▶│ • Reorder alerts     │  │
│  │   snapshots  │    │ Time-series  │    │ • Stockout warnings  │  │
│  │              │    │              │    │ • Expiry alerts      │  │
│  │ • Purchase   │───▶│ XGBoost      │───▶│ • Seasonal prep      │  │
│  │   history    │    │ Demand model │    │   recommendations    │  │
│  │              │    │              │    │                      │  │
│  │ • Patient    │───▶│ Rule engine  │───▶│ • Weekly order       │  │
│  │   footfall   │    │ (expiry/     │    │   suggestions        │  │
│  │              │    │  thresholds) │    │                      │  │
│  │ • Seasonal   │    │              │    │                      │  │
│  │   patterns   │    │              │    │                      │  │
│  └──────────────┘    └──────────────┘    └──────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    DELIVERY CHANNELS                          │   │
│  │  📱 Mobile App  │  💬 WhatsApp Bot  │  📊 Web Dashboard       │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### AI/ML Components

#### 1. Demand Forecasting Model
- **Algorithm**: Facebook Prophet (handles seasonality well) + XGBoost ensemble
- **Why Prophet**: Built for business time-series with strong seasonal patterns, robust to missing data
- **Training data**: 12-24 months of historical consumption
- **Features**:
  - Day-of-week, month, holiday effects
  - Seasonal disease indices (monsoon, winter flu)
  - Patient footfall trends
  - Local outbreak signals

#### 2. Expiry Risk Scorer
- **Logic**: Compare predicted consumption rate vs. remaining shelf life
- **Output**: Risk score (0-100) for each batch
- **Alert threshold**: Score > 70 triggers "use first" or "redistribute" alert

#### 3. Anomaly Detection
- **Algorithm**: Isolation Forest
- **Purpose**: Flag unusual consumption spikes (potential outbreak) or drops (data entry error)

### Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Backend** | Python, FastAPI | Fast development, great ML ecosystem |
| **ML/AI** | Prophet, XGBoost, scikit-learn | Production-ready, interpretable models |
| **Database** | PostgreSQL + TimescaleDB | Time-series optimized for historical data |
| **Frontend** | React Native (mobile), Next.js (dashboard) | Cross-platform, offline-capable |
| **Alerts** | Twilio (WhatsApp/SMS) | Works on feature phones, no app install needed |
| **Deployment** | Docker, AWS/GCP | Scalable, cost-effective |

---

## 📱 User Interface Design

### Primary Users
1. **PHC Pharmacist/Store In-charge**: Daily stock updates, receives alerts
2. **Medical Officer**: Reviews weekly reports, approves orders
3. **District Health Officer**: Multi-facility dashboard view

### Interface Channels

#### 1. WhatsApp Bot (Primary - requires no training)
```
┌────────────────────────────────────────┐
│ 🏥 MedPredict Daily Alert              │
│ PHC Kodigehalli, Jan 20                │
│                                        │
│ ⚠️ STOCKOUT RISK (Action needed)       │
│ • Metformin 500mg: 9 days left         │
│   Recommended order: 500 tablets       │
│                                        │
│ ⏰ EXPIRY WARNING                       │
│ • Insulin (Batch #2847): 45 days left  │
│   Predicted usage: 7 of 12 vials       │
│   💡 Consider redistribution           │
│                                        │
│ 🌧️ SEASONAL PREP                       │
│ • Monsoon starts in ~3 weeks           │
│   Stock up: ORS, anti-malarials        │
│                                        │
│ Reply: 1️⃣ View details                 │
│        2️⃣ Generate order               │
│        3️⃣ Mark as handled              │
└────────────────────────────────────────┘
```

#### 2. Mobile App (For stock entry)
- Simple barcode scanning (if available)
- Manual entry with auto-complete medicine names
- Works offline, syncs when connected

#### 3. Web Dashboard (For analysis)
- Consumption trends visualization
- Multi-month forecast view
- Supplier performance tracking
- Export reports for audits

---

## 📁 Data Strategy

### For Hackathon Demo: Synthetic Data Approach

We will generate **realistic synthetic data** based on:
- Published PHC consumption patterns from government reports
- IDSP (Integrated Disease Surveillance Programme) disease trends
- Seasonal patterns from medical literature

#### Synthetic Data Generator

```python
# Data generation approach
datasets = {
    "inventory_snapshot": {
        "fields": ["item_id", "item_name", "category", "quantity", 
                   "batch_no", "expiry_date", "unit_cost"],
        "records": 150,  # typical PHC formulary
    },
    "purchase_history": {
        "fields": ["date", "item_id", "quantity", "supplier", "cost"],
        "records": 1800,  # 18 months × ~100 orders/month
    },
    "consumption_log": {
        "fields": ["date", "item_id", "quantity_dispensed", "patient_count"],
        "records": 5400,  # 18 months daily consumption
    },
    "patient_footfall": {
        "fields": ["date", "opd_count", "ipd_count", "emergency_count"],
        "records": 540,  # 18 months daily
    },
    "disease_surveillance": {
        "fields": ["week", "disease", "case_count", "district"],
        "records": 78,  # 18 months weekly
    }
}
```

#### Realistic Patterns Embedded
- **Diabetes trend**: 12% YoY increase in metformin consumption
- **Monsoon spike**: 3x increase in ORS, anti-malarials during Jun-Sep
- **Winter spike**: 2x paracetamol, cough syrups in Dec-Feb
- **Random stockouts**: Historical gaps simulating real supply issues

### For Production: Data Sources

| Data Type | Source | Integration |
|-----------|--------|-------------|
| Inventory & purchases | Clinic's existing records (Excel/manual) | CSV upload or manual entry |
| Patient footfall | OPD registers, HMIS | API integration or manual |
| Disease surveillance | IDSP weekly reports | Public data scraping + API |
| Weather/seasonal | IMD (Indian Meteorological Dept) | API integration |
| Supplier data | Manual entry initially | Phase 3 integration |

---

## 🎯 Hackathon MVP Scope

### What We WILL Demo

| Feature | Description | AI Component |
|---------|-------------|--------------|
| **Demand Forecasting** | Predict next 4 weeks consumption for top 20 medicines | Prophet time-series model |
| **Stockout Alerts** | "Item X will run out in Y days" | Rule engine + forecast |
| **Expiry Warnings** | "Z units will expire before use" | Consumption rate prediction |
| **Seasonal Recommendations** | "Stock these items for monsoon" | Historical pattern matching |
| **Basic Dashboard** | Visualize predictions and alerts | React web app |

### What We WON'T Demo (Future Phases)
- ❌ Auto-generated purchase orders
- ❌ Supplier integration
- ❌ Multi-facility redistribution
- ❌ Cold chain monitoring
- ❌ Barcode scanning

---

## 📍 Use Case: Rural PHC in Telangana

### Setting
- **Facility**: 150-bed Primary Health Center
- **Coverage**: 50,000 population across 12 villages
- **Daily load**: 200 OPD patients, 40 IPD admissions
- **Staff**: 1 Medical Officer, 2 nurses, 1 pharmacist

### Current State vs. MedPredict AI

| Problem | Current State | With MedPredict AI |
|---------|---------------|-------------------|
| Metformin stockouts | Every 3-4 months | Predicted 3 weeks ahead, order generated |
| Monsoon prep | 500 units stocked in January | Stocked in May based on IMD forecast |
| Vaccine expiry | 15% wasted | <3% with FIFO alerts and redistribution suggestions |
| Stock counting | 2 hours/week manual | 15 min/day quick entry, auto-reconciliation |
| Demand estimation | Last year's total | Trend-adjusted (+12% for diabetes growth) |

### Sample Prediction Output

```
┌──────────────────────────────────────────────────────────────────┐
│           MEDPREDICT AI - WEEKLY FORECAST REPORT                 │
│           PHC Kodigehalli | Week of Jan 20-26, 2026              │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ MEDICINE         CURRENT  PREDICTED   DAYS    RECOMMENDED        │
│                  STOCK    WEEKLY USE  LEFT    ORDER              │
│ ─────────────────────────────────────────────────────────────── │
│ Metformin 500mg    450      180       2.5    ⚠️ ORDER 500 NOW    │
│ Amlodipine 5mg     320       85       3.8    ⚠️ ORDER 300 NOW    │
│ Paracetamol 500mg  800      200       4.0    📋 Order 400 soon   │
│ ORS sachets        200       40       5.0    ✅ Adequate         │
│ Insulin (vials)     12        3       4.0    📋 Check expiry     │
│                                                                  │
│ EXPIRY ALERTS:                                                   │
│ • Insulin Batch #2847 (12 vials) - Expires Feb 28               │
│   Predicted use by Feb 28: 7 vials                              │
│   Action: 5 vials at risk → Suggest redistribution              │
│                                                                  │
│ SEASONAL INSIGHT:                                                │
│ • Monsoon onset expected: June 15 (±7 days)                     │
│   Start stocking anti-malarials by May 15                       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## ⚠️ Risk Mitigation

| Risk | Mitigation Strategy |
|------|---------------------|
| **Poor data quality** | Data validation rules, outlier detection, graceful handling of missing values |
| **Staff adoption resistance** | WhatsApp-first approach (no new app to learn), gradual feature rollout |
| **Rural connectivity issues** | Offline-first mobile app, SMS fallback for critical alerts |
| **Model accuracy concerns** | Start with conservative predictions, improve with feedback loop |
| **Privacy/security** | No patient PII stored, only aggregate consumption data |

---

## 📈 Impact Metrics

### Quantifiable Outcomes (Projected)

| Metric | Before | After | Impact |
|--------|--------|-------|--------|
| Stockout days/year | 40 days | <5 days | **87.5% reduction** |
| Medicine expiry waste | 8% | 2% | **₹6 lakhs saved/year** |
| Staff time on inventory | 8 hrs/month | 2 hrs/month | **₹50,000 saved/year** |
| Procedure delays (supplies) | 30+/year | <5/year | **Better patient outcomes** |
| Capital locked in excess inventory | 6.25% | 3% | **Improved cash flow** |

### Pilot Projection (5 PHCs, 6 months)
- **250,000 patients** with improved medicine availability
- **₹30+ lakhs** saved across facilities
- **150+ stockout incidents** prevented

---

## 🚀 Why Now?

### Government Tailwinds
- **Ayushman Bharat Digital Mission (ABDM)**: Push for digitizing healthcare records
- **PM-JAY**: Increased patient load at public facilities
- **e-Aushadhi**: Government interest in medicine supply chain digitization

### Technology Readiness
- Time-series ML models are mature and production-ready
- WhatsApp Business API enables easy deployment
- Cloud costs have dropped, making AI accessible for public health

---

## 🎯 Customer Segments

### User vs. Buyer Matrix

| Segment | End User | Buyer (Decision Maker) | Budget Holder |
|---------|----------|------------------------|---------------|
| **Government PHCs** | Pharmacist, Medical Officer | District Health Officer, State NHM Director | State Health Department |
| **Community Health Centers (CHC)** | Store in-charge, MO | Block Medical Officer | District administration |
| **Private Clinics (Single)** | Clinic staff | Clinic Owner/Doctor | Same |
| **Private Clinic Chains** | Pharmacy staff | Operations Head | CFO/CEO |
| **Small Hospitals (< 100 beds)** | Pharmacy manager | Hospital Administrator | Owner/Management |
| **Hospital Chains** | Central pharmacy team | Supply Chain Head | CFO |
| **NGO Health Programs** | Field health workers | Program Manager | Donor/HQ |

### Primary Target (Year 1)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PRIMARY CUSTOMER: GOVERNMENT PHCs                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  WHY GOVERNMENT FIRST?                                              │
│  ├── 30,000+ PHCs in India - massive scale                          │
│  ├── Standardized formulary (easier to train models)                │
│  ├── Clear pain point (66% medicine availability)                   │
│  ├── Government push for digitization (ABDM, e-Aushadhi)           │
│  └── Social impact story (important for hackathons & grants)        │
│                                                                      │
│  CHALLENGES                                                          │
│  ├── Long sales cycles (6-18 months for tenders)                    │
│  ├── Budget constraints                                              │
│  └── Change management in bureaucracy                                │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Secondary Target (Year 2+)

| Segment | Size | Why Target? |
|---------|------|-------------|
| **Private clinic chains** | 500+ chains in India | Faster decision making, willingness to pay |
| **Small nursing homes** | 50,000+ facilities | High wastage, no existing solutions |
| **Pharma distributors** | 80,000+ | Want demand visibility, can fund adoption |

---

## 💼 Go-to-Market Strategy

### Phase 1: Pilot & Prove (Months 1-6)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         GO-TO-MARKET: PHASE 1                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  STRATEGY: Land with free pilots, expand with proof                 │
│                                                                      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │
│  │   PARTNER    │    │    PILOT     │    │    PROVE     │          │
│  │   with NGOs  │───▶│   5-10 PHCs  │───▶│  Case Study  │          │
│  │   & Govt     │    │   Free tier  │    │  & ROI Data  │          │
│  └──────────────┘    └──────────────┘    └──────────────┘          │
│                                                                      │
│  TARGET PARTNERS:                                                    │
│  • Telangana State Health Dept (existing PHC focus)                 │
│  • Swasth Alliance (health tech collective)                         │
│  • PATH / Clinton Health Access Initiative                          │
│  • Jan Swasthya Sahyog (NGO running rural hospitals)               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Phase 2: Government Scale (Months 6-18)

| Channel | Approach | Target |
|---------|----------|--------|
| **State NHM tenders** | Respond to RFPs for supply chain digitization | 2-3 states |
| **District partnerships** | Direct outreach to progressive District Collectors | 5-10 districts |
| **Central schemes** | Integrate with e-Aushadhi, ABDM initiatives | National visibility |
| **Conference presence** | Present at NHSRC, iGOT health events | Brand building |

### Phase 3: Private Expansion (Months 12-24)

| Channel | Approach | Target |
|---------|----------|--------|
| **Direct sales** | Inside sales team targeting clinic chains | 50+ chains |
| **Distributor partnerships** | Offer as value-add to pharma distributors | 10 distributors |
| **Clinic management software** | Integrate with Practo, Lybrate, etc. | 2-3 integrations |
| **Hospital associations** | Partner with IMA, AHPI | Association deals |

---

## 💰 Revenue Model

### Pricing Strategy

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MEDPREDICT AI - PRICING TIERS                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │
│  │    STARTER      │  │   PROFESSIONAL  │  │   ENTERPRISE    │     │
│  │    (Free)       │  │  ₹3,000/month   │  │    Custom       │     │
│  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤     │
│  │                 │  │                 │  │                 │     │
│  │ • 20 medicines  │  │ • Unlimited     │  │ • Multi-facility│     │
│  │ • Basic alerts  │  │   medicines     │  │   dashboard     │     │
│  │ • WhatsApp only │  │ • Full forecast │  │ • API access    │     │
│  │ • 1 facility    │  │ • Web dashboard │  │ • Custom models │     │
│  │                 │  │ • Expiry mgmt   │  │ • Dedicated     │     │
│  │                 │  │ • SMS + WhatsApp│  │   support       │     │
│  │                 │  │ • Email reports │  │ • SLA guarantee │     │
│  │                 │  │                 │  │ • On-premise    │     │
│  │                 │  │                 │  │   option        │     │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘     │
│                                                                      │
│  GOVERNMENT PRICING (District/State Level)                          │
│  ├── Per District: ₹5-8 lakhs/year (covers ~50-80 PHCs)            │
│  ├── Per State: ₹50-80 lakhs/year (all PHCs + CHCs)                │
│  └── Central: Custom pricing for national rollout                   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Revenue Streams

| Stream | Model | Year 1 | Year 2 | Year 3 |
|--------|-------|--------|--------|--------|
| **SaaS Subscriptions** | Monthly/annual per facility | ₹10L | ₹60L | ₹2Cr |
| **Government Contracts** | Annual license per district/state | ₹15L | ₹80L | ₹3Cr |
| **Implementation Services** | One-time setup + training | ₹5L | ₹20L | ₹50L |
| **Data Insights (Anonymized)** | Aggregated demand trends for pharma | - | ₹10L | ₹50L |
| **Total Revenue** | | **₹30L** | **₹1.7Cr** | **₹6Cr** |

### Alternative Revenue Models Considered

| Model | Description | Why/Why Not |
|-------|-------------|-------------|
| **Savings share** | Take 15-20% of documented savings | ✅ Aligned incentives, ❌ Hard to measure |
| **Per-transaction** | ₹5-10 per order generated | ✅ Usage-based, ❌ Complex to track |
| **Supplier-funded** | Distributors pay for demand visibility | ✅ Free for clinics, ❌ Conflict of interest |
| **Freemium** | Basic free, premium paid | ✅ Easy adoption, ❌ Low conversion in govt |

**Chosen Model**: Tiered SaaS + Government contracts (predictable, scalable)

---

## 📊 Unit Economics

### Per-Facility Economics

```
┌─────────────────────────────────────────────────────────────────────┐
│                      UNIT ECONOMICS (Per PHC)                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  REVENUE                                                             │
│  └── Monthly subscription: ₹3,000                                   │
│                                                                      │
│  COSTS (Monthly)                                                     │
│  ├── Cloud infrastructure (AWS/GCP): ₹200                           │
│  ├── WhatsApp Business API: ₹150                                    │
│  ├── SMS costs (backup): ₹50                                        │
│  ├── Customer support (allocated): ₹300                             │
│  └── Total COGS: ₹700                                               │
│                                                                      │
│  GROSS MARGIN                                                        │
│  └── ₹2,300/facility/month = 77% margin                             │
│                                                                      │
│  CUSTOMER VALUE                                                      │
│  ├── Avg savings per PHC: ₹6-8 lakhs/year                          │
│  ├── Our price: ₹36,000/year                                        │
│  └── ROI for customer: 17-22x                                       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Customer Acquisition Economics

| Metric | Government | Private Clinic |
|--------|------------|----------------|
| **Sales cycle** | 6-18 months | 1-3 months |
| **CAC (Customer Acquisition Cost)** | ₹50,000/district | ₹5,000/clinic |
| **ACV (Annual Contract Value)** | ₹5-8 lakhs/district | ₹36,000/clinic |
| **LTV (Lifetime Value)** | ₹15-24 lakhs (3 yr) | ₹1.08 lakhs (3 yr) |
| **LTV:CAC Ratio** | 3-5x | 20x+ |
| **Payback Period** | 6-12 months | 2 months |

### Market Size

```
┌─────────────────────────────────────────────────────────────────────┐
│                         MARKET SIZING (India)                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  TAM (Total Addressable Market)                                     │
│  ├── Healthcare supply chain software: $500M (₹4,200 Cr)           │
│  └── Growing at 15% CAGR                                            │
│                                                                      │
│  SAM (Serviceable Addressable Market)                               │
│  ├── PHCs: 30,000 × ₹36K = ₹108 Cr                                 │
│  ├── CHCs: 6,000 × ₹60K = ₹36 Cr                                   │
│  ├── Private clinics: 100,000 × ₹36K = ₹360 Cr                     │
│  ├── Small hospitals: 20,000 × ₹1.2L = ₹240 Cr                     │
│  └── Total SAM: ₹744 Cr                                             │
│                                                                      │
│  SOM (Serviceable Obtainable Market) - 3 Year Target                │
│  ├── 500 PHCs @ ₹3K/month = ₹1.8 Cr                                │
│  ├── 2 State contracts @ ₹60L = ₹1.2 Cr                            │
│  ├── 200 private clinics @ ₹3K/month = ₹72L                        │
│  └── Total SOM: ₹3.7 Cr ARR by Year 3                              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🛒 Sales Strategy

### Government Sales Playbook

```
┌─────────────────────────────────────────────────────────────────────┐
│                    GOVERNMENT SALES PROCESS                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  STEP 1: BUILD CREDIBILITY (Months 1-6)                             │
│  ├── Free pilots with 5-10 PHCs                                     │
│  ├── Document ROI with hard numbers                                 │
│  ├── Get testimonials from Medical Officers                         │
│  └── Publish case study                                             │
│                                                                      │
│  STEP 2: ENGAGE DECISION MAKERS (Months 4-12)                       │
│  ├── Present at District Health Committee meetings                  │
│  ├── Meet State NHM Director with case study                        │
│  ├── Align with existing initiatives (e-Aushadhi)                  │
│  └── Get on empanelled vendor list                                  │
│                                                                      │
│  STEP 3: RESPOND TO TENDERS (Months 8-18)                           │
│  ├── Monitor GeM, state health portals for RFPs                     │
│  ├── Pre-position by sharing solution with tender writers           │
│  ├── Submit competitive bids                                        │
│  └── Win through pilot success + lowest compliant bid               │
│                                                                      │
│  STEP 4: EXPAND (Months 12-24)                                      │
│  ├── Use state success to pitch neighboring states                  │
│  ├── Seek central govt recognition (Ministry of Health)             │
│  └── Become "default" supply chain solution for PHCs                │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Private Sector Sales Playbook

| Stage | Action | Timeline |
|-------|--------|----------|
| **Lead Generation** | Digital marketing, clinic associations, referrals | Ongoing |
| **Qualification** | Demo call, assess fit (>3 staff, >100 patients/day) | Day 1-3 |
| **Demo** | 30-min product walkthrough | Day 3-7 |
| **Pilot** | 2-week free trial with real data | Day 7-21 |
| **Close** | Present ROI, sign annual contract | Day 21-30 |
| **Onboard** | Setup, training, go-live | Day 30-45 |

### Key Sales Metrics (Targets)

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| **Facilities onboarded** | 50 | 300 | 1,000 |
| **Government contracts** | 1 district | 5 districts | 2 states |
| **MRR (Monthly Recurring Revenue)** | ₹1.5L | ₹12L | ₹45L |
| **Churn rate** | <10% | <8% | <5% |
| **NPS Score** | >40 | >50 | >60 |

---

## 🛣️ Roadmap

```
┌─────────────────────────────────────────────────────────────────────┐
│                        MEDPREDICT AI ROADMAP                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  HACKATHON          3 MONTHS           6 MONTHS          12 MONTHS  │
│  (MVP)              (Pilot)            (Scale)           (Expand)   │
│                                                                      │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐│
│  │• Demand  │      │• Deploy  │      │• 50 PHCs │      │• Private │││
│  │  forecast│      │  at 5    │      │• Supplier│      │  clinics │││
│  │• Expiry  │ ───▶ │  PHCs    │ ───▶ │  integra-│ ───▶ │• Hospital│││
│  │  alerts  │      │• Feedback│      │  tion    │      │  chains  │││
│  │• Basic   │      │  loop    │      │• Auto-   │      │• Pan-    │││
│  │  dashboard│     │• Model   │      │  ordering│      │  India   │││
│  └──────────┘      │  tuning  │      └──────────┘      └──────────┘│
│                    └──────────┘                                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 👥 Team

| Role | Responsibility |
|------|----------------|
| **ML Engineer** | Build and train forecasting models |
| **Backend Developer** | API, data pipeline, database |
| **Frontend Developer** | Dashboard, mobile app |
| **Domain Expert** | Healthcare workflow, validation |

---

## 📞 Call to Action

**For Hackathon Judges:**
We're not just building inventory software—we're ensuring that a diabetic grandmother in rural Telangana never has to skip her metformin because the PHC "ran out."

**For Pilot Partners:**
We're seeking 3-5 PHCs willing to share anonymized consumption data for a 3-month pilot. Zero cost, immediate benefit.

**For Investors:**
Healthcare supply chain is a $25B problem. We're starting with India's 30,000 PHCs and 150,000 sub-centers.

---

## 📎 Appendix

### A. Sample Data Schema

```sql
-- Core tables
CREATE TABLE medicines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200),
    category VARCHAR(100),
    unit VARCHAR(50),
    reorder_level INT,
    shelf_life_days INT
);

CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    medicine_id INT REFERENCES medicines(id),
    batch_no VARCHAR(50),
    quantity INT,
    expiry_date DATE,
    received_date DATE,
    cost_per_unit DECIMAL(10,2)
);

CREATE TABLE consumption_log (
    id SERIAL PRIMARY KEY,
    medicine_id INT REFERENCES medicines(id),
    date DATE,
    quantity_dispensed INT,
    patient_count INT
);

CREATE TABLE predictions (
    id SERIAL PRIMARY KEY,
    medicine_id INT REFERENCES medicines(id),
    prediction_date DATE,
    predicted_consumption INT,
    confidence_interval_low INT,
    confidence_interval_high INT,
    model_version VARCHAR(50)
);
```

### B. API Endpoints (MVP)

```
POST /api/inventory/upload          # Upload inventory CSV
POST /api/consumption/log           # Log daily consumption
GET  /api/predictions/{medicine_id} # Get demand forecast
GET  /api/alerts                    # Get active alerts
GET  /api/dashboard/summary         # Dashboard data
POST /api/orders/generate           # Generate order recommendation
```

### C. Key References
1. WHO - Essential Medicines List
2. IDSP - Weekly Disease Surveillance Reports
3. National Health Mission - PHC Supply Chain Guidelines
4. "Medicine Availability in PHCs" - NHSRC Study 2023

---

*Document Version: 1.0 | Last Updated: January 20, 2026*

