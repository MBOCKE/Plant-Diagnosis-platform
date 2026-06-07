# File: 8_data_preparation/01_download_plantvillage.py
"""
STEP 1: Extract PlantVillage Tomato Images
This downloads lab-condition images for TESTING ONLY
"""

import os
import shutil
from pathlib import Path

# The dataset is already downloaded to this cache location
CACHE_PATH = r'C:\Users\USER\.cache\kagglehub\datasets\abdallahalidev\plantvillage-dataset\versions\3\plantvillage dataset\segmented'

print("=" * 70)
print("🍅 EXTRACTING PLANTVILLAGE TOMATO IMAGES")
print("=" * 70)
print(f"\n📌 Source: {CACHE_PATH}")
print("   These are LAB images (plain background).")
print("   We will use these ONLY for validation and testing.")
print("   They will NEVER go into our training folder.")

# Check if source exists
if not os.path.exists(CACHE_PATH):
    print(f"\n❌ Source not found!")
    print("   Make sure you downloaded the dataset first.")
    exit()

# Class mapping: PlantVillage folder name → our standard name
TOMATO_MAPPING = {
    'Tomato___Early_blight': 'early_blight',
    'Tomato___Late_blight': 'late_blight',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus': 'tylcv',
    'Tomato___Bacterial_spot': 'bacterial_spot',
    'Tomato___healthy': 'healthy',
}

# Destination
TOMATO_DEST = Path('1_dataset/downloads/tomato/99_plantvillage_tomato')

# Copy tomato images
print("\n" + "=" * 70)
print("📋 COPYING TOMATO IMAGES TO PROJECT")
print("=" * 70)

total_copied = 0

for pv_name, our_name in TOMATO_MAPPING.items():
    src = os.path.join(CACHE_PATH, pv_name)
    
    if os.path.exists(src):
        dest = TOMATO_DEST / our_name
        dest.mkdir(parents=True, exist_ok=True)
        
        images = [f for f in os.listdir(src) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        
        for img in images:
            src_file = os.path.join(src, img)
            dst_file = dest / img
            if not dst_file.exists():
                shutil.copy2(src_file, dst_file)
        
        print(f"   ✅ {our_name}: {len(images)} images")
        total_copied += len(images)
    else:
        print(f"   ⚠️  Not found: {pv_name}")

print(f"\n   📊 Total tomato images copied: {total_copied}")

# Summary
print("\n" + "=" * 70)
print("✅ PLANTVILLAGE TOMATO EXTRACTION COMPLETE!")
print("=" * 70)
print(f"\n📁 Images saved to: {TOMATO_DEST}")
print(f"\n📊 Class distribution:")
for our_name in TOMATO_MAPPING.values():
    dest = TOMATO_DEST / our_name
    if dest.exists():
        count = len(list(dest.glob('*')))
        print(f"   {our_name}: {count}")

print("\n💡 NOTE: This PlantVillage version has NO banana images.")
print("   We'll get banana images from field datasets.")
print("\n💡 These tomato images will be used for VALIDATION and TESTING only.")
print("   Next step: Download FIELD datasets for training.")