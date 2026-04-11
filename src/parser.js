const fs = require('fs');

class Parser {

  constructor(commands) { // only for internal use, use fromFile or fromString to create an instance
    this.commands = commands;
    this.currentIndex = 0;
    this.currentCommand = null; // dont forget to advance() to set the first command before accessing it
  }

  static fromFile (filePath) { // Read the file content, clean it up and create a Parser instance.
    const rawFileContent = fs.readFileSync(filePath, 'utf-8');
    const cleaned = rawFileContent
      .split(/\r?\n/) // break the file into lines
      .map(line => line.split('//')[0]) // remove comments and [0] to get the command part
      .map(line => line.trim()) // remove leading and trailing whitespace
      .filter(line => line.length > 0); // filter out empty lines
    
    return new Parser(cleaned);
  }

  static fromString(text) { // Clean the input string and create a Parser instance.
    const cleaned = text.split(';').map(s => s.trim());
    return new Parser(cleaned);
  }


  hasMoreCommands() {
    return this.currentIndex < this.commands.length;
  }

  advance() {
    if (this.hasMoreCommands()) { // Check if there are more commands to process.
      this.currentCommand = this.commands[this.currentIndex];
      this.currentIndex++;
    }
  }

  commandType() {
    const C_ARITHMETIC_COMMANDS = [
      'add', 'sub', 'neg', 
      'eq', 'gt', 'lt', 
      'and', 'or', 'not'
    ]

  
    if (this.currentCommand.startsWith('push')) return 'C_PUSH';
    if (this.currentCommand.startsWith('pop')) return 'C_POP';

     if (
      C_ARITHMETIC_COMMANDS.includes(this.currentCommand)
    ) return 'C_ARITHMETIC';
  }

  arg1() {
    const args = this.currentCommand.split(' ');
    if (this.commandType() === 'C_ARITHMETIC') {
      return args[0]; // For arithmetic commands, the command itself is the first argument.
    } else {
      return args[1]; // For other commands, the first argument is the second word.
    }
    return null; // Return null if there are no arguments (e.g., for C_RETURN).
  }

  arg2() {
    const parts = this.currentCommand.split(' ');
    return parseInt(parts[2]);
  }
}

module.exports = Parser;