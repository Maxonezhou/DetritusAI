import certifi
import paho.mqtt.client as mqtt


# Callback on connection
def on_connect(client, userdata, flags, rc):
    print(f'Connected (Result: {rc})')

    # See: https://docs.solace.com/Open-APIs-Protocols/MQTT/MQTT-Topics.htm
    # client.subscribe('foo')
    # client.subscribe('Recycling')
    # client.subscribe('Trash')
    # client.subscribe('abc')
    client.subscribe('ObjDetect')
    client.publish('foo', payload='Connected')

# Callback when message is received
def on_message(client, userdata, msg):
    print("Object detected")
    client.item_detected = True
    # if {msg.topic} == 'ObjDetect':
    #     if {msg.payload} == 'True':
    #         print('Object detected')
    #         client.item_detected = True
    #     else:
    #         print('No object deteted')

    # else:
    #     print('Message received on topic: {msg.topic}. Message: {msg.payload}')
