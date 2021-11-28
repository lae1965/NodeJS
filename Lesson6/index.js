const fs  = require('fs');
const http  = require('http');
const path  = require('path');
const socket  = require('socket.io');

class Connection {
    constructor(id, clientName) {
        this.id = id;
        this.clientName = clientName;
        this.connect = true;
    }
};

const connectionsList = [];

const server = http.createServer((req, res) => {
    const indexPath = path.join(__dirname, './index.html');
    const readStream = fs.createReadStream(indexPath, 'utf-8');

    readStream.pipe(res);
});

const io = socket(server);
io.on('connection', (client) => {
    io.emit('server-msg', {
        message: `A new client ${client.id} has connected`
    });

    client.on('disconnect', () =>{
        io.emit('server-msg', {
            message: `The client ${client.id} has disconnected`
        });
    });

    client.on('client-msg', (data) => {
        const payload = {
            message: data.message.split('').reverse().join('')
        };
        client.broadcast.emit('server-msg', payload);
        client.emit('server-msg', payload);
    });

    client.on('client-name', (clientName) => {
        const find = connectionsList.findIndex((connection) => {
            connection.clientName === clientName;
        });
        if (find === -1) {
            connectionsList.push(new Connection(client.id, clientName));
        } else {
            if (connectionsList[find].connect) 
        }
    });
});

server.listen(5555, () => console.log('Listen 5555 port'));
