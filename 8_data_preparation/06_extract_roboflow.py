# File: 8_data_preparation/06_download_roboflow.py
"""
Download Roboflow dataset as organized folders
"""

from roboflow import Roboflow
from pathlib import Path
import shutil
import os

# Initialize with your API key
rf = Roboflow(api_key="g2nhM9joyQcKOs3QXice")

# Access the project
project = rf.workspace("disease").project("tomato-diseases-4n1d8")
version = project.version(2)

print("=" * 70)
print("📥 DOWNLOADING ROBOFLOW DATASET (as organized folders)")
print("=" * 70)

# Download as "folder" format — gives us JPEGs organized by class
dataset = version.download("folder")

print(f"\n✅ Downloaded to: {dataset.location}")

# The dataset.location is where Roboflow saved it
# It will have train/valid/test subfolders, each with class subfolders
source = Path(dataset.location)

print(f"\n📂 Dataset structure:")
for item in sorted(source.iterdir()):
    if item.is_dir():
        subfolders = [s.name for s in item.iterdir() if s.is_dir()]
        print(f"   📁 {item.name}/")
        for sub in subfolders:
            img_count = len(list((item / sub).glob('*')))
            print(f"      📁 {sub}/ ({img_count} images)")

# Now copy to our project
DEST = Path('1_dataset/downloads/tomato/02_roboflow_tomato')

# Class mapping from Roboflow names to our names
CLASS_MAP = {
    'Tomato_Early_blight_leaf': 'early_blight',
    'Tomato_Septoria_leaf_spot': None,  # Skip
    'Tomato_leaf': 'healthy',
    'Tomato_leaf_bacterial_spot': 'bacterial_spot',
    'Tomato_leaf_late_blight': 'late_blight',
    'Tomato_leaf_mosaic_virus': None,  # Skip
    'Tomato_leaf_yellow_virus': 'tylcv',
    'Tomato_mold_leaf': None,  # Skip
}

# Copy from train folder
train_src = source / 'train'
copied = 0

print(f"\n📋 Copying to project...")

for roboflow_class, our_class in CLASS_MAP.items():
    src_dir = train_src / roboflow_class
    
    if not src_dir.exists():
        # Try with spaces instead of underscores
        alt_name = roboflow_class.replace('_', ' ')
        src_dir = train_src / alt_name
    
    if src_dir.exists() and our_class:
        dest_dir = DEST / our_class
        dest_dir.mkdir(parents=True, exist_ok=True)
        
        for img in src_dir.glob('*'):
            if img.suffix.lower() in ['.jpg', '.jpeg', '.png']:
                dest_file = dest_dir / f"roboflow_{img.name}"
                if not dest_file.exists():
                    shutil.copy2(img, dest_file)
                    copied += 1
        
        print(f"   ✅ {roboflow_class} → {our_class}")

print(f"\n📊 Total images copied: {copied}")
print(f"\n📁 Saved to: {DEST}")
print(f"\n📂 Class distribution:")
for our_class in ['early_blight', 'late_blight', 'tylcv', 'bacterial_spot', 'healthy']:
    dest_dir = DEST / our_class
    if dest_dir.exists():
        count = len(list(dest_dir.glob('*')))
        print(f"   {our_class}: {count} images")
print(f"\n✅ DONE!")