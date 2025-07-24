# app.py
# Main application for the Handwritten Optical Character Recognition (OCR) project

import numpy as np
import base64
import cv2
from flask import Flask, render_template, request, jsonify
from sklearn.datasets import load_digits
from sklearn.svm import SVC

# --- Machine Learning Model Setup ---
# Load the MNIST-like digits dataset that comes with scikit-learn
digits = load_digits()

# Train a Support Vector Machine (SVM) classifier on the entire dataset
# This is a simple yet effective model for this task.
# In a real-world scenario, you would train this model separately and save it.
# For this simulation, we train it on startup.
model = SVC(gamma=0.001, C=100.)
model.fit(digits.data, digits.target)
print("Digit recognition model trained and ready.")

# --- Flask Application Setup ---
app = Flask(__name__)

def preprocess_image(img_data):
    """
    Takes the base64 image data from the canvas, decodes it,
    and preprocesses it to match the format of the MNIST dataset.
    
    The MNIST dataset digits are 8x8 pixels, anti-aliased, and grayscale.
    """
    # 1. Decode the base64 string
    img_str = base64.b64decode(img_data.split(',')[1])
    nparr = np.frombuffer(img_str, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # 2. Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # 3. Invert colors (canvas drawing is black on white, model expects white on black)
    gray = cv2.bitwise_not(gray)
    
    # 4. Resize to 8x8 pixels
    resized = cv2.resize(gray, (8, 8), interpolation=cv2.INTER_AREA)

    # 5. Flatten the 8x8 image into a 1D array of 64 features
    flattened = resized.flatten()

    # 6. Reshape for the model (it expects a 2D array)
    processed_img = flattened.reshape(1, -1)
    
    return processed_img

@app.route('/')
def index():
    """Render the main web page."""
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    """
    Receives the image data from the frontend, preprocesses it,
    and returns the model's prediction.
    """
    try:
        data = request.get_json()
        img_data = data['image']
        
        # Preprocess the image to fit the model's input requirements
        processed_image = preprocess_image(img_data)
        
        # Get the model's prediction
        prediction = model.predict(processed_image)
        
        # Return the prediction as JSON
        return jsonify({'prediction': int(prediction[0])})

    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
