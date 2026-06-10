# File: 2_notebooks/06_duplicate_detection.py
"""
DUPLICATE DETECTION & REMOVAL
- Finds identical/near-identical images using perceptual hashing
- Removes duplicates, keeping the field version (better for training)
- Prevents data leakage between train/val/test sets
"""

import os
from pathlib import Path
from PIL import Image
import imagehash
from collections import defaultdict
import shutil

print("=" * 70)
print("🔍 DUPLICATE DETECTION & REMOVAL")
print("=" * 70)
print("\nThis prevents the model from 'cheating' by seeing the same")
print("image in both training and validation sets.\n")

# ============================================
# CONFIGURATION
# ============================================

BASE = Path('1_dataset')
TRAINING = BASE / 'training'
VALIDATION = BASE / 'validation'
TEST = BASE / 'test'
DUPLICATES_DIR = BASE / 'duplicates_removed'

DUPLICATES_DIR.mkdir(parents=True, exist_ok=True)

# How similar images need to be to count as duplicates
# Lower = more strict (0 = identical, 5 = very similar)
HAMMING_THRESHOLD = 5

# ============================================
# STEP 1: HASH ALL IMAGES
# ============================================

def hash_image(img_path):
    """Compute perceptual hash of an image"""
    try:
        with Image.open(img_path) as img:
            return str(imagehash.phash(img))
    except Exception:
        return None

def build_hash_index(base_dir, crop_type):
    """Build a dictionary of hash → list of image paths"""
    print(f"\n📊 Indexing {crop_type} images...")
    
    hash_index = defaultdict(list)
    total = 0
    corrupt = 0
    
    for split in ['training', 'validation', 'test', 'field_test']:
        split_dir = BASE / split / crop_type
        if not split_dir.exists():
            continue
        
        for cls_dir in split_dir.iterdir():
            if cls_dir.is_dir():
                for img_file in cls_dir.glob('*'):
                    if img_file.suffix.lower() in {'.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'}:
                        img_hash = hash_image(img_file)
                        if img_hash:
                            hash_index[img_hash].append({
                                'path': img_file,
                                'split': split,
                                'class': cls_dir.name,
                                'size': img_file.stat().st_size
                            })
                            total += 1
                        else:
                            corrupt += 1
    
    print(f"   Total hashed: {total}")
    print(f"   Corrupt (skipped): {corrupt}")
    print(f"   Unique hashes: {len(hash_index)}")
    
    return hash_index, total, corrupt

# ============================================
# STEP 2: FIND DUPLICATES
# ============================================

def find_duplicates(hash_index):
    """Find all images that share the same hash"""
    duplicates = {}
    unique_count = 0
    
    for img_hash, images in hash_index.items():
        if len(images) > 1:
            # Multiple images have the same hash = duplicates
            duplicates[img_hash] = images
        else:
            unique_count += 1
    
    return duplicates, unique_count

# ============================================
# STEP 3: DECIDE WHICH COPY TO KEEP
# ============================================

def decide_keeper(duplicates_dict):
    """For each duplicate group, decide which image to keep"""
    kept = 0
    removed = 0
    removal_log = []
    
    for img_hash, images in duplicates_dict.items():
        # Priority for keeping:
        # 1. Training images (field) > validation > test
        # 2. Larger file size (usually higher quality)
        # 3. Field sources over lab sources
        
        # Sort by: training > validation > test, then by file size desc
        split_priority = {'training': 0, 'field_test': 1, 'validation': 2, 'test': 3}
        
        images_sorted = sorted(images, key=lambda x: (
            split_priority.get(x['split'], 99),
            -x['size']  # Negative for descending
        ))
        
        # Keep the first (highest priority), remove the rest
        keeper = images_sorted[0]
        to_remove = images_sorted[1:]
        
        for img_info in to_remove:
            # Only remove if not already the same file
            if img_info['path'] != keeper['path'] and img_info['path'].exists():
                # Move to duplicates folder instead of deleting
                dest = DUPLICATES_DIR / img_info['class']
                dest.mkdir(parents=True, exist_ok=True)
                shutil.move(str(img_info['path']), str(dest / img_info['path'].name))
                
                removal_log.append({
                    'kept': str(keeper['path']),
                    'removed': str(img_info['path']),
                    'reason': f"Duplicate (hash: {img_hash[:12]}...)"
                })
                removed += 1
        
        kept += 1
    
    return kept, removed, removal_log

