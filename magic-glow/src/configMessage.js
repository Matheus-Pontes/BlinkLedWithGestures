let configMessage = {
    error() {
        return {
            class: 'errorMessage',
            text: 'Desconectado/Sem conexão do servidor websocket',
        }
    },
    sucess() {
        return {
            class: 'sucessMessage',
            text: 'Conectado ao servidor websocket',
        }
    }
}

export default configMessage;
