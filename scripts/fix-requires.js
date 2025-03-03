const fs = require("fs");
const path = require("path");

// Caminho da pasta onde estão os arquivos minificados
const distFolder = path.join(__dirname, "../dist");

// Expressão regular para encontrar os require locais (ex: require("./arquivo.js"))
const requireRegex = /require\(["'`](\.\/[a-zA-Z0-9_-]+)\.js["'`]\)/g;

// Função para corrigir os requires nos arquivos minificados
function fixRequiresInFile(filePath) {
    let content = fs.readFileSync(filePath, "utf8");

    // Substituir os requires para apontar para .min.js
    const updatedContent = content.replace(requireRegex, (match, moduleName) => {
        return `require("${moduleName}.min.js")`;
    });

    // Se houve alteração, sobrescreve o arquivo
    if (content !== updatedContent) {
        fs.writeFileSync(filePath, updatedContent, "utf8");
        console.log(`✅ Fixed: ${filePath}`);
    }
}

// Verifica se a pasta dist existe antes de rodar
if (fs.existsSync(distFolder)) {
    const files = fs.readdirSync(distFolder);

    files.forEach(file => {
        if (file.endsWith(".min.js")) {
            fixRequiresInFile(path.join(distFolder, file));
        }
    });

    console.log("🎉 All files have been corrected!");
} else {
    console.log("⚠️ The 'dist' folder does not exist. Run 'npm run build' first.");
}