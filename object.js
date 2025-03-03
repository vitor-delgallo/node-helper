class VDObjectHelper {
    /**
     * Determines if a variable is an array.
     *
     * @param obj Variable to test.
     * @returns {boolean}
     */
    static isArray(obj) {
        return Array.isArray(obj);
    }

    /**
     * Determines if a variable is an object.
     *
     * @param obj Variable to test.
     * @returns {boolean}
     *
     * @ref https://stackoverflow.com/questions/4775722/how-to-check-if-an-object-is-an-array
     */
    static isObject(obj) {
        if(Array.isArray(obj) || obj === null) return false;
        return (typeof obj).toLowerCase() === "object";
    }

    /**
     * Determines if a variable is an array or an object.
     *
     * @param obj Variable to test.
     * @returns {boolean}
     *
     * @ref https://stackoverflow.com/questions/4775722/how-to-check-if-an-object-is-an-array
     */
    static isArrayOrObject(obj) {
        if(obj === null) return false;
        return (typeof obj).toLowerCase() === "object";
    }

    /**
     * Converts an array into an object.
     *
     * @param {Array} arr Array to be converted.
     * @return {Object|null}
     */
    static convertArrayToObject(arr) {
        if(this.isObject(arr)) {
            return arr;
        }

        if(this.isArray(arr)) {
            return Object.assign({}, arr);
        }
        return null;
    }

    /**
     * Creates a deep copy of an object or array.
     *
     * @param {Object|Array} obj Object to be copied.
     * @return {Object|Array}
     */
    static copyObject(obj) {
        if(obj === null) {
            return null;
        } else if(!this.isArrayOrObject(obj)) {
            return obj;
        }

        return JSON.parse(JSON.stringify(obj));
    }
}

module.exports = VDObjectHelper;