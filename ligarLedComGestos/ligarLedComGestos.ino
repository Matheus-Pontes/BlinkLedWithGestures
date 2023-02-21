#include <ArduinoWebsockets.h> // baixar lib e adicionar na idle do arduino
#define led D2

const char* ssid = "ZTE-Matheus Rafa";
const char* pass = "matheusrafa";
const char* IP = "192.168.1.6";
const int wsPort = 3000; // porta que vai se conectar ao websocket sendo igual no arquivo server/server.js

using namespace websockets;

WebsocketsClient client;

void setup() {
  // put your setup code here, to run once:

  // Definindo buzzer como saída
  pinMode(led, OUTPUT);

  // Iniciando conexeção com o WIFI local  
  Serial.begin(115200);

  WiFi.begin(ssid, pass);

  while(WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }

  Serial.println("Conectado ao WIFI!!!");

  // Iniciando conexão ao websocket do NodeJs
  // Sendo o ESP8266 como cliente
  bool connected = client.connect(IP, wsPort, "/");

  if(connected) {
    Serial.println("Conectado ao server!");

    // Enviando ao servidor que está conectado
    client.send("Conectado ao server!");   
  } else {
    Serial.println("Sem conexão!");
    return;
  }

  // Se está conectado, vai esperar receber a mensagem
  client.onMessage([&](WebsocketsMessage message){

    // Escreve mensagem recebida no Serial do arduino
    Serial.print("Valor recebido: ");
    Serial.println(message.data());
   
    if(message.data().equalsIgnoreCase("0")) {
        digitalWrite(led, LOW);
    } 
    else if(message.data().equalsIgnoreCase("1")) {
      digitalWrite(led, HIGH);
    }
  });
}

void loop() {
  // put your main code here, to run repeatedly:

  // Avalia se recebeu a mensagem
  if(client.available()) {

    // captura a mensagem enviada que vai ser usada no setup()
    client.poll();
  } 

  delay(1);
}
