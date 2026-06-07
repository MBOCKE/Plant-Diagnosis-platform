# File: 8_data_preparation/06_download_roboflow.py
"""
Download Roboflow dataset as organized folders with labeled classes
"""

from roboflow import Roboflow
from pathlib import Path
import shutil

# Initialize with your API key
rf = Roboflow(api_key="g2nhM9joyQcKOs3QXice")

# Access the project
project = rf.workspace("disease").project("tomato-diseases-4n1d8")
version = project.version(2)

print("=" * 70)
print("📥 DOWNLOADING ROBOFLOW DATASET")
print("=" * 70)

# Download as "folder" format - gives us JPEGs organized by class
dataset = version.download("multiclass")

print(f"\n✅ Downloaded to: {dataset.location}")

source = Path(dataset.location)

# Explore the structure
print(f"\n📂 Dataset structure:")
for item in sorted(source.iterdir()):
    if item.is_dir():
        subfolders = [s for s in item.iterdir() if s.is_dir()]
        print(f"   📁 {item.name}/ ({len(subfolders)} class folders)")
        for sub in sorted(subfolders):
            img_count = len(list(sub.glob('*')))
            print(f"      📁 {sub.name}: {img_count} images")

# Class mapping: Roboflow names → our names
CLASS_MAP = {
    'Tomato_Early_blight_leaf': 'early_blight',
    'Tomato_Septoria_leaf_spot': None,
    'Tomato_leaf': 'healthy',
    'Tomato_leaf_bacterial_spot': 'bacterial_spot',
    'Tomato_leaf_late_blight': 'late_blight',
    'Tomato_leaf_mosaic_virus': None,
    'Tomato_leaf_yellow_virus': 'tylcv',
    'Tomato_mold_leaf': None,
}

# Also try with spaces
CLASS_MAP_SPACES = {
    'Tomato Early blight leaf': 'early_blight',
    'Tomato Septoria leaf spot': None,
    'Tomato leaf': 'healthy',
    'Tomato leaf bacterial spot': 'bacterial_spot',
    'Tomato leaf late blight': 'late_blight',
    'Tomato leaf mosaic virus': None,
    'Tomato leaf yellow virus': 'tylcv',
    'Tomato mold leaf': None,
}

DEST = Path('1_dataset/downloads/tomato/02_roboflow_tomato')
copied = 0

print(f"\n📋 Copying to project...")

# Try train folder first
for src_folder in ['train', 'Train', 'training']:
    train_src = source / src_folder
    if train_src.exists():
        print(f"\n   Using {src_folder}/ folder...")
        
        # Check each possible class folder
        for class_name in train_src.iterdir():
            if not class_name.is_dir():
                continue
            
            name = class_name.name
            
            # Try underscore version first, then space version
            our_class = CLASS_MAP.get(name) or CLASS_MAP_SPACES.get(name)
            
            if our_class:
                dest_dir = DEST / our_class
                dest_dir.mkdir(parents=True, exist_ok=True)
                
                count = 0
                for img in class_name.glob('*'):
                    if img.suffix.lower() in ['.jpg', '.jpeg', '.png']:
                        dest_file = dest_dir / f"roboflow_{img.name}"
                        if not dest_file.exists():
                            shutil.copy2(img, dest_file)
                            count += 1
                            copied += 1
                
                print(f"   ✅ {name} → {our_class} ({count} images)")
            else:
                count = len(list(class_name.glob('*')))
                print(f"   ⏭️  {name} → SKIPPED ({count} images)")
        
        break  # Found the train folder, stop looking

# Summary
print(f"\n{'=' * 70}")
print("📊 DOWNLOAD RESULTS")
print(f"{'=' * 70}")
print(f"   Total images copied: {copied}")
print(f"   Saved to: {DEST}")
print(f"\n📂 Class distribution:")
for our_class in ['early_blight', 'late_blight', 'tylcv', 'bacterial_spot', 'healthy']:
    dest_dir = DEST / our_class
    if dest_dir.exists():
        count = len(list(dest_dir.glob('*')))
        print(f"   {our_class}: {count} images")
print(f"\n✅ DONE!")