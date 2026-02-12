"""
System Configuration and Pipeline Verification Script
Checks all components of the Vehicle Insurance Prediction Model
"""
import os
import sys
import yaml
import pickle
from datetime import datetime

def print_header(title):
    """Print formatted section header"""
    print("\n" + "="*80)
    print(f"  {title}")
    print("="*80)

def check_file_exists(filepath, description=""):
    """Check if a file exists and print status"""
    if os.path.exists(filepath):
        size = os.path.getsize(filepath)
        print(f"  ✓ {description if description else os.path.basename(filepath)}")
        print(f"    Path: {filepath}")
        print(f"    Size: {size:,} bytes")
        return True
    else:
        print(f"  ✗ {description if description else os.path.basename(filepath)}")
        print(f"    Path: {filepath} (NOT FOUND)")
        return False

def check_directory_exists(dirpath, description=""):
    """Check if a directory exists and list contents"""
    if os.path.exists(dirpath) and os.path.isdir(dirpath):
        contents = os.listdir(dirpath)
        print(f"  ✓ {description if description else os.path.basename(dirpath)}")
        print(f"    Path: {dirpath}")
        print(f"    Contents: {len(contents)} items")
        for item in contents[:5]:  # Show first 5 items
            print(f"      - {item}")
        if len(contents) > 5:
            print(f"      ... and {len(contents) - 5} more")
        return True
    else:
        print(f"  ✗ {description if description else os.path.basename(dirpath)}")
        print(f"    Path: {dirpath} (NOT FOUND)")
        return False

def load_yaml_config(filepath):
    """Load and display YAML configuration"""
    try:
        with open(filepath, 'r') as f:
            config = yaml.safe_load(f)
        return config
    except Exception as e:
        print(f"  Error loading YAML: {str(e)}")
        return None

