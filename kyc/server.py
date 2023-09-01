"""
from deepface import DeepFace
import cv2
from flask import Flask, request
from flasgger import Swagger
from flasgger.utils import swag_from
from flasgger import LazyString, LazyJSONEncoder

import imgcompare

# Create a Flask application instance
app = Flask(__name__)


#swagger documentation
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
    "specs_route": "/swagger/",
}


swagger = Swagger(app, config=swagger_config)



def cin_similarity(image1_path, image2_path):
    # Read the images
    image1 = cv2.imread(image1_path)
    image2 = cv2.imread(image2_path)

    # Resize both images to the same dimensions
    target_width = 300  # Adjust this to your desired width
    target_height = 221  # Adjust this to your desired height

    image1_resized = cv2.resize(image1, (target_width, target_height))
    image2_resized = cv2.resize(image2, (target_width, target_height))

    # Convert the resized images to grayscale (required for SSIM)
    image1_gray = cv2.cvtColor(image1_resized, cv2.COLOR_BGR2GRAY)
    image2_gray = cv2.cvtColor(image2_resized, cv2.COLOR_BGR2GRAY)
    cv2.imwrite("./faces/a.jpg", image1_gray)
    cv2.imwrite("./faces/b.jpg", image2_gray)
    return 100-imgcompare.image_diff_percent("./faces/a.jpg", "./faces/b.jpg")




@app.route('/api/compareface', methods=['POST'])
@swag_from("swagger_config.yml")
def compareface():
    request_data = request.get_json()
    id_path = request_data.get('id_path')
    
    #test if the image selected is a CIN
    cin_comformation_percent=cin_similarity("./faces/idexample.jpg", id_path)
    if cin_comformation_percent <=80:
        return "The selected image is not recognized as a valid ID card. Please take a clear image and try again!"
    
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
        font = cv2.FONT_HERSHEY_DUPLEX  # Font type
        font_scale = 0.6  # Font scale
        thickness = 1  # Thickness of the text
        color = (255,255,0)  # Text color in BGR format (Red in this case)
        text_color_bg=(0, 0, 0)
        # Get the dimensions of the image
        image_height, image_width, _ = frame.shape
        
        # Calculate the width and height of the text box
        text_box_width, text_box_height = cv2.getTextSize(text, font, font_scale, thickness)[0]
        
        # Calculate the position to align the text horizontally in the middle
        text_x = (image_width - text_box_width) // 2
        position =(text_x, 40)  # Position of the text (top-left corner)
        x, y = position
        cv2.rectangle(frame, (text_x-40, 15), (x + text_box_width+40, y + text_box_height), text_color_bg, -1)
        # Write the text on the image
        cv2.putText(frame, text, position, font, font_scale, color, thickness)

        
        cv2.imshow("Click \"SPACE\" to save,\"ECHAP\" to cancel!", frame)
        cv2.setWindowProperty("Click \"SPACE\" to save,\"ECHAP\" to cancel!", cv2.WND_PROP_TOPMOST, 1)
        key = cv2.waitKey(1)
        if key == ord(' '):
            # Save the captured frame as an image file
            cv2.imwrite("./faces/compare.jpg", frame)
            # Check if the frame is captured successfully
            if not ret:
                print("Failed to capture the frame")
                exit()
            # Close the window
            cv2.destroyAllWindows()
            # Release the camera and close the window
            camera.release()
            try:
                result = DeepFace.verify(img1_path = "./faces/compare.jpg", img2_path = id_path)
                return str(result.get("verified"));
            except Exception:
                return "Face could not be detected!"

        # 27 = ECHAP UNICODE
        elif key == 27:
            # Close the window
            cv2.destroyAllWindows()
            # Release the camera and close the window
            camera.release()
            return "Operation Canceled!"






# Run the application if the script is executed directly
if __name__ == '__main__':
    app.run(port=5000)




"""


from deepface import DeepFace
import cv2
from flask import Flask, request
from flasgger import Swagger
from flasgger.utils import swag_from
from flasgger import LazyString, LazyJSONEncoder

import imgcompare

# Create a Flask application instance
app = Flask(__name__)



# Load the pre-trained face detection model
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

#swagger documentation
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
    "specs_route": "/swagger/",
}


swagger = Swagger(app, config=swagger_config)



