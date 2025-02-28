const VDStringHelper = require('./string.js');
const fs = require('fs');

class VDFileHelper {
    /**
     * Obtêm a extensão de um arquivo dado seu nome
     *
     * @param {string} filename Nome do arquivo
     *
     * @return {string|null}
     */
    static getExtension(filename) {
        if(VDStringHelper.isEmpty(filename)) {
            return null;
        }

        let lastIndex = filename.lastIndexOf('.');
        if(lastIndex === -1) {
            return null;
        }

        return filename.substring((lastIndex + 1), filename.length).toLowerCase();
    }

    /**
     * Formata bytes para leitura humana em texto.
     *
     * @param {number} bytes Número de bytes.
     * @param {boolean} si Determina se usará a métrica de unidades (SI).
     *        Se TRUE, utiliza 1000 como divisor para avançar a unidade.
     *        Se FALSE, utiliza 1024 como divisor para avançar a unidade.
     * @param {number} dp Número de casas decimais para mostrar em tela.
     *
     * @ref https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string
     * @return Formatted string.
     */
    humanFileSize(bytes, si = false, dp = 2) {
        const thresh = si ? 1000 : 1024;

        if (Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }

        const units = si
            ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
            : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        let u = -1;
        const r = 10**dp;

        do {
            bytes /= thresh;
            ++u;
        } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

        return bytes.toFixed(dp) + ' ' + units[u];
    }

    /**
     * Adiciona uma string em um arquivo já existente e cria o arquivo se não existir
     *
     * @param {string} filePath Caminho do arquivo
     * @param {string} content Conteúdo a ser adicionado
     *
     * @return {boolean}
     */
    static appendStringToFile(filePath, content) {
        try {
            fs.appendFileSync(filePath, content);
            return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * Cria pastas caso não existam no caminho especificado
     *
     * @param {string} folderPath Caminho para a pasta
     *
     * @return {boolean}
     */
    static createFolder(folderPath) {
        try {
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }
            return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * Obtêm o tamanho em bytes de um arquivo especifico
     *
     * @param {string} filePath Caminho para o arquivo
     *
     * @return {number}
     */
    static getFileSize(filePath) {
        try {
            const stats = fs.statSync(filePath);
            return stats.size;
        } catch (err) {
            return 0;
        }
    }
}

module.exports = VDFileHelper;