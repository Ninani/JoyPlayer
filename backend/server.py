from flask import Flask
from flask import request
# from emotion_handler import recognize_emotion
from emotion_handler import recognize_emotion_local_cam
from emotion_handler import show_webcam_image


app = Flask(__name__)


@app.route("/data.json", methods=["POST"])
def get_emotion():
	# image = request.files.get('image')
	# return recognize_emotion(image)
	return recognize_emotion_local_cam()	

if __name__ == "__main__":
	# show_webcam_image('webcam')
	app.run(host="localhost", port=int("8081"))

