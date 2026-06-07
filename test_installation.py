# File: test_installation.py
"""
Verify runtime dependencies installed correctly (excluding TensorFlow).
TensorFlow is intentionally skipped because model training will be done in Google Colab.
"""

print("=" * 60)
print("🔍 VERIFYING INSTALLATION")
print("=" * 60)

tests_passed = 0
tests_total = 6

# Test 1: NumPy
try:
    import numpy as np
    print(f"\n✅ NumPy {np.__version__} installed")
    arr = np.array([1, 2, 3])
    print(f"   Test: np.array([1,2,3]) = {arr}")
    tests_passed += 1
except Exception as e:
    print(f"\n❌ NumPy error: {e}")

# Test 2: Pandas
try:
    import pandas as pd
    print(f"\n✅ Pandas {pd.__version__} installed")
    df = pd.DataFrame({'A': [1, 2], 'B': [3, 4]})
    print(f"   Test: DataFrame created with shape {df.shape}")
    tests_passed += 1
except Exception as e:
    print(f"\n❌ Pandas error: {e}")

# Test 3: OpenCV (self-contained)
try:
    import cv2
    print(f"\n✅ OpenCV {cv2.__version__} installed")
    # Attempt to run a lightweight resize test only if NumPy is available
    try:
        import numpy as np
        img = np.zeros((100, 100, 3), dtype=np.uint8)
        resized = cv2.resize(img, (50, 50))
        print(f"   Test: Resized image from 100x100 to {resized.shape[0]}x{resized.shape[1]}")
    except Exception:
        print("   ⚠️  NumPy not available — skipped OpenCV resize test (OpenCV presence verified)")
    tests_passed += 1
except Exception as e:
    print(f"\n❌ OpenCV error: {e}")

# Test 4: Pillow (PIL)
try:
    from PIL import Image
    print(f"\n✅ Pillow installed")
    img = Image.new('RGB', (100, 100), color='green')
    print(f"   Test: Created {img.size[0]}x{img.size[1]} image")
    tests_passed += 1
except Exception as e:
    print(f"\n❌ Pillow error: {e}")

# Test 5: Scikit-learn
try:
    import sklearn
    print(f"\n✅ Scikit-learn {sklearn.__version__} installed")
    tests_passed += 1
except Exception as e:
    print(f"\n❌ Scikit-learn error: {e}")

# Test 6: Matplotlib
try:
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    print(f"\n✅ Matplotlib installed")
    fig, ax = plt.subplots()
    ax.plot([1, 2, 3], [1, 4, 9])
    print(f"   Test: Plot created successfully")
    tests_passed += 1
except Exception as e:
    print(f"\n❌ Matplotlib error: {e}")

# Summary
print(f"\n{'=' * 60}")
print(f"📊 RESULTS: {tests_passed}/{tests_total} dependencies verified")
print(f"{'=' * 60}")

print("\nℹ️  TensorFlow is skipped locally because model training is planned for Google Colab.")

if tests_passed == tests_total:
    print("\n✅ ALL NON-TENSORFLOW DEPENDENCIES INSTALLED SUCCESSFULLY!")
    print("   You're ready to run the local project components.")
else:
    print(f"\n⚠️  {tests_total - tests_passed} dependency(ies) failed.")
    print("   Run: pip install <package_name>")
    print("   Or check the error messages above.") 