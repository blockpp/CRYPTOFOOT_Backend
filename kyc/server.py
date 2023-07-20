from deepface import DeepFace
import cv2
from flask import Flask, request, jsonify
import random
import string
import os
from flask import Flask, request
from flasgger import Swagger
from flasgger.utils import swag_from
from flasgger import LazyString, LazyJSONEncoder


# Create a Flask application instance
app = Flask(__name__)

# swagger config begin
app.config["SWAGGER"] = {"title": "Swagger-UI", "uiversion": 2}

swagger_config = {
    "headers": [],
    "specs": [
        {
            "endpoint": "apispec_1",
            "route": "/apispec_1.json",
            "rule_filter": lambda rule: True,  # all in
            "model_filter": lambda tag: True,  # all in
        }
    ],
    "static_url_path": "/flasgger_static",
    # "static_folder": "static",  # must be set by user
    "swagger_ui": True,
    "specs_route": "/doc/",
}


swagger = Swagger(app, config=swagger_config)
# swagger config end

# generate random string for image name
def generate_random_string(length):
    letters = string.ascii_letters
    return ''.join(random.choice(letters) for _ in range(length))



# Define a route and a corresponding function
@app.route('/api/compareface', methods=['POST'])
@swag_from("swagger_config.yml")
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
    while True:
        ret, frame = camera.read()
        # Write info on live image
        text = "Click \"SPACE\" to save,\"ECHAP\" to cancel!"  # The text to be written
        font = cv2.FONT_HERSHEY_SIMPLEX  # Font type
        font_scale = 0.6  # Font scale
        thickness = 1  # Thickness of the text
        color = (255,255,0)  # Text color in BGR format (Red in this case)
        position = (10, 50)  # Position of the text (top-left corner)
        # Get the dimensions of the image
        image_height, image_width, _ = frame.shape
        
        # Calculate the width and height of the text box
        text_box_width, text_box_height = cv2.getTextSize(text, font, font_scale, thickness)[0]
        
        # Calculate the position to align the text horizontally in the middle
        text_x = (image_width - text_box_width) // 2

        # Write the text on the image
        cv2.putText(frame, text, (text_x, 40), font, font_scale, color, thickness)

        
        cv2.imshow("Click \"SPACE\" to save,\"ECHAP\" to cancel!", frame)
        cv2.setWindowProperty("Click \"SPACE\" to save,\"ECHAP\" to cancel!", cv2.WND_PROP_TOPMOST, 1)
        key = cv2.waitKey(1)
        if key == ord(' '):
            random_string = generate_random_string(10)
            captionImagePath="./faces/"+random_string+".jpg"
            # Save the captured frame as an image file
            cv2.imwrite(captionImagePath, frame)
            # Check if the frame is captured successfully
            if not ret:
                print("Failed to capture the frame")
                exit()
            # Close the window
            cv2.destroyAllWindows()
            # Release the camera and close the window
            camera.release()
            
            try:
                verify = DeepFace.verify(img1_path = "./faces/compare.jpg", img2_path = id_path)
                result=str(verify.get("verified"))
                # Delete the image file
                os.remove(captionImagePath)
                return result;
            except Exception:
                # Delete the image file
                os.remove(captionImagePath)
                return "Face could not be detected!"

        # 27 = ECHAP UNICODE
        elif key == 27:
            # Close the window
            cv2.destroyAllWindows()
            # Release the camera and close the window
            camera.release()
            # Delete the image file
            os.remove(captionImagePath)
            return "Operation Canceled!"

            



# Run the application if the script is executed directly
if __name__ == '__main__':
    app.run(port=5000)




"""

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






"""