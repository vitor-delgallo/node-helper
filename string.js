const VDObjectHelper = require('./object.js');

class VDStringHelper {
    /**
     * Function isZero.
     * Testa se uma variavel está zerada
     *
     * @param {any} thing variavel para testar
     * @returns {boolean}
     */
    static isZero(thing) {
        try{
            if((typeof thing) === "string" && thing.trim() === "") {
                return false;
            }

            thing = thing.toString() * 1;
            if(thing === 0) {
                return true;
            }
        } catch (e) { }

        return false;
    }

    /**
     * Function isEmpty.
     * Testa se uma variavel é vazia, testando todos os possiveis casos
     *
     * @param {any} thing variavel para testar
     * @returns {boolean}
     */
    static isEmpty(thing) {
        if(
            thing === null ||
            thing === false ||
            thing === undefined
        ) {
            return true;
        } else if(VDObjectHelper.isArrayOrObject(thing)){
            if(thing?.length === undefined) {
                let hasEntered = false;
                for (const prop in thing) {
                    hasEntered = true;
                    if (Object.hasOwn(thing, prop)) {
                        return false;
                    }
                }

                if(!hasEntered) {
                    return true;
                }
            }

            return thing.length === 0;
        }

        try{
            thing = thing.toString().trim().toLowerCase();
            if(
                thing === "" || thing === "false" ||
                thing === "null" || thing === "undefined" ||
                thing === "nan"
            ) {
                return true;
            }
        } catch (e) { }

        return this.isZero(thing);
    }

    /**
     * Function isEmptyDecimal.
     * Testa se uma variavel é vazia, ou vazia como float, testando todos os possiveis casos
     *
     * @param {any} thing variavel para testar
     * @returns {boolean}
     */
    static isEmptyDecimal(thing) {
        try{
            return this.isEmpty(parseFloat(thing));
        } catch(e) { }

        return this.isEmpty(thing);
    }

    /**
     * Function isEmptyInteger.
     * Testa se uma variavel é vazia, ou vazia como integer, testando todos os possiveis casos
     *
     * @param {any} thing variavel para testar
     * @returns {boolean}
     */
    static isEmptyInteger(thing) {
        try{
            return this.isEmpty(parseInt(thing));
        } catch(e) { }

        return this.isEmpty(thing);
    }

    /**
     * Function isEmptyExceptZero.
     * Testa se uma variavel é vazia, testando todos os possiveis casos, mas caso a string esteja zerada,
     * não considera vazio
     *
     * @param {any} thing váriavel para testar
     * @returns {boolean}
     */
    static isEmptyExceptZero(thing) {
        return this.isEmpty(thing) && !this.isZero(thing);
    }

    /**
     * Function hasStr.
     * Diz se há uma palavra em uma string
     * @param {string} str String para realizar o search
     * @param {string} find String para encontrar no primeiro parametro
     * @returns {boolean}
     */
    static hasStr(str, find){
        return str.toString().indexOf(find) !== -1;
    }

    /**
     * Function removeStrings.
     * Remove todas as strings da string principal e retorna o valor
     * @param {string|null} str String para remoção dos caracteres
     * @param {string[]} strsRemove Array de strings para remover
     * @return {string}
     */
    static removeStrings(str, strsRemove) {
        if (this.isEmpty(strsRemove)) return str;
        if (this.isEmpty(str) && !this.isZero(str)) return "";
        str = str.toString();

        for (const strRemove of strsRemove) {
            str = str.split(strRemove).join("");
        }

        return str;
    }

    /**
     * Function removeChrsNotIn.
     * Remove todos caracteres da string que não estiverem nos chars enviados
     * @param {string|null} str String para remoção dos caracteres
     * @param {string[]} notIn Caracters para ignorar
     * @return {string}
     */
    static removeChrsNotIn(str, notIn) {
        if (this.isEmpty(notIn)) return str;
        if (this.isEmpty(str) && !this.isZero(str)) return "";
        str = str.toString();

        return Array.from(str).filter(char => notIn.includes(char)).join('');
    }

    /**
     * Function removeChrs.
     * Remove todos os chars da string principal e retorna o valor
     * @param {string|null} str String para remoção dos caracteres
     * @param {string} chs Caracters para remover
     * @param {boolean|undefined|null} notIn Define que irá remover todos os chars que não estiverem na lista
     * @return {string}
     */
    static removeChrs(str, chs, notIn) {
        if (this.isEmpty(chs)) chs = "";
        if (str === null) return "";

        if (!this.isEmpty(notIn)) {
            return this.removeChrsNotIn(str, Array.from(chs));
        }
        return this.removeStrings(str, Array.from(chs));
    }

