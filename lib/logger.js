const fs = require('fs');
const { getTime } = require('./mainLib')
const config = require('../config/config')

if (!fs.existsSync('./logs')) fs.mkdirSync('./logs');

let logTime = getTime(1)
fs.appendFileSync(`${process.cwd()}/logs/${logTime[0]}-${logTime[1]}-${logTime[2]}_${logTime[3]}-${logTime[4]}-${logTime[5]}.log.txt`, [
    '// 記錄檔',
    '',
    `此記錄檔於 西元${logTime[0]}年${logTime[1]}月${logTime[2]}日 ${logTime[3]}時${logTime[4]}分${logTime[5]}秒 產生`,
    '',
    '=============== 記錄檔起始點 ===============',
    ''
].join('\n'))

function writeLogFile(type, content) {
    let nowTime = getTime(1)
    switch (type) {
        case 1: // INFO
            fs.appendFileSync(`${process.cwd()}/logs/${logTime[0]}-${logTime[1]}-${logTime[2]}_${logTime[3]}-${logTime[4]}-${logTime[5]}.log.txt`, `[${nowTime[0]}/${nowTime[1]}/${nowTime[2]}] [${nowTime[3]}:${nowTime[4]}:${nowTime[5]} INFO]: ${typeof content === String ? content.replace(/\x1b[[].{1,2}m/g, '') : String(content)}\n`)
            break
        case 2: // WARN
            fs.appendFileSync(`${process.cwd()}/logs/${logTime[0]}-${logTime[1]}-${logTime[2]}_${logTime[3]}-${logTime[4]}-${logTime[5]}.log.txt`, `[${nowTime[0]}/${nowTime[1]}/${nowTime[2]}] [${nowTime[3]}:${nowTime[4]}:${nowTime[5]} WARN]: ${typeof content === String ? content.replace(/\x1b[[].{1,2}m/g, '') : String(content)}\n`)
            break
        case 3: // ERROR
            fs.appendFileSync(`${process.cwd()}/logs/${logTime[0]}-${logTime[1]}-${logTime[2]}_${logTime[3]}-${logTime[4]}-${logTime[5]}.log.txt`, `[${nowTime[0]}/${nowTime[1]}/${nowTime[2]}] [${nowTime[3]}:${nowTime[4]}:${nowTime[5]} ERROR]: ${typeof content === String ? content.replace(/\x1b[[].{1,2}m/g, '') : String(content)}\n`)
            break
        case 4: // 僅限報錯訊息使用
            fs.appendFileSync(`${process.cwd()}/logs/${logTime[0]}-${logTime[1]}-${logTime[2]}_${logTime[3]}-${logTime[4]}-${logTime[5]}.log.txt`, typeof content === String ? content.replace(/\x1b[[].{1,2}m/g, '') : content.stack + '\n')
        }
}

const originalConsoleLog = console.log
console.log = function (...args) {
    let nowTime = getTime(1)
    let returnValue = `\x1b[0m[${nowTime[3]}:${nowTime[4]}:${nowTime[5]} \x1b[94mINFO\x1b[0m]: ${args.join(' ')}`.replace(/\n/g, `\n\x1b[0m[${nowTime[3]}:${nowTime[4]}:${nowTime[5]} \x1b[94mINFO\x1b[0m]: `);
    originalConsoleLog(returnValue)
    writeLogFile(1, args.join(' ') + '\n')
}


const originalConsoleInfo = console.info
console.info = function (...args) {
    let nowTime = getTime(1)
    let returnValue = `\x1b[0m[${nowTime[3]}:${nowTime[4]}:${nowTime[5]} \x1b[94mINFO\x1b[0m]: ${args.join(' ')}`.replace(/\n/g, `\n\x1b[0m[${nowTime[3]}:${nowTime[4]}:${nowTime[5]} \x1b[94mINFO\x1b[0m]: `);
    originalConsoleInfo(returnValue)
    writeLogFile(1, args.join(' '))
}

const originalConsoleWarn = console.warn
console.warn = function (...args) {
    let nowTime = getTime(1)
    let returnValue = `\x1b[93m[${nowTime[3]}:${nowTime[4]}:${nowTime[5]} WARN]: ${args.join(' ')}\x1b[0m`.replace(/\n/g, `\n\x1b[93m[${nowTime[3]}:${nowTime[4]}:${nowTime[5]} WARN]: `);
    originalConsoleWarn(returnValue)
    writeLogFile(2, args.join(' '))
}

const originalConsoleError = console.error
console.error = function (...args) {
    let nowTime = getTime(1)
    let returnValue = `\x1b[31m[${nowTime[3]}:${nowTime[4]}:${nowTime[5]} ERROR]: \x1b[0m`.replace(/\n/g, `\n\x1b[31m[${nowTime[3]}:${nowTime[4]}:${nowTime[5]} ERROR]: \x1b[0m`);
    originalConsoleError(returnValue)
    originalConsoleError(...args)
    writeLogFile(3, '')
    writeLogFile(4, ...args)
}

const originalConsoleDebug = console.debug
console.debug = function (...args) {
    let nowTime = getTime(1)
    let returnValue = `[${nowTime[3]}:${nowTime[4]}:${nowTime[5]} \x1b[92mDEBUG\x1b[0m]: `
    originalConsoleDebug(returnValue)
    originalConsoleDebug(...args)
}