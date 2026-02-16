# Vehicle Insurance Prediction - Complete Setup Guide

This guide helps you set up and run the complete Vehicle Insurance Prediction application with React frontend and FastAPI backend.

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn
- Git

## Quick Start

### 1. Backend Setup

```powershell
# Install Python dependencies
pip install -r requirements-backend.txt

# Start the backend server
python backend_api.py
```

Backend will run on `http://localhost:5000`

### 2. Frontend Setup

```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### 3. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API Docs**: http://localhost:5000/docs
- **Health Check**: http://localhost:5000/api/health

## Default Admin Account

On first run, register a user - the first user will automatically become an admin:

```
Email: admin@example.com
Password: admin123
```

## Features Breakdown

### ✅ Feature 1: Batch Prediction Capability
**Status**: Implemented

- Upload CSV/Excel files
- Process multiple predictions at once
- View results in table format
- Download sample template

**Usage**:
1. Go to "Batch Prediction"
2. Upload your CSV/Excel file
3. Click "Process File"
4. View and export results

**Files**:
- `frontend/src/pages/BatchPrediction.jsx`
- `backend_api.py` - `/api/predict/batch` endpoint

---

### ✅ Feature 2: Export Predictions to CSV/Excel
**Status**: Implemented

- Export individual or batch predictions
- Support for CSV and Excel formats
- Customizable export fields
- One-click export from history

**Usage**:
1. Select predictions from history
2. Click "Export as CSV" or "Export as Excel"
3. File downloads automatically

**Files**:
- `frontend/src/utils/helpers.js` - Export functions
- `frontend/src/pages/PredictionHistory.jsx` - Export UI
- `backend_api.py` - `/api/predictions/export` endpoint

---

### ✅ Feature 3: User Authentication and Role Management
**Status**: Implemented

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (User/Admin)
- Protected routes
- Session management

**Usage**:
1. Register new account
2. Login with credentials
3. Admin can manage user roles
4. Access protected features

**Files**:
- `frontend/src/contexts/AuthContext.jsx`
- `frontend/src/components/PrivateRoute.jsx`
- `backend_api.py` - Auth endpoints

---

### ✅ Feature 4: Prediction History Tracking
**Status**: Implemented

- Complete history of all predictions
- Search and filter capabilities
- Pagination for large datasets
- Delete individual predictions
- Multi-select operations

**Usage**:
1. Navigate to "History"
2. Browse all past predictions
3. Search/filter as needed
4. Select and export or delete

**Files**:
- `frontend/src/pages/PredictionHistory.jsx`
- `backend_api.py` - `/api/predictions/history` endpoint

---

### ✅ Feature 5: Advanced Analytics Dashboard
**Status**: Implemented

- Interactive charts (Line, Bar, Pie, Area)
- Key performance metrics
- Trend analysis over time
- Demographic insights
- Regional analysis
- Premium distribution
- AI-powered insights

**Charts Included**:
- Prediction trends over time
- Age distribution
- Gender-based interest
- Vehicle age impact
- Premium range analysis
- Top regions by interest

**Usage**:
1. Navigate to "Analytics"
2. Select time period (7, 30, 90 days, 1 year)
3. View various visualizations
4. Read AI-generated insights

**Files**:
- `frontend/src/pages/Analytics.jsx`
- `backend_api.py` - `/api/analytics` endpoint

---

### ✅ Feature 6: Email Notifications for Predictions
**Status**: Implemented (Framework ready)

- Notification on batch completion
- High-confidence alerts (>70%)
- User-configurable preferences
- Email templates

**Setup**:
Currently using console logging. To enable real email:

1. Install email service:
```bash
pip install aiosmtplib
```

2. Configure in `backend_api.py`:
```python
async def send_email_notification(email: str, subject: str, body: str):
    # Add your SMTP configuration
    import aiosmtplib
    from email.message import EmailMessage
    
    message = EmailMessage()
    message["From"] = "your-email@example.com"
    message["To"] = email
    message["Subject"] = subject
    message.set_content(body)
    
    await aiosmtplib.send(
        message,
        hostname="smtp.gmail.com",
        port=587,
        start_tls=True,
        username="your-email@example.com",
        password="your-app-password"
    )
