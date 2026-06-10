# File: 8_data_preparation/08_download_bbtv_roboflow.py
"""
Download BBTV datasets from Roboflow
"""

from roboflow import Roboflow
from pathlib import Path
import shutil
import os
import glob

rf = Roboflow(api_key="g2nhM9joyQcKOs3QXice")

print("=" * 70)
print("🍌 DOWNLOADING BBTV DATASETS")
print("=" * 70)

DEST = Path('1_dataset/downloads/banana_plantain/04_roboflow_bbtv')
DEST.mkdir(parents=True, exist_ok=True)

total = 0

# ============================================
# DATASET 1: Bunchy Top (roamer)
# ============================================
print("\n📥 DATASET 1: Bunchy Top (roamer-pcmqg)")
print("-" * 50)

try:
    project = rf.workspace("roamer-pcmqg").project("bunchy-top")
    version = project.version(1)
    try:
        dataset = version.download("folder")
    except:
        try:
            dataset = version.download("multiclass")
        except:
            dataset = version.download("coco")
    
    source = Path(dataset.location)
    images = []
    for ext in ['*.jpg', '*.jpeg', '*.png']:
        images.extend(glob.glob(os.path.join(str(source), '**', ext), recursive=True))
    
    copied = 0
    for img in images:
        dest = DEST / 'bbtv' / os.path.basename(img)
        dest.parent.mkdir(parents=True, exist_ok=True)
        if not dest.exists():
            shutil.copy2(img, dest)
            copied += 1
    
    print(f"   Found: {len(images)} images")
    print(f"   Copied: {copied}")
    total += copied
    
except Exception as e:
    print(f"   ❌ Failed: {str(e)[:100]}")

# ============================================
# SUMMARY
# ============================================
print(f"\n{'=' * 70}")
print(f"📊 TOTAL BBTV: {total} images")
print(f"{'=' * 70}")