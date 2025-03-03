# Node Helper 🚀

🇺🇸 [Read in English](README.md)

Biblioteca utilitária para projetos Node.js, contendo funções para logs, manipulação de strings, arquivos, integração com GitHub, entre outros.

## 📦 Instalação

### 1️⃣ Instalar via GitHub
```bash
npm install git+https://github.com/vitorgd16/node-helper.git
```

### 2️⃣ Instalar uma versão fixa com base em uma branch do GitHub
```bash
npm install git+https://github.com/vitorgd16/node-helper.git#main
```

### 3️⃣ Instalar uma versão fixa com base em uma tag do GitHub
```bash
npm install github:vitorgd16/node-helper#v1.0.00
```

---

## 🚀 Como Usar

### 📌 Uso do `StringHelper`
Arquivo: **`dist/string.min.js`**
```javascript
const StringHelper = require('node-helper/dist/string.min.js');

console.log(StringHelper.isZero("0")); // true
console.log(StringHelper.isEmpty("")); // true
console.log(StringHelper.isEmptyDecimal("0.0")); // true
console.log(StringHelper.isEmptyInteger("0")); // true
console.log(StringHelper.isEmptyExceptZero("")); // true
console.log(StringHelper.hasStr("Hello World", "World")); // true
console.log(StringHelper.removeTags("<b>Texto</b>")); // "Texto"
console.log(StringHelper.removeSpecials("Olá, Mundo!")); // "Ola Mundo"
console.log(StringHelper.pad("42", 5, "0", "L")); // "00042"
console.log(StringHelper.removeMultipleSpaces("Espaço    extra")); // "Espaço extra"
console.log(StringHelper.removeAccents("ação")); // "acao"
console.log(StringHelper.stringShuffle("abcdef")); // Exemplo: "cbadef"
console.log(StringHelper.generateRandomPassword(10)); // Exemplo: "A1#bC2$dE3"
console.log(StringHelper.removeStrings("Texto de teste", ["de", " "])); // "Textoteste"
console.log(StringHelper.removeChrs("Texto", "tx")); // "eo"
console.log(StringHelper.removeChrsNotIn("Texto", "eo")); // "eo"
console.log(StringHelper.normalizeMessageIA4Whats("**Negrito** _Itálico_ __Sublinhado__")); // "*Negrito* *Itálico* *Sublinhado*"
console.log(StringHelper.splitMessageByLength("Mensagem longa com muitas linhas\nLinha1\nLinha2\nLinha3", 20)); // Divide em partes menores
```

📌 **Funções disponíveis:**
- `StringHelper.isZero(str)`: Verifica se a string representa o valor zero.
- `StringHelper.isEmpty(str)`: Verifica se uma string está vazia.
- `StringHelper.isEmptyDecimal(str)`: Verifica se uma string vazia representa um decimal inválido.
- `StringHelper.isEmptyInteger(str)`: Verifica se uma string vazia representa um número inteiro inválido.
- `StringHelper.isEmptyExceptZero(str)`: Verifica se uma string é vazia, mas ignora "0".
- `StringHelper.hasStr(str, search)`: Verifica se uma string contém outra string.
- `StringHelper.removeTags(str)`: Remove tags HTML de uma string.
- `StringHelper.removeSpecials(str)`: Remove caracteres especiais de uma string.
- `StringHelper.pad(str, width, padStr, padType)`: Faz padding em uma string.
- `StringHelper.removeMultipleSpaces(str)`: Remove múltiplos espaços consecutivos em uma string.
- `StringHelper.removeAccents(str)`: Remove acentos de uma string.
- `StringHelper.stringShuffle(str)`: Embaralha uma string aleatoriamente.
- `StringHelper.generateRandomPassword(len, minUpperCase, minLowerCase, minSpecialChars, minNumbers)`: Gera uma senha aleatória respeitando critérios mínimos.
- `StringHelper.removeStrings(str, strsRemove)`: Remove todas as strings informadas da string principal.
- `StringHelper.removeChrs(str, chs, notIn)`: Remove caracteres específicos de uma string.
- `StringHelper.removeChrsNotIn(str, notIn)`: Remove todos os caracteres que não estiverem na lista informada.
- `StringHelper.normalizeMessageIA4Whats(message)`: Normaliza uma mensagem formatada por IA para o WhatsApp, convertendo **negrito**, _itálico_ e __sublinhado__ para a formatação do WhatsApp.
- `StringHelper.splitMessageByLength(message, maxLength)`: Divide uma mensagem em partes menores, respeitando o `maxLength`, útil para envio de mensagens no WhatsApp.

---

