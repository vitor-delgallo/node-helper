const libphonenumber = require('google-libphonenumber');

class VDPhoneHelper {
    static phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
    static phoneFormat = libphonenumber.PhoneNumberFormat;

    /**
     * Removes the country code from a phone number, returning only the area code + local number.
     *
     * @param {string} phoneNumber - The phone number in E.164 format or similar. For example: "+5514996545535" or "5514996545535"
     * @param {string} defaultRegion - The default country code for parsing (e.g. "BR", "US"). This is only used
     *                                 if the phone number does not include an explicit country code.
     * @return {string} - The phone number without the country code, i.e., only the area code + local number.
     */
    static removeCountryCode(phoneNumber, defaultRegion = 'ZZ') {
        try {
            // If the user didn't include a '+' sign, we add it so the parser can recognize the country code
            const numberWithPlus = phoneNumber.startsWith('+')
                ? phoneNumber
                : '+' + phoneNumber;

            // Parse the phone number
            const parsedNumber = this.phoneUtil.parse(numberWithPlus, defaultRegion);

            // Format it in NATIONAL format, then remove all non-digit characters
            const nationalOnlyDigits = this.phoneUtil
                .format(parsedNumber, this.phoneFormat.NATIONAL)
                .replace(/\D/g, '');

            return nationalOnlyDigits;
        } catch (err) {
            // If parsing fails, return the original number or handle it as needed
            console.error('Error parsing phone number:', err);
            return phoneNumber;
        }
    }
}

module.exports = VDPhoneHelper;