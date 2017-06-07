import random

moods = ['anger', 'disgust', 'happy', 'neutral', 'sad', 'surprise']
moodsongs = {}
for mood in moods:
    with open('songs/%s.txt' % mood) as moodfile:
        moodsongs[mood] = moodfile.read().split('\n')


def get_song(moodname):
    return random.choice(moodsongs[moodname] if moodname in moods else moodsongs['neutral'])
