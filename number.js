const VDStringHelper = require('./string.js');

class VDNumberHelper {
    /**
     * Generates a random integer.
     *
     * @param {int} min Minimum value.
     * @param {int|null|undefined} max Maximum value.
     * @returns {int} Random integer.
     *
     * @ref https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
     */
    static getRandomInt(min, max) {
        if(VDStringHelper.isEmpty(max) && !VDStringHelper.isZero(max)) {
            min = 0;
        }
        min = Math.ceil(min);
        if(VDStringHelper.isEmpty(max) && !VDStringHelper.isZero(max)) {
            max = Number.MAX_SAFE_INTEGER;
        }
        max = Math.floor(max);

        if(min > max) {
            let aux = min;
            min = max;
            max = aux;
            aux = null;
        }

        return Math.floor(Math.random() * (max - min)) + min;
    }

    /**
     * Formats a decimal in JS similar to PHP's number_format.
     *
     * @param {int|string} number Number to be formatted.
     * @param {int} decimals Number of decimal places allowed.
     * @param {string} dec_point Decimal separator.
     * @param {string} thousands_sep Thousands separator.
     * @return {string} Formatted number.
     *
     * @ref https://stackoverflow.com/questions/2901102
     */
    static number_format(number, decimals, dec_point, thousands_sep) {
        if(VDStringHelper.isEmptyDecimal(number)) return "0";

        const n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            toFixedFix = function (n, prec) {
                // Fix for IE parseFloat(0.55).toFixed(0) = 0;
                const k = Math.pow(10, prec);
                return Math.round(n * k) / k;
            };
        let s = (prec ? toFixedFix(n, prec) : Math.round(n)).toString().split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec).toString();
    }

    /**
     * Extracts only numbers from a string.
     *
     * @param {string|undefined|null} str String to extract numbers from.
     * @return {string}
     */
    static onlyNumbers(str) {
        if(str === undefined || str === null) return "";
        return str.toString().replace(/[^0-9]/g, '').toString();
    }

    /**
     * Checks if a string has a negative number indicator.
     *
     * @param {string|int|float} str String to check for a negative symbol.
     * @return {boolean}
     */
    static isNegative (str) {
        if(str === undefined || str === null) return false;
        return str.toString().trim().charAt(0) === "-";
    }

    /**
     * Converts a string into a valid integer.
     *
     * @param {string|undefined|null} str String to extract numbers from.
     * @return {int}
     */
    static toInteger(str) {
        if(str === undefined || str === null) {
            str = "0";
        }

        let num = ("0" + str.toString().replace(/[^0-9]/g, '').toString()) * 1;
        if(this.isNegative(str)) {
            num *= -1;
        }

        return num;
    }

    /**
     * Formats a number according to the desired pattern.
     *
     * @param {string|int|float|null|undefined} num Number to be formatted.
     * @param {string|null|undefined} decimalSeparatorFrom Decimal separator of the input number.
     * @param {string|null|undefined} decimalSeparatorTo Decimal separator in the formatted output.
     * @param {string|null|undefined} thousandSeparatorTo Thousands separator if needed.
     * @param {string|null|undefined} prefix Number prefix (e.g., `$`, `R$`).
     * @param {string|null|undefined} suffix Number suffix (e.g., `%`).
     * @param {int|null|undefined} decimalPlaces Number of decimal places allowed after the separator.
     *                                (NULL if no limit, 0 if only integers are allowed)
     * @param {boolean|null|undefined} allowNegative Defines whether the number can be negative.
     * @return {string} Formatted number as a string.
     */
    static formatNumber (
        num, decimalSeparatorFrom, decimalSeparatorTo, thousandSeparatorTo,
        prefix, suffix,
        decimalPlaces, allowNegative
    ) {
        let ret = "";

        num = VDStringHelper.removeChrs(num, ('0123456789+-eE' + decimalSeparatorFrom), true);
        if (VDStringHelper.isEmpty(num)) {
            num = "0";
        }
        num = num.toString().toUpperCase();

        if(VDStringHelper.hasStr(num, "E")) {
            decimalSeparatorFrom = '.';
        } else {
            decimalSeparatorFrom = VDStringHelper.removeChrs(decimalSeparatorFrom, ('0123456789+-' + prefix + suffix), false);
            if (VDStringHelper.isEmpty(decimalSeparatorFrom)) {
                decimalSeparatorFrom = '.';
            }
        }

        decimalSeparatorTo = VDStringHelper.removeChrs(decimalSeparatorTo, ('0123456789+-' + prefix + suffix), false);
        if (VDStringHelper.isEmpty(decimalSeparatorTo)) {
            decimalSeparatorTo = '.';
        }
        thousandSeparatorTo = VDStringHelper.removeChrs(thousandSeparatorTo, ('0123456789+-' + prefix + suffix), false);
        if (VDStringHelper.isEmpty(thousandSeparatorTo) || thousandSeparatorTo === decimalSeparatorTo) {
            thousandSeparatorTo = "";
        }

        if (VDStringHelper.isEmpty(decimalPlaces) && decimalPlaces !== null) {
            decimalPlaces = 0;
        }
        if (VDStringHelper.isEmpty(prefix)) {
            prefix = "";
        }
        if (VDStringHelper.isEmpty(suffix)) {
            suffix = "";
        }

        let auxNum = num.split("E");
        if(auxNum.length > 1) {
            let eVal = parseFloat(auxNum[0].toString());
            let eMult = parseFloat(this.onlyNumbers(auxNum[1]).toString());
            let eNeg = this.isNegative(eVal);
            while(VDStringHelper.hasStr(eVal.toString(), decimalSeparatorFrom)) {
                eVal *= 10;
                eMult++;
            }
            if(decimalPlaces === null) {
                decimalPlaces = eMult;
            }

            eVal = VDStringHelper.pad(VDStringHelper.pad(eVal, eMult, "0", "L").substring(0, decimalPlaces), decimalPlaces, "0", "R");
            num = (eNeg ? "-" : "") + "0" + decimalSeparatorFrom + eVal;
            if(VDStringHelper.isEmpty(parseFloat(num))) {
                num = "0";
            }
            eVal = null;
            eMult = null;
            eNeg = null;
        }
        auxNum = null;

        let numSplit = num.split(decimalSeparatorFrom);
        if(numSplit.length > 1) {
            numSplit[1] = this.onlyNumbers(numSplit[1]);
        }
        if(this.isNegative(numSplit[0]) && allowNegative) ret += '-';
        numSplit[0] = this.onlyNumbers(numSplit[0]);
        ret += numSplit[0];

        if(decimalPlaces === null) {
            if(numSplit.length > 1) {
                decimalPlaces = numSplit[1].length;
            } else {
                decimalPlaces = 0;
            }
        }

        if (numSplit.length > 1 && decimalPlaces > 0) {
            ret +=
                decimalSeparatorTo +
                numSplit[1].substring(0, decimalPlaces);
        }

        ret = this.number_format(ret.split(decimalSeparatorTo).join("."), decimalPlaces, decimalSeparatorTo, thousandSeparatorTo);
        ret = prefix.trim() + " " + ret + " " + suffix.trim();
        return ret.trim();
    }
}

module.exports = VDNumberHelper;