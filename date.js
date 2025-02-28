const moment = require('moment-timezone');

class VDDateHelper {
    /**
     * Obtêm a Data/Hora de agora em objeto Moment ou no formato desejado
     *
     * @param {string} timezone Timezone desejado para obter a Data/Hora
     * @param {string|null} format Formato desejado para obter a Data/Hora
     *
     * @returns {*}
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