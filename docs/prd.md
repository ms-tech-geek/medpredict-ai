# MedPredict AI - Product Requirements Document

**Version:** 1.0  
**Last Updated:** January 20, 2026  
**Framework:** BMAD-core  

---

## Table of Contents

1. [Business Context](#1-business-context)
2. [Market Analysis](#2-market-analysis)
3. [Architecture Overview](#3-architecture-overview)
4. [Design & Requirements](#4-design--requirements)
5. [Implementation Roadmap](#5-implementation-roadmap)
6. [Success Metrics](#6-success-metrics)

---

## 1. Business Context

### 1.1 Vision Statement

> Ensure no patient misses critical medication due to stockouts, and no medicine is wasted due to expiry—through AI-powered supply chain intelligence.

### 1.2 Problem Statement

| Problem | Impact | Scale |
|---------|--------|-------|
| Gut-feel forecasting | Inaccurate orders, stockouts | 35% PHCs face critical stockouts |
| No expiry tracking | Medicine waste | 8% supplies expire unused (₹8L/year) |
| Zero real-time visibility | Reactive management | Staff discover issues at patient counter |
| Seasonal blindness | Wrong inventory timing | Capital locked in useless stock |

### 1.3 Business Goals

| Goal | Target | Timeline |
|------|--------|----------|
| Reduce medicine expiry waste | 75% reduction | 12 months |
| Prevent stockouts | 87.5% reduction | 12 months |
| Save staff time | 75% reduction in inventory time | 6 months |
| Facility coverage | 500 PHCs | 24 months |

### 1.4 Stakeholders

| Stakeholder | Role | Interest |
|-------------|------|----------|
| PHC Pharmacist | Primary User | Daily alerts, stock entry |
| Medical Officer | Approver | Weekly reports, order approval |
| District Health Officer | Administrator | Multi-facility view |
| State NHM Director | Buyer | ROI, compliance |
| Patients | Beneficiary | Medicine availability |

### 1.5 Success Criteria

- [ ] Predict stockouts 3+ weeks in advance with >80% accuracy
- [ ] Identify >90% of at-risk expiry batches
- [ ] Achieve NPS >50 from pilot users
- [ ] ROI of 10x+ for adopting facilities

---

## 2. Market Analysis

### 2.1 Target Users

#### Primary Persona: Ramesh (PHC Pharmacist)

```
┌─────────────────────────────────────────────────────────┐
│  RAMESH - PHC Store In-Charge                           │
├─────────────────────────────────────────────────────────┤
│  Age: 42 | Education: D.Pharm | Tech: Basic smartphone  │
│                                                         │
│  GOALS:                                                 │
│  • Ensure medicines available for patients              │
│  • Avoid expired stock                                  │
│  • Spend less time on paperwork                         │
│                                                         │
│  PAIN POINTS:                                           │
│  • Manual register maintenance                          │
│  • No visibility into what will expire                  │
│  • Blamed for stockouts but no tools to prevent         │
│                                                         │
│  TECH COMFORT:                                          │
│  • Uses WhatsApp daily                                  │
│  • Struggles with complex software                      │
│  • Prefers vernacular language                          │
└─────────────────────────────────────────────────────────┘
```

#### Secondary Persona: Dr. Priya (Medical Officer)

```
┌─────────────────────────────────────────────────────────┐
│  DR. PRIYA - PHC Medical Officer                        │
├─────────────────────────────────────────────────────────┤
│  Age: 32 | Education: MBBS | Tech: Comfortable          │
│                                                         │
│  GOALS:                                                 │
│  • Focus on patient care, not logistics                 │
│  • Quick overview of supply status                      │
│  • Evidence for budget requests                         │
│                                                         │
│  PAIN POINTS:                                           │
│  • Interrupted by supply emergencies                    │
│  • No data for planning                                 │
│  • Manual approval processes                            │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Competitive Landscape

| Solution | Type | Strengths | Weaknesses |
|----------|------|-----------|------------|
| **mSupply** | Inventory mgmt | Established, WHO-backed | No prediction, complex |
| **DHIS2** | Health info system | Government standard | Not supply-focused |
| **OpenLMIS** | Logistics mgmt | Open source | No AI, heavy setup |
| **Excel/Manual** | Status quo | Familiar | Error-prone, no insights |
| **MedPredict AI** | Predictive AI | Forecasting, simple | New entrant |

### 2.3 Competitive Advantages

1. **Predictive, not reactive**: We forecast; others track
2. **PHC-first design**: WhatsApp delivery, minimal training
3. **India-specific**: Monsoon patterns, IDSP integration
4. **Messy data tolerant**: Works with incomplete records

### 2.4 Market Size

| Segment | Size | Value |
|---------|------|-------|
| **TAM** | Healthcare supply chain software | ₹4,200 Cr |
| **SAM** | PHCs + CHCs + Private clinics | ₹744 Cr |
| **SOM** | Year 3 target | ₹3.7 Cr ARR |

---

## 3. Architecture Overview

> Detailed architecture in [architecture.md](./architecture.md)

### 3.1 High-Level Architecture

```
┌────────────┐     ┌────────────┐     ┌────────────┐
│   React    │────▶│   Node.js  │────▶│   Python   │
│  Frontend  │     │   Gateway  │     │ ML Service │
│  :5173     │     │   :3001    │     │   :8000    │
└────────────┘     └────────────┘     └────────────┘
```

### 3.2 Tech Stack Summary

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend | React + TypeScript | Modern, component-based |
| Styling | Tailwind CSS | Rapid UI development |
| Gateway | Node.js + Express | Flexible, async |
| ML Service | Python + FastAPI | Best ML ecosystem |
| Data | CSV → PostgreSQL | Simple start, scale later |

---

## 4. Design & Requirements

### 4.1 Feature Categories

```
┌─────────────────────────────────────────────────────────────────┐
│                        FEATURE MATRIX                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │    MVP (Now)    │  │   Phase 2 (Q2)  │  │  Phase 3 (Q3+)  │ │
│  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤ │
│  │ ✅ Expiry Risk  │  │ ⬜ WhatsApp Bot │  │ ⬜ Mobile App   │ │
│  │ ✅ Stockout     │  │ ⬜ SMS Alerts   │  │ ⬜ Multi-facility│ │
│  │    Prediction   │  │ ⬜ Seasonal     │  │ ⬜ Supplier      │ │
│  │ ✅ Dashboard    │  │    Recommend    │  │    Integration  │ │
│  │ ✅ REST API     │  │ ⬜ Prophet ML   │  │ ⬜ Auto Orders  │ │
│  │ ✅ Health Score │  │ ⬜ Anomaly      │  │ ⬜ Cold Chain   │ │
│  │                 │  │    Detection    │  │                 │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 User Stories

#### Epic 1: Expiry Risk Management

| ID | Story | Priority | Status |
|----|-------|----------|--------|
| E1.1 | As a pharmacist, I want to see which batches will expire soon so I can prioritize their use | P0 | ✅ Done |
| E1.2 | As a pharmacist, I want to know the financial impact of potential expiry so I can justify actions | P0 | ✅ Done |
| E1.3 | As a pharmacist, I want recommendations on what to do with at-risk stock | P0 | ✅ Done |
| E1.4 | As an MO, I want expiry alerts on WhatsApp so I don't need to check dashboard | P1 | ⬜ Planned |

#### Epic 2: Stockout Prevention

| ID | Story | Priority | Status |
|----|-------|----------|--------|
| S2.1 | As a pharmacist, I want to know when each medicine will run out | P0 | ✅ Done |
| S2.2 | As a pharmacist, I want recommended order quantities | P0 | ✅ Done |
| S2.3 | As an MO, I want to see critical stockout alerts prominently | P0 | ✅ Done |
| S2.4 | As a pharmacist, I want seasonal stocking recommendations | P1 | ⬜ Planned |

#### Epic 3: Dashboard & Reporting

| ID | Story | Priority | Status |
|----|-------|----------|--------|
| D3.1 | As an MO, I want a health score to quickly assess inventory status | P0 | ✅ Done |
| D3.2 | As an MO, I want visual charts showing risk distribution | P0 | ✅ Done |
| D3.3 | As an MO, I want to filter alerts by risk level | P0 | ✅ Done |
| D3.4 | As a DHO, I want exportable reports for audits | P2 | ⬜ Planned |

#### Epic 4: Notifications

| ID | Story | Priority | Status |
|----|-------|----------|--------|
| N4.1 | As a pharmacist, I want WhatsApp alerts for critical issues | P1 | ⬜ Planned |
| N4.2 | As a pharmacist, I want SMS backup if WhatsApp fails | P2 | ⬜ Planned |
| N4.3 | As an MO, I want weekly summary emails | P2 | ⬜ Planned |

### 4.3 Functional Requirements

#### FR1: Expiry Risk Scoring

```
GIVEN a batch with quantity Q and expiry date E
AND historical consumption rate C per day
WHEN days_to_expiry = E - today
AND predicted_consumption = C × days_to_expiry
THEN quantity_at_risk = max(0, Q - predicted_consumption)
AND risk_score = f(quantity_at_risk, days_to_expiry)
AND risk_level = 
    CRITICAL if risk_score ≥ 70
    HIGH if risk_score ≥ 50
    MEDIUM if risk_score ≥ 25
    LOW otherwise
```

#### FR2: Stockout Prediction

```
GIVEN current_stock S for medicine M
AND average_daily_consumption C
WHEN days_until_stockout = S / C
THEN risk_level =
    CRITICAL if days ≤ 7
    HIGH if days ≤ 14
    MEDIUM if days ≤ 21
    LOW otherwise
AND recommended_order = (C × 28) - S  # 4-week supply
```

#### FR3: Health Score Calculation

```
score = 100
FOR each expiry_risk:
    IF CRITICAL: score -= 5
    IF HIGH: score -= 2
    IF MEDIUM: score -= 0.5
FOR each stockout_risk:
    IF CRITICAL: score -= 8
    IF HIGH: score -= 3
    IF MEDIUM: score -= 1
RETURN max(0, min(100, score))
```

### 4.4 Non-Functional Requirements

| Category | Requirement | Target |
|----------|-------------|--------|
| **Performance** | API response time | < 500ms |
| **Performance** | Dashboard load time | < 3s |
| **Availability** | Uptime | 99.5% |
| **Scalability** | Concurrent users | 100+ |
| **Security** | Data encryption | AES-256 |
| **Usability** | Training time | < 30 min |
| **Compatibility** | Browsers | Chrome, Firefox, Safari |
| **Compatibility** | Mobile | Responsive design |

### 4.5 Data Requirements

#### Input Data

| Dataset | Fields | Volume |
|---------|--------|--------|
| `medicines_master` | id, name, category, unit, shelf_life | ~50-150 items |
| `consumption_log` | date, medicine_id, quantity, patients | ~100 records/day |
| `current_inventory` | medicine_id, batch, quantity, expiry, cost | ~100-200 batches |
| `patient_footfall` | date, opd_count, ipd_count | 1 record/day |

#### Output Data

| Output | Format | Frequency |
|--------|--------|-----------|
| Expiry risks | JSON array | On-demand |
| Stockout risks | JSON array | On-demand |
| Dashboard summary | JSON object | On-demand |
| Alerts | JSON array | On-demand |

---

## 5. Implementation Roadmap

### 5.1 MVP (Completed)

```
Week 1-2: ✅ Complete
├── ✅ Data generator with realistic patterns
├── ✅ ML prediction engine (consumption, expiry, stockout)
├── ✅ FastAPI REST endpoints
├── ✅ React dashboard with Tailwind
├── ✅ Node.js API gateway
└── ✅ Basic documentation
```

### 5.2 Phase 2: Notifications (Next)

```
Week 3-6: 🔄 Planned
├── ⬜ WhatsApp Business API integration
├── ⬜ Daily alert scheduling
├── ⬜ Seasonal recommendations engine
├── ⬜ Prophet time-series model upgrade
├── ⬜ Anomaly detection (Isolation Forest)
└── ⬜ SMS fallback via Twilio
```

### 5.3 Phase 3: Scale (Future)

```
Week 7-12: 📅 Future
├── ⬜ React Native mobile app
├── ⬜ PostgreSQL + TimescaleDB migration
├── ⬜ Multi-facility dashboard
├── ⬜ Supplier integration APIs
├── ⬜ Auto purchase order generation
└── ⬜ Role-based access control
```

### 5.4 Milestone Timeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 2026                                                                     │
├─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────────┤
│   Jan   │   Feb   │   Mar   │   Apr   │   May   │   Jun   │   Jul+      │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────────┤
│  MVP ✅ │WhatsApp │ Prophet │ Mobile  │ Pilot   │ Scale   │ Production  │
│ Launch  │  Bot    │ Upgrade │   App   │ 5 PHCs  │ 50 PHCs │ 500 PHCs    │
└─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────────┘
```

---

## 6. Success Metrics

### 6.1 Key Performance Indicators (KPIs)

| Metric | Current | Target (6mo) | Target (12mo) |
|--------|---------|--------------|---------------|
| Prediction accuracy | - | 75% | 85% |
| Alert actionability | - | 60% | 80% |
| User adoption (daily active) | 0 | 50 | 200 |
| Facilities covered | 0 | 10 | 100 |
| Stockouts prevented | 0 | 50 | 500 |
| Expiry waste reduction | 0% | 50% | 75% |

### 6.2 Business Metrics

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| Facilities onboarded | 50 | 300 | 1,000 |
| MRR | ₹1.5L | ₹12L | ₹45L |
| Government contracts | 1 district | 5 districts | 2 states |
| NPS Score | 40+ | 50+ | 60+ |

### 6.3 Technical Metrics

| Metric | Target |
|--------|--------|
| API uptime | 99.5% |
| P95 latency | < 500ms |
| Error rate | < 1% |
| Deployment frequency | Weekly |

---

## Appendix

### A. Glossary

| Term | Definition |
|------|------------|
| PHC | Primary Health Center |
| CHC | Community Health Center |
| NHM | National Health Mission |
| IDSP | Integrated Disease Surveillance Programme |
| FIFO | First In, First Out |
| ORS | Oral Rehydration Salts |

### B. References

- [Architecture Document](./architecture.md)
- [Pitch Document](./pitch.md)
- WHO Essential Medicines List
- IDSP Weekly Reports
- NHM PHC Guidelines

---

*Document maintained by MedPredict AI Team*

