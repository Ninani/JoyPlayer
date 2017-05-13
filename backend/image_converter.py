import cv2


FACECASCADE = cv2.CascadeClassifier("./models/haarcascade_frontalface_default.xml")
GRAY_IMAGE_FILE = '/gray_img.jpg'
CROPPED_FACE_FILE = '/cropped_face_img.jpg'


def convert_image(image_storage, image_name):
    image = cv2.imread(image_name)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    # adaptive equalization
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    clahe_image = clahe.apply(gray)
    # face detection
    face = FACECASCADE.detectMultiScale(clahe_image, scaleFactor=1.1, minNeighbors=20, minSize=(10, 10), flags=cv2.CASCADE_SCALE_IMAGE)
    # Draw rectangle around detected faces
    for (x, y, w, h) in face:
        cv2.rectangle(gray, (x, y), (x+w, y+h), (0, 0, 0), 2)

    cv2.imwrite(image_storage + GRAY_IMAGE_FILE, gray)

# TODO: crop and process multiple faces
    if len(face) == 1:
        face_slice = crop_face(clahe_image, face)
        cv2.imwrite(image_storage + CROPPED_FACE_FILE, face_slice)
        face_detected = True
    else:
        face_slice = None
        print("no face or multiple faces detected")
        face_detected = False

    return face_slice, face_detected


def crop_face(image, face): #Crop the given face
    for (x, y, w, h) in face:
        face_slice = cv2.resize(image[y:y+h, x:x+w], (350, 350))
    return face_slice