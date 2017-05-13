import json
import urlparse
import os
from image_converter import convert_image
from fishface_classifier import predict_emotion


TMP_IMAGE_STORAGE = './tmp_img_storage'
IMAGE_FILE = TMP_IMAGE_STORAGE + '/img.jpg'


def recognize_emotion(json_data):
    data = json.loads(json_data)
    image = data['image']
    up = urlparse.urlparse(image)
    head, data = up.path.split(',', 1)
    plain_data = data.decode("base64")

    with open(IMAGE_FILE, 'wb') as f:
        f.write(plain_data)

    cropped_face, face_detected = convert_image(TMP_IMAGE_STORAGE, IMAGE_FILE)
    if(face_detected):
        emotion = predict_emotion(cropped_face)
    else:
        emotion = "neutral"

    # remove temporarily saved images from TMP_IMAGE_STORAGE
    directory_cleanup(TMP_IMAGE_STORAGE)

    return emotion



def directory_cleanup(directory_path):
    for file in os.listdir(directory_path):
        file_path = os.path.join(directory_path, file)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
        except Exception as e:
            print(e)
