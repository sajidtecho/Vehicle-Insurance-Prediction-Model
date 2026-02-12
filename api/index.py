"""
Vercel Serverless Function for Vehicle Insurance Prediction
Entry point for Flask application on Vercel
"""
from flask import Flask, render_template, request, jsonify
import pandas as pd
import pickle
import os
import sys

# Add the parent directory to the path to import src modules
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

try:
    from src.logger import logging
    from src.exception import MyException
except ImportError:
    # Fallback if src modules are not available
    import logging
    logging.basicConfig(level=logging.INFO)
    MyException = Exception

app = Flask(__name__, 
            template_folder='../templates',
            static_folder='../static')

# Load the trained model
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 
                         "artifact/02_10_2026_14_49_37/model_trainer/trained_model/model.pkl")

# Global variable to hold the model
model = None

def load_model():
    """Load the trained model into memory"""
    global model
    try:
        if model is None:
            if os.path.exists(MODEL_PATH):
                with open(MODEL_PATH, 'rb') as f:
                    model = pickle.load(f)
                logging.info("Model loaded successfully")
                print("[OK] Model loaded successfully")
            else:
                print(f"[WARNING] Model not found at {MODEL_PATH}")
                # For Vercel deployment, the model should be included
                # You may need to use environment variables or external storage
    except Exception as e:
        logging.error(f"Error loading model: {str(e)}")
        print(f"[ERROR] Failed to load model: {str(e)}")

# Load model on import (for serverless cold start)
load_model()

@app.route('/')
def home():
    """Render the home page"""
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    """Handle prediction requests"""
    try:
        # Ensure model is loaded
        if model is None:
            load_model()
        
        if model is None:
            return jsonify({'error': 'Model not loaded. Please ensure the model file is deployed.'}), 500
        
        # Get form data
        data = request.get_json()
        
        # Extract features from request
        features = {
            'Gender': [int(data['gender'])],
            'Age': [int(data['age'])],
            'Driving_License': [int(data['driving_license'])],
            'Region_Code': [int(data['region_code'])],
            'Previously_Insured': [int(data['previously_insured'])],
            'Annual_Premium': [float(data['annual_premium'])],
            'Policy_Sales_Channel': [int(data['policy_sales_channel'])],
            'Vintage': [int(data['vintage'])],
            'Vehicle_Age_lt_1_Year': [int(data['vehicle_age_lt_1_year'])],
            'Vehicle_Age_gt_2_Years': [int(data['vehicle_age_gt_2_years'])],
            'Vehicle_Damage_Yes': [int(data['vehicle_damage_yes'])]
        }
        
        # Create DataFrame
        input_df = pd.DataFrame(features)
        
        # Make prediction
        prediction = model.predict(input_df)
        
        # Prepare response
        result = {
            'prediction': int(prediction[0]),
            'prediction_text': 'INTERESTED in Insurance' if prediction[0] == 1 else 'NOT INTERESTED in Insurance',
            'recommendation': get_recommendation(prediction[0], features)
        }
        
        logging.info(f"Prediction made: {result['prediction_text']}")
        return jsonify(result)
    
    except Exception as e:
        logging.error(f"Error in prediction: {str(e)}")
        return jsonify({'error': str(e)}), 500

def get_recommendation(prediction, features):
    """Generate recommendation based on prediction"""
    if prediction == 1:
        return {
            'title': '✓ High Interest Detected',
            'message': 'This customer shows strong interest in vehicle insurance.',
            'actions': [
                'Contact customer immediately',
                'Offer personalized insurance plans',
                'Highlight benefits matching their vehicle profile'
            ]
        }
    else:
        return {
            'title': '⚠ Low Interest Detected',
            'message': 'Customer may not be interested at this time.',
            'actions': [
                'Schedule follow-up contact',
                'Send educational materials about insurance benefits',
                'Consider offering promotional discounts'
            ]
        }

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'model_path': MODEL_PATH
    })

@app.route('/api/health', methods=['GET'])
def api_health():
    """API Health check endpoint for Vercel"""
    return health()

# Vercel serverless function handler
# This is the entry point for Vercel
handler = app

# For local development
if __name__ == '__main__':
    print("="*80)
    print("VEHICLE INSURANCE PREDICTION WEB APP (Vercel Mode)")
    print("="*80)
    print("\nModel path:", MODEL_PATH)
    print("Model loaded:", model is not None)
    print("\nStarting Flask server...")
    print("Access the application at: http://127.0.0.1:5000")
    print("="*80)
    app.run(debug=True, host='0.0.0.0', port=5000)
