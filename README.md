# Plant Diagnosis Platform

Repository skeleton for plant diagnosis platform.

# Plant Diagnosis Platform

Monorepo for plant disease diagnosis (dataset, training notebooks, models, backend services, and mobile frontend).

## Structure

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

The `8_data_preparation/` directory contains scripts to download and organize datasets from various sources:

- **`01_download_plantvillage.py`** - Downloads PlantVillage dataset
- **`02_download_tomato_field.py`** - Downloads field tomato images
- **`03_copy_all_kaggle.py`** - Copies Kaggle datasets
- **`03_download_field_kaggle.py`** - Downloads field Kaggle data
- **`04_download_banana_kaggle.py`** - Downloads banana Kaggle data
- **`06_download_roboflow.py`** - Downloads Roboflow datasets
- **`06_extract_roboflow.py`** - Extracts Roboflow TFRecord data
- **`count_roboflow.py`** - Counts Roboflow dataset samples
- **`extract_roboflow_tfrecord.py`** - Extracts TFRecord datasets

### Recreating the Full Dataset

To recreate the complete dataset locally:

1. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

2. **Run data preparation scripts** in order:

   ```bash
   cd 8_data_preparation/
   python 01_download_plantvillage.py
   python 02_download_tomato_field.py
   python 03_download_field_kaggle.py
   python 04_download_banana_kaggle.py
   python 06_download_roboflow.py
   python 06_extract_roboflow.py
   ```

3. **Verify downloads:**
   ```bash
   python 02_verify_downloads.py
   ```

This will populate the `1_dataset/` directory with the necessary training, validation, and test data. The exact structure and image distribution can be found in `1_dataset/metadata/`.
