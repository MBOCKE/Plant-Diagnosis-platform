# File: 2_notebooks/05_full_data_preparation.py
"""
COMPLETE DATA PREPARATION PIPELINE
- Cleans up issues (empty folders, "train/" folder, "other_disease" class)
- Standardizes all class names
- Merges field sources into training/
- Splits PlantVillage into validation/ and test/
- Creates final dataset ready for Google Colab
"""

import os
import shutil
import random
from pathlib import Path
from PIL import Image
from sklearn.model_selection import train_test_split
import json

# Set random seed for reproducibility
random.seed(42)
RANDOM_STATE = 42

# ============================================
# CONFIGURATION
# ============================================

BASE = Path('1_dataset')
DOWNLOADS = BASE / 'downloads'
TRAINING = BASE / 'training'
VALIDATION = BASE / 'validation'
TEST = BASE / 'test'
FIELD_TEST = BASE / 'field_test'
METADATA = BASE / 'metadata'

# Target classes
TOMATO_CLASSES = ['early_blight', 'late_blight', 'tylcv', 'bacterial_spot', 'healthy']
BANANA_CLASSES = ['black_sigatoka', 'bbtv', 'fusarium_wilt', 'healthy']

# Image extensions
IMG_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'}

# ============================================
# STEP 1: CREATE OUTPUT DIRECTORIES
# ============================================

print("=" * 70)
print("STEP 1: Creating output directories...")
print("=" * 70)

for crop in ['tomato', 'banana_plantain']:
    classes = TOMATO_CLASSES if crop == 'tomato' else BANANA_CLASSES
    
    for cls in classes:
        (TRAINING / crop / cls).mkdir(parents=True, exist_ok=True)
        (VALIDATION / crop / cls).mkdir(parents=True, exist_ok=True)
        (TEST / crop / cls).mkdir(parents=True, exist_ok=True)
    
    (FIELD_TEST / crop).mkdir(parents=True, exist_ok=True)

METADATA.mkdir(parents=True, exist_ok=True)

print("✅ Output directories created")

# ============================================
# STEP 2: CLEAN UP ISSUES
# ============================================

print("\n" + "=" * 70)
print("STEP 2: Cleaning up dataset issues...")
print("=" * 70)

# 2a: Remove empty folders (no images)
print("\n📋 Removing empty folders...")
for crop in ['tomato', 'banana_plantain']:
    crop_path = DOWNLOADS / crop
    if crop_path.exists():
        for source in crop_path.iterdir():
            if source.is_dir():
                img_count = sum(1 for _ in source.rglob('*') if _.suffix in IMG_EXTENSIONS)
                if img_count == 0:
                    print(f"   🗑️  Empty: {crop}/{source.name}")
                    shutil.rmtree(source)

# 2b: Remove Roboflow "train/" folder (contains labels, not images)
print("\n📋 Cleaning Roboflow artifacts...")
roboflow_tomato = DOWNLOADS / 'tomato' / '02_roboflow_tomato'
train_folder = roboflow_tomato / 'train'
if train_folder.exists():
    print(f"   🗑️  Removing Roboflow train/ folder")
    shutil.rmtree(train_folder)

# Also check for label files (JSON, XML, TXT)
for crop in ['tomato', 'banana_plantain']:
    for source in (DOWNLOADS / crop).iterdir():
        if source.is_dir():
            for file in source.rglob('*'):
                if file.suffix.lower() in {'.json', '.xml', '.txt', '.csv'}:
                    file.unlink()
                    print(f"   🗑️  Removed label file: {file.name}")

print("✅ Cleanup complete")

# ============================================
# STEP 3: INVESTIGATE "other_disease" CLASS
# ============================================

print("\n" + "=" * 70)
print("STEP 3: Investigating 'other_disease' class in banana datasets...")
print("=" * 70)

# We'll check what's inside "other_disease" folders
for source_name in ['01_bananalsd', '02_banana_v4']:
    other_dir = DOWNLOADS / 'banana_plantain' / source_name / 'other_disease'
    if other_dir.exists():
        images = list(other_dir.glob('*'))
        images = [img for img in images if img.suffix in IMG_EXTENSIONS]
        print(f"\n📁 {source_name}/other_disease/: {len(images)} images")
        
        # Show sample filenames
        for img in images[:5]:
            print(f"   - {img.name}")
        
        # Decision: We'll treat "other_disease" as potential black_sigatoka
        # (most common banana leaf disease)
        print(f"   ℹ️  Will map 'other_disease' → 'black_sigatoka' (most common)")

