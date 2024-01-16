const config = require('../config/config')

function getTime(returnType) { // 獲取時間
    let date = new Date();
    const UTCSecond = date.getUTCSeconds(),
        UTCMinute = date.getUTCMinutes(),
        UTCHour = date.getUTCHours(),
        UTCDay = date.getUTCDate(),
        UTCMonth = date.getUTCMonth() + 1,
        UTCYear = date.getUTCFullYear() // 將UTC(國際標準時間)宣告為常數
    let second, minute, hour, day, month, year;
    if (UTCHour + config.timezone >= 24) {
        hour = (UTCHour + config.timezone) - 24
        switch (UTCMonth) {
            case 1, 3, 5, 7, 8, 10, 12: // 大月
                if (UTCDay === 31) { // 若現在31日
                    month = UTCMonth + 1; // 月份加一
                    day = 1; // 天數設為1
                }
                else {
                    month = UTCMonth;
                    day = UTCMonth;
                }
                break;

            case 4, 6, 9, 11: // 除二月外的小月
                if (UTCDay === 30) { // 若現在30日
                    month = UTCMonth + 1; // 月份加一
                    day = 1; // 天數設為1
                }
                else {
                    month = UTCMonth;
                    day = UTCMonth;
                }
                break;

            case 2: // 二月
                if (UTCYear % 4 === 0) { // 閏年
                    if (UTCDay + 1 === 30) { // 若現在29日
                        month = UTCMonth + 1; // 月份加一
                        day = 1; // 天數設為1
                    }
                    else {
                        month = UTCMonth;
                        day = UTCMonth;
                    }
                } else { // 平年
                    if (UTCDay + 1 === 29) { // 若現在30日
                        month = UTCMonth + 1; // 月份加一
                        day = 1; // 天數設為1
                    }
                    else {
                        month = UTCMonth;
                        day = UTCMonth;
                    }
                }
                break
        }
        if (month === 13) {
            month = 1;
            year = UTCYear + 1
        }
    } else {
        year = UTCYear,
            month = UTCMonth,
            day = UTCDay,
            hour = UTCHour + config.timezone;
    }

    minute = UTCMinute,
        second = UTCSecond;

    let returnValue;
    switch (returnType) {
        case 0:
            returnValue = [year, month, day, hour, minute, second];
            break;
        case 1:
            returnValue = [
                `${year}`,
                month < 10 ? '0' + month : `${month}`,
                day < 10 ? '0' + day : `${day}`,
                hour < 10 ? '0' + hour : `${hour}`,
                minute < 10 ? '0' + minute : `${minute}`,
                second < 10 ? '0' + second : `${second}`
            ]
            break;
        case 2:
            returnValue = [
                `${year}`,
                `${month}`,
                `${day}`,
                `${hour}`,
                `${minute}`,
                `${second}`
            ]
            break
    }
    
    return returnValue
}

module.exports = {
    getTime
}