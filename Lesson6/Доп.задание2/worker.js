const fs = require('fs');
const readline = require('readline');
const worker_threads = require('worker_threads');

const fullFilePath = worker_threads.workerData[0];
console.log(fullFilePath);
const stringToFind = worker_threads.workerData[1];
console.log(stringToFind);
const fileFrom = fs.createReadStream(
    fullFilePath,    
    {
        encoding: 'utf-8',
        flags: 'r'
    }
);
const rl = readline.createInterface({
    input: fileFrom
});

let findQuantity = 0;
rl.on('line', (line) => {
    if (line.includes(stringToFind)) {
        findQuantity++;
    }    
});
fileFrom.on('end', () => {
    worker_threads.parentPort.postMessage({
        result: `String "${stringToFind}" was found in file "${fullFilePath}" ${findQuantity} time(s)`
    });
    rl.close();
    fileFrom.close();
});