# ============================================
# STEP 4: STANDARDIZE AND COPY FIELD IMAGES TO TRAINING/
# ============================================

print("\n" + "=" * 70)
print("STEP 4: Copying field images to training/...")
print("=" * 70)

# Class name standardization mapping
TOMATO_NAME_MAP = {
    # Standard names
    'early_blight': 'early_blight',
    'late_blight': 'late_blight',
    'tylcv': 'tylcv',
    'bacterial_spot': 'bacterial_spot',
    'healthy': 'healthy',
    
    # Variations from different sources
    'Tomato___Early_blight': 'early_blight',
    'Tomato___Late_blight': 'late_blight',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus': 'tylcv',
    'Tomato___Bacterial_spot': 'bacterial_spot',
    'Tomato___healthy': 'healthy',
    'Early_Blight': 'early_blight',
    'Late_Blight': 'late_blight',
    'Yellow_Leaf_Curl_Virus': 'tylcv',
    'Bacterial_Spot': 'bacterial_spot',
    'Healthy': 'healthy',
}

BANANA_NAME_MAP = {
    # Standard names
    'black_sigatoka': 'black_sigatoka',
    'bbtv': 'bbtv',
    'fusarium_wilt': 'fusarium_wilt',
    'healthy': 'healthy',
    
    # Variations
    'Black_Sigatoka': 'black_sigatoka',
    'sigatoka': 'black_sigatoka',
    'BBTV': 'bbtv',
    'Bunchy_Top': 'bbtv',
    'bunchy_top': 'bbtv',
    'Fusarium_Wilt': 'fusarium_wilt',
    'panama_disease': 'fusarium_wilt',
    'Healthy': 'healthy',
    
    # "other_disease" - map to black_sigatoka (most common banana disease)
    'other_disease': 'black_sigatoka',
    'Other_Disease': 'black_sigatoka',
}

# Field sources (NOT PlantVillage)
TOMATO_FIELD_SOURCES = [
    '02_roboflow_tomato',
    '03_kaggle_tomatoleaf',
    '04_kaggle_tomato_multi',
    '05_kaggle_tomato_noulam',
]

BANANA_FIELD_SOURCES = [
    '01_bananalsd',
    '02_banana_v4',
    '03_roboflow_fusarium',
    '04_roboflow_bbtv',
]

def copy_field_to_training(crop, sources, class_map, valid_classes):
    """Copy field images to training/ with standardized class names"""
    stats = {cls: 0 for cls in valid_classes}
    
    for source_name in sources:
        source_path = DOWNLOADS / crop / source_name
        if not source_path.exists():
            print(f"   ⚠️  Source not found: {source_name}")
            continue
        
        # Check if source has class subfolders
        subdirs = [d for d in source_path.iterdir() if d.is_dir()]
        
        if not subdirs:
            print(f"   ⚠️  {source_name}: No subfolders, skipping")
            continue
        
        print(f"\n   📦 Processing: {source_name}")
        source_total = 0
        
        for class_dir in subdirs:
            original_class = class_dir.name
            
            # Map to standard class name
            standardized = class_map.get(original_class)
            
            # Try case-insensitive match
            if not standardized:
                for key, value in class_map.items():
                    if key.lower() == original_class.lower():
                        standardized = value
                        break
            
            if not standardized:
                print(f"      ⚠️  Unknown class: '{original_class}' - skipping")
                continue
            
            if standardized not in valid_classes:
                print(f"      ⚠️  '{original_class}' → '{standardized}' not in valid classes - skipping")
                continue
            
            # Copy images
            dest_dir = TRAINING / crop / standardized
            count = 0
            
            for img_file in class_dir.iterdir():
                if img_file.suffix in IMG_EXTENSIONS:
                    # Create unique filename: source_class_originalname
                    new_name = f"{source_name}_{standardized}_{img_file.name}"
                    dest_path = dest_dir / new_name
                    
                    # Skip if already exists
                    if not dest_path.exists():
                        try:
                            # Verify image is valid
                            with Image.open(img_file) as img:
                                img.verify()
                            shutil.copy2(img_file, dest_path)
                            count += 1
                        except Exception:
                            # Skip corrupt images
                            continue
            
            stats[standardized] += count
            if count > 0:
                print(f"      ✅ {original_class} → {standardized}: {count} images")
            source_total += count
        
        print(f"      📊 Source total: {source_total} images")
    
    return stats

