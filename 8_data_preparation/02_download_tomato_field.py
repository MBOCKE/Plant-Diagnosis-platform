# File: 8_data_preparation/02_download_tomato_field.py
"""
STEP 2: Download Tomato FIELD Datasets
These are REAL FARM PHOTOS - our primary training data
"""

import kagglehub
import os
import shutil
from pathlib import Path

TOMATO_FIELD = Path('1_dataset/downloads/tomato')

print("=" * 70)
print("🍅 DOWNLOADING TOMATO FIELD DATASETS")
print("=" * 70)
print("\n📌 These are FIELD images (real farm conditions).")
print("   These will be our PRIMARY TRAINING data.")
print("   They show leaves with complex backgrounds, shadows, different angles.\n")

# ============================================
# DATASET 1: Tomato Leaf Disease Detection
# ============================================
print("-" * 70)
print("📥 DATASET 1: Tomato Leaf Disease Detection")
print("-" * 70)

try:
    path = kagglehub.dataset_download("kaustubhb999/tomatoleaf")
    print(f"   ✅ Downloaded to: {path}")
    
    # Explore structure
    print(f"   📂 Contents:")
    for item in os.listdir(path):
        print(f"      - {item}")
    
    # Copy to our project
    dest = TOMATO_FIELD / '03_kaggle_tomatoleaf'
    
    if os.path.isdir(os.path.join(path, 'tomato')):
        src_path = os.path.join(path, 'tomato')
    else:
        src_path = path
    
    # Copy all subfolders
    for item in os.listdir(src_path):
        src_item = os.path.join(src_path, item)
        dst_item = dest / item
        
        if os.path.isdir(src_item):
            if not dst_item.exists():
                shutil.copytree(src_item, dst_item)
                img_count = len(list(dst_item.glob('*.jpg'))) + len(list(dst_item.glob('*.jpeg'))) + len(list(dst_item.glob('*.png')))
                print(f"   ✅ {item}: {img_count} images")
    
    print(f"   ✅ Dataset 1 complete!\n")
    
except Exception as e:
    print(f"   ⚠️  Skipped (not available): {e}\n")


# ============================================
# DATASET 2: Tomato Disease Multiple Sources
# ============================================
print("-" * 70)
print("📥 DATASET 2: Tomato Disease Multiple Sources")
print("-" * 70)

try:
    path = kagglehub.dataset_download("cookiefinder/tomato-disease-multiple-sources")
    print(f"   ✅ Downloaded to: {path}")
    
    print(f"   📂 Contents:")
    for item in sorted(os.listdir(path))[:10]:
        print(f"      - {item}")
    
    dest = TOMATO_FIELD / '04_kaggle_tomato_multi'
    dest.mkdir(parents=True, exist_ok=True)
    
    # Copy all subfolders
    for item in os.listdir(path):
        src_item = os.path.join(path, item)
        dst_item = dest / item
        
        if os.path.isdir(src_item):
            if not dst_item.exists():
                shutil.copytree(src_item, dst_item)
                img_count = len(list(dst_item.glob('*.jpg'))) + len(list(dst_item.glob('*.jpeg'))) + len(list(dst_item.glob('*.png')))
                print(f"   ✅ {item}: {img_count} images")
        elif item.lower().endswith(('.jpg', '.jpeg', '.png')):
            shutil.copy2(src_item, dst_item)
    
    total = len(list(dest.glob('*.jpg'))) + len(list(dest.glob('*.jpeg'))) + len(list(dest.glob('*.png')))
    # Also check subfolders
    for sub in dest.iterdir():
        if sub.is_dir():
            total += len(list(sub.glob('*.jpg'))) + len(list(sub.glob('*.jpeg'))) + len(list(sub.glob('*.png')))
    
    print(f"   ✅ Dataset 2 complete! Total images: {total}\n")
    
except Exception as e:
    print(f"   ⚠️  Skipped (not available): {e}\n")


# ============================================
# DATASET 3: Try another tomato dataset
# ============================================
print("-" * 70)
print("📥 DATASET 3: Tomato Leaf Disease (noulam)")
print("-" * 70)

try:
    path = kagglehub.dataset_download("noulam/tomato")
    print(f"   ✅ Downloaded to: {path}")
    
    dest = TOMATO_FIELD / '05_kaggle_tomato_noulam'
    
    for item in os.listdir(path):
        src_item = os.path.join(path, item)
        dst_item = dest / item
        
        if os.path.isdir(src_item):
            if not dst_item.exists():
                shutil.copytree(src_item, dst_item)
    
    print(f"   ✅ Dataset 3 complete!\n")
    
except Exception as e:
    print(f"   ⚠️  Skipped (not available): {e}\n")


# ============================================
# SUMMARY
# ============================================
print("=" * 70)
print("📊 TOMATO FIELD DATASETS SUMMARY")
print("=" * 70)

print(f"\n📁 Download folder: {TOMATO_FIELD}")
print(f"\n📦 Sources downloaded:")
for folder in sorted(TOMATO_FIELD.iterdir()):
    if folder.is_dir():
        total = 0
        for sub in folder.iterdir():
            if sub.is_dir():
                total += len(list(sub.glob('*')))
        print(f"   📁 {folder.name}: {total} images")

print("\n" + "=" * 70)
print("✅ TOMATO FIELD DOWNLOADS COMPLETE!")
print("=" * 70)