"""
Organize verified tomato dataset for training
"""

import shutil
from pathlib import Path

VERIFIED = Path('1_dataset/downloads/tomato/07_verified_roboflow')
TRAINING = Path('1_dataset/training/tomato')

CLASSES = ['early_blight', 'late_blight', 'tylcv', 'bacterial_spot', 'healthy']

print("=" * 60)
print("🍅 ORGANIZING VERIFIED TOMATO DATA")
print("=" * 60)

total_added = 0

for cls in CLASSES:
    src = VERIFIED / cls
    dst = TRAINING / cls
    
    if not src.exists():
        print(f"\n⚠️  {cls}: No verified data found, keeping existing")
        existing = len(list(dst.glob('*'))) if dst.exists() else 0
        print(f"   Existing: {existing} images")
        continue
    
    # Create destination
    dst.mkdir(parents=True, exist_ok=True)
    
    # Count before
    before = len(list(dst.glob('*'))) if dst.exists() else 0
    
    # Copy verified images
    added = 0
    for img in src.glob('*'):
        if img.suffix.lower() in ['.jpg', '.jpeg', '.png']:
            dest_file = dst / img.name
            if not dest_file.exists():
                shutil.copy2(img, dest_file)
                added += 1
    
    after = len(list(dst.glob('*')))
    total_added += added
    
    print(f"\n📁 {cls}:")
    print(f"   Before: {before}")
    print(f"   Added:  {added} (verified)")
    print(f"   Total:  {after}")

# SUMMARY
print(f"\n{'=' * 60}")
print("📊 FINAL TRAINING COUNTS")
print(f"{'=' * 60}")

grand_total = 0
for cls in CLASSES:
    count = len(list((TRAINING / cls).glob('*')))
    print(f"   📁 {cls}: {count} images")
    grand_total += count

print(f"   {'─' * 30}")
print(f"   📦 TOTAL: {grand_total} images")
print(f"\n✅ New verified images added: {total_added}")
print(f"\n⚠️  Next steps:")
print(f"   1. Run: python 2_notebooks/06_duplicate_detection.py")
print(f"   2. Zip and upload to Google Drive")
print(f"   3. Retrain with Banana-like parameters")