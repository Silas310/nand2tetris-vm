const fs = require('fs');

class CodeWriter {
  constructor(outputPath) {
    this.outputFile = fs.createWriteStream(outputPath, { flags: 'w' });
  }

  _incrementSP() {
    return `@SP\nM=M+1`;
  }

  _decrementSP() {
    return `@SP\nM=M-1`;
  }

  _writeBinaryArithmetic(operation) { // dry for add, sub, and, or
    let assembly = "";
    assembly += this._decrementSP();
    assembly += '\n';
    assembly += `A=M\nD=M\n`;
    assembly += this._decrementSP();
    assembly += '\n';
    assembly += `A=M\n`;
    assembly += `${operation}\n`;
    assembly += this._incrementSP();
    return assembly;
  }

  setFileName(fileName) {}

  writeArithmetic(command) { // command type -> assembly equivalent
    this.outputFile.write(`// ${command}\n`);
  
    const subAndSave = `M=M-D`;
    const sumAndSave = `M=D+M`;
    const andAndSave = `M=D&M`;
    const orAndSave = `M=D|M`;
    
    switch (command) {
      case 'add': // binary operations -> pop 2 values, perform operation and push result
      case 'sub':
      case 'and':
      case 'or': {
        const operations = {
          'add': sumAndSave,
          'sub': subAndSave,
          'and': andAndSave,
          'or': orAndSave
        };
        this.outputFile.write(this._writeBinaryArithmetic(operations[command]));
        break;
      }

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