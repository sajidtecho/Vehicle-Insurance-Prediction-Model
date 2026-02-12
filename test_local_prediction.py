"""
Local Prediction Test - Using locally trained model without AWS S3
"""
import sys
import os
import pickle
import pandas as pd
from src.logger import logging
from src.exception import MyException

def load_local_model(model_path, preprocessing_path):
    """Load model and preprocessing object from local artifact directory"""
    try:
        logging.info(f"Loading preprocessing object from: {preprocessing_path}")
        with open(preprocessing_path, 'rb') as f:
            preprocessing_obj = pickle.load(f)
        
        logging.info(f"Loading trained model from: {model_path}")
        with open(model_path, 'rb') as f:
            model_obj = pickle.load(f)
        
        logging.info("Successfully loaded model and preprocessing objects")
        return preprocessing_obj, model_obj
    
    except Exception as e:
        raise MyException(e, sys)

def make_prediction(model_obj, input_data):
    """Make prediction using loaded model (model has built-in preprocessing)"""
    try:
        logging.info("Starting prediction process")
        
        # Model contains both preprocessing and trained model
        # It will handle transformation internally
        prediction = model_obj.predict(input_data)
        logging.info(f"Prediction completed: {prediction}")
        
        return prediction
    
    except Exception as e:
        raise MyException(e, sys)

if __name__ == "__main__":
    print("="*80)
    print("VEHICLE INSURANCE PREDICTION - LOCAL MODEL TEST")
    print("="*80)
    
    # Define paths to trained model and preprocessing object
    artifact_dir = "artifact/02_10_2026_14_49_37"
    model_path = os.path.join(artifact_dir, "model_trainer/trained_model/model.pkl")
    
    # Verify files exist
    print("\nVerifying model files...")
    if os.path.exists(model_path):
        print(f"✓ Model found: {model_path}")
    else:
        print(f"✗ Model NOT found: {model_path}")
        sys.exit(1)
    
    # Load model (contains both preprocessing and trained model)
    print("\nLoading model...")
    logging.info(f"Loading trained model from: {model_path}")
    with open(model_path, 'rb') as f:
        model_obj = pickle.load(f)
    
    logging.info("Successfully loaded model")
    print("✓ Model loaded successfully")
    print(f"  Model Type: {type(model_obj).__name__}")
    
    # Create sample test data
    print("\n" + "="*80)
    print("TEST CASE 1: High-risk customer (has vehicle damage)")
    print("="*80)
    sample_data_1 = {
        "Gender": [1],  # Male
        "Age": [35],
        "Driving_License": [1],  # Has license
        "Region_Code": [28],
        "Previously_Insured": [0],  # Not previously insured
        "Annual_Premium": [30000],
        "Policy_Sales_Channel": [152],
        "Vintage": [150],
        "Vehicle_Age_lt_1_Year": [0],
        "Vehicle_Age_gt_2_Years": [1],
        "Vehicle_Damage_Yes": [1]  # Vehicle has damage
    }
    
    df1 = pd.DataFrame(sample_data_1)
    print("\nInput Features:")
    print(df1.to_string(index=False))
    
    prediction_1 = make_prediction(model_obj, df1)
    print(f"\nPREDICTION: {'INTERESTED' if prediction_1[0] == 1 else 'NOT INTERESTED'} in insurance (Value: {prediction_1[0]})")
    
    # Test case 2
    print("\n" + "="*80)
    print("TEST CASE 2: Low-risk customer (no damage, previously insured)")
    print("="*80)
    sample_data_2 = {
        "Gender": [0],  # Female
        "Age": [42],
        "Driving_License": [1],  # Has license
        "Region_Code": [15],
        "Previously_Insured": [1],  # Previously insured
        "Annual_Premium": [25000],
        "Policy_Sales_Channel": [26],
        "Vintage": [200],
        "Vehicle_Age_lt_1_Year": [1],
        "Vehicle_Age_gt_2_Years": [0],
        "Vehicle_Damage_Yes": [0]  # No vehicle damage
    }
    
    df2 = pd.DataFrame(sample_data_2)
    print("\nInput Features:")
    print(df2.to_string(index=False))
    
    prediction_2 = make_prediction(model_obj, df2)
    print(f"\nPREDICTION: {'INTERESTED' if prediction_2[0] == 1 else 'NOT INTERESTED'} in insurance (Value: {prediction_2[0]})")
    
    # Test case 3
    print("\n" + "="*80)
    print("TEST CASE 3: Medium-risk customer")
    print("="*80)
    sample_data_3 = {
        "Gender": [1],  # Male
        "Age": [28],
        "Driving_License": [1],  # Has license
        "Region_Code": [8],
        "Previously_Insured": [0],  # Not previously insured
        "Annual_Premium": [35000],
        "Policy_Sales_Channel": [124],
        "Vintage": [90],
        "Vehicle_Age_lt_1_Year": [0],
        "Vehicle_Age_gt_2_Years": [0],
        "Vehicle_Damage_Yes": [1]  # Vehicle has damage
    }
    
    df3 = pd.DataFrame(sample_data_3)
    print("\nInput Features:")
    print(df3.to_string(index=False))
    
    prediction_3 = make_prediction(model_obj, df3)
    print(f"\nPREDICTION: {'INTERESTED' if prediction_3[0] == 1 else 'NOT INTERESTED'} in insurance (Value: {prediction_3[0]})")
    
    print("\n" + "="*80)
    print("ALL TESTS COMPLETED SUCCESSFULLY ✓")
    print("="*80)
