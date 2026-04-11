const fs = require('fs');
const path = require('path');
const Parser = require('./parser');
const CodeWriter = require('./codeWriter');


// output file name logic
const filePath = process.argv[2];
const fileName = path.basename(filePath, '.vm');
const outputFileName = `${fileName}.asm`;


// output path logic 
const outputPath = path.join(__dirname, 'out', outputFileName);

// instantiation
const parser = Parser.fromFile(filePath);
const assemblyWriter = new CodeWriter(outputPath);


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