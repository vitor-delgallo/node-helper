const {Octokit} = require("@octokit/rest");
const VDGenericHelper = require('./generic.js');
const fs = require("fs");
require('dotenv').config();

class VDGithubHelper {
    /**
     * Retrieves the default configurations for GitHub integration.
     *
     * @returns {Object} Object containing information such as token and commit settings.
     */
    static get CONFIGS() {
        return {
            token: process.env.VD_GITHUB_TOKEN ?? null, // seu token de app no GitHub
            owner: process.env.VD_GITHUB_OWNER ?? null, // seu usuário no GitHub
            maxTentativas: process.env.VD_GITHUB_RETRYS ?? 3, // máximo de tentativas de envio do arquivo em caso de erros especificos
            commitAuthor: {
                name: process.env.VD_GITHUB_AUTHOR ?? null,
                email: process.env.VD_GITHUB_EMAIL_AUTHOR ?? null
            },
        };
    }

    // Initializes an instance of Octokit for GitHub API calls
    static octokit = new Octokit({auth: this.CONFIGS.token});

    /**
     * Uploads a local file to a repository on GitHub.
     *
     * @param {string} repository Name of the GitHub repository.
     * @param {string} branch Branch name for the commit.
     * @param {string} localFilePath Path to the local file to be uploaded.
     * @param {string} remoteFilePath Remote path in the GitHub repository where the file will be saved.
     * @param {string|null} commitMessage Commit message.
     * @param {number} [attempt=1] Current attempt number (for retrying in case of error 409).
     * @returns {Promise<boolean>} Returns `true` if the upload is successful, `false` otherwise.
     */
    static async uploadFile(repository, branch, localFilePath, remoteFilePath, commitMessage = null, nTentativa = 1) {
        try {
            // Reads the local file content
            const fileContent = fs.readFileSync(localFilePath, "utf8");
            const base64Content = Buffer.from(fileContent).toString("base64");

            // Attempts to get the remote file content to check if it already exists
            let sha;
            try {
                const {data} = await this.octokit.repos.getContent({
                    owner: this.CONFIGS.owner,
                    repo: repository,
                    path: remoteFilePath,
                    ref: branch
                });
                sha = data.sha;
            } catch (error) {
                // If the error is 404, the file does not exist, and we will create it
                if (error.status !== 404) {
                    console.error("Erro ao verificar existência do arquivo:", error);
                    return false;
                }
            }

            // Creates or updates the remote file including commit information
            await this.octokit.repos.createOrUpdateFileContents({
                owner: this.CONFIGS.owner,
                repo: repository,
                path: remoteFilePath,
                message: commitMessage ?? (
                    sha
                        ? "Updating file via automated integration"
                        : "Creating file via automated integration"
                ),
                content: base64Content,
                sha: sha, // If the file does not exist, sha will be undefined
                branch: branch,
                committer: this.CONFIGS.commitAuthor,
                author: this.CONFIGS.commitAuthor
            });

            console.log("File successfully uploaded!");
            return true;
        } catch (error) {
            if (nTentativa <= this.CONFIGS.maxTentativas && (error.status === 409)) {
                await VDGenericHelper.delay(300);
                return await this.uploadFile(repository, branch, localFilePath, remoteFilePath, commitMessage, (nTentativa + 1));
            } else {
                console.error("Error uploading file:", error);
            }
            return false;
        }
    }
}

module.exports = VDGithubHelper;