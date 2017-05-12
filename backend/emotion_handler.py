import cv2
from cv2 import WINDOW_NORMAL
from face_detection import find_faces
import json
import base64
import urlparse

emotions = ['neutral', 'anger', 'disgust', 'happy', 'sadness', 'surprise']


def recognize_emotion(json_data):
    data = json.loads(json_data)
    image = data['image']
    up = urlparse.urlparse(image)
    head, data = up.path.split(',', 1)
    plaindata = data.decode("base64")

    with open('img.jpg', 'wb') as f:
        f.write(plaindata)


    return "emotion"



