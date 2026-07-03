"""
Merge verified healthy images and prepare final dataset
"""

from pathlib import Path
import shutil
import random

random.seed(42)

# ============================================
# PATHS
# ============================================
VERIFIED_HEALTHY = Path('1_dataset/downloads/tomato/07_verified_roboflow/healthy')
MORE_HEALTHY = Path('1_dataset/downloads/tomato/08_more_healthy')

FINAL_TRAINING = Path('1_dataset/training/tomato/healthy')
FINAL_VALIDATION = Path('1_dataset/validation/tomato/healthy')

print("=" * 60)
print("🍅 MERGING HEALTHY IMAGES")
print("=" * 60)

# Collect all verified healthy images
all_healthy = []

# From first download
if VERIFIED_HEALTHY.exists():
    imgs = [f for f in VERIFIED_HEALTHY.glob('*') if f.suffix.lower() in ['.jpg', '.jpeg', '.png']]
    all_healthy.extend(imgs)
    print(f"\n📁 Verified healthy: {len(imgs)} images")

# From second download
if MORE_HEALTHY.exists():
    imgs = [f for f in MORE_HEALTHY.glob('*') if f.suffix.lower() in ['.jpg', '.jpeg', '.png']]
    all_healthy.extend(imgs)
    print(f"📁 More healthy: {len(imgs)} images")

print(f"📦 TOTAL before dedup: {len(all_healthy)}")

# ============================================
# Remove duplicates within healthy images
# ============================================
print(f"\n🔍 Checking for duplicates...")

from PIL import Image
import imagehash
from collections import defaultdict

hash_index = defaultdict(list)
for img_path in all_healthy:
    try:
        with Image.open(img_path) as img:
            h = str(imagehash.phash(img))
            hash_index[h].append(img_path)
    except:
        pass

# Keep only one from each duplicate group
unique_healthy = []
duplicates_removed = 0
for h, imgs in hash_index.items():
    unique_healthy.append(imgs[0])
    if len(imgs) > 1:
        duplicates_removed += len(imgs) - 1

print(f"   Duplicates removed: {duplicates_removed}")
print(f"   Unique images: {len(unique_healthy)}")

# ============================================
# Clear old healthy folders
# ============================================
print(f"\n🗑️  Clearing old healthy data...")

if FINAL_TRAINING.exists():
    shutil.rmtree(FINAL_TRAINING)
if FINAL_VALIDATION.exists():
    shutil.rmtree(FINAL_VALIDATION)

FINAL_TRAINING.mkdir(parents=True, exist_ok=True)
FINAL_VALIDATION.mkdir(parents=True, exist_ok=True)

# ============================================
# Split 80/20
# ============================================
random.shuffle(unique_healthy)
split = int(len(unique_healthy) * 0.8)

train_imgs = unique_healthy[:split]
val_imgs = unique_healthy[split:]

for img in train_imgs:
    shutil.copy2(img, FINAL_TRAINING / img.name)

for img in val_imgs:
    shutil.copy2(img, FINAL_VALIDATION / img.name)

print(f"\n✅ Training healthy: {len(train_imgs)} images")
print(f"✅ Validation healthy: {len(val_imgs)} images")

# ============================================
# COUNT ALL CLASSES
# ============================================
print(f"\n{'=' * 60}")
print("📊 FINAL DATASET READY FOR TRAINING")
print(f"{'=' * 60}")

TRAINING_DIR = Path('1_dataset/training/tomato')
CLASSES = ['early_blight', 'late_blight', 'tylcv', 'bacterial_spot', 'healthy']

grand_total = 0
for cls in CLASSES:
    cls_dir = TRAINING_DIR / cls
    count = len(list(cls_dir.glob('*'))) if cls_dir.exists() else 0
    print(f"   📁 {cls}: {count} images")
    grand_total += count

print(f"   {'─' * 30}")
print(f"   📦 TOTAL TRAINING: {grand_total} images")

# ============================================
# ZIP LOCATION
# ============================================
print(f"\n{'=' * 60}")
print("📦 FILES TO UPLOAD TO GOOGLE DRIVE")
print(f"{'=' * 60}")
print(f"   Training:   1_dataset\\training\\tomato\\")
print(f"   Validation: 1_dataset\\validation\\tomato\\")
print(f"   Field Test: 1_dataset\\field_test\\tomato\\")
print(f"\n   Zip these folders and upload for Colab training!")