class VDGenericHelper {
    /**
     * Aguarda uma certa quantidade de tempo para realizar a próxima execução
     *
     * @param {number} ms Milisegundos para serem aguardados
     */
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Obtêm o stack trace de uma Exception
     *
     * @param error Exception para obter o stack
     */
    static returnStackTrace(error) {
        return error.stack || error.toString();
    }
}

module.exports = VDGenericHelper;