# Copy tomato field images
print("\n🍅 TOMATO FIELD IMAGES:")
tomato_stats = copy_field_to_training('tomato', TOMATO_FIELD_SOURCES, TOMATO_NAME_MAP, TOMATO_CLASSES)

# Copy banana field images
print("\n🍌 BANANA FIELD IMAGES:")
banana_stats = copy_field_to_training('banana_plantain', BANANA_FIELD_SOURCES, BANANA_NAME_MAP, BANANA_CLASSES)

# ============================================
# STEP 5: HANDLE PLANTVILLAGE (Validation + Test only)
# ============================================

print("\n" + "=" * 70)
print("STEP 5: Splitting PlantVillage into validation/ and test/...")
print("=" * 70)

def copy_plantvillage_to_val_test(crop, valid_classes):
    """Split PlantVillage: 50% validation, 50% test - NEVER training"""
    pv_path = DOWNLOADS / crop / '99_plantvillage_tomato'
    
    if not pv_path.exists():
        print(f"   ⚠️  PlantVillage not found for {crop}")
        return
    
    # Map PlantVillage folder names
    pv_name_map = {
        'Tomato___Early_blight': 'early_blight',
        'Tomato___Late_blight': 'late_blight',
        'Tomato___Tomato_Yellow_Leaf_Curl_Virus': 'tylcv',
        'Tomato___Bacterial_spot': 'bacterial_spot',
        'Tomato___healthy': 'healthy',
        'early_blight': 'early_blight',
        'late_blight': 'late_blight',
        'tylcv': 'tylcv',
        'bacterial_spot': 'bacterial_spot',
        'healthy': 'healthy',
    }
    
    for folder_name, std_class in pv_name_map.items():
        src_dir = pv_path / folder_name
        if not src_dir.exists():
            # Try finding the folder
            found = False
            for d in pv_path.iterdir():
                if d.is_dir() and std_class in d.name.lower():
                    src_dir = d
                    found = True
                    break
            if not found:
                continue
        
        if std_class not in valid_classes:
            continue
        
        # Get all valid images
        images = [img for img in src_dir.glob('*') if img.suffix in IMG_EXTENSIONS]
        
        # Filter out corrupt images
        valid_images = []
        for img in images:
            try:
                with Image.open(img) as im:
                    im.verify()
                valid_images.append(img)
            except Exception:
                continue
        
        if len(valid_images) < 2:
            continue
        
        # Split: 50% validation, 50% test
        val_imgs, test_imgs = train_test_split(
            valid_images, test_size=0.5, random_state=RANDOM_STATE
        )
        
        # Copy to validation
        val_dest = VALIDATION / crop / std_class
        for img in val_imgs:
            dest = val_dest / f"lab_pv_{img.name}"
            if not dest.exists():
                shutil.copy2(img, dest)
        
        # Copy to test
        test_dest = TEST / crop / std_class
        for img in test_imgs:
            dest = test_dest / f"lab_pv_{img.name}"
            if not dest.exists():
                shutil.copy2(img, dest)
        
        print(f"   ✅ {std_class}: {len(val_imgs)} val + {len(test_imgs)} test (PlantVillage)")

copy_plantvillage_to_val_test('tomato', TOMATO_CLASSES)

# ============================================
# STEP 6: SPLIT FIELD IMAGES (Training → also add some to validation)
# ============================================

print("\n" + "=" * 70)
print("STEP 6: Holding out 15% field images for field_test...")
print("=" * 70)

