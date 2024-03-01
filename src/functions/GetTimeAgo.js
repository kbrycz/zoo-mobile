// Returns a string for the timestamp for time since the date
export const getTimestamp = (date) => {
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
        let num = Math.floor(interval)
        if (num === 1) {
            return num + " year";
        }
        return num + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        let num = Math.floor(interval)
        if (num === 1) {
            return num + " month";
        }
        return num + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        let num = Math.floor(interval)
        if (num === 1) {
            return num + " day";
        }
        return num + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        let num = Math.floor(interval)
        if (num === 1) {
            return num + " hour";
        }
        return num + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
        let num = Math.floor(interval)
        if (num === 1) {
            return num + " minute";
        }
        return num + " minutes";
    }
    let num = Math.floor(seconds)
    if (num === 1) {
        return num + " second";
    }
    return num + " seconds";
}

// Returns a tuple for the countdown until the date
export const getCountdownAsTuple = (date) => {
    var seconds = Math.floor((date - new Date()) / 1000);

    // Skip down to days
    var interval = seconds / 31536000;
    interval = seconds / 2592000;
    interval = seconds / 86400;

    if (interval > 1) {
        let num = Math.ceil(interval)
        if (num === 1) {
            return [num, "day"]
        }
        return [num, "days"]
    }
    
    interval = seconds / 3600;
    if (interval > 1) {
        let num = Math.floor(interval)
        if (num === 1) {
            return [num, "hour"]
        }
        return [num, "hours"]
    }
    else {
        let num = Math.floor(interval)
        return [num, "hour"]
    }
}

// Returns a tuple for the countdown until the date 
export const getCountdownShort = (date) => {
    if (new Date(date) <= new Date()) {
        return 'Now'
    }
    var seconds = Math.floor((new Date(date) - new Date()) / 1000);

    // Skip down to days
    var interval = seconds / 31536000;
    interval = seconds / 2592000;
    interval = seconds / 86400;

    if (interval > 1) {
        let num = Math.ceil(interval)
        return num + "d"
    }
    
    interval = seconds / 3600;
    if (interval > 1) {
        let num = Math.floor(interval)
        return num + "h"
    }
    else {
        let num = Math.floor(interval)
        return num + "h"
    }
}


// Returns a string for the timestamp since the date
export const getTimestampShort = (date) => {
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
        let num = Math.floor(interval)
        return num + "y";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        let num = Math.floor(interval)
        return num + "mos";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        let num = Math.floor(interval)
        return num + "d";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        let num = Math.floor(interval)
        return num + "h";
    }
    interval = seconds / 60;
    if (interval > 1) {
        let num = Math.floor(interval)
        return num + "m";
    }
    let num = Math.floor(seconds)
    return num + "s";
}
