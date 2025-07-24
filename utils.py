import cv2
import numpy as np
from tensorflow.keras.models import load_model

model = load_model("ocr_model.h5")

def preprocess_image(image_path):
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    img = cv2.resize(img, (28, 28))
    img = img.astype("float32") / 255.0
    img = img.reshape(1, 28, 28, 1)
    return img

def predict_digit(image_path):
    img = preprocess_image(image_path)
    prediction = model.predict(img)
    return np.argmax(prediction)
