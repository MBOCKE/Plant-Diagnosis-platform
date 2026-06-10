# File: 2_notebooks/quick_audit.py
"""Quick audit of downloaded datasets - no extra packages needed"""

import os
from pathlib import Path

BASE = Path('1_dataset/downloads')

for crop in ['tomato', 'banana_plantain']:
    crop_path = BASE / crop
    if not crop_path.exists():
        print(f'\n❌ {crop}: folder not found')
        continue
    
    print(f'\n{"="*60}')
    print(f'📁 {crop.upper()}')
    print(f'{"="*60}')
    
    total_crop = 0
    
    for source in sorted(crop_path.iterdir()):
        if source.is_dir():
            # Count all images
            count = 0
            for ext in ['*.jpg', '*.jpeg', '*.png', '*.JPG', '*.JPEG', '*.PNG']:
                count += len(list(source.rglob(ext)))
            
            total_crop += count
            
            # Check subfolders (class organization)
            subdirs = [d for d in source.iterdir() if d.is_dir()]
            
            print(f'\n📦 {source.name}')
            print(f'   Total images: {count}')
            
            if subdirs:
                print(f'   Organized in {len(subdirs)} class folders:')
                for sd in sorted(subdirs):
                    sub_count = sum(1 for _ in sd.rglob('*') if _.suffix.lower() in ['.jpg', '.jpeg', '.png'])
                    print(f'      📁 {sd.name}/ → {sub_count} images')
            else:
                print(f'   ⚠️  Flat folder (no class subfolders)')
    
    print(f'\n   ─────────────────────────────')
    print(f'   📊 TOTAL for {crop}: {total_crop} images')

print(f'\n{"="*60}')
print('✅ AUDIT COMPLETE - Copy this output and share it!')
print(f'{"="*60}')