    /**
     * Function pad.
     * Realiza um PAD de strings
     * @param {string|int|float} str String para ser realizado o PAD
     * @param {int} width Tamanho do PAD
     * @param {string|int|null|undefined} padStr String PAD para concatenar na string principal
     * @param {string|null|undefined} padType Define o tipo do PAD ("L" - LEFT [Esquerda], "R" - RIGHT [Direita])
     * @returns {string}
     *
     * @ref https://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
     */
    static pad(str, width, padStr, padType) {
        if(this.isEmpty(str)) {
            str =  "";
        }
        if(this.isEmpty(padStr)) {
            padStr =  "0";
        }
        if(this.isEmpty(padType) || (padType.toUpperCase() !== "L" && padType.toUpperCase() !== "R")) {
            padType =  "L";
        }
        str = str.toString();
        padType = padType.toUpperCase();

        let ret = str;
        if(str.length < width) {
            ret = new Array(width - str.length + 1).join(padStr);
            switch (padType) {
                case "L":
                    ret = ret + str;
                    break;
                case "R":
                    ret = str + ret;
                    break;
            }
        }

        return ret;
    }

    /**
     * Function removeMultipleSpaces
     * Remove multiplos espaços de uma string para apenas 1
     * @param {string} str Texto a ser manipulado
     * @returns {string}
     *
     * @ref https://stackoverflow.com/questions/3286874/remove-all-multiple-spaces-in-javascript-and-replace-with-single-space
     */
    static removeMultipleSpaces(str) {
        return str.replace(/ +(?= )/g,'');
    }

    /**
     * Function removeAccents
     * Remove todos os acentos de uma string
     * @param {string} str Texto a ser manipulado
     * @returns {string}
     *
     * @ref https://metring.com.br/javascript-substituir-caracteres-especiais
     */
    static removeAccents(str) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    }

    /**
     * Function removeSpecials
     * Remove todos os caracteres especiais de uma string
     * @param {string} str Texto a ser manipulado
     * @returns {string}
     *
     * @ref https://metring.com.br/javascript-substituir-caracteres-especiais
     */
    static removeSpecials(str) {
        return str.normalize('NFD').replace(/(\W+|\s+)/g, '-') // Substitui espaço e outros caracteres por hífen
            .replace(/--+/g, '-')	// Substitui multiplos hífens por um único hífen
            .replace(/(^-+|-+$)/, '') // Remove hífens extras do final ou do inicio da string
            .replace(/-+/g, ''); //Remove todos os hífens
    }

    /**
     * Embaralha uma string
     *
     * @param {string} str Texto a ser embaralhado
     *
     * @return {string}
     */
    static stringShuffle(str) {
        if(this.isEmptyExceptZero(str)) {
            str = "";
        }
        return str.split('').sort(() => 0.5 - Math.random()).join('');
    }

    /**
     * Gera uma senha aleatória
     *
     * @param {null|int} len Tamanho da senha
     * @param {null|int} minUpperCase Minímo de caracteres maíusculos para gerar a senha
     * @param {null|int} minLowerCase Minímo de caracteres minúsculos para gerar a senha
     * @param {null|int} minSpecialChars Minímo de caracteres especiais para gerar a senha
     * @param {null|int} minNumbers Minímo de caracteres numéricos para gerar a senha
     * @return {string}
     */
    static generateRandomPassword(len = null, minUpperCase = null, minLowerCase = null, minSpecialChars = null, minNumbers = null) {
        if (this.isEmpty(len) || len <= 0) {
            len = 16;
        }
        if (this.isEmptyExceptZero(minUpperCase)) {
            minUpperCase = 2;
        }
        if (this.isEmptyExceptZero(minLowerCase)) {
            minLowerCase = 2;
        }
        if (this.isEmptyExceptZero(minSpecialChars)) {
            minSpecialChars = 2;
        }
        if (this.isEmptyExceptZero(minNumbers)) {
            minNumbers = 2;
        }

        const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
        const specialChars = "$#%!@*&()-_+={}[]^~,.<>;";
        const numberChars = "0123456789";
        const addCharsFromSet = (charSet, count) => {
            return new Array(count).fill(0).map(() => charSet[(Math.floor(Math.random() * (charSet.length - 1)))]).join('');
        };

        // Garantir mínimos para cada tipo de caractere
        let password = "";
        if(minUpperCase > 0) {
            password += addCharsFromSet(upperCaseChars, minUpperCase);
        }
        if(minLowerCase > 0) {
            password += addCharsFromSet(lowerCaseChars, minLowerCase);
        }
        if(minSpecialChars > 0) {
            password += addCharsFromSet(specialChars, minSpecialChars);
        }
        if(minNumbers > 0) {
            password += addCharsFromSet(numberChars, minNumbers);
        }

        // Calcular quantos caracteres são necessários para preencher a senha
        let remainingLength = len - password.length;

        // Preencher o restante da senha aleatoriamente com todos os caracteres permitidos
        if(remainingLength > 0) {
            password += addCharsFromSet((upperCaseChars + lowerCaseChars + specialChars + numberChars), remainingLength);
        }

        // Embaralhar a senha para que os caracteres mínimos garantidos não estejam todos no início
        password = this.stringShuffle(password);

        return password;
    }

    /**
     * Remove tags de uma string HTML/XML
     *
     * @param {string} str String para ser formatada
     *
     * @return {string}
     */
    static removeTags(str) {
        return str.replace(/<[^>]*>?/gm, '');
    }
}

module.exports = VDStringHelper;