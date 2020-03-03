from solace import *
import requests
import json

import cv2
import time
import numpy as np
import os

from matplotlib import pyplot as plt


def strip_html(html):
    i = 0
    str = ""
    while i < len(html):
        if html[i] == '<':
            while html[i] != '>':
                i += 1
        else:
            str += html[i]
        i += 1
    return str

def parse_json(data, start, end):
    dir_str = ""
    dir_str = dir_str + 'Begin at ' + start + '\n'
    waypoint_order = data["routes"][0]["waypoint_order"]
    directions = []
    for i in data["routes"][0]["legs"]:
        dir_str = dir_str + "Collect garbage at " + i["start_address"] + '\n'
        dir_str = dir_str + "Estimated time to next destination is " + i["duration"]["text"] + " (" + i["distance"]["text"] + ")\n"
        for j in i["steps"]:
            html_nav = j["html_instructions"]
            nav = strip_html(html_nav)
            newline_idx = nav.find('Destination will be')
            if newline_idx >= 0:
                new_nav = nav[:newline_idx - 1] + '\n' + nav[newline_idx:]
                dir_str = dir_str + new_nav + '\n'
            else:
                dir_str = dir_str + nav + '\n'
        dir_str = dir_str + '\n\n'

    dir_str = dir_str + 'Finish at ' + end + '\n'
    # print(dir_str)





# def parse_json(data, start, end):
#     dir_str = ""
#     dir_str = dir_str + 'Begin at ' + start + ';'
#     waypoint_order = data["routes"][0]["waypoint_order"]
#     directions = []
#     for i in data["routes"][0]["legs"]:
#         dir_str = dir_str + "Collect garbage at " + i["start_address"] + ';'
#         dir_str = dir_str + "Estimated time to next destination is " + i["duration"]["text"] + " (" + i["distance"]["text"] + ");"
#         for j in i["steps"]:
#             html_nav = j["html_instructions"]
#             nav = strip_html(html_nav)
#             newline_idx = nav.find('Destination will be')
#             if newline_idx >= 0:
#                 new_nav = nav[:newline_idx - 1] + ';' + nav[newline_idx:]
#                 dir_str = dir_str + new_nav + ';'
#             else:
#                 dir_str = dir_str + nav + ';'
#         dir_str = dir_str + '------------' + ';'

#     dir_str = dir_str + 'Finish at ' + end + ';'
#     # print(dir_str)





    return dir_str

def find_traffic(locations, URL, origin, destination):
    severity = ""
    waypoints = "optimize:true"
    for idx in locations:
        # print(locations[idx])
        waypoints = waypoints + '|via:' + locations[idx]
    # print(waypoints)
    key = 'AIzaSyB0PKakIGKL9F4veyAeaD4mIXl28CDxJ-U'
    PARAMS = {'origin': origin, 'destination': destination, 'waypoints': waypoints, 'departure_time': 'now','key': key}

    r = requests.get(url = URL, params = PARAMS) 
    data = r.json()
    # print(data)
    time_in_traffic = data["routes"][0]["legs"][0]["duration_in_traffic"]["value"]
    time_normal = data["routes"][0]["legs"][0]["duration"]["value"]
    time_in_traffic_str = data["routes"][0]["legs"][0]["duration_in_traffic"]["text"]
    traffic_severity = time_in_traffic/time_normal
    if traffic_severity > 1.1:
        if traffic_severity > 1.5:
            severity = "heavy"
        else:
            severity = "moderate"
    else:
        severity = "light"
    
    return time_in_traffic_str, severity

def find_shortest_path(client):
    locations = {0:'University of Toronto -  St. George Campus',1:'Yonge-Dundas Square'}
    URL = 'https://maps.googleapis.com/maps/api/directions/json'
    origin = 'Waste Management - Etobicoke Transfer Station'
    destination = 'Waste Management - Etobicoke Transfer Station'
    waypoints = "optimize:true"
    for idx in locations:
        # print(locations[idx])
        waypoints = waypoints + '|' + locations[idx]
    # print(waypoints)
    key = 'AIzaSyB0PKakIGKL9F4veyAeaD4mIXl28CDxJ-U'
    PARAMS = {'origin': origin, 'destination': destination, 'waypoints': waypoints, 'key': key}

    r = requests.get(url = URL, params = PARAMS) 
    data = r.json()
    directions = parse_json(data, origin, destination)
    client.publish('RoutePlanning', directions)
    traffic_time, severity = find_traffic(locations, URL, origin, destination)
    directions = directions + "Due to " + severity + " traffic, total trip may take " + traffic_time
    # print(directions)
    return directions

# # If using websockets (protocol is ws or wss), must set the transport for the client as below
# client =mqtt.Client(transport='websockets')

# client.on_connect = on_connect
# client.on_message = on_message

# # Required if using TLS endpoint (mqtts, wss, ssl), remove if using plaintext
# # Use Mozilla's CA bundle
# client.tls_set(ca_certs=certifi.where())

# # Enter your password here
# client.username_pw_set('solace-cloud-client', 'k8i4ud4otjpjmmutq02t929i40')

# # Use the host and port from Solace Cloud without the protocol
# # ex. "ssl://yoururl.messaging.solace.cloud:8883" becomes "yoururl.messaging.solace.cloud"
# my_url = "mr2j0vvhki1l0v.messaging.solace.cloud"
# client.connect(my_url, port=20009)
# client.loop_start()
# client.publish('Recycling', 'JHELLDDSLFKJLS')
# path = find_shortest_path(client)
# # publish_shortest_path(client, path)
