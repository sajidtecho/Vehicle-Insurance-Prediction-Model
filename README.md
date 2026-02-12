# 🚗 Vehicle Insurance Prediction Model

![Python](https://img.shields.io/badge/Python-3.8%2B-blue)
![Flask](https://img.shields.io/badge/Flask-2.0%2B-green)
![Machine Learning](https://img.shields.io/badge/ML-Scikit--learn-orange)
![Accuracy](https://img.shields.io/badge/Accuracy-92.20%25-success)
![License](https://img.shields.io/badge/License-MIT-yellow)

A production-ready machine learning project that predicts whether a customer will purchase vehicle insurance using demographic, vehicle, and policy data. Features a complete MLOps pipeline with data ingestion, transformation, model training, evaluation, and deployment to cloud storage, plus a modern web interface for real-time predictions.

## 📋 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Usage](#-usage)
  - [Training Pipeline](#1-training-pipeline)
  - [Web Application](#2-web-application)
  - [Prediction API](#3-prediction-api)
- [Project Structure](#-project-structure)
- [Model Performance](#-model-performance)
- [API Documentation](#-api-documentation)
- [Architecture](#-architecture)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

This project implements an end-to-end machine learning solution for predicting vehicle insurance purchase intent. The system analyzes customer demographics, vehicle information, and policy details to provide accurate predictions that help insurance companies:

- **Optimize Marketing**: Target customers most likely to purchase insurance
- **Reduce Costs**: Focus resources on high-probability leads
- **Improve Conversion**: Personalize offerings based on prediction insights
- **Data-Driven Decisions**: Leverage ML for strategic planning

**Model Accuracy**: 92.20% | **F1-Score**: 0.92

## ✨ Features

### Machine Learning Pipeline
- ✅ **Automated Data Ingestion** from MongoDB
- ✅ **Data Validation** with schema enforcement
- ✅ **Feature Engineering** and transformation
- ✅ **Model Training** with hyperparameter tuning
- ✅ **Model Evaluation** with comprehensive metrics
- ✅ **Cloud Deployment** to AWS S3
- ✅ **Pipeline Orchestration** with modular components

### Web Application
- 🎨 **Modern UI**: Beautiful, responsive interface
- ⚡ **Real-time Predictions**: Instant results
- 📊 **Visual Feedback**: Loading states and animations
- 💡 **Smart Recommendations**: Actionable insights
- 📱 **Mobile Responsive**: Works on all devices
- ✅ **Input Validation**: Client and server-side validation

### Production Features
- 🔄 **Artifact Versioning**: Timestamped model artifacts
- 📝 **Comprehensive Logging**: Track all operations
- 🛡️ **Error Handling**: Robust exception management
- 🧪 **Testing Suite**: Unit and integration tests
- 🐳 **Docker Support**: Containerized deployment
- ☁️ **Cloud Integration**: AWS S3 for model storage

## 🛠️ Tech Stack

### Machine Learning & Data Science
- **Python 3.8+**
- **Scikit-learn**: Model training (Random Forest)
- **Pandas & NumPy**: Data manipulation
- **Matplotlib & Plotly**: Visualization
- **Imbalanced-learn**: Handling class imbalance

### Web Framework
- **Flask**: Backend API server
- **HTML5/CSS3**: Frontend structure and styling
- **JavaScript (Vanilla)**: Client-side logic
- **AJAX (Fetch API)**: Asynchronous communication

### Database & Storage
- **MongoDB**: Data storage
- **AWS S3**: Model artifact storage
- **PyYAML**: Configuration management

### DevOps & Tools
- **Docker**: Containerization
- **Git**: Version control
- **from_root**: Path management
- **python-dotenv**: Environment variables
- **dill**: Object serialization

## 📦 Installation

### Prerequisites
- Python 3.8 or higher
- MongoDB (for data storage)
- AWS Account (optional, for S3 deployment)
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/sajidtecho/Vehicle-Insurance-Prediction-Model.git
cd Vehicle-Insurance-Prediction-Model
```

### Step 2: Create Virtual Environment
```bash
# Using conda
conda create -n vehicle python=3.8 -y
conda activate vehicle

# Or using venv
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables
Create a `.env` file in the root directory:
```env
MONGO_DB_URL=your_mongodb_connection_string
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
```

## 🚀 Quick Start

### Option 1: Using the Web Interface (Fastest)
```bash
# Run the startup script
.\start_webapp.ps1

# Or manually
python app.py
```
Then open http://127.0.0.1:5000 in your browser.

### Option 2: Training the Model
```bash
# Run the complete training pipeline
python demo.py
```

### Option 3: Using the Prediction API
```python
from src.pipline.prediction_pipeline import PredictionPipeline

# Create prediction data
data = {
    'Gender': 'Male',
    'Age': 35,
    'Driving_License': 1,
    'Region_Code': 28.0,
    'Previously_Insured': 0,
    'Annual_Premium': 40000.0,
    'Policy_Sales_Channel': 152.0,
    'Vintage': 154,
    'Vehicle_Age': '1-2 Year',
    'Vehicle_Damage': 'Yes'
}

# Get prediction
pipeline = PredictionPipeline()
result = pipeline.predict(data)
print(f"Prediction: {result}")  # 0 or 1
```

## 📖 Usage

### 1. Training Pipeline

The complete ML pipeline consists of several stages:

```bash
# Run full training pipeline
python demo.py
```

**Pipeline Stages**:
1. **Data Ingestion**: Fetch data from MongoDB
2. **Data Validation**: Validate against schema
3. **Data Transformation**: Feature engineering and preprocessing
4. **Model Training**: Train Random Forest classifier
5. **Model Evaluation**: Calculate metrics and evaluation
6. **Model Deployment**: Push to AWS S3

**Artifacts** are saved in `artifact/<timestamp>/` directory.

### 2. Web Application

#### Start the Server
```bash
python app.py
```

#### Access the Application
- **Local**: http://127.0.0.1:5000
- **Network**: http://your-ip:5000

#### Using the Interface
1. Fill in customer information
2. Click "Predict Insurance Interest"
3. View prediction and recommendations

### 3. Prediction API

#### Python Script
```python
from src.pipline.prediction_pipeline import PredictionPipeline
import pandas as pd

# Prepare data
customer_data = pd.DataFrame([{
    'Gender': 'Female',
    'Age': 42,
    'Driving_License': 1,
    'Region_Code': 28.0,
    'Previously_Insured': 0,
    'Annual_Premium': 35000.0,
    'Policy_Sales_Channel': 26.0,
    'Vintage': 200,
    'Vehicle_Age': '> 2 Years',
    'Vehicle_Damage': 'Yes'
}])

# Predict
pipeline = PredictionPipeline()
prediction = pipeline.predict(customer_data)
print(f"Prediction: {'Interested' if prediction[0] == 1 else 'Not Interested'}")
```

#### REST API
```bash
# Using PowerShell
.\test_api.ps1

# Using curl
curl -X POST http://127.0.0.1:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "Gender": "Male",
    "Age": 35,
    "Driving_License": 1,
    "Region_Code": 28.0,
    "Previously_Insured": 0,
    "Annual_Premium": 40000.0,
    "Policy_Sales_Channel": 152.0,
    "Vintage": 154,
    "Vehicle_Age": "1-2 Year",
    "Vehicle_Damage": "Yes"
  }'
```

## 📂 Project Structure

```
Vehicle-Insurance-Prediction-Model/
├── app.py                          # Flask web application
├── demo.py                         # Training pipeline runner
├── template.py                     # Project template generator
├── setup.py                        # Package setup
├── requirements.txt                # Python dependencies
├── Dockerfile                      # Docker configuration
├── README.md                       # Project documentation
├── LICENSE                         # MIT License
│
├── config/                         # Configuration files
│   ├── model.yaml                  # Model parameters
│   └── schema.yaml                 # Data schema
│
├── src/                            # Source code
│   ├── components/                 # Pipeline components
│   │   ├── data_ingestion.py
│   │   ├── data_validation.py
│   │   ├── data_transformation.py
│   │   ├── model_trainer.py
│   │   ├── model_evaluation.py
│   │   └── model_pusher.py
│   │
│   ├── pipline/                    # ML pipelines
│   │   ├── training_pipeline.py
│   │   └── prediction_pipeline.py
│   │
│   ├── entity/                     # Entity classes
│   │   ├── config_entity.py
│   │   ├── artifact_entity.py
│   │   ├── estimator.py
│   │   └── s3_estimator.py
│   │
│   ├── configuration/              # Configuration handlers
│   │   ├── mongo_db_connection.py
│   │   └── aws_connection.py
│   │
│   ├── data_access/               # Data access layer
│   │   └── Vehicle_Insurance.py
│   │
│   ├── cloud_storage/             # Cloud storage handlers
│   │   └── aws_storage.py
│   │
│   ├── utils/                     # Utility functions
│   │   └── main_utils.py
│   │
│   ├── logger/                    # Logging configuration
│   │   └── __init__.py
│   │
│   ├── exception/                 # Exception handling
│   │   └── __init__.py
│   │
│   └── constants/                 # Constants
│       └── __init__.py
│
├── templates/                     # HTML templates
│   └── index.html                # Main web interface
│
├── static/                        # Static assets
│   ├── css/
│   │   └── style.css             # Stylesheet
│   └── js/
│       └── script.js             # JavaScript logic
│
├── artifact/                      # Model artifacts (versioned)
│   └── <timestamp>/
│       ├── data_ingestion/
│       ├── data_validation/
│       ├── data_transformation/
│       ├── model_trainer/
│       └── model_evaluation/
│
├── notebook/                      # Jupyter notebooks
│   ├── ex-notebook.ipynb         # Exploratory analysis
│   └── data.csv                  # Sample data
│
├── logs/                          # Application logs
│
└── tests/                         # Test scripts
    ├── test_api.ps1
    ├── test_prediction.py
    └── test_local_prediction.py
```

## 📊 Model Performance

### Metrics
| Metric | Score |
|--------|-------|
| **Accuracy** | 92.20% |
| **Precision** | 0.91 |
| **Recall** | 0.93 |
| **F1-Score** | 0.92 |
| **ROC-AUC** | 0.94 |

### Model Details
- **Algorithm**: Random Forest Classifier
- **Estimators**: 250 trees
- **Max Depth**: 25
- **Min Samples Split**: 2
- **Training Data**: 381,109 records
- **Features**: 10 input features
- **Handling Imbalance**: SMOTE (Synthetic Minority Over-sampling)

### Key Features (by Importance)
1. Previously_Insured (35%)
2. Vehicle_Damage (28%)
3. Annual_Premium (15%)
4. Age (12%)
5. Policy_Sales_Channel (5%)
6. Others (5%)

## 🔌 API Documentation

### Endpoints

#### 1. Home Page
```
GET /
```
Returns the main HTML interface.

#### 2. Prediction
```
POST /predict
Content-Type: application/json
```

**Request Body**:
```json
{
  "Gender": "Male",
  "Age": 35,
  "Driving_License": 1,
  "Region_Code": 28.0,
  "Previously_Insured": 0,
  "Annual_Premium": 40000.0,
  "Policy_Sales_Channel": 152.0,
  "Vintage": 154,
  "Vehicle_Age": "1-2 Year",
  "Vehicle_Damage": "Yes"
}
```

**Response**:
```json
{
  "prediction": 1,
  "prediction_label": "Interested in Insurance",
  "confidence": "High",
  "model_info": {
    "accuracy": "92.20%",
    "f1_score": "0.92"
  },
  "recommendations": [
    "Contact customer immediately",
    "Offer personalized insurance plans",
    "Highlight benefits and coverage options"
  ]
}
```

#### 3. Health Check
```
GET /health
```

**Response**:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_path": "artifact/.../model.pkl"
}
```

### Input Field Specifications

| Field | Type | Values | Description |
|-------|------|--------|-------------|
| Gender | String | Male, Female | Customer gender |
| Age | Integer | 18-100 | Customer age in years |
| Driving_License | Integer | 0, 1 | Has driving license (0=No, 1=Yes) |
| Region_Code | Float | 0-52 | Customer region code |
| Previously_Insured | Integer | 0, 1 | Previously had insurance (0=No, 1=Yes) |
| Annual_Premium | Float | > 0 | Annual premium amount in currency |
| Policy_Sales_Channel | Float | 1-163 | Channel code for contacting customer |
| Vintage | Integer | 10-299 | Days associated with company |
| Vehicle_Age | String | < 1 Year, 1-2 Year, > 2 Years | Age of vehicle |
| Vehicle_Damage | String | Yes, No | Vehicle damage history |

## 🏗️ Architecture

### System Flow
```
User Input (Web/API) 
    ↓
Flask Application
    ↓
Prediction Pipeline
    ↓
Preprocessor (Scaling, Encoding)
    ↓
Random Forest Model
    ↓
Prediction (0 or 1)
    ↓
Recommendations Engine
    ↓
Response to User
```

### Training Pipeline Flow
```
MongoDB → Data Ingestion → Data Validation → Data Transformation
    ↓
Model Training → Model Evaluation → Cloud Deployment (S3)
    ↓
Versioned Artifacts
```

For detailed architecture diagrams, see [ARCHITECTURE.md](ARCHITECTURE.md).

## 🧪 Testing

### Run Tests
```bash
# Test API
.\test_api.ps1

# Test prediction locally
python test_local_prediction.py

# Test complete prediction
python test_prediction.py

# Calculate model accuracy
python calculate_accuracy.py

# System health check
python system_check.py
```

## 🐳 Docker Deployment

### Build Image
```bash
docker build -t vehicle-insurance-prediction .
```

### Run Container
```bash
docker run -p 5000:5000 \
  -e MONGO_DB_URL=your_mongo_url \
  -e AWS_ACCESS_KEY_ID=your_key \
  -e AWS_SECRET_ACCESS_KEY=your_secret \
  vehicle-insurance-prediction
```

## ☁️ Vercel Deployment (Serverless)

Deploy to Vercel for free, serverless hosting with automatic scaling!

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sajidtecho/Vehicle-Insurance-Prediction-Model)

### Manual Deployment Steps

1. **Fork/Clone the Repository**
2. **Push to Your GitHub**
3. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - Click "Deploy"

4. **Configure Build** (if needed)
   - Install Command: `pip install -r requirements-vercel.txt`
   - Build Command: (leave empty)
   - Output Directory: (leave empty)

5. **Access Your Live App**
   - Your app will be live at `https://your-project.vercel.app`

### Vercel CLI Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Local Testing (Vercel Mode)

```bash
# Test Vercel-compatible version locally
python vercel-dev.py

# Or use Vercel dev server
vercel dev
```

**📖 Complete Vercel Guide**: See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for detailed instructions, troubleshooting, and best practices.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Shakil Ahmad**
- GitHub: [@sajidtecho](https://github.com/sajidtecho)
- Repository: [Vehicle-Insurance-Prediction-Model](https://github.com/sajidtecho/Vehicle-Insurance-Prediction-Model)

## 🙏 Acknowledgments

- Dataset providers and insurance industry experts
- Open-source ML and web development communities
- Contributors and testers

## 📧 Contact

For questions, issues, or suggestions:
- Open an issue on GitHub
- Email: [Contact through GitHub profile]

---

**Made with ❤️ using Python, Flask, and Machine Learning**

⭐ Star this repo if you find it helpful!
