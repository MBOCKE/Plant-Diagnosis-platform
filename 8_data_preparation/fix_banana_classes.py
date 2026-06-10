from pathlib import Path
import shutil

base = Path('1_dataset/downloads/banana_plantain/01_bananalsd')

# Create other_disease folder
other_dir = base / 'other_disease'
other_dir.mkdir(exist_ok=True)

# Files to move from fusarium_wilt
fusi_dir = base / 'fusarium_wilt'
keywords = ['cordana', 'Cordana', 'pestalotiopsis', 'Pestalotiopsis']

moved = 0
for img in fusi_dir.glob('*'):
    name = img.name.lower()
    if any(k.lower() in name for k in keywords):
        shutil.move(str(img), str(other_dir / img.name))
        moved += 1

print(f"Moved {moved} images to other_disease")
print(f"\nRemaining in fusarium_wilt: {len(list(fusi_dir.glob('*')))} images")

print("\nNew class distribution:")
for folder in sorted(base.iterdir()):
    if folder.is_dir():
        count = len(list(folder.glob('*')))
        print(f"  {folder.name}: {count}")