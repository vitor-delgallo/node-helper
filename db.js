const crypto = require('crypto');

class VDDBHelper {
    /**
     * Realiza tratativas contra SQL Injection para os parâmetros a serem inseridos no DB
     *
     * @param {string} str Parâmetro para realizar o escape
     * @returns {string|null}
     */
    static msEscapeString(str) {
        if (str === null || str === undefined) return null;
        if (typeof str === "number") return String(str);

        const nonDisplayables = [
            /%[0-8bcef]/g,   // URL encoded 00-08, 11, 12, 14, 15
            /%1[0-9a-f]/g,   // URL encoded 16-31
            /[\x00-\x08]/g,  // ASCII 00-08
            /\x0b/g,         // ASCII 11
            /\x0c/g,         // ASCII 12
            /[\x0e-\x1f]/g   // ASCII 14-31
        ];

        // Remove caracteres indesejados
        for (const regex of nonDisplayables) {
            str = String(str).replace(regex, '');
        }

        // Substitui caracteres de escape
        str = String(str).replace(new RegExp(`'`, 'g'), `''`);

        return str;
    }

    /**
     * Gera um GUID randomico
     *
     * @returns {string}
     */
    static generateGUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = crypto.randomBytes(1)[0] % 16; // Gera um número aleatório entre 0 e 15
            const v = c === 'x' ? r : (r & 0x3 | 0x8); // Ajusta para os valores válidos do UUID v4
            return v.toString(16);
        });
    }
}

module.exports = VDDBHelper;