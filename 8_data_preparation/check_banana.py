from pathlib import Path

base = Path('1_dataset/downloads/banana_plantain/01_bananalsd')

print("Current Banana Class Distribution")
print("=" * 35)

for folder in sorted(base.iterdir()):
    if folder.is_dir():
        count = len(list(folder.glob('*')))
        print(f"  {folder.name}: {count} images")
        