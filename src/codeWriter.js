const fs = require('fs');

class CodeWriter {
  constructor(outputPath) {
    this.outputFile = fs.createWriteStream(outputPath, { flags: 'w' });
  }

  setFileName(fileName) {}

  writeArithmetic(command) { // command type -> assembly equivalent
    
  } 
    

  writePushPop(command, segment, index) { // command type -> assembly equivalent
    let assemblyCommand = `${command} ${segment} ${index}\n`;
    // console.log('command type: ', typeof command, ', segment type: ', 
    //   typeof segment, ', index type: ', typeof index);
    // string string number
    this.outputFile.write(`// ${command} ${segment} ${index}\n`)    

    switch (command) {

      case 'C_PUSH':
        if (segment === 'constant') {
          let pushStack = `@${index}\nD=A\n@SP\nA=M\nM=D`;
          let incPointer = `@SP\nM=M+1`;
          // this.outputFile.write(
          //   `@${index}\nD=A\n@SP\nA=M\nM=D\n@SP\nM=M+1\n`
          // );
          this.outputFile.write(
            pushStack + '\n' + incPointer + '\n');
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