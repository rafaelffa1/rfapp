import socketio from 'socket.io-client';
import { contexto } from '../service/app.service';

const socket = socketio(contexto, {
    autoConnect: false,
});

function subscribeTo(subscribe, func) {
    socket.on(subscribe, data => {
        func()
    });
}

function unsubscribe(subscribe) {
    socket.removeAllListeners(subscribe);
}

async function connect(usuario) {
    socket.io.opts.query = {
        usuario
    };
    await socket.connect();
}

function disconnect() {
    if (socket.connected) {
        // console.error('to disconectando');
    }
}

export {
    connect,
    disconnect,
    subscribeTo,
    unsubscribe
};