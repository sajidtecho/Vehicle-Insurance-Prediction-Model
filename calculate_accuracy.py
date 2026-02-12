"""
Calculate and display all performance metrics for the trained model
"""
import pickle
import numpy as np
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, classification_report, confusion_matrix

# Load the test data
test_data = np.load("artifact/02_10_2026_14_49_37/data_transformation/transformed/test.npy")

# Split into features and target
X_test = test_data[:, :-1]
y_test = test_data[:, -1]

# Load the trained model
with open("artifact/02_10_2026_14_49_37/model_trainer/trained_model/model.pkl", 'rb') as f:
    model_wrapper = pickle.load(f)

# Get the actual Random Forest model
trained_model = model_wrapper.trained_model_object

# Make predictions
y_pred = trained_model.predict(X_test)

# Calculate all metrics
accuracy = accuracy_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)

print("="*80)
print("VEHICLE INSURANCE PREDICTION MODEL - COMPLETE PERFORMANCE METRICS")
print("="*80)
print(f"\nTest Set Size: {len(y_test):,} samples")
print(f"\nPerformance Metrics:")
print(f"  • Accuracy:  {accuracy:.4f} ({accuracy*100:.2f}%)")
print(f"  • F1-Score:  {f1:.4f} ({f1*100:.2f}%)")
print(f"  • Precision: {precision:.4f} ({precision*100:.2f}%)")
print(f"  • Recall:    {recall:.4f} ({recall*100:.2f}%)")

print(f"\n" + "="*80)
print("CONFUSION MATRIX")
print("="*80)
cm = confusion_matrix(y_test, y_pred)
print(f"\n                Predicted")
print(f"              Not Int  Interested")
print(f"Actual Not Int  {cm[0][0]:>6}    {cm[0][1]:>6}")
print(f"       Int      {cm[1][0]:>6}    {cm[1][1]:>6}")

print(f"\n" + "="*80)
print("DETAILED CLASSIFICATION REPORT")
print("="*80)
print(classification_report(y_test, y_pred, target_names=['Not Interested', 'Interested']))

print("="*80)
print("INTERPRETATION")
print("="*80)
print(f"\n✓ The model correctly classifies {accuracy*100:.2f}% of all predictions")
print(f"✓ Of customers predicted as INTERESTED, {precision*100:.2f}% actually are")
print(f"✓ Of customers who ARE interested, the model identifies {recall*100:.2f}%")
print(f"✓ Overall F1-Score of {f1*100:.2f}% indicates excellent balanced performance")
print("\n" + "="*80)
