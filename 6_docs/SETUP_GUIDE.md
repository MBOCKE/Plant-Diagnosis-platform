# Plant Diagnosis Platform - Setup Guide

## Prerequisites

- Node.js v22+
- Python 3.13+
- MongoDB 7.0
- npm

## Quick Start

### 1. Start MongoDB
```powershell
& "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath C:\data\db


2. Install All Backend Dependencies
cd 4_backend
cd auth-service && npm install
cd ../treatment-service && npm install && npm run seed
cd ../case-service && npm install
cd ../api-gateway && npm install
cd ../inference-service/python_server && pip install -r requirements.txt

3. Start All Services
Terminal 1: Auth Service

powershell
cd 4_backend/auth-service && npm run dev
Terminal 2: Treatment Service

powershell
cd 4_backend/treatment-service && npm run dev
Terminal 3: Case Service

powershell
cd 4_backend/case-service && npm run dev
Terminal 4: Inference Service

powershell
cd 4_backend/inference-service/python_server && python app.py
Terminal 5: API Gateway

powershell
cd 4_backend/api-gateway && npm run dev
4. Test
text
GET http://localhost:3000/health
API Testing
Import 6_docs/insomnia-collection.yaml into Insomnia to test all endpoints.

Frontend
powershell
cd 5_frontend/PlantDiagnosisApp54
npm install
npx expo start