from flask import Flask
from flask import request
from flask_cors import CORS, cross_origin
from emotion_handler import recognize_emotion
from songs_recommendator import get_song

app = Flask(__name__)
CORS(app)

@app.route("/data.json", methods=["POST"])
def get_emotion():
    image_data = request.get_data()
    return recognize_emotion(image_data)


@app.route("/track/<string:mood>", methods=["GET"])
def get_track(mood):
    return get_song(mood)

if __name__ == "__main__":
    app.run(host="localhost", port=int("8081"))
