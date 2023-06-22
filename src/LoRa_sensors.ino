//Libraries for LoRa
#include <SPI.h>
#include <LoRa.h>

// Incluimos librería
#include <DHT.h>


//Incluimos librería de pantalla
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

//define the pins used by the LoRa transceiver module
#define SCK 5
#define MISO 19
#define MOSI 27
#define RST 14
#define DIO0 26
#define SS 18

// Definimos el pin digital donde se conecta el sensor
#define DHT1PIN 33
#define DHT2PIN 4
#define DHTTYPE DHT11
//medidas de control capacitivo
const int seco = 3500;
const int humedo = 1900;
#define CAPPIN1 35 
#define CAPPIN2 32 

//433E6 for Asia
//868E6 for Europe
//915E6 for North America
#define BAND 868E6

// Inicializamos el sensor DHT11
DHT dht1(DHT1PIN, DHTTYPE);
DHT dht2(DHT2PIN, DHTTYPE);

//Pantalla Oled
#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

//packet counter
int readingID = 0;
String LoRaMessage = "";
float temperature = 0;
float humidity = 0;
float temperature2 = 0;
float humidity2 = 0;
float hic = 0;
float hic2 = 0;
int humTierra1 =0;
int humTierra2=0;

//Initialize LoRa module
void startLoRA(){
  int counter;
  //SPI LoRa pins
 SPI.begin(SCK, MISO, MOSI, SS);
  //setup LoRa transceiver module
  LoRa.setPins(SS,RST,DIO0);

  while (!LoRa.begin(BAND) && counter < 10) {
    Serial.print(".");
    counter++;
    delay(500);
  }
  if (counter == 10) {
    // Increment readingID on every new reading
    readingID++;
    Serial.println("Starting LoRa failed!"); 
  }
  Serial.println("LoRa Initialization OK!");

  delay(2000);
}

void getReadings(){
  temperature = dht1.readTemperature();
  temperature2 = dht2.readTemperature();
  humidity2 = dht2.readHumidity();
  humidity = dht1.readHumidity();
  humTierra1 =  map (analogRead(CAPPIN1),humedo,seco,100,0);  // read the analog value from sensor
  humTierra2 =  map (analogRead(CAPPIN2),humedo,seco,100,0); // read the analog value from sensor
       // Calcular el índice de calor en grados centígrados
  hic = dht1.computeHeatIndex(temperature, humidity, false);
  hic2 = dht2.computeHeatIndex(temperature2, humidity2, false);
  Serial.println("readings");
  delay(10000);
}

  void setup() {
  Serial.print("entro setup");
  //initialize Serial Monitor
  Serial.begin(115200);
  startLoRA();
  dht1.begin();
  dht2.begin();
  // if(!myOLED.begin(SSD1306_128X64))
  //   while(1);   // In case the library failed to allocate enough RAM for the display buffer...

  // myOLED.setFont(SmallFont);
  // randomSeed(analogRead(0));

  
}

void loop() {
  Serial.print("entro loop");
  getReadings();
  sendReadings();
  delay(1000);

//Sensor 1
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

  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { // Address 0x3D for 128x64
    Serial.println(F("SSD1306 allocation failed"));
    for(;;);
  }
   display.clearDisplay();
  display.setTextSize(2);
  display.setTextColor(WHITE);
  display.setCursor(0, 10);
  // Display static text
  display.println("HOLA!");
  delay(2000);
  display.clearDisplay();
  display.setTextSize(2);
  display.setTextColor(WHITE);
  display.setCursor(0, 10);
  // Display static text
  display.println("H1: ");
  display.setCursor(30, 10);
  display.println((String)humidity);
  display.setCursor(0, 30);
  display.println("H2: ");
  display.setCursor(30, 30);
  display.println((String)humidity2);
  display.display(); 
  delay(5000);
  display.clearDisplay();
  display.setCursor(0, 10);
  display.println("T1: ");
  display.setCursor(40, 10);
  display.println((String)temperature);
  display.setCursor(0, 30);
  display.println("T2: ");
  display.setCursor(40, 30);
  display.println((String)temperature2);
  display.display(); 
    delay(5000);
  display.clearDisplay();
  display.setCursor(0, 10);
  display.println("Soil 1: ");
  display.setCursor(80, 10);
  display.println((String)humTierra1);
  display.setCursor(0, 30);
  display.println("Soil 2: ");
  display.setCursor(80, 30);
  display.println((String)humTierra2);
  display.display(); 
}  

  void sendReadings() {
  //LoRaMessage = "Prueba jijiji";
  LoRaMessage = String(readingID) + "/" + String(temperature) + "?" + String(temperature2) + "&" + String(humidity) + "%" + String(humidity2) + "#" + String(hic)+ "-" + String(hic2)+ "!" + String(humTierra1)+ "$" + String(humTierra2);
Serial.println('LoraMessage');
  //Send LoRa packet to receiver
  LoRa.beginPacket();
  LoRa.print(LoRaMessage);
  LoRa.endPacket();
  delay(10000);
  }



