import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    const mlHealth = await axios.get(`${ML_SERVICE_URL}/api/health`);
    res.json({
      status: 'healthy',
      gateway: 'operational',
      ml_service: mlHealth.data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.json({
      status: 'degraded',
      gateway: 'operational',
      ml_service: { status: 'unreachable' },
      timestamp: new Date().toISOString(),
    });
  }
});

// Proxy routes to ML Service
const proxyToMLService = async (req: Request, res: Response, endpoint: string) => {
  try {
    const url = `${ML_SERVICE_URL}${endpoint}`;
    const queryString = new URLSearchParams(req.query as Record<string, string>).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    
    const response = await axios({
      method: req.method as any,
      url: fullUrl,
      data: req.body,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    res.json(response.data);
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(`Error proxying to ${endpoint}:`, axiosError.message);
    
    if (axiosError.response) {
      res.status(axiosError.response.status).json(axiosError.response.data);
    } else {
      res.status(503).json({
        error: 'ML Service Unavailable',
        message: 'The prediction service is currently unavailable. Please try again later.',
      });
    }
  }
};

// Dashboard Summary
app.get('/api/dashboard/summary', (req: Request, res: Response) => {
  proxyToMLService(req, res, '/api/dashboard/summary');
});

// Expiry Risks
app.get('/api/expiry-risks', (req: Request, res: Response) => {
  proxyToMLService(req, res, '/api/expiry-risks');
});

// Stockout Risks
app.get('/api/stockout-risks', (req: Request, res: Response) => {
  proxyToMLService(req, res, '/api/stockout-risks');
});

// Alerts
app.get('/api/alerts', (req: Request, res: Response) => {
  proxyToMLService(req, res, '/api/alerts');
});

// Medicines - List
app.get('/api/medicines', (req: Request, res: Response) => {
  proxyToMLService(req, res, '/api/medicines');
});

// Medicines - Detail
app.get('/api/medicines/:id', (req: Request, res: Response) => {
  proxyToMLService(req, res, `/api/medicines/${req.params.id}`);
});

// Inventory
app.get('/api/inventory', (req: Request, res: Response) => {
  proxyToMLService(req, res, '/api/inventory');
});

// Consumption Trends
app.get('/api/consumption/trends', (req: Request, res: Response) => {
  proxyToMLService(req, res, '/api/consumption/trends');
});

// Categories
app.get('/api/categories', (req: Request, res: Response) => {
  proxyToMLService(req, res, '/api/categories');
});

// Recommendations
app.get('/api/recommendations', (req: Request, res: Response) => {
  proxyToMLService(req, res, '/api/recommendations');
});

// Reload Data
app.post('/api/reload-data', (req: Request, res: Response) => {
  proxyToMLService(req, res, '/api/reload-data');
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
  });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🚀 MedPredict API Gateway                                   ║
║                                                               ║
║   Gateway:     http://localhost:${PORT}                          ║
║   ML Service:  ${ML_SERVICE_URL}                         ║
║                                                               ║
║   Endpoints:                                                  ║
║   • GET  /api/health             - Health check               ║
║   • GET  /api/dashboard/summary  - Dashboard stats            ║
║   • GET  /api/expiry-risks       - Expiry predictions         ║
║   • GET  /api/stockout-risks     - Stockout predictions       ║
║   • GET  /api/alerts             - Active alerts              ║
║   • GET  /api/medicines          - Medicine list              ║
║   • GET  /api/medicines/:id      - Medicine detail            ║
║   • GET  /api/inventory          - Inventory batches          ║
║   • GET  /api/consumption/trends - Consumption trends         ║
║   • GET  /api/categories         - Category list              ║
║   • GET  /api/recommendations    - Action recommendations     ║
║   • POST /api/reload-data        - Reload data                ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});

export default app;

