"use strict";
define("instructions", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OutInstruction = exports.JzInstruction = exports.JcInstruction = exports.JmpInstruction = exports.SubInstruction = exports.AddInstruction = exports.HltInstruction = exports.LdiInstruction = exports.StaInstruction = exports.LdaInstruction = exports.NopInstruction = exports.Instruction = exports.InstructionCodes = exports.Opcodes = void 0;
    var Opcodes;
    (function (Opcodes) {
        Opcodes[Opcodes["HLT"] = 0] = "HLT";
        Opcodes[Opcodes["MI"] = 1] = "MI";
        Opcodes[Opcodes["RI"] = 2] = "RI";
        Opcodes[Opcodes["RO"] = 3] = "RO";
        Opcodes[Opcodes["IO"] = 4] = "IO";
        Opcodes[Opcodes["II"] = 5] = "II";
        Opcodes[Opcodes["AI"] = 6] = "AI";
        Opcodes[Opcodes["AO"] = 7] = "AO";
        Opcodes[Opcodes["EO"] = 8] = "EO";
        Opcodes[Opcodes["SU"] = 9] = "SU";
        Opcodes[Opcodes["BI"] = 10] = "BI";
        Opcodes[Opcodes["OI"] = 11] = "OI";
        Opcodes[Opcodes["CE"] = 12] = "CE";
        Opcodes[Opcodes["CO"] = 13] = "CO";
        Opcodes[Opcodes["J"] = 14] = "J";
        Opcodes[Opcodes["FI"] = 15] = "FI";
    })(Opcodes = exports.Opcodes || (exports.Opcodes = {}));
    var InstructionCodes;
    (function (InstructionCodes) {
        InstructionCodes[InstructionCodes["NOP"] = 0] = "NOP";
        InstructionCodes[InstructionCodes["LDA"] = 1] = "LDA";
        InstructionCodes[InstructionCodes["ADD"] = 2] = "ADD";
        InstructionCodes[InstructionCodes["SUB"] = 3] = "SUB";
        InstructionCodes[InstructionCodes["STA"] = 4] = "STA";
        InstructionCodes[InstructionCodes["LDI"] = 5] = "LDI";
        InstructionCodes[InstructionCodes["JMP"] = 6] = "JMP";
        InstructionCodes[InstructionCodes["JC"] = 7] = "JC";
        InstructionCodes[InstructionCodes["JZ"] = 8] = "JZ";
        InstructionCodes[InstructionCodes["OUT"] = 14] = "OUT";
        InstructionCodes[InstructionCodes["HLT"] = 15] = "HLT";
    })(InstructionCodes = exports.InstructionCodes || (exports.InstructionCodes = {}));
    class Instruction {
        constructor(instructionCode, value) {
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
    exports.Instruction = Instruction;
    class NopInstruction extends Instruction {
        constructor() {
            super(InstructionCodes.NOP, 0);
        }
    }
    exports.NopInstruction = NopInstruction;
    class LdaInstruction extends Instruction {
        constructor(value) {
            super(InstructionCodes.LDA, value);
        }
    }
    exports.LdaInstruction = LdaInstruction;
    class StaInstruction extends Instruction {
        constructor(value) {
            super(InstructionCodes.STA, value);
        }
    }
    exports.StaInstruction = StaInstruction;
    class LdiInstruction extends Instruction {
        constructor(value) {
            super(InstructionCodes.LDI, value);
        }
    }
    exports.LdiInstruction = LdiInstruction;
    class HltInstruction extends Instruction {
        constructor() {
            super(InstructionCodes.HLT, 0);
        }
    }
    exports.HltInstruction = HltInstruction;
    class AddInstruction extends Instruction {
        constructor(value) {
            super(InstructionCodes.ADD, value);
        }
    }
    exports.AddInstruction = AddInstruction;
    class SubInstruction extends Instruction {
        constructor(value) {
            super(InstructionCodes.SUB, value);
        }
    }
    exports.SubInstruction = SubInstruction;
    class JmpInstruction extends Instruction {
        constructor(value) {
            super(InstructionCodes.JMP, value);
        }
    }
    exports.JmpInstruction = JmpInstruction;
    class JcInstruction extends Instruction {
        constructor(value) {
            super(InstructionCodes.JC, value);
        }
    }
    exports.JcInstruction = JcInstruction;
    class JzInstruction extends Instruction {
        constructor(value) {
            super(InstructionCodes.JZ, value);
        }
    }
    exports.JzInstruction = JzInstruction;
    class OutInstruction extends Instruction {
        constructor() {
            super(InstructionCodes.OUT, 0);
        }
    }
    exports.OutInstruction = OutInstruction;
});
define("state", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.State = void 0;
    class State {
        get memoryContent() {
            return this.ram[this.memoryAddress];
        }
        ;
        set memoryContent(value) {
            this.ram[this.memoryAddress] = value;
        }
        get aRegister() {
            return this.$_aRegister;
        }
        ;
        set aRegister(value) {
            this.$_aRegister = value;
            this.calculateAlu();
        }
        get bRegister() {
            return this.$_bRegister;
        }
        ;
        set bRegister(value) {
            this.$_bRegister = value;
            this.calculateAlu();
        }
        ;
        get aluSubtract() {
            return this.$_aluSubtract;
        }
        set aluSubtract(value) {
            this.$_aluSubtract = value;
            this.calculateAlu();
        }
        constructor() {
            this.$_aRegister = 0;
            this.$_bRegister = 0;
            this.$_aluSubtract = 0;
            this.bus = 0;
            this.halted = 0;
            this.memoryAddress = 0;
            this.ram = [];
            this.instructionRegister = 0;
            this.opcodeCounter = 0;
            this.counter = 0;
            this.sumRegister = 0;
            this.sumRegisterZero = 0;
            this.sumRegisterOverflow = 0;
            this.outRegister = 0;
            this.carryFlag = 0;
            this.zeroFlag = 0;
            for (let i = 0; i < 16; i++) {
                this.ram[i] = 0;
            }
        }
        copy() {
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
            }
            else {
                this.sumRegisterOverflow = 0;
            }
            this.sumRegister = result & 255;
            this.sumRegisterZero = this.sumRegister === 0 ? 1 : 0;
        }
    }
    exports.State = State;
});
// TODO unify vocabulary?
// TODO add instruction parser
// TODO add UI
// TODO add used resources
// TODO add readme
// TODO more sample programs?
// todo snake or game of life?
define("emulator", ["require", "exports", "instructions", "state"], function (require, exports, instructions_1, state_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getInitState = exports.nextInstruction = exports.handleOpcodes = exports.handleOpcode = exports.run = void 0;
    function run(initState) {
        let currentState = initState;
        while (currentState.halted !== 1) {
            let nextState = nextInstruction(currentState);
            currentState = nextState;
        }
        return currentState;
    }
    exports.run = run;
    function handleOpcode(opcode, opCodeValue, currentState) {
        let newState = currentState.copy();
        switch (opcode) {
            case instructions_1.Opcodes.HLT:
                newState.halted = opCodeValue;
                return newState;
            case instructions_1.Opcodes.MI:
                if (opCodeValue) {
                    newState.memoryAddress = newState.bus;
                }
                return newState;
            case instructions_1.Opcodes.RI:
                if (opCodeValue) {
                    newState.memoryContent = newState.bus;
                }
                return newState;
            case instructions_1.Opcodes.RO:
                if (opCodeValue) {
                    newState.bus = newState.memoryContent;
                }
                return newState;
            case instructions_1.Opcodes.IO:
                if (opCodeValue) {
                    newState.bus = newState.instructionRegister & 15;
                }
                return newState;
            case instructions_1.Opcodes.II:
                if (opCodeValue) {
                    newState.instructionRegister = newState.bus;
                }
                return newState;
            case instructions_1.Opcodes.AI:
                if (opCodeValue) {
                    newState.aRegister = newState.bus;
                }
                return newState;
            case instructions_1.Opcodes.AO:
                if (opCodeValue) {
                    newState.bus = newState.aRegister;
                }
                return newState;
            case instructions_1.Opcodes.EO:
                if (opCodeValue) {
                    newState.bus = newState.sumRegister;
                }
                return newState;
            case instructions_1.Opcodes.SU:
                newState.aluSubtract = opCodeValue;
                return newState;
            case instructions_1.Opcodes.BI:
                if (opCodeValue) {
                    newState.bRegister = newState.bus;
                }
                return newState;
            case instructions_1.Opcodes.OI:
                if (opCodeValue) {
                    newState.outRegister = newState.bus;
                }
                return newState;
            case instructions_1.Opcodes.CE:
                if (opCodeValue) {
                    newState.counter = (newState.counter + 1) & 15;
                }
                return newState;
            case instructions_1.Opcodes.CO:
                if (opCodeValue) {
                    newState.bus = newState.counter;
                }
                return newState;
            case instructions_1.Opcodes.J:
                if (opCodeValue) {
                    newState.counter = newState.bus;
                }
                return newState;
            case instructions_1.Opcodes.FI:
                if (opCodeValue) {
                    newState.zeroFlag = newState.sumRegisterZero;
                    newState.carryFlag = newState.sumRegisterOverflow;
                }
                return newState;
            default:
                throw new Error('Unknown opcode: ' + opcode);
        }
    }
    exports.handleOpcode = handleOpcode;
    function handleOpcodes(currentState) {
        let newState = currentState.copy();
        // MI|CO
        if (currentState.opcodeCounter === 0) {
            newState = handleOpcode(instructions_1.Opcodes.CO, 1, newState);
            newState = handleOpcode(instructions_1.Opcodes.MI, 1, newState);
        }
        // RO|II|CE
        if (currentState.opcodeCounter === 1) {
            newState = handleOpcode(instructions_1.Opcodes.RO, 1, newState);
            newState = handleOpcode(instructions_1.Opcodes.II, 1, newState);
            newState = handleOpcode(instructions_1.Opcodes.CE, 1, newState);
        }
        let instruction = newState.instructionRegister >> 4;
        switch (instruction) {
            case instructions_1.InstructionCodes.NOP:
                break;
            case instructions_1.InstructionCodes.LDA:
                // IO|MI
                if (newState.opcodeCounter === 2) {
                    newState = handleOpcode(instructions_1.Opcodes.IO, 1, newState);
                    newState = handleOpcode(instructions_1.Opcodes.MI, 1, newState);
                }
                // RO|AI
                if (newState.opcodeCounter === 3) {
                    newState = handleOpcode(instructions_1.Opcodes.RO, 1, newState);
                    newState = handleOpcode(instructions_1.Opcodes.AI, 1, newState);
                }
                break;
            case instructions_1.InstructionCodes.ADD:
                // IO|MI
                if (newState.opcodeCounter === 2) {
                    newState = handleOpcode(instructions_1.Opcodes.IO, 1, newState);
                    newState = handleOpcode(instructions_1.Opcodes.MI, 1, newState);
                }
                // RO|BI
                if (newState.opcodeCounter === 3) {
                    newState = handleOpcode(instructions_1.Opcodes.RO, 1, newState);
                    newState = handleOpcode(instructions_1.Opcodes.BI, 1, newState);
                }
                // EO|AI|FI
                if (newState.opcodeCounter === 4) {
                    newState = handleOpcode(instructions_1.Opcodes.SU, 0, newState);
                    newState = handleOpcode(instructions_1.Opcodes.EO, 1, newState);
                    newState = handleOpcode(instructions_1.Opcodes.FI, 1, newState);
                    newState = handleOpcode(instructions_1.Opcodes.AI, 1, newState);
                }
                break;
            case instructions_1.InstructionCodes.SUB:
                // IO|MI
                if (newState.opcodeCounter === 2) {
                    newState = handleOpcode(instructions_1.Opcodes.IO, 1, newState);
                    newState = handleOpcode(instructions_1.Opcodes.MI, 1, newState);
                }
                // RO|BI
                if (newState.opcodeCounter === 3) {
                    newState = handleOpcode(instructions_1.Opcodes.RO, 1, newState);
                    newState = handleOpcode(instructions_1.Opcodes.BI, 1, newState);
                }
                // EO|AI|SU|FI
                if (newState.opcodeCounter === 4) {
                    newState = handleOpcode(instructions_1.Opcodes.SU, 1, newState);
                    newState = handleOpcode(instructions_1.Opcodes.EO, 1, newState);
                    newState = handleOpcode(instructions_1.Opcodes.FI, 1, newState);
                    newState = handleOpcode(instructions_1.Opcodes.AI, 1, newState);
                }
                break;
            case instructions_1.InstructionCodes.STA:
                // IO|MI
                if (newState.opcodeCounter === 2) {
                    newState = handleOpcode(instructions_1.Opcodes.IO, 1, newState);
                    newState = handleOpcode(instructions_1.Opcodes.MI, 1, newState);
                }
                // AO|RI
                if (newState.opcodeCounter === 3) {
                    newState = handleOpcode(instructions_1.Opcodes.AO, 1, newState);
                    newState = handleOpcode(instructions_1.Opcodes.RI, 1, newState);
                }
                break;
            case instructions_1.InstructionCodes.LDI:
                // IO|AI
                if (newState.opcodeCounter === 2) {
                    newState = handleOpcode(instructions_1.Opcodes.IO, 1, newState);
                    newState = handleOpcode(instructions_1.Opcodes.AI, 1, newState);
                }
                break;
            case instructions_1.InstructionCodes.JMP:
                // IO|J
                if (newState.opcodeCounter === 2) {
                    newState = handleOpcode(instructions_1.Opcodes.IO, 1, newState);
                    newState = handleOpcode(instructions_1.Opcodes.J, 1, newState);
                }
                break;
            case instructions_1.InstructionCodes.JC:
                if (newState.carryFlag && newState.opcodeCounter === 2) {
                    // IO|J
                    newState = handleOpcode(instructions_1.Opcodes.IO, 1, newState);
                    newState = handleOpcode(instructions_1.Opcodes.J, 1, newState);
                }
                break;
            case instructions_1.InstructionCodes.JZ:
                if (newState.zeroFlag && newState.opcodeCounter === 2) {
                    // IO|J
                    newState = handleOpcode(instructions_1.Opcodes.IO, 1, newState);
                    newState = handleOpcode(instructions_1.Opcodes.J, 1, newState);
                }
                break;
            case instructions_1.InstructionCodes.OUT:
                // AO|OI
                if (newState.opcodeCounter === 2) {
                    newState = handleOpcode(instructions_1.Opcodes.AO, 1, newState);
                    newState = handleOpcode(instructions_1.Opcodes.OI, 1, newState);
                }
                break;
            case instructions_1.InstructionCodes.HLT:
                // HLT
                if (newState.opcodeCounter === 2) {
                    newState = handleOpcode(instructions_1.Opcodes.HLT, 1, newState);
                }
                break;
            default:
                throw new Error('Unknown instruction: ' + newState.instructionRegister);
        }
        return newState;
    }
    exports.handleOpcodes = handleOpcodes;
    function nextInstruction(currentState) {
        let nextState = currentState;
        nextState.opcodeCounter = 0;
        for (let i = 0; i < 5; i++) {
            nextState = handleOpcodes(nextState);
            nextState.opcodeCounter++;
        }
        nextState.opcodeCounter = 0;
        return nextState;
    }
    exports.nextInstruction = nextInstruction;
    function getInitState() {
        return new state_1.State();
    }
    exports.getInitState = getInitState;
});
// TODO
// add / generate favicon
// bus column should fix the size of bus, other 2 columns should be uniform
// rewrite to typescript
// connect to actual execution code
// optimize for phones
// set output value
// set control word value
// set op codes counter + rename it correctly based on ben eater's naming convention
// add ui tests
// use webpack?
function setBinaryValue(module, number) {
    let leds = Array.from(document.querySelectorAll(`#${module} .led`)).reverse();
    if (leds.length === 0)
        throw new Error(`Module ${module} not found`);
    for (let led of leds) {
        led.classList.remove('active');
    }
    let digits = number.toString(2).split('').reverse();
    if (digits.length > leds.length)
        throw new Error(`Number exceeds bits of module`);
    for (let i = 0; i < digits.length; i++) {
        if (digits[i] === '1') {
            leds[i].classList.add('active');
        }
    }
}
setBinaryValue('a-register', 42);
setBinaryValue('b-register', 15);
setBinaryValue('b-register', 42 + 15);
setBinaryValue('counter', 15);
setBinaryValue('bus', 17);
setBinaryValue('memory-address', 8);
setBinaryValue('memory-content', 30);
setBinaryValue('instruction-register', 43);
