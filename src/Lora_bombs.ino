//Libraries for LoRa
#include <SPI.h>
#include <LoRa.h>
#include <WiFi.h>
extern "C" {
  #include "freertos/FreeRTOS.h"
  #include "freertos/timers.h"
}
#include <AsyncMqttClient.h>
#include <ArduinoJson.h>


#define WIFI_SSID "your wifi name"
#define WIFI_PASSWORD "your password"


// Raspberry Pi Mosquitto MQTT Broker
#define MQTT_HOST IPAddress(34, 175, 155, 40) 
// For a cloud MQTT broker, type the domain name
//#define MQTT_HOST "example.com"
#define MQTT_PORT 1883

// Temperature MQTT Topics
#define MQTT_PUB_DHT "esp32/dht/sensor"
#define MQTT_PUB_MOI "esp32/MoistureSensor/sensor"

//define the pins used by the LoRa transceiver module
#define SCK 5
#define MISO 19
#define MOSI 27
#define RST 14
#define DI0 26
#define SS 18

//433E6 for Asia
//866E6 for Europe
//915E6 for North America
#define BAND 868E6

//Initialize waterbomb pins
#define Bomb1 2
#define Bomb2 32
// Initialize variables to get and save LoRa data

String loRaMessage;
String temperature;
String temperature2;
String humidity;
String humidity2;
String hic;
String hic2;
String cappin1;
String cappin2;
String readingID;

AsyncMqttClient mqttClient;
TimerHandle_t mqttReconnectTimer;
TimerHandle_t wifiReconnectTimer;

unsigned long previousMillis = 0;   // Stores last time temperature was published
const long interval = 10000;        // Interval at which to publish sensor readings

