# Plant Diagnosis Platform

## Cloud-Based Mobile Platform for Real-Time Plant Diagnosis and Treatment Recommendation

A farmer-centric mobile application that uses AI to diagnose tomato and banana/plantain diseases from leaf photos, providing instant treatment recommendations.

---

## 🎯 Project Status

| Phase | Status |
|:---|:---|
| Dataset Acquisition & Preparation | ✅ Complete |
| Model Training (Tomato & Banana) | ✅ Complete |
| Mobile App Development | 🚧 In Progress |
| Backend Development | ⏳ Pending |
| Testing & Integration | ⏳ Pending |

---

## 🧠 AI Models

| Model | Architecture | Field Accuracy | Size |
|:---|:---|:---|:---|
| 🍅 Tomato | MobileNetV2 | **98.31%** | 2.77 MB |
| 🍌 Banana/Plantain | MobileNetV2 | **91.33%** | 2.77 MB |

### Target Diseases
- **Tomato (5 classes):** Early Blight, Late Blight, TYLCV, Bacterial Spot, Healthy
- **Banana/Plantain (4 classes):** Black Sigatoka, BBTV, Fusarium Wilt, Healthy

---

## 📂 Project Structure


- `1_dataset/`: dataset (not deployed)
- `2_notebooks/`: training notebooks (not deployed)
- `3_models/`: trained shared assets
- `4_backend/`: microservices
- `5_frontend/`: React Native app (separate)
- `6_docs/`: docs
- `7_tests/`: tests
- `scripts/`: convenience scripts

## Dataset Setup

**Important:** Dataset image files are **not committed** to the repository to keep it lightweight. Instead, they can be automatically recreated using the provided data preparation scripts.

### Downloading Datasets

pip install -r requirements.txt
cd 8_data_preparation/
python 01_download_plantvillage.py
python 02_download_tomato_field.py
python 03_download_field_kaggle.py
python 04_download_banana_kaggle.py
python 06_download_roboflow.py
python 06_extract_roboflow.py
---

## ✅ Completed Tasks

- [x] 6 tomato datasets + 6 banana datasets downloaded (Kaggle, Roboflow, PlantVillage, Mendeley, PMC)
- [x] Empty folders removed and Roboflow artifacts cleaned
- [x] Class names standardized across all sources
- [x] "other_disease" class mapped to black_sigatoka
- [x] Duplicate detection: 8,854 duplicate images removed
- [x] Cross-set leakage check: no training images in test set
- [x] Field-first strategy: training = field images only, PlantVillage = validation/test only
- [x] TYLCV imbalance handled with class weights (3.0x)
- [x] Both models trained on Google Colab (T4 GPU) with 2-stage transfer learning
- [x] Models converted to TFLite format (2.77 MB each)
- [x] Tomato: 87.80% validation, 98.31% field test accuracy
- [x] Banana: 96.72% validation, 91.33% field test accuracy
- [x] Expo project initialized with TypeScript, NativeWind, React Navigation
- [x] UI screens generated via Google Stitch for all app interfaces

---

## 🚧 In Progress

- [ ] Mobile app screens (adapting Stitch HTML to React Native)
- [ ] Offline storage & sync with AsyncStorage
- [ ] API integration with backend services

---

## 🛠️ Tech Stack

| Layer | Technology |
|:---|:---|
| Frontend | React Native, Expo, TypeScript, NativeWind |
| Backend | Express.js, Node.js |
| ML Inference | Python Flask + TensorFlow Lite |
| ML Training | TensorFlow, Keras, MobileNetV2 |
| Database | MongoDB (per microservice) |
| Training Hardware | Google Colab (T4 GPU) |

---

## 📊 Dataset Sources

PlantVillage, Tomato-Village, Roboflow, Kaggle (tomatoleaf, tomato-multi, tomato-noulam), Mendeley, PMC, Banana Leaves Imagery, BananaLSD, Banana v4, Roboflow fusarium, Roboflow BBTV.

**Strategy:** Field datasets prioritized for training. PlantVillage used exclusively for validation/testing. Cameroon field images held out for final field test.
sorry but the actual notebooks are empty because everything was done on collab and stored on drive. contact us if you need it and we will send you a copy.
---

## 📐 Architecture Decisions

| Decision | Choice | Rationale |
|:---|:---|:---|
| Model Architecture | MobileNetV2 | Best accuracy/speed trade-off |
| Training Strategy | 2-stage transfer learning | Head training → fine-tuning |
| Optimizer | Adamax | Proven for plant disease detection |
| Class Imbalance | Weighted loss + aggressive augmentation | TYLCV (3x), fusarium_wilt (3x) |
| Field vs Lab | Field images = training, Lab = validation | Real-world generalization |
| Backend | Express.js microservices | Independent deployment per service |
| Database | MongoDB per service | Document model fits case data |
| Frontend | React Native + Expo | Cross-platform, fast development |


I'll create a command to generate all docs at once. But first:

---

**Export the Insomnia collection now:**

1. Click `⏷` on your collection → **Export** → **Insomnia v4 (JSON)**
2. Save to `6_docs/insomnia-collection.yaml`

Then create the remaining files in `6_docs/` and commit everything!


## 🚀 Quick Start

```bash
# Frontend
cd 5_frontend/PlantDiagnosisApp
npm install
npx expo start

# Backend (coming soon)
cd 4_backend
npm install
npm run dev