# 🚗 Vehicle Insurance Prediction Web Application

## Complete Frontend Setup Guide

This is a user-friendly web interface for the Vehicle Insurance Prediction Model with 92.20% accuracy.

## 📁 Project Structure
```
Vehicle-Insurance-Prediction-Model/
│
├── app.py                 # Flask backend API
├── templates/
│   └── index.html        # Frontend HTML page
├── static/
│   ├── css/
│   │   └── style.css     # Stylesheet
│   └── js/
│       └── script.js     # JavaScript functionality
└── artifact/             # Trained model files
```

## 🚀 How to Run the Web Application

### Step 1: Install Flask
```bash
pip install flask
```

### Step 2: Start the Server
```bash
python app.py
```

### Step 3: Access the Application
Open your browser and go to:
```
http://127.0.0.1:5000
```

## 🎨 Features

### ✨ User Interface
- **Modern Design**: Beautiful gradient-based UI with smooth animations
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Real-time Validation**: Input fields are validated as you type
- **Loading States**: Visual feedback during prediction processing

### 📊 Prediction Features
- **Instant Predictions**: Get results in seconds
- **Detailed Results**: Clear display of prediction outcome
- **Smart Recommendations**: Actionable insights based on prediction
- **Model Metrics**: Display of accuracy and F1-score for transparency

### 📝 Input Fields
The form collects the following information:

**Personal Information:**
- Gender (Male/Female)
- Age (18-100 years)
- Driving License (Yes/No)
- Region Code

**Insurance History:**
- Previously Insured (Yes/No)
- Annual Premium Amount

**Policy Details:**
- Policy Sales Channel
- Vintage (Days associated with company)

**Vehicle Information:**
- Vehicle Age (< 1 year, 1-2 years, > 2 years)
- Vehicle Damage History (Yes/No)

## 🔧 Technical Stack

### Backend
- **Framework**: Flask (Python)
- **ML Model**: Scikit-learn Random Forest
- **Data Processing**: Pandas, NumPy
- **Model Storage**: Pickle

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with gradients and animations
- **JavaScript (Vanilla)**: No framework dependencies
- **AJAX**: Fetch API for async communication

## 📱 API Endpoints

### 1. Home Page
```
GET /
Returns: HTML page
```

### 2. Predict
```
POST /predict
Content-Type: application/json

Request Body:
{
    "gender": 1,
    "age": 35,
    "driving_license": 1,
    "region_code": 28,
    "previously_insured": 0,
    "annual_premium": 30000,
    "policy_sales_channel": 152,
    "vintage": 150,
    "vehicle_age_lt_1_year": 0,
    "vehicle_age_gt_2_years": 1,
    "vehicle_damage_yes": 1
}

Response:
{
    "prediction": 1,
    "prediction_text": "INTERESTED in Insurance",
    "recommendation": {
        "title": "✓ High Interest Detected",
        "message": "Customer shows strong interest...",
        "actions": ["Contact immediately", "Offer plans", ...]
    }
}
```

### 3. Health Check
```
GET /health
Returns: {"status": "healthy", "model_loaded": true}
```

## 🎯 Example Usage

### Sample Customer Profile 1: High Interest
- Male, Age 35
- Has driving license
- NOT previously insured
- Vehicle has damage
- **Prediction**: INTERESTED ✅

### Sample Customer Profile 2: Low Interest
- Female, Age 42
- Has driving license
- Previously insured
- No vehicle damage
- **Prediction**: NOT INTERESTED ❌

## 🛠️ Customization Options

### Change Colors
Edit `static/css/style.css`:
```css
/* Primary gradient colors */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Modify Recommendations
Edit `app.py` in the `get_recommendation()` function:
```python
def get_recommendation(prediction, features):
    # Add your custom logic here
    ...
```

### Add New Features
1. Update HTML form in `templates/index.html`
2. Add corresponding fields in `app.py` predict endpoint
3. Update model input in prediction logic

## 🔐 Production Deployment

### For Production Use:
1. **Use Production Server**: Replace Flask dev server with Gunicorn/uWSGI
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

2. **Add HTTPS**: Use nginx as reverse proxy with SSL

3. **Environment Variables**: Store sensitive configs
   ```python
   import os
   SECRET_KEY = os.environ.get('SECRET_KEY')
   ```

4. **Enable CORS** (if needed for external access):
   ```bash
   pip install flask-cors
   ```

5. **Add Authentication**: Implement user login if required

## 📊 Performance Metrics

**Model Accuracy**: 92.20%
**F1-Score**: 93.16%
**Precision**: 88.57%
**Recall**: 98.25%

**Dataset**: 381,109 records
**Algorithm**: Random Forest Classifier
**Training Time**: ~25 minutes

## 🐛 Troubleshooting

### Issue: Model not found
**Solution**: Ensure the model path in `app.py` is correct:
```python
MODEL_PATH = "artifact/02_10_2026_14_49_37/model_trainer/trained_model/model.pkl"
```

### Issue: Port 5000 already in use
**Solution**: Change port in `app.py`:
```python
app.run(debug=True, port=5001)
```

### Issue: Flask not installed
**Solution**: Install Flask:
```bash
pip install flask
```

## 📈 Future Enhancements

- [ ] Add batch prediction capability
- [ ] Export predictions to CSV/Excel
- [ ] User authentication and role management
- [ ] Prediction history tracking
- [ ] Advanced analytics dashboard
- [ ] Email notifications for predictions
- [ ] RESTful API documentation (Swagger)
- [ ] Docker containerization

## 📄 License

This project is part of the Vehicle Insurance Prediction Model system.

## 👨‍💻 Support

For questions or issues:
1. Check the logs in `logs/` directory
2. Verify model files exist in `artifact/` directory
3. Ensure all dependencies are installed

---

**Built with ❤️ using Flask and Machine Learning**
