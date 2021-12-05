const fs = require('fs');
const http = require('http');
const path = require('path');
const socket = require('socket.io');

class Connection {
    constructor(id, clientName) {
        this.id = id,
        this.clientName = clientName,
        this.connect = true
    }
    get getConnect() {
        return this.connect;
    }
    get getClientName() {
        return this.clientName;
    }
    get getId() {
        return this.id;
    }
    set setConnect(connect) {
        this.connect = connect;
    }
    set setId(id) {
        this.id = id;
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

    client.on('disconnect', () => {
        const find = connectionsList.findIndex(connection => connection.getId === client.id);
        if (find !== -1) {
            connectionsList[find].setConnect = false;
            io.emit('server-msg', {
                clientName: 'Server',
                message: `The client ${connectionsList[find].getClientName} has disconnected`
            });
        }
    });
 
    client.on('client-name', clientName => {
        const find = connectionsList.findIndex(connection => connection.getClientName === clientName);
        if (find === -1) {
            connectionsList.push(new Connection(client.id, clientName));
            client.broadcast.emit('server-msg', {
                clientName: 'Server',
                message: `A new client ${clientName} has connected`
            });
        } else {
            if (connectionsList[find].getConnect) {
                client.emit('name-already-exist');
            } else {
                connectionsList[find].setConnect = true;
                connectionsList[find].setId = client.id;
                client.broadcast.emit('server-msg', {
                    clientName: 'Server',
                    message: `The client ${clientName} has reconnected`
                });
            }
        }
    });

    client.on('client-msg', (data) => {
        const payload = {
            clientName: (connectionsList.find(connection => 
                connection.getId === client.id)).getClientName,
            message: data.message.split('').reverse().join('')
        };
        client.broadcast.emit('server-msg', payload);
    });
});

server.listen(5555, () => console.log('Listen 5555 port'));
