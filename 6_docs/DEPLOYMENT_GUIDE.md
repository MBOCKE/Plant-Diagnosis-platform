## FILE 4: `6_docs/DEPLOYMENT_GUIDE.md`

```markdown
# Plant Diagnosis Platform - Deployment Guide

## Independent Deployment

Each microservice can be deployed independently:

### Deploy Auth Service
```bash
cd auth-service
npm install --production
npm start
Deploy Treatment Service
bash
cd treatment-service
npm install --production
npm run seed
npm start
Deploy Case Service
bash
cd case-service
npm install --production
npm start
Deploy Inference Service
bash
cd inference-service/python_server
pip install -r requirements.txt
python app.py
Deploy API Gateway
bash
cd api-gateway
npm install --production
npm start
Environment Variables
Each service has its own .env file. Update production URLs:

MONGODB_URI: Production MongoDB connection string

JWT_SECRET: Strong random secret

*_SERVICE_URL: Production service URLs