### 📌 Uso do `FileHelper`
Arquivo: **`dist/file.min.js`**
```javascript
const FileHelper = require('node-helper/dist/file.min.js');

console.log(FileHelper.getExtension("arquivo.txt")); // "txt"
console.log(FileHelper.humanFileSize(1024)); // "1 KiB"
console.log(FileHelper.getFileSize("meuarquivo.txt")); // Retorna o tamanho do arquivo em bytes
FileHelper.appendStringToFile("log.txt", "Nova entrada de log\n");
FileHelper.createFolder("novaPasta");
```

📌 **Funções disponíveis:**
- `FileHelper.getExtension(filename)`: Retorna a extensão do arquivo.
- `FileHelper.humanFileSize(bytes, si, dp)`: Converte tamanho de arquivo em bytes para uma leitura mais fácil.
- `FileHelper.getFileSize(filePath)`: Obtém o tamanho de um arquivo em bytes.
- `FileHelper.appendStringToFile(filePath, content)`: Adiciona uma string a um arquivo existente.
- `FileHelper.createFolder(folderPath)`: Cria uma nova pasta, se não existir.

---

### 📌 Uso do `DBHelper`
Arquivo: **`dist/db.min.js`**
```javascript
const DBHelper = require('node-helper/dist/db.min.js');

console.log(DBHelper.msEscapeString("O'Reilly")); // "O''Reilly"
console.log(DBHelper.generateGUID()); // Exemplo: "550e8400-e29b-41d4-a716-446655440000"
```

📌 **Funções disponíveis:**
- `DBHelper.msEscapeString(str)`: Protege uma string contra SQL Injection.
- `DBHelper.generateGUID()`: Gera um GUID aleatório.

---

### 📌 Uso do `DateHelper`
Arquivo: **`dist/date.min.js`**
```javascript
const DateHelper = require('node-helper/dist/date.min.js');

console.log(DateHelper.getNow("America/Sao_Paulo", "YYYY-MM-DD HH:mm:ss")); // "2024-03-05 12:00:00"
```

📌 **Funções disponíveis:**
- `DateHelper.getNow(timezone, format)`: Retorna a data/hora atual no timezone e formato especificados.

---

### 📌 Uso do `GenericHelper`
Arquivo: **`dist/generic.min.js`**
```javascript
const GenericHelper = require('node-helper/dist/generic.min.js');

await GenericHelper.delay(1000); // Aguarda 1 segundo
console.log(GenericHelper.returnStackTrace(new Error("Erro Teste"))); // Retorna o stack trace do erro
```

📌 **Funções disponíveis:**
- `GenericHelper.delay(ms)`: Aguarda um tempo específico em milissegundos.
- `GenericHelper.returnStackTrace(error)`: Retorna o stack trace de uma exceção.

---

### 📌 Uso do `GithubHelper`
Arquivo: **`dist/github.min.js`**
```javascript
const GithubHelper = require('node-helper/dist/github.min.js');

GithubHelper.uploadFile("meu-repo", "main", "arquivo.txt", "remote/arquivo.txt", "Commit message");
```

📌 **Funções disponíveis:**
- `GithubHelper.uploadFile(repository, branch, localFilePath, remoteFilePath, commitMessage)`: Faz upload de um arquivo para um repositório GitHub.

---

### 📌 Uso do `ObjectHelper`
Arquivo: **`dist/object.min.js`**
```javascript
const ObjectHelper = require('node-helper/dist/object.min.js');

console.log(ObjectHelper.isArray([1,2,3])); // true
console.log(ObjectHelper.isObject({key: "value"})); // true
console.log(ObjectHelper.convertArrayToObject(["a", "b", "c"])); // {0: "a", 1: "b", 2: "c"}
console.log(ObjectHelper.copyObject({a:1})); // {a:1} (cópia independente)
```

📌 **Funções disponíveis:**
- `ObjectHelper.isArray(obj)`: Verifica se um objeto é um array.
- `ObjectHelper.isObject(obj)`: Verifica se um objeto é um objeto válido.
- `ObjectHelper.isArrayOrObject(obj)`: Verifica se um valor é um array ou objeto.
- `ObjectHelper.convertArrayToObject(arr)`: Converte um array para um objeto.
- `ObjectHelper.copyObject(obj)`: Cria uma cópia profunda de um objeto ou array.

---

### 📌 Uso do `LogHelper`
Arquivo: **`dist/log.min.js`**
```javascript
const LogHelper = require('node-helper/dist/log.min.js');

LogHelper.addInfo("Iniciando sistema...");
LogHelper.addWarning("Cuidado, algo pode dar errado!");
LogHelper.addError("Erro crítico encontrado!");
```

📌 **Funções disponíveis:**
- `LogHelper.addInfo(message)`: Adiciona um log de informação.
- `LogHelper.addWarning(message)`: Adiciona um log de aviso.
- `LogHelper.addError(message)`: Adiciona um log de erro.
- `LogHelper.addException(error)`: Adiciona uma exceção ao log.
- `LogHelper.garbageCollector(true)`: Remove logs antigos com base na configuração.

---

