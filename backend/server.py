from flask import Flask
from flask import request
from flask_cors import CORS, cross_origin
from emotion_handler import recognize_emotion

app = Flask(__name__)
CORS(app)

@app.route("/data.json", methods=["POST"])
def get_emotion():
    image_data = request.get_data()
    return recognize_emotion(image_data)


@app.route("/track/<string:mood>", methods=["GET"])
def get_track(mood):
    if mood == "happy":
        return "6NPVjNh8Jhru9xOmyQigds"
    elif mood == "sadness":
        return "5Q30xdABnojqN3wBIhrsQp"
    elif mood == "anger":
        return "1sV6neOqXX4jglsFUz6QX9"
    elif mood == "neutral":
        return "2w9w4X0qTu81r4jJ1afU8E"

if __name__ == "__main__":
    app.run(host="localhost", port=int("8081"))
