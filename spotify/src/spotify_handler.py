import spotipy
from random import randint

spotify = spotipy.Spotify()


def search_playlist(query, limit=10):
    all_playlists = spotify.search(query, type="playlist", limit=limit)["playlists"]["items"]
    playlist = all_playlists[randint(0, limit)]
    return playlist["external_urls"]["spotify"]
