export interface State {
    halted: number;
    counter: number;
    aRegister: number;
    bRegister: number;
    sumRegister: number;
    outRegister: number;
    carryFlag: number;
    zeroFlag: number;
    ram: number[],

    copy(): State;
}