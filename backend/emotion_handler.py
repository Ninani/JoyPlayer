import json
import urlparse
import os
from image_converter import convert_image
from fishface_classifier import predict_emotion
import model_update


TMP_IMAGE_STORAGE = './tmp_img_storage'
IMAGE_FILE = TMP_IMAGE_STORAGE + '/img.jpg'
emotions = ['neutral', 'anger', 'disgust', 'happy', 'sadness', 'surprise']
retrain_counter = 0


def recognize_emotion(json_data):
    plain_data = extract_img_from_json(json_data)

    if not os.path.exists(TMP_IMAGE_STORAGE):
        os.makedirs(TMP_IMAGE_STORAGE)

    with open(IMAGE_FILE, 'wb') as f:
        f.write(plain_data)

    cropped_face, face_detected = convert_image(TMP_IMAGE_STORAGE, IMAGE_FILE)
    if(face_detected):
        emotion = predict_emotion(cropped_face, emotions)
    else:
        emotion = "neutral"

    # remove temporarily saved images from TMP_IMAGE_STORAGE
    directory_cleanup(TMP_IMAGE_STORAGE)

    return emotion


def retrain_model(json_data, mood):
    plain_data = extract_img_from_json(json_data)

    if not os.path.exists(TMP_IMAGE_STORAGE):
        os.makedirs(TMP_IMAGE_STORAGE)

    with open(IMAGE_FILE, 'wb') as f:
        f.write(plain_data)

    if(retrain counter > 10):
        model_update.update(mood)
    else:
        retrain_counter += 1


def extract_img_from_json(json_data):
    data = json.loads(json_data)
    image = data['image']
    up = urlparse.urlparse(image)
    head, data = up.path.split(',', 1)
    plain_data = data.decode("base64")
    return plain_data

def directory_cleanup(directory_path):
    for file in os.listdir(directory_path):
        file_path = os.path.join(directory_path, file)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
        except Exception as e:
            print(e)


