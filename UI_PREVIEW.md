# 🎨 Web Application User Interface Preview

## Visual Overview

### 📱 Main Page Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  🚗 VEHICLE INSURANCE PREDICTION SYSTEM                             │
│  AI-Powered Customer Interest Prediction | 92.20% Accuracy         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────┬────────────────────────────────────────────┐
│                          │                                            │
│  CUSTOMER INFORMATION    │         PREDICTION RESULT                  │
│  ────────────────────    │         ─────────────────                  │
│                          │                                            │
│  Gender: [▼ Select]      │         ┌────────────────────┐             │
│  Age: [____]             │         │        ✅          │             │
│  Driving License: [▼]    │         │                    │             │
│  Region Code: [____]     │         │   INTERESTED IN    │             │
│                          │         │     INSURANCE      │             │
│  INSURANCE HISTORY       │         └────────────────────┘             │
│  ──────────────────      │                                            │
│  Previously Insured: [▼] │    This customer is predicted to have      │
│  Annual Premium: [____]  │    high interest in purchasing vehicle     │
│                          │    insurance.                              │
│  POLICY DETAILS          │                                            │
│  ──────────────          │    ✓ High Interest Detected                │
│  Sales Channel: [____]   │    Customer shows strong interest...       │
│  Vintage: [____]         │                                            │
│                          │    Recommended Actions:                    │
│  VEHICLE INFORMATION     │    ✓ Contact customer immediately          │
│  ────────────────────    │    ✓ Offer personalized plans              │
│  Vehicle Age: [▼]        │    ✓ Highlight matching benefits           │
│  Vehicle Damage: [▼]     │                                            │
│                          │    ┌────────────────────────────────────┐  │
│  ┌────────────────────┐  │    │ Model Accuracy: 92.20%             │  │
│  │ 🔍 Predict Interest │  │    │ F1-Score: 93.16%                   │  │
│  └────────────────────┘  │    └────────────────────────────────────┘  │
│                          │                                            │
└──────────────────────────┴────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  © 2026 Vehicle Insurance Prediction System | Powered by ML         │
└─────────────────────────────────────────────────────────────────────┘
```

## 🎨 Color Scheme

### Primary Colors
- **Header Gradient**: Purple to Blue (#667eea → #764ba2)
- **Success Green**: (#11998e → #38ef7d) - For "Interested" predictions
- **Alert Red**: (#eb3349 → #f45c43) - For "Not Interested" predictions

### Secondary Colors
- **Background**: Light gray (#f8f9fa)
- **Text Primary**: Dark gray (#495057)
- **Text Secondary**: Medium gray (#6c757d)
- **Borders**: Light gray (#e9ecef)

## 📐 Interface Components

### 1. Header Section
```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║    🚗 Vehicle Insurance Prediction System                 ║
║    AI-Powered Customer Interest Prediction | 92.20%       ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```
- Gradient background (purple to blue)
- White text with shadow
- Centered alignment
- Includes accuracy badge

### 2. Input Form (Left Panel)

**Personal Information Section:**
```
┌─────────────────────────────────┐
│ Gender:         [▼ Select]      │
│ Age:            [____]          │
│ Driving License:[▼ Yes/No]      │
│ Region Code:    [____]          │
└─────────────────────────────────┘
```

**Insurance History Section:**
```
INSURANCE HISTORY
─────────────────
┌─────────────────────────────────┐
│ Previously Insured: [▼ Yes/No]  │
│ Annual Premium (₹): [____]      │
└─────────────────────────────────┘
```

**Policy Details Section:**
```
POLICY DETAILS
──────────────
┌─────────────────────────────────┐
│ Policy Sales Channel: [____]    │
│ Vintage (Days):       [____]    │
│   Number of days associated     │
└─────────────────────────────────┘
```

**Vehicle Information Section:**
```
VEHICLE INFORMATION
───────────────────
┌─────────────────────────────────┐
│ Vehicle Age:    [▼ Select Age]  │
│ Vehicle Damage: [▼ Yes/No]      │
└─────────────────────────────────┘
```

**Submit Button:**
```
┌──────────────────────────────┐
│  🔍 Predict Interest         │
└──────────────────────────────┘
```
- Full-width gradient button
- Hover effect: Slight lift with shadow
- Loading state: Spinner animation

### 3. Result Panel (Right Panel)

**Interested Prediction:**
```
┌────────────────────────────────────────┐
│              ✅                         │
│                                        │
│         Prediction Result              │
│                                        │
│    ┌──────────────────────────┐       │
│    │  INTERESTED IN INSURANCE │       │
│    └──────────────────────────┘       │
│                                        │
│  This customer is predicted to have    │
│  high interest in purchasing vehicle   │
│  insurance.                            │
│                                        │
│  ┌─ ✓ High Interest Detected ────┐    │
│  │                                │    │
│  │ Customer shows strong interest │    │
│  │                                │    │
│  │ Recommended Actions:           │    │
│  │ ✓ Contact immediately          │    │
│  │ ✓ Offer personalized plans     │    │
│  │ ✓ Highlight benefits           │    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌──────────────────────────────┐     │
│  │ Model Accuracy: 92.20%       │     │
│  │ F1-Score: 93.16%             │     │
│  └──────────────────────────────┘     │
└────────────────────────────────────────┘
```

**Not Interested Prediction:**
```
┌────────────────────────────────────────┐
│              ❌                         │
│                                        │
│         Prediction Result              │
│                                        │
│    ┌──────────────────────────────┐   │
│    │ NOT INTERESTED IN INSURANCE  │   │
│    └──────────────────────────────┘   │
│                                        │
│  This customer is predicted to have    │
│  low interest in purchasing insurance  │
│  at this time.                         │
│                                        │
│  ┌─ ⚠ Low Interest Detected ─────┐    │
│  │                                │    │
│  │ Customer may not be interested │    │
│  │                                │    │
│  │ Recommended Actions:           │    │
│  │ ✓ Schedule follow-up           │    │
│  │ ✓ Send educational materials   │    │
│  │ ✓ Consider promotions          │    │
│  └────────────────────────────────┘    │
└────────────────────────────────────────┘
```

## 🎬 User Interaction Flow

```
┌──────────┐
│  START   │
└────┬─────┘
     │
     ▼
