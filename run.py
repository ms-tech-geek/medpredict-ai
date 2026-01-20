#!/usr/bin/env python3
"""
MedPredict AI - Application Runner

This script manages all services:
- Python ML Service (FastAPI) - Port 8000
- Node.js API Gateway - Port 3001  
- React Frontend - Port 5173

Usage:
    python run.py              # Run all services
    python run.py ml           # Run only ML service
    python run.py gateway      # Run only API gateway
    python run.py frontend     # Run only frontend
    python run.py dashboard    # Run legacy Streamlit dashboard
"""

import subprocess
import sys
import os
import signal
import time
from pathlib import Path

# Project root directory
ROOT_DIR = Path(__file__).parent

def run_ml_service():
    """Run the FastAPI ML service"""
    print("\n🔬 Starting ML Service (FastAPI)...")
    os.chdir(ROOT_DIR)
    subprocess.run([
        sys.executable, "-m", "uvicorn", 
        "src.api.main:app", 
        "--reload", 
        "--port", "8000",
        "--host", "0.0.0.0"
    ])

def run_gateway():
    """Run the Node.js API Gateway"""
    print("\n🌐 Starting API Gateway (Node.js)...")
    gateway_dir = ROOT_DIR / "gateway"
    os.chdir(gateway_dir)
    subprocess.run(["npm", "run", "dev"])

def run_frontend():
    """Run the React frontend"""
    print("\n⚛️ Starting Frontend (React)...")
    frontend_dir = ROOT_DIR / "frontend"
    os.chdir(frontend_dir)
    subprocess.run(["npm", "run", "dev"])

def run_streamlit_dashboard():
    """Run the legacy Streamlit dashboard"""
    print("\n📊 Starting Streamlit Dashboard...")
    os.chdir(ROOT_DIR)
    subprocess.run([
        sys.executable, "-m", "streamlit", "run", 
        "dashboard/app.py",
        "--server.port", "8501"
    ])

def run_all_services():
    """Run all services concurrently"""
    print("""
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║   💊 MedPredict AI - Hybrid Architecture                          ║
║                                                                   ║
║   Starting all services...                                        ║
║                                                                   ║
║   Services:                                                       ║
║   • ML Service (FastAPI):    http://localhost:8000                ║
║   • API Gateway (Node.js):   http://localhost:3001                ║
║   • Frontend (React):        http://localhost:5173                ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
    """)
    
    processes = []
    
    try:
        # Start ML Service
        ml_process = subprocess.Popen(
            [sys.executable, "-m", "uvicorn", "src.api.main:app", "--port", "8000", "--host", "0.0.0.0"],
            cwd=ROOT_DIR
        )
        processes.append(ml_process)
        print("✅ ML Service started")
        time.sleep(2)  # Wait for ML service to start
        
        # Start Gateway
        gateway_process = subprocess.Popen(
            ["npm", "run", "dev"],
            cwd=ROOT_DIR / "gateway"
        )
        processes.append(gateway_process)
        print("✅ API Gateway started")
        time.sleep(1)
        
        # Start Frontend
        frontend_process = subprocess.Popen(
            ["npm", "run", "dev"],
            cwd=ROOT_DIR / "frontend"
        )
        processes.append(frontend_process)
        print("✅ Frontend started")
        
        print("\n🚀 All services running! Press Ctrl+C to stop.\n")
        
        # Wait for processes
        for p in processes:
            p.wait()
            
    except KeyboardInterrupt:
        print("\n\n🛑 Shutting down services...")
        for p in processes:
            p.terminate()
        for p in processes:
            p.wait()
        print("✅ All services stopped")

def main():
    if len(sys.argv) < 2:
        run_all_services()
    else:
        command = sys.argv[1].lower()
        
        if command == "ml":
            run_ml_service()
        elif command == "gateway":
            run_gateway()
        elif command == "frontend":
            run_frontend()
        elif command == "dashboard":
            run_streamlit_dashboard()
        elif command == "api":
            # Backward compatibility
            run_ml_service()
        else:
            print(f"Unknown command: {command}")
            print(__doc__)
            sys.exit(1)

if __name__ == "__main__":
    main()
