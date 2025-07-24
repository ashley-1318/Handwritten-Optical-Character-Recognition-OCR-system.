Handwritten Optical Character Recognition (OCR) AI
This is a web-based application that uses a machine learning model to recognize handwritten digits drawn on an HTML5 canvas. It's a full-stack demonstration of a simple OCR system.

Project Objective
The goal of this project is to create an interactive web interface where a user can draw a single digit (from 0 to 9), and have that drawing be processed and classified by a machine learning model in real-time. This project showcases the end-to-end process of deploying a machine learning model within a web application.

Features
Interactive Drawing Canvas: A user-friendly canvas built with HTML5 and JavaScript allows for smooth drawing.

Machine Learning Backend: A Python Flask server hosts a pre-trained Support Vector Machine (SVM) model for digit classification.

Real-Time Prediction: As soon as the user finishes drawing, the image is sent to the backend, and the AI's prediction is displayed almost instantly.

Image Preprocessing: The backend includes a robust preprocessing pipeline using OpenCV to convert the user's drawing into the 8x8 pixel format required by the ML model.

Clean User Interface: A modern and intuitive UI clearly separates the drawing area from the prediction result.

Technology Stack
Backend: Python, Flask

Machine Learning: Scikit-learn (for the SVM model and digits dataset)

Image Processing: OpenCV, NumPy

Frontend: HTML, CSS, JavaScript (with the Canvas API)

API Communication: Asynchronous JavaScript (Fetch API) and JSON

How It Works
Model Training: On startup, the Flask server loads the digits dataset from scikit-learn and trains an SVM classifier on it.

User Drawing: The user draws a digit on the black canvas using their mouse.

Image Capture: When the user releases the mouse button, the JavaScript captures the contents of the canvas as a base64 encoded PNG image.

API Call: The frontend sends this image data to the /predict endpoint on the Flask server via a POST request.

Backend Processing: The Flask server receives the image data. It uses OpenCV to decode the image, convert it to grayscale, invert the colors, resize it to 8x8 pixels, and flatten it into a 64-feature array.

Prediction: This processed array is fed into the pre-trained SVM model, which returns a prediction.

Response: The server sends the predicted digit back to the frontend as a JSON response.

Display Result: The JavaScript updates the UI to display the predicted digit, providing immediate feedback to the user.

Setup and Installation
1. Clone the Repository:

git clone https://github.com/ashley-1318/Handwritten-Optical-Character-Recognition-OCR-system.
cd handwritten-ocr

2. Create a Virtual Environment (Recommended):

# For Windows
python -m venv venv
venv\Scripts\activate

# For macOS/Linux
python3 -m venv venv
source venv/bin/activate

3. Install Dependencies:

pip install -r requirements.txt

4. Run the Application:

python app.py

5. View in Browser:

Open your web browser and navigate to http://127.0.0.1:5000. Draw a digit on the canvas to see the AI in action!