### 📌 Uso do `NumberHelper`
Arquivo: **`dist/number.min.js`**
```javascript
const NumberHelper = require('node-helper/dist/number.min.js');

console.log(NumberHelper.getRandomInt(1, 100)); // Número aleatório entre 1 e 100
console.log(NumberHelper.number_format(12345.678, 2, '.', ',')); // "12,345.68"
console.log(NumberHelper.onlyNumbers("R$ 1.234,56")); // "123456"
console.log(NumberHelper.isNegative("-123")); // true
console.log(NumberHelper.toInteger("R$ 1.234,56")); // 1234
```

📌 **Funções disponíveis:**
- `NumberHelper.getRandomInt(min, max)`: Retorna um número inteiro aleatório.
- `NumberHelper.number_format(number, decimals, dec_point, thousands_sep)`: Formata um número como no PHP.
- `NumberHelper.onlyNumbers(str)`: Remove todos os caracteres não numéricos de uma string.
- `NumberHelper.isNegative(str)`: Verifica se um número é negativo.
- `NumberHelper.toInteger(str)`: Converte uma string numérica em um inteiro válido.
- `NumberHelper.formatNumber(num, decimalSeparatorFrom, decimalSeparatorTo, thousandSeparatorTo, prefix, suffix, decimalPlaces, allowNegative)`: Formata um número de acordo com especificações.

---

## 📦 Configuração de Variáveis de Ambiente (.env)

O projeto utiliza um arquivo `.env` para armazenar configurações sensíveis, como tokens de API e credenciais. Certifique-se de criar um arquivo `.env` na raiz do projeto e preencher as variáveis conforme necessário.

### 📄 Exemplo de `.env`:
```ini
# Configurações do GitHub
VD_GITHUB_TOKEN=seu-token-aqui
VD_GITHUB_OWNER=seu-usuario
VD_GITHUB_RETRYS=3
VD_GITHUB_AUTHOR=Seu Nome
VD_GITHUB_EMAIL_AUTHOR=seu-email@exemplo.com

# Configurações de Log
VD_LOG_FOLDERNAME=logs
VD_LOG_EXTENSION=.log
VD_LOG_TIMEZONE=America/Sao_Paulo
VD_LOG_MAXSIZEMB_PER_FILE=300
VD_LOG_LIMIT_UNITY=days
VD_LOG_LIMIT_VALUE=7
VD_LOG_GC_PROBABILITY=5
VD_LOG_GC_DIVISOR=100
VD_LOG_AUTO_SEND_GITHUB_BRANCH=
VD_LOG_AUTO_SEND_GITHUB_REPOSITORY=
```

### 🔹 Descrição das variáveis:
#### **GitHub**
- `VD_GITHUB_TOKEN`: Token de autenticação para integração com o GitHub.
- `VD_GITHUB_OWNER`: Nome do usuário ou organização no GitHub.
- `VD_GITHUB_RETRYS`: Número máximo de tentativas ao tentar fazer upload de arquivos.
- `VD_GITHUB_AUTHOR`: Nome do autor do commit.
- `VD_GITHUB_EMAIL_AUTHOR`: E-mail do autor do commit.

#### **Logs**
- `VD_LOG_FOLDERNAME`: Nome da pasta onde os logs serão armazenados.
- `VD_LOG_EXTENSION`: Extensão dos arquivos de log.
- `VD_LOG_TIMEZONE`: Timezone utilizado para registrar os logs.
- `VD_LOG_MAXSIZEMB_PER_FILE`: Tamanho máximo de cada arquivo de log (em MB).
- `VD_LOG_LIMIT_UNITY`: Unidade de tempo para retenção de logs (`days`, `hours`, `minutes`, etc.).
- `VD_LOG_LIMIT_VALUE`: Quantidade de unidades de tempo antes que os logs sejam excluídos.
- `VD_LOG_GC_PROBABILITY`: Probabilidade de ativação do coletor de lixo dos logs.
- `VD_LOG_GC_DIVISOR`: Fator divisor para o cálculo da coleta de lixo.
- `VD_LOG_AUTO_SEND_GITHUB_BRANCH`: Define se os logs serão enviados automaticamente para o GitHub nessa branch (Exemplo: main).
- `VD_LOG_AUTO_SEND_GITHUB_REPOSITORY`: Define se os logs serão enviados automaticamente para o GitHub nesse repositório (Exemplo: LogsSync).

---

## 📜 Scripts Disponíveis

| Comando         | Descrição |
|----------------|-------------|
| `npm run start` | Executa a biblioteca (se aplicável). |
| `npm run start:prod` | Roda em modo produção. |
| `npm run build` | Minifica e prepara os arquivos para distribuição. |

---

## 🤝 Contribuindo
Se quiser contribuir, sinta-se livre para abrir **issues** e **pull requests** no repositório!

---

## 📜 Licença
Este projeto está sob a licença **MIT**.

