from flask import Flask
from flask import request
from emotion_handler import recognize_emotion

app = Flask(__name__)


@app.route("/data.json", methods=["POST"])
def get_emotion():
    image_data = request.get_data()
    return recognize_emotion(image_data)


if __name__ == "__main__":
    app.run(host="localhost", port=int("8081"))
