# Plant Diagnosis Platform - API Documentation

## Base URL
http://localhost:3000/api

text

## Authentication
Protected endpoints require header:
Authorization: Bearer <token>

text

---

## 🔐 Auth Service

### Register
POST /api/auth/register

text
**Body:**
```json
{
  "email": "farmer@test.com",
  "password": "password123",
  "name": "Jean",
  "phone": "+237600000000",
  "preferredLanguage": "fr",
  "location": {
    "type": "Point",
    "coordinates": [10.4833, 5.4667],
    "country": "Cameroon",
    "region": "West",
    "town": "Foumbot"
  }
}
Login
text
POST /api/auth/login
Body:

json
{
  "email": "farmer@test.com",
  "password": "password123"
}
Get Profile (Auth Required)
text
GET /api/auth/profile
💊 Treatment Service
Get Treatment
text
GET /api/treatment/:cropType/:diseaseName?lang=en|fr
cropType: tomato or banana_plantain

lang: en (default) or fr

List All Treatments
text
GET /api/treatment?cropType=tomato&lang=fr
📋 Case Service (Auth Required)
Create Case
text
POST /api/cases
json
{
  "cropType": "tomato",
  "imageUri": "file:///photos/leaf.jpg",
  "diagnosis": {
    "primaryDiagnosis": { "disease": "Early Blight", "confidence": 94 }
  }
}

Get All Cases
GET /api/cases?page=1&limit=10

Get Single Case
GET /api/cases/:id

Add Notes
PUT /api/cases/:id/notes
json
{ "notes": "Applied copper spray" }

Delete Case
DELETE /api/cases/:id

Sync Offline Cases
POST /api/cases/sync

🤖 Inference Service
Health
GET /api/inference/health

Diagnose
POST /api/inference/predict
Body: multipart/form-data

image: Image file

crop_type: tomato or banana_plantain

Error Codes
Code	Meaning
200	    Success
201 	Created
400	    Validation error
401	    Unauthorized
404	    Not found
409 	Duplicate
429	    Rate limit
500	    Server error