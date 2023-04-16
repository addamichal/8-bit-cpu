export interface State {
    halted: number;
    memoryAddress: number;
    memoryContent: number;
    ram: number[],
    instructionRegister: number;
    counter: number;
    aRegister: number;
    bRegister: number;
    sumRegister: number;
    outRegister: number;
    carryFlag: number;
    zeroFlag: number;

    copy(): State;
}