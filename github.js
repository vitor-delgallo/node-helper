const {Octokit} = require("@octokit/rest");
const VDGenericHelper = require('./generic.js');
const fs = require("fs");
require('dotenv').config();

class VDGithubHelper {
    /**
     * Obtêm as configurações padrão para integração com o GitHub.
     *
     * @returns {Object} Objeto contendo informações como token e configurações de commit.
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

    // Inicializa uma instância do Octokit para chamadas à API do GitHub
    static octokit = new Octokit({auth: this.CONFIGS.token});

    /**
     * Faz o upload de um arquivo local para um repositório no GitHub.
     *
     * @param {string} repository Nome do repositório no Git.
     * @param {string} branch Nome da branch para o commit
     * @param {string} localFilePath Caminho do arquivo local a ser enviado.
     * @param {string} localFilePath Caminho do arquivo local a ser enviado.
     * @param {string} remoteFilePath Caminho remoto no repositório GitHub onde o arquivo será salvo.
     * @param {string|null} commitMessage Mensagem para envio do commit.
     * @param {number} [nTentativa=1] Número da tentativa atual (para reenvio em caso de erro 409).
     * @returns {Promise<boolean>} Retorna `true` se o upload for bem-sucedido, `false` caso contrário.
     */
    static async uploadFile(repository, branch, localFilePath, remoteFilePath, commitMessage = null, nTentativa = 1) {
        try {
            // Lê o conteúdo do arquivo local
            const fileContent = fs.readFileSync(localFilePath, "utf8");
            const base64Content = Buffer.from(fileContent).toString("base64");

            // Tenta obter o conteúdo do arquivo remoto para verificar se ele já existe
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
                // Se o erro for 404, o arquivo não existe e iremos criá-lo
                if (error.status !== 404) {
                    console.error("Erro ao verificar existência do arquivo:", error);
                    return false;
                }
            }

            // Cria ou atualiza o arquivo remoto incluindo as informações do commit
            await this.octokit.repos.createOrUpdateFileContents({
                owner: this.CONFIGS.owner,
                repo: repository,
                path: remoteFilePath,
                message: commitMessage ?? (
                    sha
                        ? "Atualizando arquivo via integração automatizada"
                        : "Criando arquivo via integração automatizada"
                ),
                content: base64Content,
                sha: sha,      // se o arquivo não existir, sha será undefined
                branch: branch,
                committer: this.CONFIGS.commitAuthor,
                author: this.CONFIGS.commitAuthor
            });

            console.log("Arquivo enviado com sucesso!");
            return true;
        } catch (error) {
            if (nTentativa <= this.CONFIGS.maxTentativas && (error.status === 409)) {
                await VDGenericHelper.delay(300);
                return await this.uploadFile(repository, branch, localFilePath, remoteFilePath, commitMessage, (nTentativa + 1));
            } else {
                console.error("Erro ao enviar arquivo:", error);
            }
            return false;
        }
    }
}

module.exports = VDGithubHelper;