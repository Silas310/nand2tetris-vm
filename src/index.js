const fs = require('fs');
const path = require('path');
const Parser = require('./parser');
const CodeWriter = require('./codeWriter');

const inputPath = process.argv[2];

if (!inputPath) { // no path provided
  console.error('Usage: npm start <input.vm | input-directory>');
  process.exit(1);
}

if (!fs.existsSync(inputPath)) { // path does not exist
  console.error(`Input path not found: ${inputPath}`);
  process.exit(1);
}

const stat = fs.statSync(inputPath); // check if it's a file or directory

let vmFiles = [];
let outputBaseName = '';

if (stat.isDirectory()) { // if it's a directory
  vmFiles = fs // read all .vm files in the directory
    .readdirSync(inputPath) // read all files in the directory
    .filter(file => path.extname(file).toLowerCase() === '.vm') // filter only .vm files
    .map(file => path.join(inputPath, file)) // get full path of each .vm file
    .sort(); // sort files alphabetically for consistent output

  if (vmFiles.length === 0) { // no .vm files found in the directory
    console.error(`No .vm files found in directory: ${inputPath}`);
    process.exit(1);
  }

  outputBaseName = path.basename(inputPath);
} else { // if it's a file
  if (path.extname(inputPath).toLowerCase() !== '.vm') {
    console.error(`Input file must have .vm extension: ${inputPath}`);
    process.exit(1);
  }

  vmFiles = [inputPath];
  outputBaseName = path.basename(inputPath, '.vm');
}

const outputDirectory = path.join(__dirname, '..', 'out');
fs.mkdirSync(outputDirectory, { recursive: true });

const outputPath = path.join(outputDirectory, `${outputBaseName}.asm`);
const assemblyWriter = new CodeWriter(outputPath);

for (const vmFilePath of vmFiles) {
  const parser = Parser.fromFile(vmFilePath);
  assemblyWriter.setFileName(path.basename(vmFilePath, '.vm'));

  while (parser.hasMoreCommands()) {
    parser.advance();
    const commandType = parser.commandType();

    switch (commandType) {
      case 'C_PUSH':
      case 'C_POP':
        assemblyWriter.writePushPop(
          commandType,
          parser.arg1(),
          parser.arg2()
        );
        break;

      case 'C_ARITHMETIC':
        assemblyWriter.writeArithmetic(parser.arg1());
        break;

      default:
        break;
    }
  }
}

assemblyWriter.close();
console.log(`${outputBaseName}.asm compiled from: ${inputPath}`);



// const outputFileName = filePath // split, get last part and replace .vm with .asm
//   .split('/')
//   .at(-1)
//   .replace('.vm', '.asm');
// console.log('out file name: ', outputFileName);


// const parser = Parser.fromFile('./tests/StackArithmetic/SimpleAdd/SimpleAdd.vm'); // file
// const manualParser = Parser.fromString("push constant 10 ; push constant 20 ; add ;"); // array

// console.log('from file: \n', parser);
// console.log('from string', manualParser);

// manualParser.advance();
// console.log('current command: ', manualParser.currentCommand);
// console.log('command type: ', manualParser.commandType());
// console.log('arg1: ', manualParser.arg1());
// console.log('arg2: ', manualParser.arg2());