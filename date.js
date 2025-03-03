const moment = require('moment-timezone');

class VDDateHelper {
    /**
     * Retrieves the current Date/Time in a Moment object or the desired format.
     *
     * @param {string} timezone Desired timezone for the Date/Time.
     * @param {string|null} format Desired format for the Date/Time output.
     *
     * @returns {*} Returns a Moment object if `format` is `null`, otherwise returns a formatted string.
     */
    static getNow(timezone, format = null) {
        let now = moment().tz(timezone);
        if(format) {
            return now.format(format);
        }

        return now;
    }
}

module.exports = VDDateHelper;