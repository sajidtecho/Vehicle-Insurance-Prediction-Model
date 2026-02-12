"""
Local development server for testing Vercel deployment
Run this to test the Vercel-compatible version locally
"""
import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

# Import the Vercel app
from api.index import app

if __name__ == '__main__':
    print("="*80)
    print("VERCEL DEVELOPMENT SERVER")
    print("Testing Vercel-compatible deployment locally")
    print("="*80)
    print("\nAccess the application at: http://127.0.0.1:3000")
    print("This mimics how your app will run on Vercel")
    print("="*80)
    app.run(debug=True, host='0.0.0.0', port=3000)
