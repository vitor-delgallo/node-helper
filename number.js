const VDStringHelper = require('./string.js');

class VDNumberHelper {
    /**
     * Function getRandomInt.
     * Obtem um número randomico inteiro
     *
     * @param {int} min Valor minimo
     * @param {int|null|undefined} max Valor máximo
     * @returns {int} Valor randomico
     *
     * @ref https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Math/random
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
     * Function number_format.
     * Formata um decimal em JS equivalente ao number_format do PHP
     * @param {int|string} number Numero para ser formatado
     * @param {int} decimals Numero de casas decimais permitidas
     * @param {string} dec_point Separador de milhar
     * @param {string} thousands_sep Separador de decimais
     * @return {string} Número formatado
     *
     * @ref https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
     * @ref http://jsfiddle.net/drewnoakes/xc3qh35z/
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
     * Function onlyNumbers
     * Retorna apenas os numeros de uma string
     * @param {string|undefined|null} str para deixar apenas numeros
     * @return {string}
     *
     * https://stackoverflow.com/questions/185510/how-can-i-concatenate-regex-literals-in-javascript
     * https://stackoverflow.com/questions/4460595/jquery-filter-numbers-of-a-string
     */
    static onlyNumbers(str) {
        if(str === undefined || str === null) return "";
        return str.toString().replace(/[^0-9]/g, '').toString();
    }

    /**
     * Function isNegative.
     * Testa se existe o caracter de numero negativo
     * @param {string|int|float} str String para testar se existe o simbolo de negativo
     * @return {boolean}
     */
    static isNegative (str) {
        if(str === undefined || str === null) return false;
        return str.toString().trim().charAt(0) === "-";
    }

    /**
     * Function toInteger
     * Retorna um inteiro válido de acordo com uma string
     * @param {string|undefined|null} str para deixar apenas numeros
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
     * Function formatNumber.
     * Formata um número para o padrão desejado
     * @param {string|int|float|null|undefined} num Numero para ser formatado
     * @param {string|null|undefined} decimalSeparatorFrom Divisor de casas decimais do numero
     * @param {string|null|undefined} decimalSeparatorTo Divisor de casas decimais ao retornar o valor
     * @param {string|null|undefined} thousandSeparatorTo Define o separador de milhar caso tenha necessidade
     * @param {string|null|undefined} prefix Prefixo do numero (Ex: R$)
     * @param {string|null|undefined} suffix Sufixo do numero (Ex: %)
     * @param {int|null|undefined} decimalPlaces Numero de casas decimais permitidas depois da virgula
     *                                (NULL se não houver limite, 0 se apenas números inteiros forem permitidos)
     * @param {boolean|null|undefined} allowNegative Define se o numero pode ser negativo ou não
     * @return {string}
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