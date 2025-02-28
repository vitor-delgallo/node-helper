const VDDateHelper = require('./date.js');
const VDFileHelper = require('./file.js');
const VDStringHelper = require('./string.js');
const VDNumberHelper = require('./number.js');
const VDGenericHelper = require('./generic.js');
const VDGithubHelper = require('./github.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

class VDLogHelper {
    /**
     * Obtém as configurações padrão para os logs.
     *
     * @returns {Object} Objeto contendo configurações como diretório de logs, limite de tamanho e nome do arquivo.
     */
    static get CONFIGS() {
        const GC_DIVISOR = (process.env.VD_LOG_GC_DIVISOR ?? 0);
        let ret = {
            PATH_LOGS: path.join(process.cwd(), (process.env.VD_LOG_FOLDERNAME ?? 'logs')) + path.sep,
            LOG_EXT: (process.env.VD_LOG_EXTENSION ?? ".log"),
            NOW: VDDateHelper.getNow((process.env.VD_LOG_TIMEZONE ?? "America/Sao_Paulo"), 'YYYY-MM-DD'),
            FILE_COUNT: 1,
            MAX_SIZE_MB: (process.env.VD_LOG_MAXSIZEMB_PER_FILE ?? 300),
            LOG_LIMIT_TYPE: (process.env.VD_LOG_LIMIT_UNITY ?? "days"),
            LOG_LIMIT: (process.env.VD_LOG_LIMIT_VALUE ?? 7),
            GC: {
                PROBABILITY: (process.env.VD_LOG_GC_PROBABILITY ?? 5),
                DIVISOR: (GC_DIVISOR <= 0 ? 100 : GC_DIVISOR),
            },
            INTEGRATIONS: {
                GITHUB: (!!process.env.VD_LOG_AUTO_SEND_GITHUB),
            },
        };

        // Verifica quantos arquivos .log que começam com NOW ultrapassam o número máximo de MB
        const SIZE_LIMIT = ret.MAX_SIZE_MB * 1024 * 1024; // 300MB em bytes
        try {
            if (fs.existsSync(ret.PATH_LOGS)) {
                const files = fs.readdirSync(ret.PATH_LOGS);
                files.forEach(file => {
                    if (
                        file.endsWith(ret.LOG_EXT) &&
                        file.startsWith(ret.NOW) &&
                        VDFileHelper.getFileSize(path.join(ret.PATH_LOGS, file)) > SIZE_LIMIT
                    ) {
                        ret.FILE_COUNT++;
                    }
                });
            }
        } catch (err) {
            console.error("Erro ao verificar arquivos no diretório de logs:", err);
        }

        ret.FILE_NAME = ret.NOW + "-" + ret.FILE_COUNT + ret.LOG_EXT;
        ret.FILE_PATH = path.join(ret.PATH_LOGS, ret.FILE_NAME);

        return ret;
    }

    /**
     * Obtém o tempo limite para a exclusão de logs antigos em milissegundos.
     *
     * @returns {number} Tempo em milissegundos correspondente ao limite definido.
     */
    static get LOG_LIMIT_MS() {
        let ret = 0;
        switch (this.CONFIGS.LOG_LIMIT_TYPE.toLowerCase()) {
            case "d":
            case "day":
            case "days":
                ret = this.CONFIGS.LOG_LIMIT * 24 * 60 * 60 * 1000;
                break;
            case "h":
            case "hour":
            case "hours":
                ret = this.CONFIGS.LOG_LIMIT * 60 * 60 * 1000;
                break;
            case "m":
            case "min":
            case "mins":
            case "minute":
            case "minutes":
                ret = this.CONFIGS.LOG_LIMIT * 60 * 1000;
                break;
            case "s":
            case "sec":
            case "secs":
            case "second":
            case "seconds":
                ret = this.CONFIGS.LOG_LIMIT * 1000;
                break;
        }

        return ret;
    }

    /**
     * Exibe uma mensagem de erro no console informando falha na inicialização dos logs.
     */
    static showMessageError() {
        console.error(
            "\x1b[31m%s\x1b[0m",
            (
                "Não foi possível inicializar o sistema de logs! " +
                "Por favor, verifique as permissões de pastas! O integrador possui direitos administrativos?"
            )
        );
    }

    /**
     * Inicializa o sistema de logs, garantindo a criação do diretório necessário.
     *
     * @returns {boolean} Retorna `true` se o diretório for criado, `false` caso contrário.
     */
    static initialize() {
        if (VDFileHelper.createFolder(this.CONFIGS.PATH_LOGS)) {
            return true;
        }

        this.showMessageError();
        return false;
    }

    /**
     * Remove logs antigos com base no tempo limite configurado.
     *
     * @param {boolean} force Força limpar logs antigos.
     *
     * @returns {boolean} Retorna `true` se arquivos foram excluídos, `false` caso contrário.
     */
    static garbageCollector(force = false) {
        if(!force && VDNumberHelper.getRandomInt(1, this.CONFIGS.GC.DIVISOR) > this.CONFIGS.GC.PROBABILITY) {
            return false;
        }

        try {
            const files = fs.readdirSync(this.CONFIGS.PATH_LOGS);
            const now = Date.now();
            files.forEach(file => {
                const filePath = path.join(this.CONFIGS.PATH_LOGS, file);
                const stats = fs.statSync(filePath);
                const diff = now - stats.mtime.getTime();
                if (diff > this.LOG_LIMIT_MS) {
                    let remove = true;
                    if(this.CONFIGS.INTEGRATIONS.GITHUB) {
                        remove = VDGithubHelper.uploadFile("LMSync", "main", filePath, file);
                    }
                    if(remove) {
                        fs.unlinkSync(filePath);
                    }
                }
            });

            return true;
        } catch (err) {
            this.showMessageError();
            return false;
        }
    }

    /**
     * Adiciona uma mensagem ao log com um tipo específico.
     *
     * @param {string} message Mensagem a ser registrada.
     * @param {string} type Tipo do log (INFO, WARN, ERRO).
     */
    static add(message, type) {
        this.initialize();
        if (message && message.length > 0) {
            const logMessage = VDDateHelper.getNow("America/Sao_Paulo", 'YYYY-MM-DD HH:mm:ss') + " " + type + " > " + message + "\n";
            const filePath = this.CONFIGS.FILE_PATH;
            const remoteFileGH = filePath.substring(filePath.split("\\").join("/").lastIndexOf('/') + 1);
            if (!VDFileHelper.appendStringToFile(filePath, logMessage)) {
                this.showMessageError();
            } else if(this.CONFIGS.INTEGRATIONS.GITHUB) {
                VDGithubHelper.uploadFile("LMSync", "main", filePath, remoteFileGH);
            }
        }
        this.garbageCollector();
    }

    /**
     * Adiciona uma mensagem de informação ao log.
     *
     * @param {string} message Mensagem a ser registrada.
     */
    static addInfo(message) {
        this.add(VDStringHelper.removeTags(message), "INFO");
    }

    /**
     * Adiciona uma mensagem de aviso ao log.
     *
     * @param {string} message Mensagem a ser registrada.
     */
    static addWarning(message) {
        this.add(VDStringHelper.removeTags(message), "WARN");
    }

    /**
     * Adiciona uma mensagem de erro ao log.
     *
     * @param {string} message Mensagem a ser registrada.
     */
    static addError(message) {
        this.add(VDStringHelper.removeTags(message), "ERRO");
    }

    /**
     * Adiciona uma exceção ao log.
     *
     * @param {Error} error Objeto de erro a ser registrado.
     */
    static addException(error) {
        this.add(VDGenericHelper.returnStackTrace(error), "ERRO");
    }
}

module.exports = VDLogHelper;