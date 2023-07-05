from deepface import DeepFace
import cv2
from flask import Flask, request, jsonify
import pytesseract
from PIL import Image

# Path to the Tesseract OCR executable
pytesseract.pytesseract.tesseract_cmd = 'path_to_tesseract_executable'


# Create a Flask application instance
app = Flask(__name__)

# Define a route and a corresponding function
@app.route('/api/compareface', methods=['POST'])
def compareface():
    request_data = request.get_json()
    id_path = request_data.get('id_path')
    # Open the default camera (index 0)
    camera = cv2.VideoCapture(0)

    # Check if the camera is opened successfully
    if not camera.isOpened():
        print("Failed to open the camera")
        exit()

    # Capture a frame from the camera
    ret, frame = camera.read()

    # Check if the frame is captured successfully
    if not ret:
        print("Failed to capture the frame")
        exit()


    # Save the captured frame as an image file
    cv2.imwrite("./faces/compare.jpg", frame)
    # Release the camera and close the window
    camera.release()

    try:
        result = DeepFace.verify(img1_path = "./faces/compare.jpg", img2_path = id_path)
        return str(result.get("verified"));
    except Exception:
        return "Face could not be detected!"





# Run the application if the script is executed directly
if __name__ == '__main__':
    app.run(port=5000)




