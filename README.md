# VM Translator - Nand2Tetris

## Summary / Sumário
* [English Version](#-english)
    * [Description](#description)
    * [Instruction Types](#instruction-types)
    * [How to Use](#how-to-use)
* [Versão em Português](#-português)
    * [Descrição](#descrição)
    * [Tipos de Instruções](#tipos-de-instruções)
    * [Como Usar](#como-usar)

---

## 🇺🇸 English

### Description
This is a VM Translator implementation developed for Project 07 and eventually Project 08 of the [Nand2Tetris](https://www.nand2tetris.org/) course. The program is responsible for translating intermediate Virtual Machine code (`.vm`) into Hack Assembly (`.asm`).

### Instruction Types

#### 🔢 Arithmetic (Ch. 7)
Performs arithmetic and logical operations (`add`, `sub`, `neg`, `eq`, `gt`, `lt`, `and`, `or`, `not`) using a **Stack**-based architecture.

#### 💾 Memory Access (Ch. 7)
Consists of the `push` command, which adds an item to the top of the stack, and the `pop` command, which removes and retrieves an item from the top to a specific memory segment.

#### 🔄 Program Flow & Functions (Ch. 8)
Soon...

### How to Use
1. Ensure you have [Node.js](https://nodejs.org/) installed.
2. Run the translator by passing your script and the input file path:
```bash
npm start path/to/your/file.vm
```
## 🇧🇷 Português
### Descrição
Este é uma implementação do VM translator desenvolvido como parte do Projeto 07 e futuramente Projeto 8 do curso [Nand2Tetris](https://www.nand2tetris.org/). O programa é responsável por traduzir o um código intermediário (`.vm`) em Hack Assembly (`.asm`).

### Tipos de instruções
#### Aritmética (Cap 7)
Realiza operações aritméticas e lógicas (`add`, `sub`, `neg`, `eq`, `gt`, `lt`, `and`, `or`, `not`) usando arquitetura baseada em **Pilha**.

#### Acesso à Memória
Composto do comando `push` que adiciona um item o topo da pilha, e do comando `pop`, que remove um item também do topo e o recupera pra um segmento específico da memória.

#### Controle de fluxo e funções(Cap 8)
Em breve...

### Como Usar
1. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.
2. Execute o assembler informando o caminho do arquivo de entrada:
```bash
npm start caminho/para/seu/arquivo.vm