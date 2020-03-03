from solace import *
from path_planning import *

import cv2
import time
import numpy as np
import os

# from matplotlib import pyplot as plt

import tensorflow as tf
from tensorflow import keras
from keras.preprocessing import image



def identify_detritus(client):
    # Get a reference to webcam #0 (the default one)
    video_capture = cv2.VideoCapture(1)

    process_this_frame = True

    cv2.namedWindow("Video", cv2.WINDOW_NORMAL)
    # cv2.setWindowProperty("Video", cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)
    cv2.resizeWindow("Video", 500, 500)

    # Load the model
    path = os.path.join(os.getcwd(), 'trained_model.h5')
    model = tf.keras.models.load_model(path)

    last = video_capture.read()

    # Show the model architecture
    # model.summary()

    #remember how "hot" each category is over multiple trials
    cardboard = 0
    glass = 0
    metal = 0
    paper = 0
    plastic = 0
    trash = 0

    hits = [0,0,0,0,0,0]

    i = 0

    while i < 2:
        # Grab a single frame of video
        ret, frame = video_capture.read()
        last = frame

        # Only process every other frame of video to save time
        if process_this_frame:
            # Resize frame of video to 1/4 size for faster face recognition processing
            small_frame = cv2.resize(frame, (300, 300))
            # Predict what the image contains
            labels={0: 'cardboard', 1: 'glass', 2: 'metal', 3: 'paper', 4: 'plastic', 5: 'trash'}

            img = image.img_to_array(small_frame, dtype=np.uint8)
            img=np.array(img)/255.0
            plt.imshow(img.squeeze())

            p=model.predict(img[np.newaxis, ...])
            pro=np.max(p[0], axis=-1)
            # print("p.shape:",p.shape)
            # print("prob",pro)
            idx = np.argmax(p[0], axis=-1)
            predicted_class = labels[idx]
            hits[idx] += 1
            # print("classified label:",predicted_class)
            i += 1

        # Display the resulting image
        cv2.imshow('Video', frame)

        process_this_frame = not process_this_frame
        # Hit 'q' on the keyboard to quit!
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release handle to the webcam
    video_capture.release()
    cv2.destroyAllWindows()
    # print(cardboard, glass, metal, paper, plastic, trash)
    # for index, val in enumerate(hits):
        # print (labels[index], ': ', str(val))

    max_idx = np.argmax(hits)
    print("classified label:", labels[max_idx])
    if max_idx == 5 or max_idx == 4:
        client.publish('Trash', 'trash')
    else:
        client.publish('Recycling', labels[max_idx])




# If using websockets (protocol is ws or wss), must set the transport for the client as below
client = mqtt.Client(transport='websockets')

mqtt.Client.item_detected = False

client.on_connect = on_connect
client.on_message = on_message

# Required if using TLS endpoint (mqtts, wss, ssl), remove if using plaintext
# Use Mozilla's CA bundle
client.tls_set(ca_certs=certifi.where())

# Enter your password here
client.username_pw_set('solace-cloud-client', 'k8i4ud4otjpjmmutq02t929i40')

# Use the host and port from Solace Cloud without the protocol
# ex. "ssl://yoururl.messaging.solace.cloud:8883" becomes "yoururl.messaging.solace.cloud"
my_url = "mr2j0vvhki1l0v.messaging.solace.cloud"
client.connect(my_url, port=20009)
client.loop_start()
while True:
    client.item_detected = False
    # client.item_detected = True #REMOVE
    while client.item_detected != True:
        time.sleep(0.01)
        # print(client.item_detected)
    identify_detritus(client)
    path = find_shortest_path(client)
    time.sleep(8)
    client.item_detected = True