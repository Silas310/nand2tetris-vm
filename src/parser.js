const fs = require('fs');

class Parser {
  constructor(filePath) {
    const rawFileContent = fs.readFileSync(filePath, 'utf-8');
    this.commands = rawFileContent
      .split(/\r?\n/) // break the file into lines
      .map(line => line.split('//')[0]) // remove comments and [0] to get the command part
      .map(line => line.trim()) // remove leading and trailing whitespace
      .filter(line => line.length > 0); // filter out empty lines

    this.currentIndex = 0;
    this.currentCommand = null;
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
  }

  arg2() {
    const parts = this.currentCommand.split(' ');
    return parseInt(parts[2])
  }
}