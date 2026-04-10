const Parser = require('./parser');

const parser = Parser.fromFile('./tests/StackArithmetic/SimpleAdd/SimpleAdd.vm'); // file
const manualParser = Parser.fromString("push constant 10 ; push constant 20 ; add"); // array

console.log(parser);
console.log(manualParser);