# File: 8_data_preparation/04_download_banana_kaggle.py
"""
Download BANANA/PLANTAIN datasets from Kaggle
"""

import kagglehub
import os
import shutil
import glob
from pathlib import Path

BANANA_FIELD = Path('1_dataset/downloads/banana_plantain')

print("=" * 70)
print("🍌 DOWNLOADING BANANA/PLANTAIN DATASETS")
print("=" * 70)

BANANA_CLASS_MAP = {
    'black_sigatoka': ['black_sigatoka', 'Black_Sigatoka', 'sigatoka', 'Sigatoka'],
    'bbtv': ['bbtv', 'BBTV', 'bunchy_top', 'Bunchy_Top'],
    'fusarium_wilt': ['fusarium_wilt', 'Fusarium_Wilt', 'panama', 'Panama'],
    'healthy': ['healthy', 'Healthy', 'health'],
}

def find_and_copy(source_path, dest_name):
    dest_base = BANANA_FIELD / dest_name
    images = []
    for ext in ['*.jpg', '*.jpeg', '*.png', '*.JPG', '*.JPEG', '*.PNG']:
        images.extend(glob.glob(os.path.join(str(source_path), '**', ext), recursive=True))
    
    print(f"   Found {len(images)} images")
    copied = 0
    
    for img_path in images:
        path_lower = img_path.lower()
        detected = None
        for class_name, keywords in BANANA_CLASS_MAP.items():
            for kw in keywords:
                if kw.lower() in path_lower:
                    detected = class_name
                    break
            if detected:
                break
        
        if detected:
            dest_dir = dest_base / detected
            dest_dir.mkdir(parents=True, exist_ok=True)
            dest_file = dest_dir / f"{dest_name}_{os.path.basename(img_path)}"
            if not dest_file.exists():
                try:
                    shutil.copy2(img_path, dest_file)
                    copied += 1
                except:
                    pass
    
    print(f"   Copied: {copied}")
    return copied

# Try banana datasets
banana_sources = [
    ('Banana Leaf Diseases', 'shuvokumardas/banana-leaf-diseases', '01_kaggle_banana_leaf'),
    ('Banana Disease Detection', 'hafizhanif/banana-disease-detection', '02_kaggle_banana_disease'),
    ('Banana Leaf Spot', 'iftekharrashid/banana-leaf-disease', '03_kaggle_banana_spot'),
]

total = 0
for name, kaggle_path, dest in banana_sources:
    print(f"\n📥 {name}")
    try:
        path = kagglehub.dataset_download(kaggle_path)
        count = find_and_copy(path, dest)
        total += count
    except Exception as e:
        print(f"   Skipped: {str(e)[:80]}")

print(f"\n{'=' * 70}")
print(f"📊 Total banana images: {total}")
print(f"{'=' * 70}")
