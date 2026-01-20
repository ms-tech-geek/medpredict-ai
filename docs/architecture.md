# MedPredict AI - Architecture Document

## Overview

MedPredict AI is a hybrid architecture system combining React frontend, Node.js API gateway, and Python ML microservice for intelligent medical supply forecasting.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────────────────────────────────────────────────────────────────┐  │
│   │                     REACT FRONTEND (Port 5173)                        │  │
│   │                                                                       │  │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │  │
│   │  │   Header    │  │   Sidebar   │  │   Charts    │  │   Tables    │ │  │
│   │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │  │
│   │                                                                       │  │
│   │  Tech: React 18 • TypeScript • Tailwind CSS • Recharts • React Query │  │
│   └──────────────────────────────────────────────────────────────────────┘  │
│                                      │                                       │
│                                      ▼                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                           API GATEWAY LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────────────────────────────────────────────────────────────────┐  │
│   │                  NODE.JS API GATEWAY (Port 3001)                      │  │
│   │                                                                       │  │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │  │
│   │  │    CORS     │  │   Logging   │  │   Routing   │  │    Proxy    │ │  │
│   │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │  │
│   │                                                                       │  │
│   │  Tech: Express.js • TypeScript • Axios • CORS middleware             │  │
│   └──────────────────────────────────────────────────────────────────────┘  │
│                                      │                                       │
│                                      ▼                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                           ML SERVICE LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────────────────────────────────────────────────────────────────┐  │
│   │                 PYTHON ML SERVICE (Port 8000)                         │  │
│   │                                                                       │  │
│   │  ┌─────────────────────────────────────────────────────────────────┐ │  │
│   │  │                      FastAPI Application                         │ │  │
│   │  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │ │  │
│   │  │  │   /api/      │  │   /api/      │  │   /api/      │          │ │  │
│   │  │  │   dashboard  │  │ expiry-risks │  │stockout-risks│          │ │  │
│   │  │  └──────────────┘  └──────────────┘  └──────────────┘          │ │  │
│   │  └─────────────────────────────────────────────────────────────────┘ │  │
│   │                                │                                      │  │
│   │                                ▼                                      │  │
│   │  ┌─────────────────────────────────────────────────────────────────┐ │  │
│   │  │                   MedPredict ML Engine                           │ │  │
│   │  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │ │  │
│   │  │  │  Consumption │  │  Expiry Risk │  │   Stockout   │          │ │  │
│   │  │  │  Predictor   │  │    Scorer    │  │   Detector   │          │ │  │
│   │  │  └──────────────┘  └──────────────┘  └──────────────┘          │ │  │
│   │  └─────────────────────────────────────────────────────────────────┘ │  │
│   │                                                                       │  │
│   │  Tech: FastAPI • pandas • numpy • scikit-learn • Pydantic            │  │
│   └──────────────────────────────────────────────────────────────────────┘  │
│                                      │                                       │
│                                      ▼                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                           DATA LAYER                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────────────────────────────────────────────────────────────────┐  │
│   │                        CSV DATA FILES                                 │  │
│   │                                                                       │  │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │  │
│   │  │  medicines  │  │ consumption │  │  inventory  │  │  suppliers  │ │  │
│   │  │  _master    │  │    _log     │  │   _current  │  │             │ │  │
│   │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │  │
│   │                                                                       │  │
│   │  Future: PostgreSQL + TimescaleDB for production                     │  │
│   └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Details

### 1. Frontend (React)

**Location:** `/frontend`

**Technology Stack:**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Recharts for data visualization
- React Query for server state management
- Lucide React for icons

**Key Components:**
| Component | Purpose |
|-----------|---------|
| `Header` | Navigation, alerts badge, refresh |
| `Sidebar` | Navigation, risk filters |
| `StatsCard` | Metric display cards |
| `HealthGauge` | Circular health score visualization |
| `RiskDistributionChart` | Pie chart for risk levels |
| `StockoutChart` | Bar chart for stockout timeline |
| `AlertsTable` | Tabular alert display |

**State Management:**
- React Query for API data caching
- Local state for UI controls

---

### 2. API Gateway (Node.js)

**Location:** `/gateway`

**Technology Stack:**
- Express.js
- TypeScript
- Axios for proxying
- CORS middleware

