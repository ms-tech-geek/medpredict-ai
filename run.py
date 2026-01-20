#!/usr/bin/env python3
"""
MedPredict AI - Application Runner

Run the complete application:
- Streamlit Dashboard (default)
- FastAPI Backend
- Both services
"""

import subprocess
import sys
import os
from pathlib import Path

# Set working directory
os.chdir(Path(__file__).parent)


def run_dashboard():
    """Run Streamlit dashboard"""
    print("🚀 Starting MedPredict AI Dashboard...")
    print("📊 Dashboard will open at: http://localhost:8501")
    subprocess.run([
        sys.executable, "-m", "streamlit", "run",
        "dashboard/app.py",
        "--server.port=8501",
        "--server.address=localhost",
        "--browser.gatherUsageStats=false"
    ])


def run_api():
    """Run FastAPI backend"""
    print("🚀 Starting MedPredict AI API...")
    print("📡 API available at: http://localhost:8000")
    print("📚 API Docs at: http://localhost:8000/docs")
    subprocess.run([
        sys.executable, "-m", "uvicorn",
        "src.api.main:app",
        "--host=0.0.0.0",
        "--port=8000",
        "--reload"
    ])


def main():
    """Main entry point"""
    print("""
    ╔══════════════════════════════════════════════════════════════╗
    ║                     MedPredict AI                            ║
    ║         AI-Powered Medical Supply Prediction                 ║
    ╚══════════════════════════════════════════════════════════════╝
    """)
    
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        if command == "api":
            run_api()
        elif command == "dashboard":
            run_dashboard()
        else:
            print(f"Unknown command: {command}")
            print("Usage: python run.py [dashboard|api]")
    else:
        # Default: run dashboard
        run_dashboard()


if __name__ == "__main__":
    main()

