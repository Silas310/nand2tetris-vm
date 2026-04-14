const fs = require('fs');

class CodeWriter {
  constructor(outputPath) {
    this.outputFile = fs.createWriteStream(outputPath, { flags: 'w' });
    this.labelCounter = 0;
  }

    binaryMap = {
      'add': `M=D+M`,
      'sub': `M=M-D`,
      'and': `M=D&M`,
      'or': `M=D|M`
    };

    unaryMap = {
      'neg': `M=-M`,
      'not': `M=!M`
    };

    comparisonMap = {
      'eq': 'D;JEQ',
      'gt': 'D;JGT',
      'lt': 'D;JLT'
    };
  

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
    assembly += this._incrementSP() + '\n';
    return assembly;
  }

  _writeUnaryArithmetic(operation) { // dry for neg, not
    let assembly = "";
    assembly += this._decrementSP();
    assembly += '\n';
    assembly += `A=M\n`;
    assembly += `${operation}\n`;
    assembly += this._incrementSP() + '\n';
    return assembly;
  }

  _writeComparisonArithmetic(operation) { // dry for eq, gt, lt
    let assembly = "";

    const labelTrue = `TRUE_IF_${this.labelCounter}`;
    const labelEnd = `END_IF${this.labelCounter}`;

    this.labelCounter += 1;

    assembly += this._decrementSP() + '\n'; // pick y
    assembly += 'A=M\nD=M\n'; // D = y | y = top of stack
    assembly += this._decrementSP() + '\n'; // pick x
    assembly += 'A=M\n'; // A = address of x
    assembly += 'D=M-D\n'; // D = x - y 

    assembly += `@${labelTrue}\n`;
    assembly += `${operation}\n`; // jump to TRUE_IF_X if condition is true

    assembly += `@SP\nA=M\nM=0\n`; // condition false = push 0
    assembly += `@${labelEnd}\n`;
    assembly += `0;JMP\n`; // jump to end

    assembly += `(${labelTrue})\n`; // if condition is true, push -1 (true) to stack
    assembly += `@SP\nA=M\nM=-1\n`; // condition true = push -1
    assembly += `(${labelEnd})\n`; 

    assembly += this._incrementSP() + '\n'; // after write result

    return assembly;
  }


  setFileName(fileName) {}

  writeArithmetic(command) { // command type -> assembly equivalent
    this.outputFile.write(`// ${command}\n`);

    
    switch (command) {
      case 'add': // binary operations -> pop 2 values, perform operation and push result
      case 'sub':
      case 'and':
      case 'or': {
        this.outputFile.write(this._writeBinaryArithmetic(this.binaryMap[command]));
        break;
      }

      case 'neg': // unary operations -> pop 1 value, perform operation and push result
      case 'not': {
        this.outputFile.write(this._writeUnaryArithmetic(this.unaryMap[command]));
        break;
      }

      case 'eq': // comparison operations -> pop 2 values, perform operation and push true (-1) or false (0)
      case 'gt':
      case 'lt': {
        this.outputFile.write(this._writeComparisonArithmetic(this.comparisonMap[command]));
      }
      break;

      default:
        break;
    }
  }
    

  writePushPop(command, segment, index) { // command type -> assembly equivalent
    let assemblyCommand = `${command} ${segment} ${index}`;
    // console.log('command type: ', typeof command, ', segment type: ', 
    //   typeof segment, ', index type: ', typeof index);
    // string string number
    this.outputFile.write(`// ${assemblyCommand}\n`);    

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