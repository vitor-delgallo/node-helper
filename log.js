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
     * Retrieves the default log configurations.
     *
     * @returns {Object} Object containing settings such as log directory, file size limit, and file name.
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
                GITHUB: {
                    ENABLED: false,
                    BRANCH: process.env.VD_LOG_AUTO_SEND_GITHUB_BRANCH,
                    REPOSITORY: process.env.VD_LOG_AUTO_SEND_GITHUB_REPOSITORY
                },
            },
        };
        ret.INTEGRATIONS.GITHUB.ENABLED =
            !VDStringHelper.isEmpty(ret.INTEGRATIONS.GITHUB.BRANCH) &&
            !VDStringHelper.isEmpty(ret.INTEGRATIONS.GITHUB.REPOSITORY);

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
            console.error("Error checking log directory files:", err);
        }

        ret.FILE_NAME = ret.NOW + "-" + ret.FILE_COUNT + ret.LOG_EXT;
        ret.FILE_PATH = path.join(ret.PATH_LOGS, ret.FILE_NAME);

        return ret;
    }

    /**
     * Retrieves the log deletion time limit in milliseconds.
     *
     * @returns {number} Time in milliseconds corresponding to the defined limit.
     */
    static get LOG_LIMIT_MS() {
        let ret = 0;
        switch (this.CONFIGS.LOG_LIMIT_TYPE.toLowerCase()) {
            case "d":
            case "day":
            case "days":
                ret = this.CONFIGS.LOG_LIMIT * 24 * 60 * 60 * 1000;
                break;
            case "m":
            case "month":
            case "months":
                ret = this.CONFIGS.LOG_LIMIT * 30 * 24 * 60 * 60 * 1000;
                break;
        }

        return ret;
    }

    /**
     * Displays an error message in the console indicating a failure in log system initialization.
     */
    static showMessageError() {
        console.error(
            "\x1b[31m%s\x1b[0m",
            (
                "Failed to initialize the log system! " +
                "Please check folder permissions! Does the integrator have administrative rights?"
            )
        );
    }

    /**
     * Initializes the logging system, ensuring the required directory exists.
     *
     * @returns {boolean} Returns `true` if the directory is created, `false` otherwise.
     */
    static initialize() {
        if (VDFileHelper.createFolder(this.CONFIGS.PATH_LOGS)) {
            return true;
        }

        this.showMessageError();
        return false;
    }

    /**
     * Removes old logs based on the configured time limit.
     *
     * @param {boolean} force Forces the deletion of old logs.
     *
     * @returns {boolean} Returns `true` if files were deleted, `false` otherwise.
     */
    static async garbageCollector(force = false) {
        if(!force && VDNumberHelper.getRandomInt(1, this.CONFIGS.GC.DIVISOR) > this.CONFIGS.GC.PROBABILITY) {
            return false;
        }

        try {
            const files = fs.readdirSync(this.CONFIGS.PATH_LOGS);
            const now = Date.now();
            for (const file of files) {
                const filePath = path.join(this.CONFIGS.PATH_LOGS, file);
                const stats = fs.statSync(filePath);
                const diff = now - stats.mtime.getTime();
                if (diff > this.LOG_LIMIT_MS) {
                    if(this.CONFIGS.INTEGRATIONS.GITHUB.ENABLED) {
                        let remove = await VDGithubHelper.uploadFile(this.CONFIGS.INTEGRATIONS.GITHUB.REPOSITORY, this.CONFIGS.INTEGRATIONS.GITHUB.BRANCH, filePath, file);
                        if(remove) {
                            fs.unlinkSync(filePath);
                        }
                    } else {
                        fs.unlinkSync(filePath);
                    }
                }
            }

            return true;
        } catch (err) {
            this.showMessageError();
            return false;
        }
    }

    /**
     * Format a message to the log with a specific type.
     *
     * @param {string} message Message to be formatted.
     * @param {string} type Log type (INFO, WARN, ERROR).
     *
     * @return {string} Message to be saved in log
     */
    static getFormattedMessage(message, type) {
        let logMessage = VDDateHelper.getNow((process.env.VD_LOG_TIMEZONE ?? "America/Sao_Paulo"), 'YYYY-MM-DD HH:mm:ss') + " " + type + " > {{MESSAGE}}\n";

        type = ((message && type) ? type.toUpperCase() : "");
        switch (type) {
            case "INFO":
            case "WARN":
            case "ERROR":
            case "CRITICAL":
            case "EXCEPTION":
                logMessage = logMessage.replace("{{MESSAGE}}", message);
                break;
            default:
                logMessage = "";
        }

        return logMessage;
    }

    /**
     * Adds a message to the log with a specific type.
     *
     * @param {string} message Message to be recorded.
     * @param {string} type Log type (INFO, WARN, ERROR, CRITICAL, EXCEPTION).
     *
     * @return {string} Message saved in log
     */
    static async add(message, type) {
        this.initialize();
        await this.garbageCollector();

        const logMessage = this.getFormattedMessage(message, type);
        if(!logMessage) {
            return logMessage;
        }

        const filePath = this.CONFIGS.FILE_PATH;
        const remoteFileGH = filePath.substring(filePath.split("\\").join("/").lastIndexOf('/') + 1);
        if (!VDFileHelper.appendStringToFile(filePath, logMessage)) {
            this.showMessageError();
        } else if(this.CONFIGS.INTEGRATIONS.GITHUB.ENABLED) {
            await VDGithubHelper.uploadFile(this.CONFIGS.INTEGRATIONS.GITHUB.REPOSITORY, this.CONFIGS.INTEGRATIONS.GITHUB.BRANCH, filePath, remoteFileGH);
        }

        return logMessage;
    }

    /**
     * Adds an informational message to the log.
     *
     * @param {string} message Message to be recorded.
     *
     * @return {string} Message saved in log
     */
    static async addInfo(message) {
        return this.add(VDStringHelper.removeTags(message), "INFO");
    }

    /**
     * Adds a warning message to the log.
     *
     * @param {string} message Message to be recorded.
     *
     * @return {string} Message saved in log
     */
    static async addWarning(message) {
        return this.add(VDStringHelper.removeTags(message), "WARN");
    }

    /**
     * Adds an error message to the log.
     *
     * @param {string} message Message to be recorded.
     *
     * @return {string} Message saved in log
     */
    static async addError(message) {
        return this.add(VDStringHelper.removeTags(message), "ERROR");
    }

    /**
     * Adds an critical error message to the log.
     *
     * @param {string} message Message to be recorded.
     *
     * @return {string} Message saved in log
     */
    static async addCritical(message) {
        return this.add(VDStringHelper.removeTags(message), "CRITICAL");
    }

    /**
     * Adds an exception to the log.
     *
     * @param {Error} error Error object to be recorded.
     *
     * @return {string} Message saved in log
     */
    static async addException(error) {
        return this.add(VDGenericHelper.returnStackTrace(error), "EXCEPTION");
    }
}

module.exports = VDLogHelper;