void connectToWifi() {
  Serial.println("Connecting to Wi-Fi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
}

void connectToMqtt() {
  Serial.println("Connecting to MQTT...");
  mqttClient.connect();
}

void WiFiEvent(WiFiEvent_t event) {
  Serial.printf("[WiFi-event] event: %d\n", event);
  switch(event) {
    case SYSTEM_EVENT_STA_GOT_IP:
      Serial.println("WiFi connected");
      Serial.println("IP address: ");
      Serial.println(WiFi.localIP());
      connectToMqtt();
      break;
    case SYSTEM_EVENT_STA_DISCONNECTED:
      Serial.println("WiFi lost connection");
      xTimerStop(mqttReconnectTimer, 0); // ensure we don't reconnect to MQTT while reconnecting to Wi-Fi
      xTimerStart(wifiReconnectTimer, 0);
      break;
  }
}

void onMqttConnect(bool sessionPresent) {
  Serial.println("Connected to MQTT.");
  Serial.print("Session present: ");
  Serial.println(sessionPresent);
}

void onMqttDisconnect(AsyncMqttClientDisconnectReason reason) {
  Serial.println("Disconnected from MQTT.");
  if (WiFi.isConnected()) {
    xTimerStart(mqttReconnectTimer, 0);
  }
}

/*void onMqttSubscribe(uint16_t packetId, uint8_t qos) {
  Serial.println("Subscribe acknowledged.");
  Serial.print("  packetId: ");
  Serial.println(packetId);
  Serial.print("  qos: ");
  Serial.println(qos);
}
void onMqttUnsubscribe(uint16_t packetId) {
  Serial.println("Unsubscribe acknowledged.");
  Serial.print("  packetId: ");
  Serial.println(packetId);
}*/

void onMqttPublish(uint16_t packetId) {
  Serial.print("Publish acknowledged.");
  Serial.print("  packetId: ");
  Serial.println(packetId);
}


//Initialize LoRa module
void startLoRA(){
  int counter;
  //SPI LoRa pins
  SPI.begin(SCK, MISO, MOSI, SS);
  //setup LoRa transceiver module
  LoRa.setPins(SS,RST, DI0);

  while (!LoRa.begin(BAND) && counter < 10) {
    Serial.print(".");
    counter++;
    delay(500);
  }
  if (counter == 10) {
    // Increment readingID on every new reading
    Serial.println("Starting LoRa failed!"); 
  }
  Serial.println("LoRa Initialization OK!");
  delay(2000);
}

  void getLoRaData() {
  Serial.print("Lora packet received: ");
  // Read packet
  while (LoRa.available()) {
    String LoRaData = LoRa.readString();
    // LoRaData format: readingID/temperature&soilMoisture#batterylevel
    // String example: 1/27.43&654#95.34
    //Serial.print(LoRaData);
// Get readingID, temperature and soil moisture
    int pos1 = LoRaData.indexOf('/');
    int pos2 = LoRaData.indexOf('?');
    int pos3 = LoRaData.indexOf('&');
    int pos4 = LoRaData.indexOf('%');
    int pos5 = LoRaData.indexOf('#');
    int pos6 = LoRaData.indexOf('-');
    int pos7 = LoRaData.indexOf('!');
    int pos8 = LoRaData.indexOf('$');
    readingID = LoRaData.substring(0, pos1);
    temperature = LoRaData.substring(pos1 +1, pos2);
    temperature2 = LoRaData.substring(pos2+1, pos3);
    humidity = LoRaData.substring(pos3+1, pos4); 
    humidity2 = LoRaData.substring(pos4+1, pos5); 
    hic = LoRaData.substring(pos5+1, pos6); 
    hic2 = LoRaData.substring(pos6+1, pos7);
    cappin1 = LoRaData.substring(pos7+1, pos8); 
    cappin2 = LoRaData.substring(pos8+1, LoRaData.length()); 


  }
  }

  void activateBomb(){
  
    float x = ::atof(humidity.c_str());
    float x2 = ::atof(humidity.c_str());
    if(x<60){
      digitalWrite(Bomb1, HIGH);
      delay(5000);
      digitalWrite(Bomb1, LOW);
    }
    if(x2<60){
      digitalWrite(Bomb2, HIGH);
      delay(5000);
      digitalWrite(Bomb2, LOW);
    }

  }
  
 

  void setup() { 
  // Initialize Serial Monitor
  Serial.begin(115200);
  startLoRA();
  // Initialize water pumps
  pinMode(Bomb1, OUTPUT);
  pinMode(Bomb2, OUTPUT); 

  mqttReconnectTimer = xTimerCreate("mqttTimer", pdMS_TO_TICKS(2000), pdFALSE, (void*)0, reinterpret_cast<TimerCallbackFunction_t>(connectToMqtt));
  wifiReconnectTimer = xTimerCreate("wifiTimer", pdMS_TO_TICKS(2000), pdFALSE, (void*)0, reinterpret_cast<TimerCallbackFunction_t>(connectToWifi));

  WiFi.onEvent(WiFiEvent);

  mqttClient.onConnect(onMqttConnect);
  mqttClient.onDisconnect(onMqttDisconnect);
  //mqttClient.onSubscribe(onMqttSubscribe);
  //mqttClient.onUnsubscribe(onMqttUnsubscribe);
  mqttClient.onPublish(onMqttPublish);
  mqttClient.setServer(MQTT_HOST, MQTT_PORT);
  // If your broker requires authentication (username and password), set them below
  //mqttClient.setCredentials("REPlACE_WITH_YOUR_USER", "REPLACE_WITH_YOUR_PASSWORD");
  connectToWifi();

}
void loop() {
  // Check if there are LoRa packets available
  int packetSize = LoRa.parsePacket();
  if (packetSize) {
  getLoRaData();
  Serial.print("Humedad: ");
  Serial.print(humidity);
  Serial.print(" %\t");
  Serial.print("Temperatura: ");
  Serial.print(temperature);
  Serial.print(" *C ");
  Serial.print("Índice de calor sensor 1: ");
  Serial.print(hic);
  Serial.print(" *C \n");
  
  //Sensor 2
 Serial.print("Humedad: ");
 Serial.print(humidity2);
 Serial.print(" %\t2");
 Serial.print("Temperatura: ");
 Serial.print(temperature2);
 Serial.print(" *C ");
 Serial.print("Índice de calor sensor 2: ");
 Serial.print(hic2);
 Serial.print(" *C \n");
  }
 
  //activateBomb();

  unsigned long currentMillis = millis();
  // Every X number of seconds (interval = 10 seconds) 
  // it publishes a new MQTT message
  if (currentMillis - previousMillis >= interval) {
    // Save the last time a new reading was published
    previousMillis = currentMillis;
  

  // Compact data into JSON payload
  StaticJsonDocument<128> jsonDHT1;
  jsonDHT1["sensor"]=1;
  jsonDHT1["temperature"] = temperature;
  jsonDHT1["humidity"] = humidity;
  jsonDHT1["hic"] = hic;
  // Serialize JSON payload to a string
  String jsonStringDHT1;
  serializeJson(jsonDHT1, jsonStringDHT1);


   // Compact data into JSON payload
  StaticJsonDocument<128> jsonDHT2;
  jsonDHT2["sensor"]=3;
  jsonDHT2["temperature"] = temperature2;
  jsonDHT2["humidity"] = humidity2;
  jsonDHT2["hic"] = hic2;
  // Serialize JSON payload to a string
  String jsonStringDHT2;
  serializeJson(jsonDHT2, jsonStringDHT2);
  

  StaticJsonDocument<128> jsonCapacitivo1;
  jsonCapacitivo1["sensor"] = 2;
  jsonCapacitivo1["humidity"] = cappin1;
  
   String jsonStringMOI1;
  serializeJson(jsonCapacitivo1, jsonStringMOI1);


  StaticJsonDocument<128> jsonCapacitivo2;
  jsonCapacitivo2["sensor"] = 4;
  jsonCapacitivo2["humidity"] = cappin2;
  
   String jsonStringMOI2;
  serializeJson(jsonCapacitivo2, jsonStringMOI2);

    
    // Publish an MQTT message on topic esp32/dht/sensor
    uint16_t packetIdPub1 = mqttClient.publish(MQTT_PUB_DHT, 1, true, jsonStringDHT1.c_str());                            
    Serial.printf("Publishing on topic %s at QoS 1, packetId: %i ", MQTT_PUB_DHT, packetIdPub1);
    delay(3000);
     // Publish an MQTT message on topic esp32/dht/sensor
    uint16_t packetIdPub2 = mqttClient.publish(MQTT_PUB_DHT, 1, true, jsonStringDHT2.c_str());                            
    Serial.printf("Publishing on topic %s at QoS 1, packetId: %i ", MQTT_PUB_DHT, packetIdPub2);
    delay(3000);

      // Publish an MQTT message on topic esp32/MoistureSensor/sensor
    uint16_t packetIdPub3 = mqttClient.publish(MQTT_PUB_MOI, 1, true, jsonStringMOI1.c_str());                            
    Serial.printf("Publishing on topic %s at QoS 1, packetId: %i ", MQTT_PUB_MOI, packetIdPub3);
    delay(3000);
      // Publish an MQTT message on topic esp32/MoistureSensor/sensor
    uint16_t packetIdPub4 = mqttClient.publish(MQTT_PUB_MOI, 1, true, jsonStringMOI2.c_str());                            
    Serial.printf("Publishing on topic %s at QoS 1, packetId: %i ", MQTT_PUB_MOI, packetIdPub4);
    delay(3000);
    

  }
  
}
