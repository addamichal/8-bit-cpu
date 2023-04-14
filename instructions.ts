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

export class StaInstruction extends Instruction {
    constructor(value: number) {
        super(InstructionCodes.STA, value);
    }
}

export class LdiInstruction extends Instruction {
    constructor(value: number) {
        super(InstructionCodes.LDI, value);
    }
}

export class HltInstruction extends Instruction {
    constructor() {
        super(InstructionCodes.HLT, 0);
    }
}

export class AddInstruction extends Instruction {
    constructor(value: number) {
        super(InstructionCodes.ADD, value);
    }
}

export class SubInstruction extends Instruction {
    constructor(value: number) {
        super(InstructionCodes.SUB, value);
    }
}

export class JmpInstruction extends Instruction {
    constructor(value: number) {
        super(InstructionCodes.JMP, value);
    }
}

export class JcInstruction extends Instruction {
    constructor(value: number) {
        super(InstructionCodes.JC, value);
    }
}

export class JzInstruction extends Instruction {
    constructor(value: number) {
        super(InstructionCodes.JZ, value);
    }
}

export class OutInstruction extends Instruction {
    constructor(value: number) {
        super(InstructionCodes.OUT, value);
    }
}