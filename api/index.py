"""
Vercel Serverless Function for Vehicle Insurance Prediction
Entry point for FastAPI application on Vercel
"""
import sys
import os

# Add the parent directory to the path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Import the FastAPI app from backend_api
from backend_api import app

# Vercel expects the app to be exported
# FastAPI apps work with ASGI, Vercel handles this automatically
handler = app
