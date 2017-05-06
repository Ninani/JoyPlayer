from flask import Flask
from spotify_handler import search_playlist

app = Flask(__name__)


@app.route("/api/spotify/playlist/<path:mood>", methods=["GET"])
def get_playlist(mood):
    return search_playlist(mood)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int("1234"))
