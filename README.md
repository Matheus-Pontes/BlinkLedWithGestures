# BlinkLedWithGestures
- Liga e desliga led no ESP8266 a partir de gestos na WEB
- Funcionamento: 
    - Ligar: Basta abrir a mão direita ou a esquerda as duas juntas ainda não funciona kkk
    - Desligar: Basta fechar a mão direita ou a esquerda as duas juntas ainda não funciona kkk

## Vídeo
- ![Video](/Video-blink-led-with-gestures2.gif)

## Para brincar
- Clone o projeto
- Rode o comando `npm install` na pasta `server` para as depências
- Para subir a página HTML rode ` node server/src/server.js`
- Coloque o código no ESP
    - Nele coloque os dados de sua rede
        - SSID, PASSWORD e IPlocal
    - Para o código será necessário uma biblioteca
        - [Lib ArduinoWebsockets](https://github.com/gilmaimon/ArduinoWebsockets/releases) baixe o .zip e coloque na sua IDE arduino 

## Referências
- [Gestos com as duas mãos pelo Erick Mendel](https://github.com/ErickWendel/fingerpose)
