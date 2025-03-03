class VDGenericHelper {
    /**
     * Delays execution for a specified amount of time.
     *
     * @param {number} ms Time to wait in milliseconds.
     * @returns {Promise<void>} Resolves after the delay.
     */
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Retrieves the stack trace of an exception.
     *
     * @param {Error} error Exception to retrieve the stack trace from.
     * @returns {string} Stack trace or string representation of the error.
     */
    static returnStackTrace(error) {
        return error.stack || error.toString();
    }
}

module.exports = VDGenericHelper;