# File: 2_notebooks/07_fix_data_split.py
"""
FIX THE DATA SPLIT ISSUES:
1. Training/Field_test split was REVERSED (15% training, 85% test)
2. Banana has no validation images (need to split from field data)
"""

import shutil
from pathlib import Path
from sklearn.model_selection import train_test_split
import random

random.seed(42)
RANDOM_STATE = 42

BASE = Path('1_dataset')
TRAINING = BASE / 'training'
VALIDATION = BASE / 'validation'
TEST = BASE / 'test'
FIELD_TEST = BASE / 'field_test'

TOMATO_CLASSES = ['early_blight', 'late_blight', 'tylcv', 'bacterial_spot', 'healthy']
BANANA_CLASSES = ['black_sigatoka', 'bbtv', 'fusarium_wilt', 'healthy']

print("=" * 70)
print("🔧 FIXING DATA SPLIT")
print("=" * 70)

# ============================================
# FIX 1: MOVE IMAGES BACK FROM FIELD_TEST TO TRAINING
# ============================================

print("\n📋 STEP 1: Fixing training/field_test ratio (should be 85/15)...")

for crop in ['tomato', 'banana_plantain']:
    classes = TOMATO_CLASSES if crop == 'tomato' else BANANA_CLASSES
    
    for cls in classes:
        field_test_dir = FIELD_TEST / crop / cls
        training_dir = TRAINING / crop / cls
        
        if not field_test_dir.exists():
            continue
        
        # Get all images currently in field_test
        field_test_images = list(field_test_dir.glob('*'))
        
        if len(field_test_images) == 0:
            continue
        
        # Calculate correct split
        total = len(list(training_dir.glob('*'))) + len(field_test_images)
        target_field_test = max(1, int(total * 0.15))  # 15% for field test
        target_training = total - target_field_test
        
        current_training = len(list(training_dir.glob('*')))
        
        if current_training < target_training:
            # Need to move images from field_test back to training
            move_count = target_training - current_training
            to_move = field_test_images[:move_count]
            
            for img in to_move:
                dest = training_dir / img.name
                if not dest.exists():
                    shutil.move(str(img), str(dest))
            
            print(f"   ✅ {crop}/{cls}: Moved {move_count} back to training")
        
        # Verify
        final_training = len(list(training_dir.glob('*')))
        final_field_test = len(list(field_test_dir.glob('*')))
        print(f"      Training: {final_training} | Field Test: {final_field_test}")

# ============================================
# FIX 2: CREATE VALIDATION SET FOR BANANA FROM FIELD DATA
# ============================================

print("\n📋 STEP 2: Creating validation set for banana from field images...")

for cls in BANANA_CLASSES:
    training_dir = TRAINING / 'banana_plantain' / cls
    val_dir = VALIDATION / 'banana_plantain' / cls
    
    if not training_dir.exists():
        continue
    
    images = list(training_dir.glob('*'))
    
    if len(images) < 5:
        print(f"   ⚠️  {cls}: Too few images ({len(images)}) to split")
        continue
    
    # Split: 80% stay in training, 20% go to validation
    keep_train, move_to_val = train_test_split(
        images, test_size=0.20, random_state=RANDOM_STATE
    )
    
    val_dir.mkdir(parents=True, exist_ok=True)
    
    for img in move_to_val:
        dest = val_dir / f"field_val_{img.name}"
        shutil.move(str(img), str(dest))
    
    print(f"   ✅ {cls}: {len(keep_train)} training + {len(move_to_val)} validation")

# ============================================
# FIX 3: ALSO ADD FIELD IMAGES TO TOMATO VALIDATION
# ============================================

print("\n📋 STEP 3: Adding field images to tomato validation...")

for cls in TOMATO_CLASSES:
    training_dir = TRAINING / 'tomato' / cls
    val_dir = VALIDATION / 'tomato' / cls
    
    if not training_dir.exists():
        continue
    
    images = list(training_dir.glob('*'))
    
    if len(images) < 5:
        continue
    
    # Take 10% for validation
    keep_train, move_to_val = train_test_split(
        images, test_size=0.10, random_state=RANDOM_STATE
    )
    
    val_dir.mkdir(parents=True, exist_ok=True)
    
    for img in move_to_val:
        dest = val_dir / f"field_val_{img.name}"
        shutil.move(str(img), str(dest))
    
    print(f"   ✅ {cls}: {len(move_to_val)} field images added to validation")

# ============================================
# FINAL SUMMARY
# ============================================

print(f"\n{'='*70}")
print("📊 CORRECTED DATASET SUMMARY")
print(f"{'='*70}")

for crop in ['tomato', 'banana_plantain']:
    classes = TOMATO_CLASSES if crop == 'tomato' else BANANA_CLASSES
    
    print(f"\n🌱 {crop.upper()}:")
    print(f"   {'Class':<20} {'Training':>10} {'Validation':>12} {'Test':>8} {'Field Test':>12} {'Total':>8}")
    print(f"   {'─'*70}")
    
    crop_totals = {'train': 0, 'val': 0, 'test': 0, 'field': 0}
    
    for cls in classes:
        train_n = len(list((TRAINING / crop / cls).glob('*')))
        val_n = len(list((VALIDATION / crop / cls).glob('*'))) if (VALIDATION / crop / cls).exists() else 0
        test_n = len(list((TEST / crop / cls).glob('*'))) if (TEST / crop / cls).exists() else 0
        field_n = len(list((FIELD_TEST / crop / cls).glob('*'))) if (FIELD_TEST / crop / cls).exists() else 0
        
        crop_totals['train'] += train_n
        crop_totals['val'] += val_n
        crop_totals['test'] += test_n
        crop_totals['field'] += field_n
        
        total = train_n + val_n + test_n + field_n
        print(f"   {cls:<20} {train_n:>10} {val_n:>12} {test_n:>8} {field_n:>12} {total:>8}")
    
    print(f"   {'─'*70}")
    print(f"   {'TOTAL':<20} {crop_totals['train']:>10} {crop_totals['val']:>12} {crop_totals['test']:>8} {crop_totals['field']:>12} {sum(crop_totals.values()):>8}")

print(f"\n✅ DATA SPLIT FIXED!")
