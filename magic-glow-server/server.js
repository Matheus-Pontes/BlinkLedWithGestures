import { server } from "websocket";
import http from 'http';

const port = 3000;
let estadoLed;
const servidor = http.createServer();
const ws = new server({ httpServer: servidor });

ws.on('request', (request) => {
    
  let client = request.accept(null, request.origin);
  
  client.on('message', (message) => {
    //Se é uma mensagem string utf8
    if (message.type === 'utf8') {
        //Mostra no console a mensagem
        console.log("Enviando: ", message.utf8Data);
    }

    estadoLed = message.utf8Data;
  });
  
  setInterval(() => {
    if (estadoLed) {
      client.sendUTF(String(estadoLed));
    } else {
      client.sendUTF("0");
    }
  }, 1);
        
  client.on('message', () => {
    client.sendUTF("2");
  })
  
  client.on('close', () => {
    console.log("Conexão fechada.");
  });
});

servidor.listen(port, (res) => {
  console.log(`Servidor conectado na porta http://localhost:${port}`);
});