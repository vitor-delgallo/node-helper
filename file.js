const VDStringHelper = require('./string.js');
const fs = require('fs');

class VDFileHelper {
    /**
     * Retrieves the file extension given its name.
     *
     * @param {string} filename File name.
     * @returns {string|null} File extension or `null` if not found.
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
     * Formats bytes into a human-readable string.
     *
     * @param {number} bytes Number of bytes.
     * @param {boolean} si Determines if the metric system (SI) is used.
     *        If `true`, uses 1000 as a divisor to advance units.
     *        If `false`, uses 1024 as a divisor to advance units.
     * @param {number} dp Number of decimal places to display.
     *
     * @ref https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string
     * @returns {string} Formatted file size.
     */
    static humanFileSize(bytes, si = false, dp = 2) {
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
     * Appends a string to an existing file, creating the file if it does not exist.
     *
     * @param {string} filePath File path.
     * @param {string} content Content to be appended.
     * @returns {boolean} `true` if the operation succeeds, `false` otherwise.
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
     * Creates directories if they do not exist in the specified path.
     *
     * @param {string} folderPath Directory path.
     * @returns {boolean} `true` if the folder is created or already exists, `false` otherwise.
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
     * Retrieves the file size in bytes.
     *
     * @param {string} filePath File path.
     * @returns {number} File size in bytes, or `0` if the file does not exist.
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