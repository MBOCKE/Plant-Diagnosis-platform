# File: 8_data_preparation/extract_roboflow_tfrecord.py
"""
Extract ALL images from Roboflow TFRecord with class labels
TensorFlow IS installed now, so this will work properly
"""

import tensorflow as tf
from pathlib import Path
from PIL import Image
import io

TFRECORD = '1_dataset/downloads/tomato/02_roboflow_tomato/train/Tomato-diseases.tfrecord'
OUTPUT = Path('1_dataset/downloads/tomato/02_roboflow_tomato')

# Class mapping from the label map
CLASS_MAP = {
    1: 'early_blight',
    2: None,      # Septoria - skip
    3: 'healthy',
    4: 'bacterial_spot',
    5: 'late_blight',
    6: None,      # mosaic virus - skip
    7: 'tylcv',
    8: None,      # mold leaf - skip
}

print("=" * 60)
print("Extracting Roboflow TFRecord with TensorFlow")
print("=" * 60)

# Create output folders
for c in ['early_blight', 'late_blight', 'tylcv', 'bacterial_spot', 'healthy']:
    (OUTPUT / c).mkdir(parents=True, exist_ok=True)

# Parse TFRecord
dataset = tf.data.TFRecordDataset(TFRECORD)
counts = {c: 0 for c in CLASS_MAP.values() if c}

for i, record in enumerate(dataset):
    try:
        example = tf.train.Example()
        example.ParseFromString(record.numpy())
        
        # Get image
        img_bytes = example.features.feature['image/encoded'].bytes_list.value[0]
        
        # Get label
        label = example.features.feature['image/object/class/label'].int64_list.value[0]
        
        class_name = CLASS_MAP.get(label)
        if class_name is None:
            continue
        
        # Save image
        img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
        img.save(OUTPUT / class_name / f'roboflow_{i:05d}.jpg', 'JPEG')
        counts[class_name] += 1
        
        if (i + 1) % 500 == 0:
            print(f"   Processed {i + 1} records...")
            
    except Exception as e:
        pass

print(f"\nDone! Extracted:")
for c, n in counts.items():
    print(f"   {c}: {n} images")
print(f"   Total: {sum(counts.values())}")