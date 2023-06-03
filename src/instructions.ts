export enum OpCode {
  HLT = 'HLT',
  MI = 'MI',
  RI = 'RI',
  RO = 'RO',
  IO = 'IO',
  II = 'II',
  AI = 'AI',
  AO = 'AO',
  EO = 'EO',
  SU = 'SU',
  BI = 'BI',
  OI = 'OI',
  CE = 'CE',
  CO = 'CO',
  J = 'J',
  FI = 'FI'
}

export enum InstructionCode {
  NOP = 0,
  LDA = 1,
  ADD = 2,
  SUB = 3,
  STA = 4,
  LDI = 5,
  JMP = 6,
  JC = 7,
  JZ = 8,
  OUT = 14,
  HLT = 15
}

export class Instruction {
  instructionCode: InstructionCode;
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
    super(InstructionCode.NOP, 0);
  }
}

export class LdaInstruction extends Instruction {
  constructor(value: number) {
    super(InstructionCode.LDA, value);
  }
}

export class StaInstruction extends Instruction {
  constructor(value: number) {
    super(InstructionCode.STA, value);
  }
}

export class LdiInstruction extends Instruction {
  constructor(value: number) {
    super(InstructionCode.LDI, value);
  }
}

export class HltInstruction extends Instruction {
  constructor() {
    super(InstructionCode.HLT, 0);
  }
}

export class AddInstruction extends Instruction {
  constructor(value: number) {
    super(InstructionCode.ADD, value);
  }
}

export class SubInstruction extends Instruction {
  constructor(value: number) {
    super(InstructionCode.SUB, value);
  }
}

export class JmpInstruction extends Instruction {
  constructor(value: number) {
    super(InstructionCode.JMP, value);
  }
}

export class JcInstruction extends Instruction {
  constructor(value: number) {
    super(InstructionCode.JC, value);
  }
}

export class JzInstruction extends Instruction {
  constructor(value: number) {
    super(InstructionCode.JZ, value);
  }
}

export class OutInstruction extends Instruction {
  constructor() {
    super(InstructionCode.OUT, 0);
  }
}
