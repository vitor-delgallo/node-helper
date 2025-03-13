import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to the 'dist' folder relative to the script's location
const distPath = path.resolve(__dirname, '../dist');

// Function to delete a directory and its contents
const deleteDirectory = (dirPath) => {
    if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach((file) => {
            const currentPath = path.join(dirPath, file);
            if (fs.lstatSync(currentPath).isDirectory()) {
                // Recursively delete contents of directory
                deleteDirectory(currentPath);
            } else {
                // Delete file
                fs.unlinkSync(currentPath);
            }
        });
        // Remove the now-empty directory
        fs.rmdirSync(dirPath);
    }
};

// Clear the 'dist' folder
deleteDirectory(distPath);

// Recreate the 'dist' folder
fs.mkdirSync(distPath, { recursive: true });

console.log(`Limpeza do diretório '${distPath}' concluída!`);
console.log(`Execução de script "clear-dist.mjs" concluída!`);