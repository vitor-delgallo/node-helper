# Node Helper 🚀

🇧🇷 [Leia em Português](README.pt.md)

Utility library for Node.js projects, providing functions for logging, string manipulation, file handling, GitHub integration, and more.

## 📦 Installation

### 1️⃣ Install via GitHub
```bash
npm install git+https://github.com/vitorgd16/node-helper.git
```

### 2️⃣ Install a fixed version from a GitHub branch
```bash
npm install git+https://github.com/vitorgd16/node-helper.git#main
```

### 3️⃣ Install a fixed version from a GitHub tag
```bash
npm install git+https://github.com/vitorgd16/node-helper.git#refs/tags/1.0.0
```

---

## 🚀 How to Use

### 📌 Using `StringHelper`
File: **`dist/string.min.js`**
```javascript
const StringHelper = require('node-helper/dist/string.min.js');

console.log(StringHelper.isZero("0")); // true
console.log(StringHelper.isEmpty("")); // true
console.log(StringHelper.isEmptyDecimal("0.0")); // true
console.log(StringHelper.isEmptyInteger("0")); // true
console.log(StringHelper.isEmptyExceptZero("")); // true
console.log(StringHelper.hasStr("Hello World", "World")); // true
console.log(StringHelper.removeTags("<b>Text</b>")); // "Text"
console.log(StringHelper.removeSpecials("Hello, World!")); // "Hello World"
console.log(StringHelper.pad("42", 5, "0", "L")); // "00042"
console.log(StringHelper.removeMultipleSpaces("Extra    space")); // "Extra space"
console.log(StringHelper.removeAccents("ação")); // "acao"
console.log(StringHelper.stringShuffle("abcdef")); // Example: "cbadef"
console.log(StringHelper.generateRandomPassword(10)); // Example: "A1#bC2$dE3"
console.log(StringHelper.removeStrings("Test text", ["of", " "])); // "Testtext"
console.log(StringHelper.removeChrs("Text", "tx")); // "eo"
console.log(StringHelper.removeChrsNotIn("Text", "eo")); // "eo"
console.log(StringHelper.normalizeMessageIA4Whats("**Bold** _Italic_ __Underlined__")); // "*Bold* *Italic* *Underlined*"
console.log(StringHelper.splitMessageByLength("Long message with multiple lines\nLine1\nLine2\nLine3", 20)); // Splits into smaller parts
```

📌 **Available Functions:**
- `StringHelper.isZero(str)`: Checks if the string represents zero.
- `StringHelper.isEmpty(str)`: Checks if a string is empty.
- `StringHelper.isEmptyDecimal(str)`: Checks if a string represents an invalid decimal.
- `StringHelper.isEmptyInteger(str)`: Checks if a string represents an invalid integer.
- `StringHelper.isEmptyExceptZero(str)`: Checks if a string is empty but ignores "0".
- `StringHelper.hasStr(str, search)`: Checks if a string contains another string.
- `StringHelper.removeTags(str)`: Removes HTML tags from a string.
- `StringHelper.removeSpecials(str)`: Removes special characters from a string.
- `StringHelper.pad(str, width, padStr, padType)`: Pads a string.
- `StringHelper.removeMultipleSpaces(str)`: Removes multiple consecutive spaces in a string.
- `StringHelper.removeAccents(str)`: Removes accents from a string.
- `StringHelper.stringShuffle(str)`: Randomly shuffles a string.
- `StringHelper.generateRandomPassword(len, minUpperCase, minLowerCase, minSpecialChars, minNumbers)`: Generates a random password with specific constraints.
- `StringHelper.removeStrings(str, strsRemove)`: Removes specific substrings from a string.
- `StringHelper.removeChrs(str, chs, notIn)`: Removes specific characters from a string.
- `StringHelper.removeChrsNotIn(str, notIn)`: Removes all characters that are not in the specified list.
- `StringHelper.normalizeMessageIA4Whats(message)`: Normalizes AI-generated messages for WhatsApp formatting.
- `StringHelper.splitMessageByLength(message, maxLength)`: Splits a message into smaller parts based on length.

---