**Responsibilities:**
- CORS handling for frontend
- Request logging
- Proxying to ML service
- Future: Authentication, rate limiting, caching

**Endpoints:**
```
GET  /api/health           → Health check
GET  /api/dashboard/summary → Proxies to ML service
GET  /api/expiry-risks     → Proxies to ML service
GET  /api/stockout-risks   → Proxies to ML service
GET  /api/alerts           → Proxies to ML service
GET  /api/medicines        → Proxies to ML service
POST /api/reload-data      → Proxies to ML service
```

---

### 3. ML Service (Python)

**Location:** `/src`

**Technology Stack:**
- FastAPI for REST API
- pandas for data manipulation
- numpy for numerical operations
- Pydantic for data validation

**Core Classes:**

#### MedPredictEngine
Main prediction engine that:
- Calculates consumption statistics
- Predicts future consumption
- Scores expiry risks
- Detects stockout risks

#### ExpiryRisk (Dataclass)
```python
@dataclass
class ExpiryRisk:
    medicine_id: int
    medicine_name: str
    batch_no: str
    current_quantity: int
    expiry_date: datetime
    days_to_expiry: int
    predicted_consumption: int
    quantity_at_risk: int
    risk_score: float      # 0-100
    risk_level: str        # CRITICAL, HIGH, MEDIUM, LOW
    recommendation: str
    potential_loss: float
```

#### StockoutRisk (Dataclass)
```python
@dataclass
class StockoutRisk:
    medicine_id: int
    medicine_name: str
    current_stock: int
    avg_daily_consumption: float
    predicted_weekly_consumption: int
    days_until_stockout: float
    risk_level: str
    recommended_order: int
    recommendation: str
```

---

## Data Flow

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  User    │───▶│ Frontend │───▶│ Gateway  │───▶│    ML    │
│ Browser  │    │  React   │    │ Node.js  │    │  Python  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                     │               │               │
                     │   HTTP/JSON   │   HTTP/JSON   │
                     │◀──────────────│◀──────────────│
                     │               │               │
                     ▼               │               ▼
              ┌──────────┐          │         ┌──────────┐
              │  React   │          │         │   CSV    │
              │  Query   │          │         │  Files   │
              │  Cache   │          │         └──────────┘
              └──────────┘          │
                                    │
                              Future: Redis
                              Cache Layer
```

---

## Deployment Architecture

### Development
```
localhost:5173  →  Frontend (Vite dev server)
localhost:3001  →  Gateway (nodemon + ts-node)
localhost:8000  →  ML Service (uvicorn --reload)
```

### Production (Future)
```
┌─────────────────────────────────────────────────────────────┐
│                        NGINX / Load Balancer                 │
│                    (SSL termination, routing)                │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
    ┌──────────┐        ┌──────────┐        ┌──────────┐
    │ Frontend │        │ Gateway  │        │    ML    │
    │  (CDN)   │        │ (Docker) │        │ (Docker) │
    └──────────┘        └──────────┘        └──────────┘
                              │
                              ▼
                        ┌──────────┐
                        │PostgreSQL│
                        │TimescaleDB│
                        └──────────┘
```

---

## Security Considerations

### Current (MVP)
- CORS configured for localhost
- No authentication (demo mode)
- No PII stored (only aggregate data)

### Future
- JWT authentication
- API key for gateway
- Role-based access control
- Data encryption at rest
- HTTPS everywhere

---

## Scalability

### Horizontal Scaling
- Frontend: CDN distribution
- Gateway: Multiple instances behind load balancer
- ML Service: Multiple workers with uvicorn

### Vertical Scaling
- ML Service: More CPU/RAM for larger datasets
- Database: Read replicas for analytics

---

## Monitoring (Future)

```
┌──────────────────────────────────────────────────────────┐
│                    OBSERVABILITY STACK                    │
├──────────────────────────────────────────────────────────┤
│  Metrics: Prometheus + Grafana                           │
│  Logging: ELK Stack (Elasticsearch, Logstash, Kibana)    │
│  Tracing: Jaeger / OpenTelemetry                         │
│  Alerts: PagerDuty / Slack integration                   │
└──────────────────────────────────────────────────────────┘
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-20 | Initial hybrid architecture |
| - | - | React frontend + Node gateway + Python ML |

