export enum InstructionCodes {
    NOP = 0,     // 0000
    LDA = 1,     // 0001
    ADD = 2,     // 0010
    SUB = 3,     // 0011
    STA = 4,     // 0100
    LDI = 5,     // 0101
    JMP = 6,     // 0110
    JC = 7,      // 0111
    JZ = 8,      // 1000
    OUT = 14,    // 1110
    HLT = 15,     // 1111
}

export class Instruction {
    instructionCode: InstructionCodes
    value: number;

    constructor(instructionCode: number, value: number) {
        this.instructionCode = instructionCode;
        this.value = value;
    }

    toNumber() {
        let instructionCodeHex = this.instructionCode.toString(16);
        let valueHex = this.value.toString(16);
        let hexValue = instructionCodeHex + valueHex;
        return parseInt(hexValue, 16);
    }
}

export class NopInstruction extends Instruction {
    constructor() {
        super(InstructionCodes.NOP, 0);
    }
}

export class LdaInstruction extends Instruction {
    constructor(value: number) {
        super(InstructionCodes.LDA, value);
    }
}