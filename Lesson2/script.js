// Задание по промисам: 1 5 6 2 3 4


const moment = require("moment");
const EventEmitter = require('events');

const emitter = new EventEmitter();

class Timer {
    constructor(timerString) {
        [this.hour, this.day, this.month, this.year] = timerString.split('-');
    }
};


const calculateTimeToDate = ({ hour, day, month, year}) => {
    const curDate = moment();
    const nextDate = moment(`${year}-${month}-${day} ${hour}`);
    let diffDate = Math.floor(nextDate.diff(curDate) / 1000);       // В секундах
    if (diffDate <= 0) return null;
    const seconds = diffDate % 60;
    diffDate = Math.floor(diffDate / 60);                           // В минутах
    const minutes = diffDate % 60;
    diffDate = Math.floor(diffDate / 60);                           // В часах
    const hours = diffDate % 24;
    diffDate = Math.floor(diffDate / 24);                           // В сутках
    
    const curMonth = curDate.format('MM');
    const curYear = curDate.format('YYYY');
    let daysInMonth = moment(`${curMonth} ${curYear}`, 'MM YYYY').daysInMonth();
    let days = daysInMonth - curDate.format('DD');                  // Остаток дней текущего месяца
    if (days > diffDate) days = diffDate;
    let months = 0, years = 0;
    let finish = false;
    
    if (diffDate <= days) return ({years, months, days, hours, minutes, seconds});

    diffDate -= days;    
    
    let monthIndex;    
    do {                                                        // Обрабатываем оставшиеся месяцы в текущем году
        monthIndex = +curMonth + months + 1;
        daysInMonth = moment(`${monthIndex} ${curYear}`, 'M YYYY').daysInMonth();
        if (diffDate < daysInMonth) {
            finish = true;
            break;
        }    
        diffDate -= daysInMonth;
        months++;
    } while (monthIndex < 12);
    
    for (let i = +curDate.format('YYYY') + 1; i < +year; i++) {  // Обрабатываем целые года
        years++;
        diffDate -= 365 + +moment([i]).isLeapYear();
    } 
    
    let lastMonths = 0;
    while (!finish) {                                            // Обрабатываем последний год
        daysInMonth = moment(`${lastMonths + 1} ${year}`, 'M YYYY').daysInMonth();
        if (diffDate < daysInMonth) break;
        diffDate -= daysInMonth;
        lastMonths++;
    }
    
    days += diffDate; 
    if (days >= daysInMonth) {
        months++;
        days -= daysInMonth;
    }
    
    months += lastMonths;
    if (months > 12) {
        years++;
        months -= 12;
    }
    return ({years, months, days, hours, minutes, seconds});
}
if (!arguments?.length) {
    console.log('Укажите хотя бы один аргумент в формате HH-DD-MM-YYYY');
    return;
}

arguments = process.argv.slice(2);

const timers = [];

arguments.forEach((timerString) => {
    if (moment(timerString, 'HH-DD-MM-YYYY').isValid()) timers.push(new Timer(timerString));
    else console.log('Аргумент №', arguments.indexOf(timerString) + 1, 'имеет неверный формат');
});

if (!timers.length) {
    console.log("Все переданные аргументы имеют неверный формат!!!");
    console.log('Укажите хотя бы один аргумент в формате HH-DD-MM-YYYY');
}

let timersTable;
const calculateTimers = () => {
    timersTable = [];
    for (let i = 0; i < timers.length; i++) {
        const result = calculateTimeToDate(timers[i]);
        if (result === null) emitter.emit('timerEmpty');
        else timersTable.push(calculateTimeToDate(timers[i]));
    }
    console.log('\x1Bc');
    console.table(timersTable);
}

const run = async () => {
    emitter.emit('newCalculate');

    await new Promise(resolve => setTimeout(resolve, 1000));
}

const runInCycle = async () => {
    while (1) {
        await run();
    }
}

emitter.on('newCalculate', calculateTimers);
emitter.on('timerEmpty', () => {
    timersTable.push({years: 'Timer is empty'});
});

runInCycle();


