const fs = require('fs');

class CodeWriter {
  constructor(outputPath) {
    this.outputFile = fs.createWriteStream(outputPath, { flags: 'w' });
  }

  _incrementSP() {
    this.outputFile.write(`@SP\nM=M+1\n`);
  }

  _decrementSP() {
    this.outputFile.write(`@SP\nM=M-1\n`);
  }

  setFileName(fileName) {}

  writeArithmetic(command) { // command type -> assembly equivalent
    let assemblyCommand = command;
    this.outputFile.write(`// ${assemblyCommand}\n`);
    
    switch (command) {
      case 'add':
        const decPointer = this._decrementSP();
        const poppedValue = `A=M\nD=M`;
        const sumAndSave = `@SP\nA=M\nM=D+M`;
        const incPointer = this._incrementSP();
        this.outputFile.write(
          decPointer + '\n' + poppedValue + '\n' + decPointer + '\n' 
          + sumAndSave + '\n' + incPointer + '\n'
        );
        break;
    
      default:
        break;
    }
  }
    

  writePushPop(command, segment, index) { // command type -> assembly equivalent
    let assemblyCommand = `${command} ${segment} ${index}\n`;
    // console.log('command type: ', typeof command, ', segment type: ', 
    //   typeof segment, ', index type: ', typeof index);
    // string string number
    this.outputFile.write(`// ${command} ${segment} ${index}\n`)    

    switch (command) {

      case 'C_PUSH':
        const pushStack = `@${index}\nD=A\n@SP\nA=M\nM=D`;
        const incPointer = this._incrementSP();
        if (segment === 'constant') {
          // this.outputFile.write(
          //   `@${index}\nD=A\n@SP\nA=M\nM=D\n@SP\nM=M+1\n`
          // );
          this.outputFile.write(
            pushStack + '\n' + incPointer + '\n'
          );
        }
        break;

      case 'C_POP':
        break;
    
      default:
        break;
    }
  }

  close() {
    this.outputFile.end();
  }
}

module.exports = CodeWriter;