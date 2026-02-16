# Configuration Guide

## Quick Start

### Option 1: Run Full Stack (Recommended)
```powershell
.\start_fullstack.ps1
```
This will start both backend and frontend automatically.

### Option 2: Run Separately

#### Start Backend Only
```powershell
python backend_api.py
```
Backend will run at: http://localhost:5000

#### Start Frontend Only
```powershell
cd frontend
npm run dev
```
Frontend will run at: http://localhost:3000

---

## Configuration Files

### 1. Backend Configuration (.env)
Located at project root:
```env
SECRET_KEY=vehicle-insurance-secret-key-change-in-production-2026
PORT=5000
MONGODB_URL=mongodb+srv://...
```

### 2. Frontend Configuration (frontend/.env)
```env
VITE_API_URL=http://localhost:5000
```

---

## Architecture

```
┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │
│  Frontend       │         │  Backend        │
│  React + Vite   │ ──────> │  FastAPI        │
│  Port: 3000     │  HTTP   │  Port: 5000     │
│                 │         │                 │
└─────────────────┘         └─────────────────┘
                                    │
                                    ▼
                            ┌───────────────┐
                            │  ML Model     │
                            │  (Pickle)     │
                            └───────────────┘
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Predictions
- `POST /api/predict` - Single prediction
- `POST /api/predict/batch` - Batch prediction
- `GET /api/predictions` - Get prediction history
- `GET /api/predictions/{id}` - Get specific prediction

### Analytics
- `GET /api/analytics/overview` - Dashboard stats
- `GET /api/analytics/charts` - Chart data

### Admin
- `GET /api/admin/users` - List all users
- `DELETE /api/admin/users/{id}` - Delete user

### Health
- `GET /api/health` - Health check

---

## Environment Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- pip
- npm

### Backend Dependencies
```powershell
pip install -r requirements.txt
```

Key packages:
- fastapi
- uvicorn
- pandas
- scikit-learn
- pyjwt
- bcrypt

### Frontend Dependencies
```powershell
cd frontend
npm install
```

Key packages:
- react
- react-router-dom
- axios
- recharts
- tailwindcss

---

## CORS Configuration

The backend is configured to accept requests from:
- http://localhost:3000 (Frontend dev server)
- http://localhost:5173 (Vite alternate port)

To add more origins, edit `backend_api.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://your-domain.com"],
    ...
)
```

---

## Troubleshooting

### Backend Issues

**Model not found:**
```powershell
python demo.py  # Train the model first
```

**Port 5000 already in use:**
```powershell
# Kill the process using port 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process
```

### Frontend Issues

**Cannot connect to API:**
1. Check backend is running: http://localhost:5000/api/health
2. Verify frontend/.env has correct VITE_API_URL
3. Restart frontend dev server

**Dependencies missing:**
```powershell
cd frontend
rm -rf node_modules
npm install
```

### CORS Errors

If you see CORS errors in browser console:
1. Verify backend CORS settings include your frontend URL
2. Check frontend is making requests to correct URL
3. Ensure credentials are set properly

---

## Production Deployment

### Backend (Vercel)
- Uses `api/index.py` for serverless deployment
- Configure environment variables in Vercel dashboard
- Model file needs to be included or loaded from cloud storage

### Frontend (Vercel/Netlify)
- Build command: `npm run build`
- Output directory: `dist`
- Set `VITE_API_URL` to production backend URL

---

## Security Notes

⚠️ **Important for Production:**

1. Change `SECRET_KEY` to a strong random value
2. Use environment variables for all secrets
3. Enable HTTPS
4. Configure proper CORS origins (remove localhost)
5. Implement rate limiting
6. Use secure database (not in-memory)
7. Add input validation and sanitization
8. Enable authentication for all protected routes

---

## Testing

### Test Backend
```powershell
.\test_api.ps1
```

### Test Frontend
```powershell
cd frontend
npm run build  # Test production build
```

### Manual API Testing
```powershell
# Health check
curl http://localhost:5000/api/health

# Test prediction (requires auth token)
curl -X POST http://localhost:5000/api/predict `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_TOKEN" `
  -d '{"Gender":"Male","Age":30,...}'
```

---

## Support

For issues or questions:
1. Check logs in `logs/` directory
2. Verify all dependencies are installed
3. Ensure model is trained and available
4. Check console output for error messages
