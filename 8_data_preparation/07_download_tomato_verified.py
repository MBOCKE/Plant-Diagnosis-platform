from roboflow import Roboflow
from pathlib import Path
import shutil, os, glob

rf = Roboflow(api_key="g2nhM9joyQcKOs3QXice")

OUTPUT = Path('1_dataset/downloads/tomato/07_verified_roboflow/bacterial_spot')
OUTPUT.mkdir(parents=True, exist_ok=True)

# Add URLs for bacterial spot datasets
DATASETS = [
    # Dataset 1 - already downloaded (134 images)
    # Dataset 2 - new
    {
        'workspace': 'tomato-leaf-disease-brnbi',
        'project': 'tomato-bacterial-spot-elzgw',
        'name': 'Bacterial Spot 1',
    },
    # Add more as you find them:
    # {
    #     'workspace': '...',
    #     'project': '...',
    #     'name': 'Bacterial Spot 2',
    # },
]

total = 0

for ds in DATASETS:
    print(f"\n📥 Downloading {ds['name']}...")
    project = rf.workspace(ds['workspace']).project(ds['project'])
    
    versions = project.versions()
    print(f"   Found {len(versions)} versions")
    
    for version in versions:
        try:
            for fmt in ["coco", "yolov8", "folder", "multiclass"]:
                try:
                    dataset = version.download(fmt)
                    source = Path(dataset.location)
                    
                    count = 0
                    for img in glob.glob(os.path.join(str(source), '**', '*'), recursive=True):
                        if img.lower().endswith(('.jpg', '.jpeg', '.png')):
                            dest = OUTPUT / f"v{version.version}_{os.path.basename(img)}"
                            if not dest.exists():
                                shutil.copy2(img, dest)
                                count += 1
                    
                    if count > 0:
                        print(f"   ✅ Version {version.version}: {count} images")
                        total += count
                        break
                except:
                    continue
        except Exception as e:
            print(f"   ❌ Version {version.version}: {str(e)[:80]}")

print(f"\n{'=' * 50}")
print(f"✅ TOTAL BACTERIAL SPOT: {total} images")
print(f"📁 Saved to: {OUTPUT}")
print(f"\n⚠️  Manually verify: delete any non-bacterial-spot images!")