#include <Arduino.h>
#include <ArduinoJson.h>
#include <Adafruit_VL53L0X.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <PubSubClient.h>
#include <SPI.h>
#include <Wire.h>

#include <ESP8266mDNS.h>
#include <WiFiUdp.h>
#include <ArduinoOTA.h>

#include <Servo.h>

#define SSID "Shaqib"
//#define SSID "Hotspot"
#define PASSWORD "12345678"

Servo servo_trash;

// Get the chipid
uint32_t chipId = ESP.getChipId();

// Enable Over the Air Upgrades
boolean enableOTA = true;

const char* mqttServer = "mr2j0vvhki1l0v.messaging.solace.cloud";
const int mqttPort = 20006;
const char* mqttUser = "solace-cloud-client";
const char* mqttPassword = "k8i4ud4otjpjmmutq02t929i40";

WiFiClient espClient;
PubSubClient client(espClient);

long lastMqttReconnectAttempt = 0;

const int ESP_BUILTIN_LED = 2;

unsigned long loopCounter = 0;

Adafruit_VL53L0X lox_trash = Adafruit_VL53L0X();

void ConnectToWifi()
{
  delay(100);
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.print(SSID);
  /* Explicitly set the ESP8266 to be a WiFi-client, otherwise, it by default,
  would try to act as both a client and an access-point and could cause
  network-issues with your other WiFi-devices on your WiFi-network. */
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  Serial.println("Begin connecting to wifi");
  //start connecting to WiFi
  WiFi.begin(SSID, PASSWORD);
  //while client is not connected to WiFi keep loading
  while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
  }
  Serial.println("");
  Serial.print("WiFi connected to ");
  Serial.println(SSID);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.println("");
}

// MQTT Callback
void callback(char* topic, byte* payload, unsigned int length) {

  // Make a copy of the payload
  byte message[length + 10];
  memcpy(message, payload, length);
  message[length] = '\0';

  // Make a copy of the topic
  char t[sizeof(topic) * 4];
  strncpy(t, topic, sizeof(topic) * 4);

  // Get topic name as string
  String topicString(t);

  if (topicString.startsWith("Trash"))
  {
    Serial.println("[INFO] Trash Motor Recieved Message");
    servo_trash.write(15);
    delay(5000);
    servo_trash.write(100);
    delay(1000);
  }
}

void setup() 
{
  // put your setup code here, to run once:
  Serial.begin(115200);
  Wire.begin();

  // ESP8266
  ConnectToWifi();

  // MQTT Setup
  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback);


  // TOF sensors
  // wait until serial port opens for native USB devices
  while (!Serial)
  {
  delay(1);
  }

  Serial.println("TOF Trash Sensor Start");
  if (!lox_trash.begin())
  {
  Serial.println(F("Failed to boot TOF Trash Sensor"));
  while(1);
  }

  servo_trash.attach(D4); //D4 - Trash
  servo_trash.write(100);

  delay(2000);
}

boolean mqttReconnect() {
  Serial.println("Connecting to MQTT...");
  char mqttClientId[40];
  sprintf(mqttClientId, "ESP8266Client%lu", chipId);

  if (client.connect(mqttClientId, mqttUser, mqttPassword, NULL, NULL, NULL, NULL, false )) {
    Serial.println("connected");
    // Subscribe to global drive commands
    // Subscription

    client.subscribe("Trash");
  } else {
    Serial.println("[ERROR] Not Connected");
  }
  return client.connected();
}

void loop() 
{
  VL53L0X_RangingMeasurementData_t trash_measure;
 
  Serial.print("Reading trash measurement... ");
  lox_trash.rangingTest(&trash_measure, false); // pass in 'true' to get debug data printout!
  
  if (trash_measure.RangeStatus != 4)
  { // phase failures have incorrect data
  Serial.print("Distance (mm): "); Serial.println(trash_measure.RangeMilliMeter);
  }
  else
  {
  Serial.println(" out of range ");
  }

  float trash_vol = 100.0 - ((trash_measure.RangeMilliMeter / 300.0) * 100.0);
  Serial.print("Trash volume (%): "); Serial.println(trash_vol);
  char trash_vol_string[6];
  sprintf(trash_vol_string, "%f", trash_vol);
  client.publish("DetritusAI/UofT/State/TrashVol", trash_vol_string);

  if ((loopCounter % 200 == 0) && !client.connected()) {
    long now = millis();
    if (now - lastMqttReconnectAttempt > 5000) {
      lastMqttReconnectAttempt = now;
      // Attempt to reconnect
      if (mqttReconnect()) {
        lastMqttReconnectAttempt = 0;
      }
    }
  } else {
    // Client connected
    client.loop();
  }

  // Check for OTA Updates
  if (enableOTA && (loopCounter % 20 == 0)) {
    ArduinoOTA.handle();
  }

  if (loopCounter >= 1000) {
    loopCounter = 0;
  }

  loopCounter++;
  
  delay(1000);
}