def main():
    print_header("VEHICLE INSURANCE PREDICTION MODEL - SYSTEM CONFIGURATION CHECK")
    print(f"Scan Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # 1. Check Configuration Files
    print_header("1. CONFIGURATION FILES")
    
    schema_path = "config/schema.yaml"
    schema_exists = check_file_exists(schema_path, "Schema Configuration")
    if schema_exists:
        schema = load_yaml_config(schema_path)
        if schema:
            print(f"    Schema columns: {len(schema.get('columns', []))}")
            print(f"    Numerical features: {len(schema.get('numerical_columns', []))}")
            print(f"    Categorical features: {len(schema.get('categorical_columns', []))}")
    
    model_config_path = "config/model.yaml"
    check_file_exists(model_config_path, "Model Configuration")
    
    # 2. Check Latest Training Artifacts
    print_header("2. LATEST TRAINING ARTIFACTS")
    
    artifact_dir = "artifact/02_10_2026_14_49_37"
    
    print("\n  Pipeline Stages:")
    check_directory_exists(os.path.join(artifact_dir, "data_ingestion"), "Data Ingestion")
    check_directory_exists(os.path.join(artifact_dir, "data_validation"), "Data Validation")
    check_directory_exists(os.path.join(artifact_dir, "data_transformation"), "Data Transformation")
    check_directory_exists(os.path.join(artifact_dir, "model_trainer"), "Model Trainer")
    
    # 3. Check Critical Model Files
    print_header("3. CRITICAL MODEL FILES")
    
    model_path = os.path.join(artifact_dir, "model_trainer/trained_model/model.pkl")
    model_exists = check_file_exists(model_path, "Trained Model (model.pkl)")
    
    preprocessing_path = os.path.join(artifact_dir, "data_transformation/transformed_object/preprocessing.pkl")
    preprocessing_exists = check_file_exists(preprocessing_path, "Preprocessing Object (preprocessing.pkl)")
    
    # 4. Check Training Data
    print_header("4. TRAINING DATA FILES")
    
    train_path = os.path.join(artifact_dir, "data_ingestion/ingested/train.csv")
    check_file_exists(train_path, "Training Data (train.csv)")
    
    test_path = os.path.join(artifact_dir, "data_ingestion/ingested/test.csv")
    check_file_exists(test_path, "Test Data (test.csv)")
    
    feature_store_path = os.path.join(artifact_dir, "data_ingestion/feature_store/data.csv")
    check_file_exists(feature_store_path, "Feature Store (data.csv)")
    
    # 5. Check Validation Report
    print_header("5. VALIDATION REPORT")
    
    validation_report_path = os.path.join(artifact_dir, "data_validation/report.yaml")
    report_exists = check_file_exists(validation_report_path, "Validation Report")
    if report_exists:
        report = load_yaml_config(validation_report_path)
        if report:
            print(f"    Validation Status: {report}")
    
    # 6. Check Source Code Components
    print_header("6. SOURCE CODE COMPONENTS")
    
    check_file_exists("src/pipline/training_pipeline.py", "Training Pipeline")
    check_file_exists("src/pipline/prediction_pipeline.py", "Prediction Pipeline")
    check_file_exists("src/components/data_ingestion.py", "Data Ingestion Component")
    check_file_exists("src/components/data_validation.py", "Data Validation Component")
    check_file_exists("src/components/data_transformation.py", "Data Transformation Component")
    check_file_exists("src/components/model_trainer.py", "Model Trainer Component")
    check_file_exists("src/components/model_evaluation.py", "Model Evaluation Component")
    
    # 7. Check Test Scripts
    print_header("7. TEST SCRIPTS")
    
    check_file_exists("test_prediction.py", "Original Prediction Test (AWS S3)")
    check_file_exists("test_local_prediction.py", "Local Prediction Test (No AWS)")
    check_file_exists("demo.py", "Training Demo Script")
    
    # 8. Check Logs
    print_header("8. LOGS")
    
    if os.path.exists("logs"):
        log_files = [f for f in os.listdir("logs") if f.endswith('.log')]
        log_files.sort(reverse=True)
        print(f"  ✓ Found {len(log_files)} log files")
        if log_files:
            print(f"    Latest log: {log_files[0]}")
            latest_log_path = os.path.join("logs", log_files[0])
            check_file_exists(latest_log_path, f"Latest Training Log ({log_files[0]})")
    
    # 9. Model Verification
    print_header("9. MODEL VERIFICATION")
    
    if model_exists and preprocessing_exists:
        try:
            print("  Attempting to load model components...")
            with open(model_path, 'rb') as f:
                model = pickle.load(f)
            print(f"  ✓ Model loaded successfully")
            print(f"    Model Type: {type(model).__name__}")
            
            with open(preprocessing_path, 'rb') as f:
                preprocessing = pickle.load(f)
            print(f"  ✓ Preprocessing object loaded successfully")
            print(f"    Preprocessing Type: {type(preprocessing).__name__}")
            
        except Exception as e:
            print(f"  ✗ Error loading model: {str(e)}")
    else:
        print("  ⚠ Cannot verify model - files not found")
    
    # 10. Final Summary
    print_header("10. SYSTEM STATUS SUMMARY")
    
    checks = {
        "Configuration Files": schema_exists,
        "Training Artifacts": os.path.exists(artifact_dir),
        "Trained Model": model_exists,
        "Preprocessing Object": preprocessing_exists,
        "Validation Report": report_exists,
    }
    
    passed = sum(checks.values())
    total = len(checks)
    
    print(f"\n  Status Checks: {passed}/{total} passed")
    for check_name, status in checks.items():
        print(f"    {'✓' if status else '✗'} {check_name}")
    
    if passed == total:
        print("\n  🎉 ALL SYSTEMS OPERATIONAL - READY FOR PREDICTIONS")
    else:
        print(f"\n  ⚠ SOME CHECKS FAILED - {total - passed} issue(s) found")
    
    print_header("SYSTEM CHECK COMPLETE")

if __name__ == "__main__":
    main()
