const fs = require('fs');
const readline = require('readline');

const ACCESS_LOG = './access.log';
const IP89 = '89.123.1.41';
const IP34 = '34.48.240.111';
const LIST89 = `${IP89}_requests.log`;
const LIST34 = `${IP34}_requests.log`;
const writeConfig = {
    encoding: 'utf-8',
    flags: 'a'
};

const fileFrom = fs.createReadStream(
    ACCESS_LOG,    
    {
        encoding: 'utf-8',
        flags: 'r'
    }
);
const fileTo89 = fs.createWriteStream(LIST89, writeConfig);
const fileTo34 = fs.createWriteStream(LIST34, writeConfig);

const rl = readline.createInterface({
    input: fileFrom,
    terminal: false
});

rl.on('line', (line) => {
    if (line.includes(IP89)) fileTo89.write(line + '\n');
    else if (line.includes(IP34)) fileTo34.write(line + '\n');
});