### 📌 Using `FileHelper`
File: **`dist/file.min.js`**
```javascript
const FileHelper = require('node-helper/dist/file.min.js');

console.log(FileHelper.getExtension("file.txt")); // "txt"
console.log(FileHelper.humanFileSize(1024)); // "1 KiB"
console.log(FileHelper.getFileSize("myfile.txt")); // Returns file size in bytes
FileHelper.appendStringToFile("log.txt", "New log entry\n");
FileHelper.createFolder("newFolder");
```

📌 **Available Functions:**
- `FileHelper.getExtension(filename)`: Returns the file extension.
- `FileHelper.humanFileSize(bytes, si, dp)`: Converts file size in bytes to a readable format.
- `FileHelper.getFileSize(filePath)`: Gets the size of a file in bytes.
- `FileHelper.appendStringToFile(filePath, content)`: Appends a string to an existing file.
- `FileHelper.createFolder(folderPath)`: Creates a new folder if it does not exist.

---

### 📌 Using `DBHelper`
File: **`dist/db.min.js`**
```javascript
const DBHelper = require('node-helper/dist/db.min.js');

console.log(DBHelper.msEscapeString("O'Reilly")); // "O''Reilly"
console.log(DBHelper.generateGUID()); // Example: "550e8400-e29b-41d4-a716-446655440000"
```

📌 **Available Functions:**
- `DBHelper.msEscapeString(str)`: Escapes a string to prevent SQL Injection.
- `DBHelper.generateGUID()`: Generates a random GUID.

---

### 📌 Using `DateHelper`
File: **`dist/date.min.js`**
```javascript
const DateHelper = require('node-helper/dist/date.min.js');

console.log(DateHelper.getNow("America/Sao_Paulo", "YYYY-MM-DD HH:mm:ss")); // "2024-03-05 12:00:00"
```

📌 **Available Functions:**
- `DateHelper.getNow(timezone, format)`: Returns the current date/time in the specified timezone and format.

---

### 📌 Using `GenericHelper`
File: **`dist/generic.min.js`**
```javascript
const GenericHelper = require('node-helper/dist/generic.min.js');

await GenericHelper.delay(1000); // Waits for 1 second
console.log(GenericHelper.returnStackTrace(new Error("Test Error"))); // Returns the stack trace of an error
```

📌 **Available Functions:**
- `GenericHelper.delay(ms)`: Waits for a specified time in milliseconds.
- `GenericHelper.returnStackTrace(error)`: Returns the stack trace of an exception.

---

### 📌 Using `GithubHelper`
File: **`dist/github.min.js`**
```javascript
const GithubHelper = require('node-helper/dist/github.min.js');

GithubHelper.uploadFile("my-repo", "main", "file.txt", "remote/file.txt", "Commit message");
```

📌 **Available Functions:**
- `GithubHelper.uploadFile(repository, branch, localFilePath, remoteFilePath, commitMessage)`: Uploads a file to a GitHub repository.

---

### 📌 Using `ObjectHelper`
File: **`dist/object.min.js`**
```javascript
const ObjectHelper = require('node-helper/dist/object.min.js');

console.log(ObjectHelper.isArray([1,2,3])); // true
console.log(ObjectHelper.isObject({key: "value"})); // true
console.log(ObjectHelper.convertArrayToObject(["a", "b", "c"])); // {0: "a", 1: "b", 2: "c"}
console.log(ObjectHelper.copyObject({a:1})); // {a:1} (independent copy)
```

📌 **Available Functions:**
- `ObjectHelper.isArray(obj)`: Checks if a value is an array.
- `ObjectHelper.isObject(obj)`: Checks if a value is a valid object.
- `ObjectHelper.isArrayOrObject(obj)`: Checks if a value is an array or object.
- `ObjectHelper.convertArrayToObject(arr)`: Converts an array to an object.
- `ObjectHelper.copyObject(obj)`: Creates a deep copy of an object or array.

---

### 📌 Using `LogHelper`
File: **`dist/log.min.js`**
```javascript
const LogHelper = require('node-helper/dist/log.min.js');

LogHelper.addInfo("Starting system...");
LogHelper.addWarning("Warning, something might go wrong!");
LogHelper.addError("Critical error encountered!");
```

📌 **Available Functions:**
- `LogHelper.addInfo(message)`: Adds an informational log entry.
- `LogHelper.addWarning(message)`: Adds a warning log entry.
- `LogHelper.addError(message)`: Adds an error log entry.
- `LogHelper.addException(error)`: Adds an exception log entry.
- `LogHelper.garbageCollector(true)`: Removes old logs based on configuration.

