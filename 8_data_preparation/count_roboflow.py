from pathlib import Path

base = Path('1_dataset/downloads/tomato/02_roboflow_tomato')

print("Roboflow Dataset Status")
print("=" * 30)

for c in ['early_blight', 'late_blight', 'tylcv', 'bacterial_spot', 'healthy']:
    folder = base / c
    if folder.exists():
        count = len(list(folder.glob('*')))
        print(f"{c}: {count} images")
    else:
        print(f"{c}: folder missing")