```

**Files**:
- `backend_api.py` - `send_email_notification` function
- `frontend/src/pages/Profile.jsx` - Notification preferences

---

## Architecture

```
┌─────────────────┐         ┌──────────────────┐
│  React Frontend │ ◄─────► │  FastAPI Backend │
│  (Port 3000)    │         │  (Port 5000)     │
└─────────────────┘         └──────────────────┘
        │                            │
        │                            │
        ▼                            ▼
┌─────────────────┐         ┌──────────────────┐
│  Tailwind CSS   │         │  ML Model (PKL)  │
│  Recharts       │         │  JWT Auth        │
│  React Router   │         │  In-Memory DB    │
└─────────────────┘         └──────────────────┘
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Predictions
- `POST /api/predict/single` - Single prediction
- `POST /api/predict/batch` - Batch prediction
- `GET /api/predictions/history` - Get history
- `DELETE /api/predictions/{id}` - Delete prediction
- `POST /api/predictions/export` - Export predictions

### Analytics
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/analytics` - Advanced analytics

### User Management
- `GET /api/user/profile` - Get profile
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/password` - Change password
- `PUT /api/user/notifications` - Update preferences

### Admin
- `GET /api/admin/users` - List all users
- `GET /api/admin/stats` - System statistics
- `PUT /api/admin/users/{id}/role` - Update user role
- `DELETE /api/admin/users/{id}` - Delete user

## Testing

### Test Backend

```powershell
# Test health endpoint
curl http://localhost:5000/api/health

# Test prediction
curl -X POST http://localhost:5000/api/predict/single \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"Gender":"Male","Age":30,...}'
```

### Test Frontend

1. Register a new user
2. Login
3. Make a single prediction
4. Upload batch file
5. View history
6. Check analytics
7. Update profile

## Production Deployment

### Backend

```powershell
# Install production server
pip install gunicorn

# Run with gunicorn
gunicorn backend_api:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend

```powershell
cd frontend
npm run build
# Serve the dist folder with nginx or another web server
```

### Environment Variables

Create `.env` file:

```env
# Backend
SECRET_KEY=your-super-secret-key-change-this
DATABASE_URL=your-database-url
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-app-password

# Frontend
VITE_API_URL=https://your-api-domain.com
```

## Database Migration

Currently using in-memory storage. For production, migrate to:

### MongoDB
```python
from pymongo import MongoClient
client = MongoClient('mongodb://localhost:27017/')
db = client['vehicle_insurance']
```

### PostgreSQL
```python
from sqlalchemy import create_engine
engine = create_engine('postgresql://user:password@localhost/dbname')
```

## Troubleshooting

### Port Already in Use

**Backend**:
```powershell
# Change port in backend_api.py
uvicorn.run(app, host="0.0.0.0", port=5001)
```

**Frontend**:
```powershell
# Change port in vite.config.js
server: { port: 3001 }
```

### CORS Errors

Update `backend_api.py`:
```python
allow_origins=["http://localhost:3000", "your-frontend-url"]
```

### Model Not Loading

Ensure model path is correct in `backend_api.py`:
```python
MODEL_PATH = "artifact/02_10_2026_14_49_37/model_trainer/trained_model/model.pkl"
```

## Performance Tips

1. **Backend**:
   - Use async operations
   - Implement caching
   - Database indexing
   - Load balancing

2. **Frontend**:
   - Code splitting
   - Lazy loading
   - Image optimization
   - Bundle optimization

## Security Best Practices

1. Change `SECRET_KEY` in production
2. Use HTTPS
3. Implement rate limiting
4. Validate all inputs
5. Use environment variables
6. Regular security audits

## Next Steps

1. **Add Real Database**: Replace in-memory storage with MongoDB/PostgreSQL
2. **Email Service**: Integrate SendGrid/AWS SES
3. **Cloud Deployment**: Deploy to AWS/Azure/Google Cloud
4. **CI/CD Pipeline**: Set up automated deployment
5. **Monitoring**: Add application monitoring
6. **Testing**: Add unit and integration tests
7. **Documentation**: API documentation with Swagger
8. **Caching**: Implement Redis caching
9. **WebSockets**: Real-time updates
10. **Mobile App**: React Native version

## Support

- GitHub Issues: [Create an issue]
- Email: support@example.com
- Documentation: See individual README files

## License

MIT License - See LICENSE file for details
