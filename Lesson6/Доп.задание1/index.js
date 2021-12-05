const fs = require('fs');
const path = require('path');
const http = require('http');
const socket = require('socket.io');


const server = http.createServer((req, res) => {
    let fullFilePath = path.join(process.cwd(), req.url);

    if (!fs.existsSync(fullFilePath)) return res.end(`File or directory ${fullFilePath} is not exist`);

    if (fs.lstatSync(fullFilePath).isFile()) return fs.createReadStream(fullFilePath, 'utf-8').pipe(res);

    const list = fs.readdirSync(fullFilePath);
    let dirList = '', fileList = '';
    let linkStr = req.url;
    const lastSlash = linkStr.lastIndexOf('/');
    if (lastSlash !== -1 && (lastSlash !== linkStr.indexOf('/') || lastSlash !== linkStr.length - 1)) {
        dirList += `<a href="${!lastSlash ? '/' : linkStr.slice(0, lastSlash)}" class="back-directory">. . /</a>`;
    }
    list.forEach((item) => {
        const isFile = fs.lstatSync(path.join(fullFilePath, item)).isFile();
        linkStr = `<a href="${path.join(req.url, item)}" class=${isFile ? "" : "directory"}>${item}</a>`;
        if (isFile) fileList += linkStr;
        else dirList += linkStr;
    });

    const data = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
    const insertPosition = data.search('</body>');
    const html = data.slice(0, insertPosition - 1) + dirList + fileList + data.slice(insertPosition);
    res.writeHead(200, {'Content-Type': 'text/html'});
    return res.end(html);
});

const io = socket(server);
let guestsNumber = 0;
io.on('connection', client => {
    io.emit('change-guests-number', ++guestsNumber);

    client.on('disconnect', () => {
        io.emit('change-guests-number', --guestsNumber);
    });
});

const port = 5555;
server.listen(port, () => {
    console.log(`Listen ${port} port`);
});