def holdout_field_test(crop, valid_classes, holdout_pct=0.15):
    """Hold out a portion of field images for final field test"""
    
    for cls in valid_classes:
        training_dir = TRAINING / crop / cls
        field_test_dir = FIELD_TEST / crop / cls
        
        # Get all training images for this class
        images = list(training_dir.glob('*'))
        
        if len(images) < 3:
            continue
        
        # Split: holdout_pct for field test, rest stays in training
        hold_imgs, keep_imgs = train_test_split(
            images, test_size=holdout_pct, random_state=RANDOM_STATE
        )
        
        # Move holdout images to field_test
        field_test_dir.mkdir(parents=True, exist_ok=True)
        for img in hold_imgs:
            dest = field_test_dir / img.name
            shutil.move(str(img), str(dest))
        
        print(f"   ✅ {crop}/{cls}: {len(hold_imgs)} → field_test, {len(keep_imgs)} kept in training")

holdout_field_test('tomato', TOMATO_CLASSES)
holdout_field_test('banana_plantain', BANANA_CLASSES)

# ============================================
# STEP 7: FINAL SUMMARY
# ============================================

print("\n" + "=" * 70)
print("📊 FINAL DATASET SUMMARY")
print("=" * 70)

summary = {}

for crop in ['tomato', 'banana_plantain']:
    classes = TOMATO_CLASSES if crop == 'tomato' else BANANA_CLASSES
    
    print(f"\n{'='*70}")
    print(f"🌱 {crop.upper()}")
    print(f"{'='*70}")
    
    crop_summary = {}
    
    for cls in classes:
        train_count = len(list((TRAINING / crop / cls).glob('*')))
        val_pv_count = len(list((VALIDATION / crop / cls).glob('lab_pv_*')))
        val_field_count = len(list((VALIDATION / crop / cls).glob('*'))) - val_pv_count
        test_count = len(list((TEST / crop / cls).glob('*')))
        field_test_count = len(list((FIELD_TEST / crop / cls).glob('*'))) if (FIELD_TEST / crop / cls).exists() else 0
        
        total = train_count + val_pv_count + val_field_count + test_count + field_test_count
        
        print(f"\n   📁 {cls}:")
        print(f"      Training:     {train_count} (field)")
        print(f"      Validation:   {val_pv_count} (PlantVillage) + {val_field_count} (field)")
        print(f"      Test:         {test_count} (PlantVillage)")
        print(f"      Field Test:   {field_test_count} (held-out field)")
        print(f"      ─────────────────────")
        print(f"      TOTAL:        {total}")
        
        crop_summary[cls] = {
            'training': train_count,
            'validation_lab': val_pv_count,
            'validation_field': val_field_count,
            'test_lab': test_count,
            'field_test': field_test_count,
            'total': total
        }
    
    summary[crop] = crop_summary

# Save summary to JSON
with open(METADATA / 'final_dataset_summary.json', 'w') as f:
    json.dump(summary, f, indent=2)

print(f"\n✅ Summary saved to: {METADATA / 'final_dataset_summary.json'}")

# ============================================
# STEP 8: CREATE CLASS LABELS FILE
# ============================================

print("\n" + "=" * 70)
print("STEP 8: Creating class labels files...")
print("=" * 70)

# For Colab, we need class_indices mapping
tomato_labels = {str(i): cls for i, cls in enumerate(sorted(TOMATO_CLASSES))}
banana_labels = {str(i): cls for i, cls in enumerate(sorted(BANANA_CLASSES))}

with open(BASE / 'training' / 'tomato' / 'class_labels.json', 'w') as f:
    json.dump(tomato_labels, f, indent=2)

with open(BASE / 'training' / 'banana_plantain' / 'class_labels.json', 'w') as f:
    json.dump(banana_labels, f, indent=2)

print(f"✅ Class labels saved")

# ============================================
# DONE
# ============================================

print("\n" + "=" * 70)
print("🎉 DATA PREPARATION COMPLETE!")
print("=" * 70)
print(f"""
Your data is now organized as:

1_dataset/
├── training/          ← FIELD images for model training
│   ├── tomato/        (5 class folders)
│   └── banana_plantain/ (4 class folders)
├── validation/        ← PlantVillage + some field for validation
├── test/              ← PlantVillage only for lab benchmark
└── field_test/        ← Held-out field images for real-world test

NEXT STEP: Upload to Google Drive and train on Colab!
""")