# File: 8_data_preparation/03_copy_all_kaggle.py
"""
Copy ALL downloaded Kaggle datasets to our project
Uses robust path handling for Windows
"""

import os
import shutil
from pathlib import Path
import glob

TOMATO_FIELD = Path('1_dataset/downloads/tomato')

print("=" * 70)
print("📋 COPYING ALL DOWNLOADED KAGGLE DATASETS")
print("=" * 70)

# ============================================
# CLASS MAPPING
# ============================================
CLASS_MAP = {
    'Tomato___Early_blight': 'early_blight',
    'Tomato___Late_blight': 'late_blight',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus': 'tylcv',
    'Tomato___Bacterial_spot': 'bacterial_spot',
    'Tomato___healthy': 'healthy',
    'Tomato___Leaf_Mold': None,  # Skip - not in our target classes
    'Tomato___Septoria_leaf_spot': None,
    'Tomato___Spider_mites': None,
    'Tomato___Target_Spot': None,
    'Tomato___Tomato_mosaic_virus': None,
    'early_blight': 'early_blight',
    'late_blight': 'late_blight',
    'Early_blight': 'early_blight',
    'Late_blight': 'late_blight',
    'tylcv': 'tylcv',
    'bacterial_spot': 'bacterial_spot',
    'healthy': 'healthy',
    'Healthy': 'healthy',
}


def find_images_deep(folder_path, extensions=None):
    """
    Find all images in a folder, even with long Windows paths.
    Uses glob which handles long paths better.
    """
    if extensions is None:
        extensions = ['*.jpg', '*.jpeg', '*.png', '*.JPG', '*.JPEG', '*.PNG']
    
    images = []
    folder = str(folder_path)
    
    for ext in extensions:
        # Use recursive glob
        pattern = os.path.join(folder, '**', ext)
        try:
            found = glob.glob(pattern, recursive=True)
            images.extend(found)
        except Exception:
            pass
    
    return images


def detect_class_from_path(filepath):
    """Detect disease class from file path"""
    path_lower = filepath.lower()
    
    # Check each class
    for keyword, class_name in CLASS_MAP.items():
        if class_name is None:
            continue
        if keyword.lower() in path_lower:
            return class_name
    
    return None


def copy_to_project(source_folder, dest_subfolder_name):
    """Copy all images from source to destination, organized by class"""
    dest_base = TOMATO_FIELD / dest_subfolder_name
    
    print(f"\n📂 Processing: {dest_subfolder_name}")
    print(f"   Source: {source_folder}")
    
    # Find all images
    images = find_images_deep(source_folder)
    print(f"   Found {len(images)} images")
    
    copied = 0
    skipped = 0
    
    for img_path in images:
        # Detect class
        detected_class = detect_class_from_path(img_path)
        
        if detected_class is None:
            skipped += 1
            continue
        
        # Create destination
        dest_dir = dest_base / detected_class
        dest_dir.mkdir(parents=True, exist_ok=True)
        
        # Copy with unique name
        filename = os.path.basename(img_path)
        dest_path = dest_dir / f"{dest_subfolder_name}_{filename}"
        
        if not dest_path.exists():
            try:
                shutil.copy2(img_path, dest_path)
                copied += 1
            except OSError:
                skipped += 1
    
    print(f"   ✅ Copied: {copied} | Skipped: {skipped}")
    return copied


# ============================================
# DATASET 1: Tomato Leaf (kaustubhb999)
# ============================================
src1 = r'C:\Users\USER\.cache\kagglehub\datasets\kaustubhb999\tomatoleaf\versions\1\tomato'
copy_to_project(src1, '03_kaggle_tomatoleaf')


# ============================================
# DATASET 2: Tomato Multiple Sources (cookiefinder)
# ============================================
src2 = r'C:\Users\USER\.cache\kagglehub\datasets\cookiefinder\tomato-disease-multiple-sources\versions\1'
copy_to_project(src2, '04_kaggle_tomato_multi')


# ============================================
# DATASET 3: Tomato Augmented (noulam)
# ============================================
src3 = r'C:\Users\USER\.cache\kagglehub\datasets\noulam\tomato\versions\1\New Plant Diseases Dataset(Augmented)\New Plant Diseases Dataset(Augmented)'
copy_to_project(src3, '05_kaggle_tomato_noulam')


# ============================================
# FINAL SUMMARY
# ============================================
print("\n" + "=" * 70)
print("📊 FINAL SUMMARY - ALL TOMATO DATA")
print("=" * 70)

print("\n🔵 LAB IMAGES (Validation/Test only):")
pv_path = TOMATO_FIELD / '99_plantvillage_tomato'
if pv_path.exists():
    for cls in sorted(pv_path.iterdir()):
        if cls.is_dir():
            count = len(list(cls.glob('*')))
            print(f"   {cls.name}: {count}")

print("\n🟢 FIELD/KAGGLE IMAGES (Training):")
for folder in sorted(TOMATO_FIELD.iterdir()):
    if folder.is_dir() and 'plantvillage' not in folder.name and folder.name.startswith(('03', '04', '05')):
        total = 0
        for cls in folder.iterdir():
            if cls.is_dir():
                count = len(list(cls.glob('*')))
                total += count
                if count > 0:
                    print(f"   [{folder.name}] {cls.name}: {count}")
        print(f"   📊 {folder.name} TOTAL: {total}")

print("\n✅ DONE!")