┌─────────────────────┐
│ Fill Customer Info  │
│ - Personal details  │
│ - Insurance history │
│ - Policy details    │
│ - Vehicle info      │
└────┬────────────────┘
     │
     ▼
┌──────────────────┐
│ Click "Predict"  │
└────┬─────────────┘
     │
     ▼
┌──────────────────┐       ┌─────────────┐
│ Show Loading...  │       │ API Call to │
│ (Spinner active) │◄──────│  /predict   │
└────┬─────────────┘       └─────────────┘
     │
     ▼
┌──────────────────┐
│ Display Result   │
│ - Prediction     │
│ - Recommendations│
│ - Model metrics  │
└────┬─────────────┘
     │
     ▼
┌──────────────┐
│ User Reviews │
│    Result    │
└──────────────┘
```

## 📱 Responsive Design

### Desktop View (> 968px)
- Two-column layout (form | results)
- Full-width components
- Larger fonts and spacing

### Tablet View (768px - 968px)
- Single column layout
- Results appear below form
- Medium-sized components

### Mobile View (< 768px)
- Single column layout
- Compact form fields
- Touch-optimized buttons
- Smaller fonts to fit screen

## ✨ Animations & Effects

### Page Load
- Fade-in animation for form section
- Slide-in for header content

### Form Interactions
- Focus glow effect on input fields
- Border color change on focus (#667eea)
- Smooth transitions (0.3s ease)

### Button States
- Hover: Lift effect (translateY -2px) + shadow
- Active: Press down (translateY 0)
- Disabled: 60% opacity + no pointer

### Result Display
- Fade-in animation (0.5s)
- Scale-in for prediction badge
- Slide-down for recommendations
- Smooth scroll to result section

### Loading State
```
Button Text:  🔍 Predict Interest
              ↓
Loading:      ⭕ (rotating spinner)
              ↓
Complete:     🔍 Predict Interest
```

## 🎯 Accessibility Features

- Semantic HTML5 elements
- Proper label-input associations
- Clear error messages
- Keyboard navigation support
- High contrast ratios for text
- Focus indicators on interactive elements
- ARIA labels where appropriate

## 📊 Data Visualization Elements

### Confidence Badge
Shows model performance metrics:
```
┌──────────────────────────────────────┐
│ Model Accuracy: 92.20%               │
│ F1-Score: 93.16%                     │
│ Trained on 381,109 records           │
└──────────────────────────────────────┘
```

### Progress Indicator (During Prediction)
```
⭕ Making prediction...
```

## 🔧 Technical Features Display

### Health Status Endpoint
Accessible at `/health`:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_path": "artifact/.../model.pkl"
}
```

---

This interface provides a professional, modern experience for making insurance interest predictions!