---

### 📌 Using `NumberHelper`
File: **`dist/number.min.js`**
```javascript
const NumberHelper = require('node-helper/dist/number.min.js');

console.log(NumberHelper.getRandomInt(1, 100)); // Random number between 1 and 100
console.log(NumberHelper.number_format(12345.678, 2, '.', ',')); // "12,345.68"
console.log(NumberHelper.onlyNumbers("R$ 1.234,56")); // "123456"
console.log(NumberHelper.isNegative("-123")); // true
console.log(NumberHelper.toInteger("R$ 1.234,56")); // 1234
```

📌 **Available Functions:**
- `NumberHelper.getRandomInt(min, max)`: Returns a random integer between the given range.
- `NumberHelper.number_format(number, decimals, dec_point, thousands_sep)`: Formats a number similar to PHP's `number_format()`.
- `NumberHelper.onlyNumbers(str)`: Removes all non-numeric characters from a string.
- `NumberHelper.isNegative(str)`: Checks if a number is negative.
- `NumberHelper.toInteger(str)`: Converts a numeric string into a valid integer.
- `NumberHelper.formatNumber(num, decimalSeparatorFrom, decimalSeparatorTo, thousandSeparatorTo, prefix, suffix, decimalPlaces, allowNegative)`: Formats a number according to specific requirements.

---

## 📦 Environment Variables Configuration (.env)

The project uses a `.env` file to store sensitive configurations such as API tokens and credentials. Ensure you create a `.env` file in the project root and populate it accordingly.

### 📄 Example `.env` file:
```ini
# GitHub Configuration
VD_GITHUB_TOKEN=your-token-here
VD_GITHUB_OWNER=your-username
VD_GITHUB_RETRYS=3
VD_GITHUB_AUTHOR=Your Name
VD_GITHUB_EMAIL_AUTHOR=your-email@example.com

# Log Configuration
VD_LOG_FOLDERNAME=logs
VD_LOG_EXTENSION=.log
VD_LOG_TIMEZONE=America/Sao_Paulo
VD_LOG_MAXSIZEMB_PER_FILE=300
VD_LOG_LIMIT_UNITY=days
VD_LOG_LIMIT_VALUE=7
VD_LOG_GC_PROBABILITY=5
VD_LOG_GC_DIVISOR=100
VD_LOG_AUTO_SEND_GITHUB=true
```

### 🔹 Variable Descriptions:
#### **GitHub**
- `VD_GITHUB_TOKEN`: Authentication token for GitHub integration.
- `VD_GITHUB_OWNER`: GitHub user or organization name.
- `VD_GITHUB_RETRYS`: Maximum number of retry attempts when uploading files.
- `VD_GITHUB_AUTHOR`: Commit author name.
- `VD_GITHUB_EMAIL_AUTHOR`: Commit author email.

#### **Logs**
- `VD_LOG_FOLDERNAME`: Folder name where logs are stored.
- `VD_LOG_EXTENSION`: Log file extension.
- `VD_LOG_TIMEZONE`: Timezone used for logging.
- `VD_LOG_MAXSIZEMB_PER_FILE`: Maximum log file size (in MB).
- `VD_LOG_LIMIT_UNITY`: Time unit for log retention (`days`, `hours`, `minutes`, etc.).
- `VD_LOG_LIMIT_VALUE`: Number of time units before logs are deleted.
- `VD_LOG_GC_PROBABILITY`: Probability of triggering log garbage collection.
- `VD_LOG_GC_DIVISOR`: Divisor for log garbage collection calculation.
- `VD_LOG_AUTO_SEND_GITHUB`: Determines if logs should be automatically uploaded to GitHub (`true` or `false`).

---

## 📜 Available Scripts

| Command         | Description |
|----------------|-------------|
| `npm run start` | Runs the library (if applicable). |
| `npm run start:prod` | Runs in production mode. |
| `npm run build` | Minifies and prepares files for distribution. |

---

## 🤝 Contributing
If you want to contribute, feel free to open **issues** and **pull requests** in the repository!

---

## 📜 License
This project is licensed under the **MIT** license.