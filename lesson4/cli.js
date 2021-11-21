const fs = require('fs');
const path = require('path');
const readline = require('readline');
const inquirer = require('inquirer');
const yargs = require('yargs');

const options = yargs
    .usage('Usage: -p <path> to file')
    .option('p', {
        alias: 'path',
        describe: 'Path to the file',
        type: 'string',
        demandOption: false,
    }).argv;
try {
    if (!!options.p) process.chdir(path.resolve(__dirname, options.p));    
} catch(err) {
    console.log(err);
    return;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let stringToFind;

const question = (query) => new Promise(resolve => rl.question(query, resolve));
(async () => {
    stringToFind = await question('Please enter the string you need to find:\n');
    rl.close();
    navFunc();
})();

const findStringInFile = async (fullFilePath) => {
    const fileFrom = fs.createReadStream(
        fullFilePath,    
        {
            encoding: 'utf-8',
            flags: 'r'
        }
    );
    const rr = readline.createInterface({
        input: fileFrom
    });
    
    let findQuantity = 0;
    rr.on('line', (line) => {
        if (line.includes(stringToFind)) {
            findQuantity++;
        }    
    });
    fileFrom.on('end', () => {
        console.log(`String "${stringToFind}" was found in file "${fullFilePath}" ${findQuantity} time(s)`);
        rr.close();
        fileFrom.close();
    });
}

const navFunc = async () => {
    const executionDir = process.cwd();

    const list = fs.readdirSync('./');
    await inquirer.prompt([
        {
            name: 'fileName',
            type: 'list', 
            message: 'Choose a file to find:',
            choices: list,
        },
    ]).then(async ({ fileName }) => {
        const fullFilePath = path.join(executionDir, fileName);
        if (!fs.lstatSync(fullFilePath).isFile()) { 
            process.chdir(fileName);
            navFunc(); 
        } else {
            await findStringInFile(fullFilePath);
        }
    }).catch((err) => {
        console.log(err);
    });
};