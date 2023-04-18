export class State {
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
    counter: number = 0;
    aRegister: number = 0;
    bRegister: number = 0;
    sumRegister: number = 0;
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
        copy.counter = this.counter;
        copy.aRegister = this.aRegister;
        copy.bRegister = this.bRegister;
        copy.sumRegister = this.sumRegister;
        copy.outRegister = this.outRegister;
        copy.carryFlag = this.carryFlag;
        copy.zeroFlag = this.zeroFlag;

        return copy;
    }
}