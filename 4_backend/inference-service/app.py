"""
Plant Diagnosis Inference Service
Loads TFLite models and serves predictions via HTTP
"""

from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import json
import os

app = Flask(__name__)

# ============================================
# LOAD MODELS AT STARTUP
# ============================================

MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')

print("🔄 Loading models...")

# Tomato model
tomato_interpreter = tf.lite.Interpreter(
    model_path=os.path.join(MODEL_DIR, 'tomato_model.tflite')
)
tomato_interpreter.allocate_tensors()
tomato_input = tomato_interpreter.get_input_details()[0]
tomato_output = tomato_interpreter.get_output_details()[0]

# Banana model
banana_interpreter = tf.lite.Interpreter(
    model_path=os.path.join(MODEL_DIR, 'banana_model.tflite')
)
banana_interpreter.allocate_tensors()
banana_input = banana_interpreter.get_input_details()[0]
banana_output = banana_interpreter.get_output_details()[0]

# Load labels
with open(os.path.join(MODEL_DIR, 'labels', 'tomato_labels.json')) as f:
    TOMATO_LABELS = json.load(f)
with open(os.path.join(MODEL_DIR, 'labels', 'banana_labels.json')) as f:
    BANANA_LABELS = json.load(f)

print("✅ Models loaded!")
print(f"   Tomato classes: {len(TOMATO_LABELS)}")
print(f"   Banana classes: {len(BANANA_LABELS)}")


# ============================================
# IMAGE PREPROCESSING
# ============================================

def preprocess_image(image_bytes):
    """Convert raw image bytes to model input tensor"""
    img = Image.open(io.BytesIO(image_bytes))
    img = img.convert('RGB')
    img = img.resize((224, 224))
    img_array = np.array(img, dtype=np.float32) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array


# ============================================
# INFERENCE
# ============================================

def run_inference(image_bytes, crop_type):
    """Run inference on image and return predictions"""
    
    tensor = preprocess_image(image_bytes)
    
    if crop_type == 'tomato':
        interpreter = tomato_interpreter
        input_details = tomato_input
        output_details = tomato_output
        labels = TOMATO_LABELS
    elif crop_type == 'banana_plantain':
        interpreter = banana_interpreter
        input_details = banana_input
        output_details = banana_output
        labels = BANANA_LABELS
    else:
        raise ValueError(f"Unsupported crop type: {crop_type}")
    
    interpreter.set_tensor(input_details['index'], tensor)
    interpreter.invoke()
    predictions = interpreter.get_tensor(output_details['index'])[0]
    
    results = []
    for i, prob in enumerate(predictions):
        results.append({
            'disease': labels[str(i)],
            'confidence': round(float(prob) * 100, 2),
        })
    
    results.sort(key=lambda x: x['confidence'], reverse=True)
    
    return {
        'primaryDiagnosis': results[0],
        'alternativeDiagnoses': results[1:3],
        'allPredictions': results,
        'modelUsed': f'{crop_type}-mobilenetv2-v1',
    }


# ============================================
# ROUTES
# ============================================

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'service': 'inference-service',
        'models': {
            'tomato': len(TOMATO_LABELS),
            'banana': len(BANANA_LABELS),
        }
    })


@app.route('/predict', methods=['POST'])
def predict():
    """Diagnose plant disease from uploaded image"""
    
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    crop_type = request.form.get('crop_type', 'tomato')
    
    if crop_type not in ['tomato', 'banana_plantain']:
        return jsonify({'error': 'Invalid crop type. Must be tomato or banana_plantain'}), 400
    
    try:
        image_bytes = request.files['image'].read()
        result = run_inference(image_bytes, crop_type)
        
        return jsonify({
            'success': True,
            'data': result,
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
        }), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)