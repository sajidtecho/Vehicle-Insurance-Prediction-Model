"""
Enhanced FastAPI Backend for Vehicle Insurance Prediction
Supports authentication, batch prediction, history tracking, analytics, and exports
"""
from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime, timedelta
import pandas as pd
import pickle
import jwt
import bcrypt
from io import BytesIO
import os
from pathlib import Path

# Initialize FastAPI
app = FastAPI(title="Vehicle Insurance Prediction API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# Load ML Model
MODEL_PATH = "artifact/02_10_2026_14_49_37/model_trainer/trained_model/model.pkl"
model = None

def load_model():
    global model
    try:
        if os.path.exists(MODEL_PATH):
            with open(MODEL_PATH, 'rb') as f:
                model = pickle.load(f)
            print("[OK] Model loaded successfully")
        else:
            print(f"[WARNING] Model not found at {MODEL_PATH}")
    except Exception as e:
        print(f"[ERROR] Failed to load model: {str(e)}")

load_model()

# In-memory database (replace with MongoDB/PostgreSQL in production)
users_db = {}
predictions_db = []
user_id_counter = 1

# Pydantic Models
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str = "user"
    createdAt: datetime

class PredictionInput(BaseModel):
    Gender: str
    Age: int
    Driving_License: int
    Region_Code: float
    Previously_Insured: int
    Vehicle_Age: str
    Vehicle_Damage: str
    Annual_Premium: float
    Policy_Sales_Channel: float
    Vintage: int

class PredictionResponse(BaseModel):
    prediction: int
    probability: float
    timestamp: datetime

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

# Helper Functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication")
        return users_db.get(int(user_id))
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication")

def get_admin_user(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

def preprocess_input(data: dict) -> pd.DataFrame:
    """Convert input data to DataFrame for model prediction"""
    df = pd.DataFrame([data])
    
    # Handle categorical encoding (adjust based on your model's requirements)
    if 'Gender' in df.columns:
        df['Gender'] = df['Gender'].map({'Male': 1, 'Female': 0})
    
    if 'Vehicle_Age' in df.columns:
        vehicle_age_map = {'< 1 Year': 0, '1-2 Year': 1, '> 2 Years': 2}
        df['Vehicle_Age'] = df['Vehicle_Age'].map(vehicle_age_map)
    
    if 'Vehicle_Damage' in df.columns:
        df['Vehicle_Damage'] = df['Vehicle_Damage'].map({'Yes': 1, 'No': 0})
    
    return df

async def send_email_notification(email: str, subject: str, body: str):
    """Send email notification (implement with your email service)"""
    # TODO: Implement email sending logic
    print(f"Sending email to {email}: {subject}")
    pass

# Initialize default users for testing
def init_default_users():
    global user_id_counter
    
    # Create default admin user
    admin_id = user_id_counter
    user_id_counter += 1
    users_db[admin_id] = {
        "id": admin_id,
        "name": "Admin User",
        "email": "admin@test.com",
        "password": hash_password("admin123"),
        "role": "admin",
        "createdAt": datetime.now()
    }
    
    # Create default regular user
    user_id = user_id_counter
    user_id_counter += 1
    users_db[user_id] = {
        "id": user_id,
        "name": "Test User",
        "email": "user@test.com",
        "password": hash_password("user123"),
        "role": "user",
        "createdAt": datetime.now()
    }
    
    print("[INFO] Default users created:")
    print("  ✓ Admin: admin@test.com / admin123")
    print("  ✓ User: user@test.com / user123")

init_default_users()

# Authentication Endpoints
@app.post("/api/auth/register", response_model=User)
async def register(user: UserCreate):
    global user_id_counter
    
    # Check if user exists
    if any(u['email'] == user.email for u in users_db.values()):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_id = user_id_counter
    user_id_counter += 1
    
    hashed_password = hash_password(user.password)
    new_user = {
        "id": user_id,
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "role": "admin" if user_id == 1 else "user",  # First user is admin
        "createdAt": datetime.now()
    }
    
    users_db[user_id] = new_user
    
    return User(**{k: v for k, v in new_user.items() if k != 'password'})

@app.post("/api/auth/login", response_model=Token)
async def login(user: UserLogin):
    # Find user
    db_user = next((u for u in users_db.values() if u['email'] == user.email), None)
    
    if not db_user or not verify_password(user.password, db_user['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create access token
    token = create_access_token({"sub": str(db_user['id']), "email": db_user['email'], "role": db_user['role']})
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {k: v for k, v in db_user.items() if k != 'password'}
    }

# Prediction Endpoints
@app.post("/api/predict/single")
async def predict_single(
    data: PredictionInput,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user)
):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Preprocess and predict
        input_df = preprocess_input(data.dict())
        prediction = model.predict(input_df)[0]
        
        # Get probability if available
        probability = None
        if hasattr(model, 'predict_proba'):
            probability = float(model.predict_proba(input_df)[0][1])
        
        # Save prediction
        prediction_record = {
            "id": len(predictions_db) + 1,
            "userId": current_user['id'],
            "data": data.dict(),
            "prediction": int(prediction),
            "probability": probability,
            "createdAt": datetime.now(),
            "type": "single"
        }
        predictions_db.append(prediction_record)
        
        # Send email notification
        if probability and probability > 0.7:
            background_tasks.add_task(
                send_email_notification,
                current_user['email'],
                "High Interest Customer Detected",
                f"A customer prediction shows {probability*100:.1f}% interest probability!"
            )
        
        return {
            "prediction": int(prediction),
            "probability": probability,
            "timestamp": prediction_record["createdAt"]
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/api/predict/batch")
async def predict_batch(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None,
    current_user: dict = Depends(get_current_user)
):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Read file
        contents = await file.read()
        
        if file.filename.endswith('.csv'):
            df = pd.read_csv(BytesIO(contents))
        elif file.filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(BytesIO(contents))
        else:
            raise HTTPException(status_code=400, detail="File must be CSV or Excel")
        
        # Make predictions
        predictions_list = []
        for idx, row in df.iterrows():
            try:
                input_df = preprocess_input(row.to_dict())
                prediction = model.predict(input_df)[0]
                probability = None
                if hasattr(model, 'predict_proba'):
                    probability = float(model.predict_proba(input_df)[0][1])
                
                predictions_list.append({
                    "input": row.to_dict(),
                    "prediction": int(prediction),
                    "probability": probability
                })
                
                # Save to database
                prediction_record = {
                    "id": len(predictions_db) + 1,
                    "userId": current_user['id'],
                    "data": row.to_dict(),
                    "prediction": int(prediction),
                    "probability": probability,
                    "createdAt": datetime.now(),
                    "type": "batch"
                }
                predictions_db.append(prediction_record)
            except Exception as e:
                print(f"Error processing row {idx}: {e}")
                continue
        
        # Send summary email
        interested_count = sum(1 for p in predictions_list if p['prediction'] == 1)
        if background_tasks:
            background_tasks.add_task(
                send_email_notification,
                current_user['email'],
                "Batch Prediction Completed",
                f"Processed {len(predictions_list)} predictions. {interested_count} customers show interest!"
            )
        
        return {
            "predictions": predictions_list,
            "total": len(predictions_list),
            "interested": interested_count
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch prediction failed: {str(e)}")

# History and Analytics Endpoints
@app.get("/api/predictions/history")
async def get_history(
    prediction: Optional[int] = None,
    current_user: dict = Depends(get_current_user)
):
    user_predictions = [p for p in predictions_db if p['userId'] == current_user['id']]
    
    if prediction is not None:
        user_predictions = [p for p in user_predictions if p['prediction'] == prediction]
    
    return {"predictions": user_predictions}

@app.delete("/api/predictions/{prediction_id}")
async def delete_prediction(
    prediction_id: int,
    current_user: dict = Depends(get_current_user)
):
    global predictions_db
    prediction = next((p for p in predictions_db if p['id'] == prediction_id), None)
    
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
    
    if prediction['userId'] != current_user['id'] and current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Not authorized")
    
    predictions_db = [p for p in predictions_db if p['id'] != prediction_id]
    return {"message": "Prediction deleted successfully"}

@app.get("/api/dashboard/stats")
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    user_predictions = [p for p in predictions_db if p['userId'] == current_user['id']]
    
    total = len(user_predictions)
    interested = sum(1 for p in user_predictions if p['prediction'] == 1)
    not_interested = total - interested
    
    # Recent predictions (last 7 days)
    seven_days_ago = datetime.now() - timedelta(days=7)
    recent = sum(1 for p in user_predictions if p['createdAt'] >= seven_days_ago)
    
    # Weekly data
    weekly_data = []
    for i in range(7):
        date = datetime.now() - timedelta(days=6-i)
        count = sum(1 for p in user_predictions if p['createdAt'].date() == date.date())
        weekly_data.append({"day": date.strftime("%a"), "count": count})
    
    return {
        "totalPredictions": total,
        "interestedCount": interested,
        "notInterestedCount": not_interested,
        "recentPredictions": recent,
        "weeklyData": weekly_data
    }

@app.get("/api/analytics")
async def get_analytics(
    period: str = "7days",
    current_user: dict = Depends(get_current_user)
):
    user_predictions = [p for p in predictions_db if p['userId'] == current_user['id']]
    
    # Calculate metrics
    total = len(user_predictions)
    interested = sum(1 for p in user_predictions if p['prediction'] == 1)
    
    return {
        "totalCustomers": total,
        "conversionRate": round((interested / total * 100) if total > 0 else 0, 1),
        "totalRevenue": sum(float(p['data'].get('Annual_Premium', 0)) for p in user_predictions if p['prediction'] == 1),
        "avgPremium": round(sum(float(p['data'].get('Annual_Premium', 0)) for p in user_predictions) / total if total > 0 else 0, 2),
        "trendData": [],
        "ageDistribution": [],
        "genderData": [],
        "vehicleAgeData": [],
        "premiumData": [],
        "regionalData": []
    }

# Export Endpoints
@app.post("/api/predictions/export")
async def export_predictions(
    data: dict,
    current_user: dict = Depends(get_current_user)
):
    ids = data.get('ids', [])
    format_type = data.get('format', 'csv')
    
    user_predictions = [p for p in predictions_db if p['id'] in ids and p['userId'] == current_user['id']]
    
    # Convert to DataFrame
    export_data = []
    for p in user_predictions:
        row = p['data'].copy()
        row['Prediction'] = 'Interested' if p['prediction'] == 1 else 'Not Interested'
        row['Confidence'] = f"{p['probability']*100:.2f}%" if p['probability'] else 'N/A'
        row['Date'] = p['createdAt'].strftime('%Y-%m-%d %H:%M')
        export_data.append(row)
    
    df = pd.DataFrame(export_data)
    
    # Generate file
    output = BytesIO()
    if format_type == 'csv':
        df.to_csv(output, index=False)
        media_type = 'text/csv'
        filename = f'predictions_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
    else:
        df.to_excel(output, index=False)
        media_type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        filename = f'predictions_{datetime.now().strftime("%Y%m%d_%H%M%S")}.xlsx'
    
    output.seek(0)
    
    return StreamingResponse(
        output,
        media_type=media_type,
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

# Admin Endpoints
@app.get("/api/admin/users")
async def get_users(admin: dict = Depends(get_admin_user)):
    users_list = [{k: v for k, v in u.items() if k != 'password'} for u in users_db.values()]
    
    # Add prediction counts
    for user in users_list:
        user['predictionCount'] = sum(1 for p in predictions_db if p['userId'] == user['id'])
    
    return {"users": users_list}

@app.get("/api/admin/stats")
async def get_admin_stats(admin: dict = Depends(get_admin_user)):
    return {
        "totalUsers": len(users_db),
        "totalPredictions": len(predictions_db),
        "adminUsers": sum(1 for u in users_db.values() if u['role'] == 'admin')
    }

@app.put("/api/admin/users/{user_id}/role")
async def update_user_role(
    user_id: int,
    data: dict,
    admin: dict = Depends(get_admin_user)
):
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    users_db[user_id]['role'] = data['role']
    return {"message": "Role updated successfully"}

@app.delete("/api/admin/users/{user_id}")
async def delete_user(
    user_id: int,
    admin: dict = Depends(get_admin_user)
):
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    del users_db[user_id]
    return {"message": "User deleted successfully"}

# User Profile Endpoints
@app.get("/api/user/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    return {k: v for k, v in current_user.items() if k != 'password'}

@app.put("/api/user/profile")
async def update_profile(
    data: dict,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user['id']
    if user_id in users_db:
        users_db[user_id].update({
            "name": data.get("name", current_user['name']),
            "phone": data.get("phone", current_user.get('phone'))
        })
    return {"message": "Profile updated successfully"}

@app.put("/api/user/password")
async def update_password(
    data: dict,
    current_user: dict = Depends(get_current_user)
):
    if not verify_password(data['currentPassword'], current_user['password']):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    user_id = current_user['id']
    users_db[user_id]['password'] = hash_password(data['newPassword'])
    return {"message": "Password updated successfully"}

@app.put("/api/user/notifications")
async def update_notifications(
    data: dict,
    current_user: dict = Depends(get_current_user)
):
    # Save notification preferences
    return {"message": "Notification preferences updated"}

# Health Check
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "timestamp": datetime.now()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
