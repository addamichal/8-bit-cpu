export const instructions = {
    NOP: 0,     // 0000
    LDA: 1,     // 0001
    ADD: 2,     // 0010
    SUB: 3,     // 0011
    STA: 4,     // 0100
    LDI: 5,     // 0101
    JMP: 6,     // 0110
    JC: 7,      // 0111
    JZ: 8,      // 1000
    OUT: 14,    // 1110
    HLT: 15,     // 1111

    getInstructionName(value: number): string {
        return Object.keys(this).filter(key => this[key as keyof typeof instructions] === value)[0];
    }
}