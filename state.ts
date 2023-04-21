export class State {
    private $_aRegister: number = 0;
    private $_bRegister: number = 0;
    private $_aluSubtract: number = 0;

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

    constructor() {
        for (let i = 0; i < 16; i++) {
            this.ram[i] = 0;
        }
    }

    copy(): State {
        let copy = new State();

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