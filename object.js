class VDObjectHelper {
    /**
     * Function isArray
     * Determina se uma variavel é um array
     *
     * @param obj Variavel para ser testada
     * @returns {boolean}
     */
    static isArray(obj) {
        return Array.isArray(obj);
    }

    /**
     * Function isObject
     * Determina se uma variavel é um objeto
     *
     * @param obj Variavel para ser testada
     * @returns {boolean}
     *
     * @ref https://stackoverflow.com/questions/4775722/how-to-check-if-an-object-is-an-array
     */
    static isObject(obj) {
        if(Array.isArray(obj) || obj === null) return false;
        return (typeof obj).toLowerCase() === "object";
    }

    /**
     * Function isArrayOrObject
     * Determina se uma variavel é um array ou um objeto
     *
     * @param obj Variavel para ser testada
     * @returns {boolean}
     *
     * @ref https://stackoverflow.com/questions/4775722/how-to-check-if-an-object-is-an-array
     */
    static isArrayOrObject(obj) {
        if(obj === null) return false;
        return (typeof obj).toLowerCase() === "object";
    }

    /**
     * Function convertArrayToObject
     * Converte um array para objeto
     *
     * @param {Array} arr Array para ser convertido
     *
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
     * Cria um novo objeto ou array sem referência do anterior
     *
     * @param {Object|Array} obj Objeto a ser copiado
     *
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