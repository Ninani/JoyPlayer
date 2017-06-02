import cv2
import glob
import numpy as np

fishface = cv2.createFisherFaceRecognizer()
data = {}

def make_sets(emotions):
    training_data = []
    training_labels = []

    for emotion in emotions:
        training = glob.glob("./dataset/%s/*" % emotion)
        for item in training:
            image = cv2.imread(item)
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            training_data.append(gray)
            training_labels.append(emotions.index(emotion))

    return training_data, training_labels


def run_recognizer(emotions):
    training_data, training_labels = make_sets(emotions)

    print("training set size: " + str(len(training_labels)))
    fishface.train(training_data, np.asarray(training_labels))


def update(emotions):
    print("start retraining model")
    run_recognizer(emotions)
    fishface.save("./models/fishface_trained_classifier.xml")
    print("model updated!")