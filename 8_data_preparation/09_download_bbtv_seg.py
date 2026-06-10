# File: 8_data_preparation/09_download_bbtv_seg.py
"""
Download BBTV semantic segmentation dataset and extract images
"""

from roboflow import Roboflow
from pathlib import Path
import shutil
import os
import glob

rf = Roboflow(api_key="g2nhM9joyQcKOs3QXice")

print("=" * 70)
print("🍌 EXTRACTING BBTV FROM SEGMENTATION DATASET")
print("=" * 70)

DEST = Path('1_dataset/downloads/banana_plantain/04_roboflow_bbtv')

try:
    project = rf.workspace("banana-pest").project("banana-bunchy-top-virus-3")
    version = project.version(9)
    
    # Download in coco-segmentation format (gives us images + annotations)
    print("\n📥 Downloading as coco-segmentation...")
    dataset = version.download("coco-segmentation")
    
    source = Path(dataset.location)
    print(f"   Downloaded to: {source}")
    
    # Find all images (ignore JSON annotation files)
    images = []
    for ext in ['*.jpg', '*.jpeg', '*.png', '*.JPG', '*.JPEG', '*.PNG']:
        images.extend(glob.glob(os.path.join(str(source), '**', ext), recursive=True))
    
    print(f"   Found {len(images)} images")
    
    # Copy to bbtv folder
    copied = 0
    for img in images:
        # Skip mask/annotation images
        if 'mask' in img.lower() or '_mask' in img.lower():
            continue
        
        dest = DEST / 'bbtv' / os.path.basename(img)
        dest.parent.mkdir(parents=True, exist_ok=True)
        if not dest.exists():
            shutil.copy2(img, dest)
            copied += 1
    
    print(f"   Copied: {copied} images")
    
except Exception as e:
    print(f"   ❌ Error: {str(e)[:150]}")

# Show final count
bbtv_dir = DEST / 'bbtv'
count = len(list(bbtv_dir.glob('*'))) if bbtv_dir.exists() else 0
print(f"\n📊 TOTAL BBTV: {count} images")
print(f"   Previous: 139 + New: {count - 139}")