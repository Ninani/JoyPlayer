import cv2
from cv2 import WINDOW_NORMAL
from face_detection import find_faces

emotions = ['neutral', 'anger', 'disgust', 'happy', 'sadness', 'surprise']

# use it for an image read from request
def recognize_emotion(pic):
	return "emotion"


def recognize_emotion_local_cam():
	prediction = 0
	vc = cv2.VideoCapture(0)
	if vc.isOpened():
		read_value, webcam_image = vc.read()
	else:
		print("webcam not found")
		return

	if cv2.__version__ == '3.1.0':
		model = cv2.face.createFisherFaceRecognizer()
	else:
		model = cv2.createFisherFaceRecognizer()
	model.load('models/emotion_detection_model.xml')

	for normalized_face, (x, y, w, h) in find_faces(webcam_image):
		prediction = model.predict(normalized_face) 
		if cv2.__version__ != '3.1.0':
			prediction = prediction[0]

	return emotions[prediction]

	


def show_webcam_image(window_name):
	cv2.namedWindow(window_name, WINDOW_NORMAL)
	cv2.resizeWindow(window_name, 1000, 700)

	vc = cv2.VideoCapture(0)
	if vc.isOpened():
		read_value, webcam_image = vc.read()
	else:
		print("webcam not found")
		return

	if cv2.__version__ == '3.1.0':
		model = cv2.face.createFisherFaceRecognizer()
	else:
		model = cv2.createFisherFaceRecognizer()
	model.load('models/emotion_detection_model.xml')

	while read_value:
		for normalized_face, (x, y, w, h) in find_faces(webcam_image):
			prediction = model.predict(normalized_face) 
			if cv2.__version__ != '3.1.0':
				prediction = prediction[0]
				print emotions[prediction]

		cv2.imshow(window_name, webcam_image)
		read_value, webcam_image = vc.read()
		key = cv2.waitKey(10)

	cv2.destroyWindow(window_name)