def cin_similarity(image1_path, image2_path):
    # Read the images
    image1 = cv2.imread(image1_path)
    image2 = cv2.imread(image2_path)

    # Resize both images to the same dimensions
    target_width = 300  # Adjust this to your desired width
    target_height = 221  # Adjust this to your desired height

    image1_resized = cv2.resize(image1, (target_width, target_height))
    image2_resized = cv2.resize(image2, (target_width, target_height))

    # Convert the resized images to grayscale (required for SSIM)
    image1_gray = cv2.cvtColor(image1_resized, cv2.COLOR_BGR2GRAY)
    image2_gray = cv2.cvtColor(image2_resized, cv2.COLOR_BGR2GRAY)
    cv2.imwrite("./faces/a.jpg", image1_gray)
    cv2.imwrite("./faces/b.jpg", image2_gray)
    return 100-imgcompare.image_diff_percent("./faces/a.jpg", "./faces/b.jpg")




@app.route('/api/compareface', methods=['POST'])
@swag_from("swagger_config.yml")
def compareface():
    request_data = request.get_json()
    id_path = request_data.get('id_path')
    
    #test if the image selected is a CIN
    cin_comformation_percent=cin_similarity("./faces/idexample.jpg", id_path)
    if cin_comformation_percent <=80:
        return "The selected image is not recognized as a valid ID card. Please take a clear image and try again!"
    
    # Open the default camera (index 0)
    camera = cv2.VideoCapture(0)

    # Check if the camera is opened successfully
    if not camera.isOpened():
        print("Failed to open the camera")
        exit()
    # Capture a frame from the camera
    while True:
        ret, frame = camera.read()
        
        # Convert the frame to grayscale for face detection
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Detect faces in the frame
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        for (x, y, w, h) in faces:
            # Draw a rectangle around the detected face
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)

            # Here, you would implement liveness verification using a deep learning model
            # For example, you could use a pre-trained Convolutional Neural Network (CNN)
            # trained on real and fake face images to distinguish between the two.

            # Replace this placeholder with your liveness verification code.
            # You might need to use libraries like TensorFlow or PyTorch for the CNN.
        
        
        
        # Write info on live image
        text = "When your face is detected, click \"SPACE\" to save or \"ESC\" to cancel!"  # The text to be written
        font = cv2.FONT_HERSHEY_COMPLEX  # Font type
        font_scale = 0.5  # Font scale
        thickness = 1  # Thickness of the text
        color = (0, 255, 0)  # Text color in BGR format (Red in this case)
        text_color_bg=(0, 0, 0)
        # Get the dimensions of the image
        image_height, image_width, _ = frame.shape
        
        # Calculate the width and height of the text box
        text_box_width, text_box_height = cv2.getTextSize(text, font, font_scale, thickness)[0]
        
        # Calculate the position to align the text horizontally in the middle
        text_x = (image_width - text_box_width) // 2
        position =(text_x, 40)  # Position of the text (top-left corner)
        x, y = position
        cv2.rectangle(frame, (text_x-40, 15), (x + text_box_width+40, y + text_box_height), text_color_bg, -1)
        # Write the text on the image
        cv2.putText(frame, text, position, font, font_scale, color, thickness)

        
        cv2.imshow("Click \"SPACE\" to save,\"ECHAP\" to cancel!", frame)
        cv2.setWindowProperty("Click \"SPACE\" to save,\"ECHAP\" to cancel!", cv2.WND_PROP_TOPMOST, 1)
        key = cv2.waitKey(1)
        if key == ord(' '):
            # Save the captured frame as an image file
            cv2.imwrite("./faces/compare.jpg", frame)
            # Check if the frame is captured successfully
            if not ret:
                print("Failed to capture the frame")
                exit()
            # Close the window
            cv2.destroyAllWindows()
            # Release the camera and close the window
            camera.release()
            try:
                result = DeepFace.verify(img1_path = "./faces/compare.jpg", img2_path = id_path)
                return str(result.get("verified"));
            except Exception:
                return "Face could not be detected!"

        # 27 = ECHAP UNICODE
        elif key == 27:
            # Close the window
            cv2.destroyAllWindows()
            # Release the camera and close the window
            camera.release()
            return "Operation Canceled!"






# Run the application if the script is executed directly
if __name__ == '__main__':
    app.run(port=5000)






