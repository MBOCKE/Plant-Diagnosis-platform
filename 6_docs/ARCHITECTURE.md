
## FILE: `6_docs/ARCHITECTURE.md`

```markdown
# Plant Diagnosis Platform - Architecture

## System Diagram
┌─────────────────────────────────────────┐
│ MOBILE APP │
│ React Native + Expo (SDK 54) │
└───────────────────┬─────────────────────┘
│ HTTP REST
▼
┌─────────────────────────────────────────┐
│ API GATEWAY (:3000) │
│ Express.js + Rate Limiting + CORS │
│ Security: Helmet, Input Validation │
└──┬──────────┬──────────┬────────────────┘
│ │ │
▼ ▼ ▼
┌──────┐ ┌──────┐ ┌──────────────┐
│ AUTH │ │CASE │ │ TREATMENT │
│:3004 │ │:3003 │ │ :3002 │
│ │ │ │ │ │
│MongoDB│ │MongoDB│ │ MongoDB │
│auth_db│ │cases_db│ │treatment_db │
└──────┘ └──────┘ └──────────────┘

┌──────────────────┐
│ INFERENCE │
│ :5000 │
│ Python Flask │
│ + TFLite Models │
└──────────────────┘

text

## Tech Stack

| Layer | Technology |
|:---|:---|
| Frontend | React Native, Expo SDK 54, TypeScript |
| Backend | Node.js, Express.js |
| ML Inference | Python 3.13, Flask, TensorFlow Lite |
| Database | MongoDB 7.0 (separate DB per service) |
| ML Models | MobileNetV2, trained on Google Colab (T4 GPU) |
| API Testing | Insomnia |

## Microservices

| Service | Port | Database | Responsibility |
|:---|:---|:---|:---|
| API Gateway | 3000 | None | Routing, rate limiting, security, CORS |
| Auth Service | 3004 | auth_db | Registration, login, JWT tokens, profiles |
| Treatment Service | 3002 | treatment_db | Disease protocols (EN/FR), urgency levels |
| Case Service | 3003 | cases_db | Diagnosis history, CRUD, offline sync |
| Inference Service | 5000 | None | AI model inference, image preprocessing |

## AI Models

| Model | Architecture | Classes | Accuracy |
|:---|:---|:---|:---|
| Tomato | MobileNetV2 | 5 (Early Blight, Late Blight, TYLCV, Bacterial Spot, Healthy) | 98.31% field test |
| Banana/Plantain | MobileNetV2 | 4 (Black Sigatoka, BBTV, Fusarium Wilt, Healthy) | 91.33% field test |

## Security

- JWT authentication on protected routes
- Rate limiting (Auth: 10/min, Inference: 30/15min, Global: 100/15min)
- Helmet security headers
- CORS configured for mobile app
- Input validation on all endpoints
- Body size limit (10MB)

## Data Flow

1. Farmer captures leaf photo via mobile app
2. App sends image to API Gateway (:3000)
3. Gateway routes to Inference Service (:5000)
4. Python Flask server preprocesses image, runs TFLite model
5. Returns diagnosis with confidence scores
6. Gateway fetches treatment from Treatment Service (:3002)
7. Complete result returned to mobile app
8. Case saved to Case Service (:3003) for history

## Deployment

Each service is independently deployable with its own:
- `package.json` / `requirements.txt`
- `.env` configuration
- `deploy.sh` script
- Database connection