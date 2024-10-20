#include <ArduinoWebsockets.h> // Baixar a biblioteca e adicionar na IDE do Arduino
#include <ESP8266WiFi.h> // Biblioteca para conexão WiFi no ESP8266
#define LED_PIN D2

const char* ssid = "**********";
const char* password = "***************";
const char* serverIP = "*************";
const int wsPort = 3000;

using namespace websockets;

WebsocketsClient client;

void connectWiFi() {
  Serial.print("Conectando ao WiFi...");
  WiFi.begin(ssid, password);
  
  unsigned long startAttemptTime = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < 10000) {
    Serial.print(".");
    delay(500);
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nConectado ao WiFi!");
  } else {
    Serial.println("\nFalha ao conectar ao WiFi.");
  }
}

void connectWebSocket() {
  if (client.connect(serverIP, wsPort, "/")) {
    Serial.println("Conectado ao servidor WebSocket!");
    client.send("Conectado ao servidor!");
  } else {
    Serial.println("Falha na conexão com o WebSocket.");
  }
}

void handleWebSocketMessage(WebsocketsMessage message) {
  String msg = message.data();
  int brightness = msg.toInt();

  // Verifica se o valor está no intervalo de 1 a 100
  if (brightness >= 1 && brightness <= 100) {
    // Mapeia o valor de 1-100 para 0-1023 para o controle de PWM
    int pwmValue = map(brightness, 1, 100, 0, 1023);
    analogWrite(LED_PIN, pwmValue);
    Serial.print("Luminosidade ajustada para: ");
    Serial.println(pwmValue);
  } else {
    Serial.println("Valor fora do intervalo (1-100)");
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  connectWiFi();
  
  if (WiFi.status() == WL_CONNECTED) {
    connectWebSocket();
    client.onMessage(handleWebSocketMessage);
  }
}

void loop() {
  if (client.available()) {
    client.poll();
  }
  delay(100); // Intervalo de polling
}
