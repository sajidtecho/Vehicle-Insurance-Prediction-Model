from src.pipline.prediction_pipeline import VehicleData, VehicleDataClassifier
from src.logger import logging

# Create sample vehicle data for prediction
sample_data = VehicleData(
    Gender=1,  # Male
    Age=35,
    Driving_License=1,  # Has license
    Region_Code=28,
    Previously_Insured=0,  # Not previously insured
    Annual_Premium=30000,
    Policy_Sales_Channel=152,
    Vintage=150,
    Vehicle_Age_lt_1_Year=0,
    Vehicle_Age_gt_2_Years=1,
    Vehicle_Damage_Yes=1  # Vehicle has damage
)

# Convert to DataFrame
input_df = sample_data.get_vehicle_input_data_frame()
print("Input Data:")
print(input_df)
print("\n")

# Make prediction
classifier = VehicleDataClassifier()
prediction = classifier.predict(input_df)

print("Prediction Result:")
print(prediction)
