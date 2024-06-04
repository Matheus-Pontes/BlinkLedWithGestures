# Magic Glow
- Ligar e desligar um led a partir de gestos das mãos em um site. 
- Uma placa se conectara ao mesmo socket emitido pela página web 

# Funcionamento
- Abrindo uma das mãos, vai ser enviado um sinal para a placa, e assim o led conectado será ligado. 
- Fechando uma das mãos, vai ser enviado um sinal para a placa, e assim o led conectado será desligado. 
- Se, você deixou o led ligado ele ficará ligado, por um tempo e será desligado automáticamente.

## Tecnicamente
- Temos o front-end/magic-glow e servidor que faz a comunicação entre o front-end e a placa ESP8266, por meio do sistema de comunicação WEBSOCKET.

# Layout
- [Figma](https://www.figma.com/design/TdetFT9IVp8JG6JoOVgbrh/TCC---PROJETO?node-id=0%3A1&t=rATlx3Um8LG6Ty1J-1)

# Vídeo
- ![Video](/Video-blink-led-with-gestures2.gif)

# Tecnologias
- HTML5 / CSS3 / JS
- Arduino c++
- Web socket

# Circuito eletrônico
- Componentes:
    - LED
    - RESISTOR: 1K
    - Placa: ESP8266
- Conexão:
    ![IMAGEM-CONEXAO](/Conexao.png)

# Para se divertir
- Clone o projeto
- Rode o comando `npm install` na pasta `magic-glow` e `magic-glow-server` para as depências
- Para subir o front-end: `npm run dev`
- Para subir o backend: `node server.js`
- Coloque o código no ESP
    - Nele coloque os dados de sua rede
        - SSID 
            - Nome sua da rede wifi
        - PASSWORD
        - IPlocal
            - Abra o CMD ou em seu terminal de preferência, rode o comando `ipconfig`, será a linha IPV4
    - Para o código será necessário uma biblioteca
        - [Lib ArduinoWebsockets](https://github.com/gilmaimon/ArduinoWebsockets/releases) baixe o .zip e coloque na sua IDE arduino 

# Referências
- [Gestos com as duas mãos pelo Erick Mendel](https://github.com/ErickWendel/fingerpose)
