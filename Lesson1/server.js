const colors = require('colors');

const minNumber = +process.argv[2];
const maxNumber = +process.argv[3];

if (isNaN(+minNumber)) {
    console.log(colors.red("minNumber is not number"));
    return;
}

if (isNaN(+maxNumber)) {
    console.log(colors.red("maxNumber is not number"));
    return;
}

if (minNumber >= maxNumber) {
    console.log(colors.red("minNumber should be less than maxNumber"));
    return;
}

const isSymple = (number) => {
    if (number < 2) return false;
    for (let i = 2; i < number; i++) {
        if (number % i == 0) return false;
    }
    return true;
}

const sympleArr = [];
for (let i = minNumber; i <= maxNumber; i++) {
    if (isSymple(i)) sympleArr.push(i);
}

if (!sympleArr.length) console.log(colors.red(`В диапазоне ${minNumber} - ${maxNumber} нет ни одного простого числа`));
else {
    sympleArr.forEach(el => {
        switch (sympleArr.indexOf(el) % 3) {
            case 0:
                console.log(colors.green(el));
                break;
            case 1:
                console.log(colors.yellow(el));
                break;
            case 2:
                console.log(colors.red(el));
                break;
            default:
                break;
        }
    });
}