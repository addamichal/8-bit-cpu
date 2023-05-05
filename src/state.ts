import { InstructionCode } from "./instructions";

export class ControlWord {
    [key: string]: number;

    HLT = 0;
    MI = 0;
    RI = 0;
    RO = 0;
    IO = 0;
    II = 0;
    AI = 0;
    AO = 0;
    EO = 0;
    SU = 0;
    BI = 0;
    OI = 0;
    CE = 0;
    CO = 0;
    J = 0;
    FI = 0;
}

export class State {
    private $_aRegister: number = 0;
    private $_bRegister: number = 0;
    private $_aluSubtract: number = 0;

    clock: number = 0;

    bus: number = 0;
    halted: number = 0;
    memoryAddress: number = 0;
    get memoryContent(): number {
        return this.ram[this.memoryAddress];
    };
    set memoryContent(value: number) {
        this.ram[this.memoryAddress] = value;
    }
    ram: number[] = [];
    instructionRegister = 0;

    opcodeCounter: number = 0;

    counter: number = 0;

    get aRegister(): number {
        return this.$_aRegister;
    };
    set aRegister(value: number) {
        this.$_aRegister = value;
        this.calculateAlu();
    }

    get bRegister(): number {
        return this.$_bRegister;
    };
    set bRegister(value: number) {
        this.$_bRegister = value;
        this.calculateAlu();
    };

    get aluSubtract(): number {
        return this.$_aluSubtract;
    }
    set aluSubtract(value: number) {
        this.$_aluSubtract = value;
        this.calculateAlu();
    }

    sumRegister: number = 0;
    sumRegisterZero: number = 0;
    sumRegisterOverflow: number = 0;

    outRegister: number = 0;
    carryFlag: number = 0;
    zeroFlag: number = 0;

    get controlWord(): ControlWord {
        let controlWord = new ControlWord();
        if (this.opcodeCounter === 0) {
            controlWord.CO = 1;
            controlWord.MI = 1;
        }
        if (this.opcodeCounter === 1) {
            controlWord.RO = 1;
            controlWord.II = 1;
            controlWord.CE = 1;
        }

        let instruction = this.instructionRegister >> 4;
        switch (instruction) {
            case InstructionCode.NOP:
                break;
            case InstructionCode.LDA:
                if (this.opcodeCounter === 2) {
                    controlWord.IO = 1;
                    controlWord.MI = 1;
                }
                if (this.opcodeCounter === 3) {
                    controlWord.RO = 1;
                    controlWord.AI = 1;
                }
                break;
            case InstructionCode.ADD:
                if (this.opcodeCounter === 2) {
                    controlWord.IO = 1;
                    controlWord.MI = 1;
                }
                if (this.opcodeCounter === 3) {
                    controlWord.RO = 1;
                    controlWord.BI = 1;
                }
                if (this.opcodeCounter === 4) {
                    controlWord.SU = 0;
                    controlWord.EO = 1;
                    controlWord.FI = 1;
                    controlWord.AI = 1;
                }
                break;
            case InstructionCode.SUB:
                if (this.opcodeCounter === 2) {
                    controlWord.IO = 1;
                    controlWord.MI = 1;
                }
                if (this.opcodeCounter === 3) {
                    controlWord.RO = 1;
                    controlWord.BI = 1;
                }
                if (this.opcodeCounter === 4) {
                    controlWord.SU = 0;
                    controlWord.EO = 1;
                    controlWord.FI = 1;
                    controlWord.AI = 1;
                }
                break;
            case InstructionCode.STA:
                if (this.opcodeCounter === 2) {
                    controlWord.IO = 1;
                    controlWord.MI = 1;
                }
                if (this.opcodeCounter === 3) {
                    controlWord.AO = 1;
                    controlWord.RI = 1;
                }
                break;
            case InstructionCode.LDI:
                // IO|AI
                if (this.opcodeCounter === 2) {
                    controlWord.IO = 1;
                    controlWord.AI = 1;
                }
                break;
            case InstructionCode.JMP:
                // IO|J
                if (this.opcodeCounter === 2) {
                    controlWord.IO = 1;
                    controlWord.J = 1;
                }
                break;
            case InstructionCode.JC:
                if (this.carryFlag && this.opcodeCounter === 2) {
                    controlWord.IO = 1;
                    controlWord.J = 1;
                }
                break;
            case InstructionCode.JZ:
                if (this.zeroFlag && this.opcodeCounter === 2) {
                    controlWord.IO = 1;
                    controlWord.J = 1;
                }
                break;
            case InstructionCode.OUT:
                if (this.opcodeCounter === 2) {
                    controlWord.AO = 1;
                    controlWord.OI = 1;
                }
                break;
            case InstructionCode.HLT:
                // HLT
                if (this.opcodeCounter === 2) {
                    controlWord.HLT = 1;
                }
                break;
        }
        return controlWord;
    }

    constructor() {
        for (let i = 0; i < 16; i++) {
            this.ram[i] = 0;
        }
    }

    copy(): State {
        let copy = new State();

        copy.clock = this.clock;
        copy.bus = this.bus;
        copy.halted = this.halted;
        copy.memoryAddress = this.memoryAddress;
        copy.ram = [...this.ram];
        copy.instructionRegister = this.instructionRegister;
        copy.opcodeCounter = this.opcodeCounter;
        copy.counter = this.counter;
        copy.aRegister = this.aRegister;
        copy.bRegister = this.bRegister;
        copy.sumRegister = this.sumRegister;
        copy.aluSubtract = this.aluSubtract;
        copy.sumRegisterOverflow = this.sumRegisterOverflow;
        copy.zeroFlag = this.zeroFlag;
        copy.outRegister = this.outRegister;
        copy.carryFlag = this.carryFlag;
        copy.zeroFlag = this.zeroFlag;

        return copy;
    }

    calculateAlu() {
        let temp = this.aluSubtract
            ? ((~this.bRegister & 255) + 1) & 255
            : this.bRegister;

        let result = this.aRegister + temp;
        if (result >= 256) {
            this.sumRegisterOverflow = 1;
        } else {
            this.sumRegisterOverflow = 0;
        }

        this.sumRegister = result & 255;
        this.sumRegisterZero = this.sumRegister === 0 ? 1 : 0;
    }
}