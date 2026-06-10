from pathlib import Path

base = Path('1_dataset/downloads/banana_plantain')

print("ALL BANANA DATASETS")
print("=" * 50)

for src in sorted(base.iterdir()):
    if src.is_dir():
        total = 0
        print(f"\n📁 {src.name}/")
        for cls in sorted(src.iterdir()):
            if cls.is_dir():
                count = len(list(cls.glob('*')))
                total += count
                print(f"   {cls.name}: {count} images")
        print(f"   TOTAL: {total}")