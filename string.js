const VDObjectHelper = require('./object.js');

class VDStringHelper {
    /**
     * Checks if a variable is zero.
     *
     * @param {any} thing Variable to test.
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
     * Checks if a variable is empty, considering all possible cases.
     *
     * @param {any} thing Variable to test.
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
     * Checks if a variable is empty or an empty float, considering all possible cases.
     *
     * @param {any} thing Variable to test.
     * @returns {boolean}
     */
    static isEmptyDecimal(thing) {
        try{
            return this.isEmpty(parseFloat(thing));
        } catch(e) { }

        return this.isEmpty(thing);
    }

    /**
     * Checks if a variable is empty or an empty integer, considering all possible cases.
     *
     * @param {any} thing Variable to test.
     * @returns {boolean}
     */
    static isEmptyInteger(thing) {
        try{
            return this.isEmpty(parseInt(thing));
        } catch(e) { }

        return this.isEmpty(thing);
    }

    /**
     * Checks if a variable is empty, considering all possible cases, but if the string is zero,
     * it does not consider it empty.
     *
     * @param {any} thing Variable to test.
     * @returns {boolean}
     */
    static isEmptyExceptZero(thing) {
        return this.isEmpty(thing) && !this.isZero(thing);
    }

    /**
     * Checks if a word exists within a string.
     *
     * @param {string} str String to search within.
     * @param {string} find String to find within the first parameter.
     * @returns {boolean}
     */
    static hasStr(str, find){
        return str.toString().indexOf(find) !== -1;
    }

    /**
     * Removes all specified substrings from the main string and returns the modified value.
     *
     * @param {string|null} str String to process.
     * @param {string[]} strsRemove Array of substrings to remove.
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
     * Removes all characters from the string that are not included in the provided character list.
     *
     * @param {string|null} str String to process.
     * @param {string[]} notIn Characters to keep.
     * @return {string}
     */
    static removeChrsNotIn(str, notIn) {
        if (this.isEmpty(notIn)) return str;
        if (this.isEmpty(str) && !this.isZero(str)) return "";
        str = str.toString();

        return Array.from(str).filter(char => notIn.includes(char)).join('');
    }

    /**
     * Removes all specified characters from the main string and returns the modified value.
     *
     * @param {string|null} str String to process.
     * @param {string} chs Characters to remove.
     * @param {boolean|undefined|null} notIn If true, removes all characters **not** in the list.
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
     * Pads a string to a specified length.
     *
     * @param {string|int|float} str String to pad.
     * @param {int} width Total length after padding.
     * @param {string|int|null|undefined} padStr Character used for padding.
     * @param {string|null|undefined} padType Padding type ("L" - LEFT, "R" - RIGHT).
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
     * Removes multiple consecutive spaces, keeping only one.
     *
     * @param {string} str Text to process.
     * @returns {string}
     *
     * @ref https://stackoverflow.com/questions/3286874/remove-all-multiple-spaces-in-javascript-and-replace-with-single-space
     */
    static removeMultipleSpaces(str) {
        return str.replace(/ +(?= )/g,'');
    }

    /**
     * Removes all accents from a string.
     *
     * @param {string} str Text to process.
     * @returns {string}
     *
     * @ref https://metring.com.br/javascript-substituir-caracteres-especiais
     */
    static removeAccents(str) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    }

    /**
     * Removes all special characters from a string.
     *
     * @param {string} str Text to process.
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
     * Shuffles a string randomly.
     *
     * @param {string} str Text to shuffle.
     * @return {string}
     */
    static stringShuffle(str) {
        if(this.isEmptyExceptZero(str)) {
            str = "";
        }
        return str.split('').sort(() => 0.5 - Math.random()).join('');
    }

    /**
     * Generates a random password with specific constraints.
     *
     * @param {null|int} len Password length.
     * @param {null|int} minUpperCase Minimum uppercase characters.
     * @param {null|int} minLowerCase Minimum lowercase characters.
     * @param {null|int} minSpecialChars Minimum special characters.
     * @param {null|int} minNumbers Minimum numeric characters.
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

        // Ensure minimum required characters for each type
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

        // Calculate remaining length to fill password
        let remainingLength = len - password.length;

        // Fill remaining password randomly from all allowed characters
        if(remainingLength > 0) {
            password += addCharsFromSet((upperCaseChars + lowerCaseChars + specialChars + numberChars), remainingLength);
        }

        // Shuffle the password to ensure minimum required characters are not all at the start
        password = this.stringShuffle(password);

        return password;
    }

    /**
     * Removes all HTML/XML tags from a string.
     *
     * @param {string} str String to process.
     * @return {string}
     */
    static removeTags(str) {
        return str.replace(/<[^>]*>?/gm, '');
    }

    /**
     * Normalizes an AI-generated message for WhatsApp formatting.
     *
     * @param {string} message String to be formatted.
     * @return {string}
     */
    static normalizeMessageIA4Whats(message) {
        return message
            .replace(/\*\*(.*?)\*\*/g, '*$1*') // Converte negrito
            .replace(/__(.*?)__/g, '*$1*') // Converte sublinhado
            .replace(/_(.*?)_/g, '*$1*') // Converte itálico
            .replace(/```(.*?)```/gs, '```$1```') // Remove espaços extras
            .replace(/\n{2,}/g, '\n'); // Remove múltiplas quebras de linha
    }

    /**
     * Splits an AI-generated message into multiple parts based on length.
     *
     * @param {string} message String to be split.
     * @param {number} maxLength Maximum length per message.
     * @return {array}
     */
    static splitMessageByLength(message, maxLength) {
        if (message.length <= maxLength) return [message];

        const parts = [];
        let sentences = message.split("\n");
        let currentMessage = "";

        for (const sentence of sentences) {
            if ((currentMessage + "\n" + sentence).length > maxLength) {
                parts.push(currentMessage.trim());
                currentMessage = sentence;
            } else {
                currentMessage += (currentMessage ? "\n" : "") + sentence;
            }
        }

        if (currentMessage) parts.push(currentMessage.trim());
        return parts;
    }
}

module.exports = VDStringHelper;