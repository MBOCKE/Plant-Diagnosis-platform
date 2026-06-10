# File: 8_data_preparation/07_download_roboflow_banana.py
"""
Download Banana Fusarium Wilt dataset from Roboflow
"""

from roboflow import Roboflow
from pathlib import Path
import shutil
import os

# Initialize with your API key
rf = Roboflow(api_key="g2nhM9joyQcKOs3QXice")

# Access the project - workspace from URL: emtechieee, project: fusarium_wilt-xxox2
project = rf.workspace("emtechieee").project("fusarium_wilt-xxox2")
version = project.version(1)  # Try version 1 first

print("=" * 70)
print("🍌 DOWNLOADING BANANA FUSARIUM WILT (Roboflow)")
print("=" * 70)

# Download as folder structure
try:
    dataset = version.download("folder")
except:
    print("   Trying multiclass format...")
    dataset = version.download("multiclass")

print(f"\n✅ Downloaded to: {dataset.location}")

# Map classes
CLASS_MAP = {
    'fusarium_wilt': 'fusarium_wilt',
    'Fusarium_Wilt': 'fusarium_wilt',
    'healthy': 'healthy',
    'Healthy': 'healthy',
}

DEST = Path('1_dataset/downloads/banana_plantain/03_roboflow_fusarium')

import glob
source = Path(dataset.location)
images = []
for ext in ['*.jpg', '*.jpeg', '*.png']:
    images.extend(glob.glob(os.path.join(str(source), '**', ext), recursive=True))

print(f"   Found {len(images)} images")

copied = 0
for img_path in images:
    path_lower = img_path.lower()
    detected = None
    for class_name, keywords in CLASS_MAP.items():
        if class_name.lower() in path_lower or keywords.lower() in path_lower:
            detected = class_name if class_name != 'Fusarium_Wilt' else 'fusarium_wilt'
            break
    
    if detected:
        dest_dir = DEST / detected
        dest_dir.mkdir(parents=True, exist_ok=True)
        dest_file = dest_dir / os.path.basename(img_path)
        if not dest_file.exists():
            shutil.copy2(img_path, dest_file)
            copied += 1

print(f"   Copied: {copied} images")

# Show distribution
print(f"\n📊 Class distribution:")
for cls in DEST.iterdir():
    if cls.is_dir():
        print(f"   {cls.name}: {len(list(cls.glob('*')))} images")
print(f"\n✅ Done!")