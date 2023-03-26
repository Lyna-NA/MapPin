module.exports = class DataUtils {
    static addDays(days){
        return Date.now() + 3600 * 1000 * 24 * days;
    }

    static minutes(minutes){
        return Date.now() + 1000 * 60 * minutes;
    }
}