# ============================================
# STEP 4: RUN FOR BOTH CROPS
# ============================================

all_logs = []

for crop in ['tomato', 'banana_plantain']:
    print(f"\n{'='*70}")
    print(f"🔍 Processing {crop.upper()}")
    print(f"{'='*70}")
    
    # Build hash index
    hash_index, total, corrupt = build_hash_index(BASE, crop)
    
    # Find duplicates
    duplicates, unique = find_duplicates(hash_index)
    
    duplicate_groups = len(duplicates)
    duplicate_images = sum(len(v) for v in duplicates.values())
    
    print(f"\n   📊 Results:")
    print(f"      Total images: {total}")
    print(f"      Unique images: {unique}")
    print(f"      Duplicate groups: {duplicate_groups}")
    print(f"      Images in duplicate groups: {duplicate_images}")
    
    # Decide which to keep
    if duplicate_groups > 0:
        kept, removed, logs = decide_keeper(duplicates)
        all_logs.extend(logs)
        
        print(f"\n   ✅ Kept: {kept} (best copy of each group)")
        print(f"   🗑️  Removed: {removed} duplicates")
        
        # Show examples
        print(f"\n   📋 Example duplicates found:")
        for log in logs[:5]:
            removed_path = Path(log['removed'])
            print(f"      Removed: {removed_path.parent.name}/{removed_path.name}")
    else:
        print(f"\n   ✅ No duplicates found!")

# ============================================
# STEP 5: CROSS-SET LEAKAGE CHECK
# ============================================

print(f"\n{'='*70}")
print("🔒 CROSS-SET LEAKAGE CHECK")
print(f"{'='*70}")
print("\nChecking if any training images leaked into test set...")

for crop in ['tomato', 'banana_plantain']:
    # Hash all test images
    test_hashes = set()
    test_dir = TEST / crop
    if test_dir.exists():
        for img_file in test_dir.rglob('*'):
            if img_file.suffix.lower() in {'.jpg', '.jpeg', '.png'}:
                h = hash_image(img_file)
                if h:
                    test_hashes.add(h)
    
    # Check if any training images have same hash
    train_dir = TRAINING / crop
    leakage_count = 0
    if train_dir.exists():
        for img_file in train_dir.rglob('*'):
            if img_file.suffix.lower() in {'.jpg', '.jpeg', '.png'}:
                h = hash_image(img_file)
                if h and h in test_hashes:
                    leakage_count += 1
                    # Move the training copy to avoid leakage
                    dest = DUPLICATES_DIR / 'cross_set_leakage' / crop
                    dest.mkdir(parents=True, exist_ok=True)
                    shutil.move(str(img_file), str(dest / img_file.name))
    
    if leakage_count > 0:
        print(f"   ⚠️  {crop}: {leakage_count} training images leaked into test - REMOVED")
    else:
        print(f"   ✅ {crop}: No cross-set leakage detected")

# ============================================
# STEP 6: FINAL REPORT
# ============================================

print(f"\n{'='*70}")
print("📊 DUPLICATE REMOVAL SUMMARY")
print(f"{'='*70}")

total_removed = len(all_logs)
print(f"\n   Total duplicates removed: {total_removed}")
print(f"   Removed files saved to: {DUPLICATES_DIR}")

# Count remaining images
for crop in ['tomato', 'banana_plantain']:
    classes = ['early_blight', 'late_blight', 'tylcv', 'bacterial_spot', 'healthy'] if crop == 'tomato' else ['black_sigatoka', 'bbtv', 'fusarium_wilt', 'healthy']
    
    print(f"\n   📁 {crop} - Images after cleanup:")
    
    for split_name, split_dir in [('Training', TRAINING), ('Validation', VALIDATION), ('Test', TEST)]:
        total = 0
        for cls in classes:
            cls_dir = split_dir / crop / cls
            if cls_dir.exists():
                total += len(list(cls_dir.glob('*')))
        print(f"      {split_name}: {total}")

print(f"\n✅ DUPLICATE DETECTION COMPLETE!")
print(f"   Your dataset is now clean and safe for training.").